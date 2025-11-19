import { apiClient } from "./api.js";
import { elements } from "./domElements.js";

function formatDate(value) {
  if (!value) return "-";
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return value;
  }
  return new Date(timestamp).toLocaleString("ja-JP");
}

function setHistoryMessage(message) {
  if (!elements.historyList) return;
  const paragraph = document.createElement("p");
  paragraph.textContent = message;
  elements.historyList.innerHTML = "";
  elements.historyList.appendChild(paragraph);
}

function appendLogSection(container, label, content) {
  if (content === undefined || content === null) return;
  const labelElement = document.createElement("p");
  labelElement.className = "history-label";
  labelElement.textContent = label;
  const pre = document.createElement("pre");
  pre.textContent = content;
  container.appendChild(labelElement);
  container.appendChild(pre);
}

function renderHistory(history = []) {
  if (!elements.historyList) return;
  elements.historyList.innerHTML = "";
  if (!history.length) {
    setHistoryMessage("履歴がありません。");
    return;
  }
  history.forEach((item) => {
    const entry = document.createElement("article");
    entry.className = "history-entry";

    const header = document.createElement("header");
    const title = document.createElement("strong");
    title.textContent = formatDate(item.created_at);
    const status = document.createElement("span");
    const success = Boolean(item.success);
    status.className = `status-badge ${success ? "success" : "fail"}`;
    status.textContent = success ? "成功" : "失敗";

    header.appendChild(title);
    header.appendChild(status);
    entry.appendChild(header);

    const meta = document.createElement("div");
    meta.className = "history-meta";
    const execution = typeof item.execution_time === "number" ? item.execution_time : 0;
    const execSpan = document.createElement("span");
    execSpan.textContent = `実行時間: ${execution.toFixed(3)}s`;
    meta.appendChild(execSpan);
    entry.appendChild(meta);

    appendLogSection(entry, "実行コード", item.code || "");
    appendLogSection(entry, "標準出力", item.stdout || "");
    appendLogSection(entry, "標準エラー", item.stderr || "");

    elements.historyList.appendChild(entry);
  });
}

async function loadHistory() {
  if (!elements.historyList) return;
  setHistoryMessage("履歴を読み込んでいます...");
  try {
    const response = await apiClient.get("/api/programs/history", { params: { limit: 50 } });
    renderHistory(response.data?.history || []);
  } catch (error) {
    console.error("Failed to load history", error);
    setHistoryMessage("履歴の取得に失敗しました。");
  }
}

function openHistoryModal() {
  elements.historyModal?.classList.remove("hidden");
}

function closeHistoryModal() {
  elements.historyModal?.classList.add("hidden");
}

export function setupProgramHistory() {
  if (!elements.historyButton || !elements.historyModal) return;
  elements.historyButton.addEventListener("click", () => {
    openHistoryModal();
    loadHistory();
  });
  elements.historyModalClose?.addEventListener("click", closeHistoryModal);
  elements.historyModal.addEventListener("click", (event) => {
    if (event.target === elements.historyModal) {
      closeHistoryModal();
    }
  });
}
