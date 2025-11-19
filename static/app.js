import { elements } from "./js/domElements.js";
import { state } from "./js/state.js";
import { setupTabs } from "./js/tabs.js";
import { setupSplitters } from "./js/splitters.js";
import { setupTeacherButton } from "./js/audio.js";
import { initializeEditor, resetEditor, setupFontSizeControl } from "./js/editor.js";
import { executeCode } from "./js/codeRunner.js";
import { ensureAuthenticated, logout } from "./js/auth.js";
import {
  fetchLesson,
  fetchMaterialsMeta,
  setupMaterialsList,
  updateLessonNavigation,
} from "./js/materials.js";
import { setupProgramHistory } from "./js/history.js";
import { setupUserManagement } from "./js/adminUsers.js";

/**
 * Ctrl + Enter で実行ボタンを押せるようにするキーボードショートカット。
 */
function setupKeyboardShortcut() {
  document.addEventListener("keydown", (event) => {
    const isCtrlEnter = event.key === "Enter" && event.ctrlKey;
    if (isCtrlEnter) {
      event.preventDefault();
      if (!elements.runButton.disabled) {
        executeCode();
      }
    }
  });
}

/**
 * 教材ナビゲーションボタンのクリックイベント。
 */
function setupLessonNavigationButtons() {
  elements.prevLessonButton.addEventListener("click", () => {
    if (state.currentLessonIndex <= 0) return;
    const previousIndex = state.currentLessonIndex - 1;
    fetchLesson(previousIndex);
  });

  elements.nextLessonButton.addEventListener("click", async () => {
    if (state.currentLessonIndex >= state.materialsMeta.length - 1) return;
    const nextIndex = state.currentLessonIndex + 1;

    if (state.unlockedMaterialIndexes.has(nextIndex)) {
      await fetchLesson(nextIndex);
      return;
    }

    const password = prompt(
      "先生に確認しましたか？\n先生に「パスワード」をもらってください",
      ""
    );
    if (password === null) return;
    await fetchLesson(nextIndex, { password });
  });
}

/**
 * 初期ロード時に必要なセットアップをまとめて呼び出す。
 */
async function bootstrap() {
  setupTabs();
  setupSplitters();
  setupTeacherButton();
  setupKeyboardShortcut();
  setupLessonNavigationButtons();
  setupMaterialsList();
  setupFontSizeControl();
  setupProgramHistory();
  setupUserManagement();

  elements.runButton.addEventListener("click", executeCode);
  elements.resetButton.addEventListener("click", resetEditor);
  elements.logoutButton?.addEventListener("click", logout);

  initializeEditor();

  await ensureAuthenticated();
  await fetchMaterialsMeta();
  if (state.materialsMeta.length > 0) {
    fetchLesson(0);
  } else {
    elements.lessonTitle.textContent = "教材";
    elements.lessonContent.innerHTML = "<p>教材が登録されていません。</p>";
    updateLessonNavigation();
  }
}

bootstrap();
