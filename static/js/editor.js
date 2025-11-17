import { elements } from "./domElements.js";
import { state } from "./state.js";

/**
 * <template> から読み込むデフォルトコード文字列を整形して返す。
 */
function getDefaultCode() {
  return (elements.defaultCodeTemplate.textContent || "").trim();
}

/**
 * Monaco Editor のインスタンスを作成し、state に保持する。
 */
export function initializeEditor() {
  const defaultCode = getDefaultCode();
  const defaultFontSize = elements.fontSizeControl
    ? Number(elements.fontSizeControl.value) || 15
    : 15;

  require(["vs/editor/editor.main"], () => {
    state.editorInstance = monaco.editor.create(elements.editorContainer, {
      value: defaultCode,
      language: "python",
      theme: "vs-dark",
      automaticLayout: true,
      fontSize: defaultFontSize,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
    });
  });
}

/**
 * エディタを初期値に戻す。
 */
export function resetEditor() {
  if (!state.editorInstance) return;
  state.editorInstance.setValue(getDefaultCode());
  state.editorInstance.focus();
}

/**
 * フォントサイズスライダーと数値表示の連携を設定する。
 */
export function setupFontSizeControl() {
  const { fontSizeControl, fontSizeValue } = elements;
  if (!fontSizeControl) return;

  function updateFontSizeDisplay(value) {
    if (!fontSizeValue) return;
    fontSizeValue.textContent = `${value}px`;
  }

  updateFontSizeDisplay(fontSizeControl.value);

  fontSizeControl.addEventListener("input", () => {
    const size = Number(fontSizeControl.value);
    updateFontSizeDisplay(size);
    if (state.editorInstance) {
      state.editorInstance.updateOptions({ fontSize: size });
    }
  });
}
