/**
 * タブ UI の制御を担当するモジュール。
 */
export function activateTab(targetId) {
  document.querySelectorAll(".tab").forEach((tab) =>
    tab.classList.remove("active")
  );
  document
    .querySelectorAll(".tab-panel")
    .forEach((panel) => panel.classList.remove("active"));

  const tab = document.querySelector(`.tab[data-tab="${targetId}"]`);
  const panel = document.getElementById(targetId);
  if (tab && panel) {
    tab.classList.add("active");
    panel.classList.add("active");
  }
}

/**
 * タブヘッダにクリックイベントを仕込み、activateTab を呼び出せるようにする。
 */
export function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.tab;
      activateTab(targetId);
    });
  });
}
