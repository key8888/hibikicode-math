import { elements } from "./domElements.js";
import { state } from "./state.js";
import { activateTab } from "./tabs.js";
import { renderPlot } from "./bokeh.js";
import { updateLog } from "./log.js";
import { apiClient } from "./api.js";

const MIN_EXECUTION_INTERVAL_MS = 5000;

let cooldownEndsAt = 0;
let runButtonTimerId = null;
let executionInFlight = false;

function remainingCooldownSeconds() {
  const remainingMs = cooldownEndsAt - Date.now();
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

function refreshRunButtonState() {
  const remainingSeconds = remainingCooldownSeconds();
  const disabled = executionInFlight || remainingSeconds > 0;

  if (remainingSeconds > 0) {
    elements.runButton.textContent = `実行(${remainingSeconds})`;
  } else if (executionInFlight) {
    elements.runButton.textContent = "実行...";
  } else {
    elements.runButton.textContent = "実行";
  }

  elements.runButton.disabled = disabled;
  elements.runButton.classList.toggle("cooldown", disabled);
}

function scheduleRunButtonTimer() {
  if (runButtonTimerId) return;
  runButtonTimerId = window.setInterval(() => {
    refreshRunButtonState();
    if (!executionInFlight && remainingCooldownSeconds() === 0) {
      window.clearInterval(runButtonTimerId);
      runButtonTimerId = null;
    }
  }, 200);
}

function startCooldown(durationMs = MIN_EXECUTION_INTERVAL_MS) {
  cooldownEndsAt = Math.max(cooldownEndsAt, Date.now() + durationMs);
  scheduleRunButtonTimer();
  refreshRunButtonState();
}

function endExecution() {
  executionInFlight = false;
  refreshRunButtonState();
}

function beginExecution() {
  executionInFlight = true;
  startCooldown(MIN_EXECUTION_INTERVAL_MS);
}

function extractRetryAfterSeconds(error) {
  const retryAfterHeader = error?.response?.headers?.["retry-after"];
  if (retryAfterHeader) {
    const parsed = Number.parseInt(retryAfterHeader, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  const detail = error?.response?.data?.detail;
  if (typeof detail === "string") {
    const match = detail.match(/あと\s*(\d+)\s*秒/);
    if (match && match[1]) {
      const parsed = Number.parseInt(match[1], 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  return null;
}

/**
 * サーバーにコードを送信して実行し、結果を UI に反映する。
 */
export async function executeCode() {
  if (!state.editorInstance) return;

  // 実行したらグラフタブを最前面に
  activateTab("graph");

  beginExecution();
  if (elements.combinedLogOutput) {
    elements.combinedLogOutput.textContent = "";
    elements.combinedLogOutput.classList.remove("error");
  }

  const code = state.editorInstance.getValue();

  try {
    const response = await apiClient.post("/api/execute", { code });
    const result = response.data;
    updateLog(result);

    if (result.success && result.plot) {
      await renderPlot(result.plot);
    } else {
      await renderPlot(null);
      if (result.stderr) {
        alert("エラーが発生しました。実行ログを確認してください。");
      }
    }
  } catch (error) {
    console.error(error);
    const retryAfterSeconds = extractRetryAfterSeconds(error);
    if (retryAfterSeconds) {
      startCooldown(retryAfterSeconds * 1000);
    }
    let errorLog = "";
    if (error.response) {
      const { status, statusText, data } = error.response;
      const detail =
        (data && (data.detail || data.message || JSON.stringify(data))) || "";
      errorLog = `HTTP ${status} ${statusText || ""}`.trim();
      if (detail) errorLog += `\n${detail}`;
    } else if (error.request) {
      errorLog =
        "サーバーからの応答がありません。ネットワーク設定を確認してください。";
    } else {
      errorLog = `実行処理中のエラー: ${error.message}`;
    }
    updateLog({ execution_time: 0, stdout: "", stderr: errorLog });
    await renderPlot(null);
    alert("コードの実行に失敗しました。実行ログを確認してください。");
  } finally {
    endExecution();
  }
}
