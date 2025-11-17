import { elements } from "./domElements.js";
import { state } from "./state.js";
import { activateTab } from "./tabs.js";
import { renderPlot } from "./bokeh.js";
import { updateLog } from "./log.js";

/**
 * サーバーにコードを送信して実行し、結果を UI に反映する。
 */
export async function executeCode() {
  if (!state.editorInstance) return;

  // 実行したらグラフタブを最前面に
  activateTab("graph");

  elements.runButton.disabled = true;
  elements.runButton.textContent = "実行...";
  if (elements.combinedLogOutput) {
    elements.combinedLogOutput.textContent = "";
    elements.combinedLogOutput.classList.remove("error");
  }

  const code = state.editorInstance.getValue();

  try {
    const response = await axios.post("/api/execute", { code });
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
    elements.runButton.disabled = false;
    elements.runButton.textContent = "実行";
  }
}
