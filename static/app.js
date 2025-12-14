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

// 学習画面の初期化からイベント登録まで、フロント全体の起点となるスクリプト。
// 各モジュールのセットアップ順序をここで統一しておくことで、依存関係の抜け漏れを防ぐ。

/**
 * Ctrl + Enter で実行ボタンを押せるようにするキーボードショートカット。
 *
 * キーボード操作だけで素早く試行錯誤できるように、ボタンが無効化されている場合は
 * 何もしないようガードしている。preventDefault で改行入力を抑制し、
 * エディタに余計な改行が入らないようにする。
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
 *
 * 未解放の教材へ進む際はパスワード入力を求め、正しく入力された場合のみ fetchLesson を実行する。
 * 戻るボタンは 0 番目 (最初の教材) で無効化することで配列範囲外アクセスを防いでいる。
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
 *
 * UI のイベント登録・エディタ初期化・認証確認・教材メタデータ取得の順で処理する。
 * 非同期処理の途中で例外が起きても await により順序が保証され、初期化の抜け漏れを防げる。
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
