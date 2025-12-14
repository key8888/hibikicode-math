import { elements } from "./domElements.js";

function markInitialized(el) {
  if (!el) return false;
  if (el.dataset.splitterInitialized === "1") return true;
  el.dataset.splitterInitialized = "1";
  return false;
}

function clamp(val, min, max) {
  if (max < min) max = min; // 狭すぎる時の破綻回避
  return Math.max(min, Math.min(max, val));
}

/**
 * 左右ペインの縦スプリッター（ポインタ位置に棒が追従する版）
 */
function setupVerticalSplitter() {
  const { workspace, leftPane, verticalSplitter } = elements;
  if (!workspace || !leftPane || !verticalSplitter) return;
  if (markInitialized(verticalSplitter)) return;

  let dragging = false;
  let pointerId = null;
  let grabOffsetX = 0;

  const MIN_LEFT = 280;
  const MIN_RIGHT = 320;

  const onMove = (event) => {
    if (!dragging) return;

    const rect = workspace.getBoundingClientRect();
    const splitterRect = verticalSplitter.getBoundingClientRect();
    const splitterWidth = splitterRect.width;

    const available = Math.max(0, rect.width - splitterWidth);
    const minLeft = Math.min(MIN_LEFT, available);
    const maxLeft = Math.max(0, available - MIN_RIGHT);

    // ポインタ位置（workspace左端基準）から、そのまま左ペイン幅を決める
    let x = event.clientX - rect.left - grabOffsetX;
    x = clamp(x, minLeft, maxLeft);

    leftPane.style.flexBasis = `${x}px`;
  };

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    pointerId = null;
    document.body.classList.remove("resizing-x");
    window.removeEventListener("pointermove", onMove, true);
    window.removeEventListener("pointerup", endDrag, true);
    window.removeEventListener("pointercancel", endDrag, true);
  };

  verticalSplitter.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const splitterRect = verticalSplitter.getBoundingClientRect();
    grabOffsetX = event.clientX - splitterRect.left; // 棒の中で掴んだ位置を保持

    dragging = true;
    pointerId = event.pointerId;

    document.body.classList.add("resizing-x");

    try {
      verticalSplitter.setPointerCapture(pointerId);
    } catch (_) {}

    window.addEventListener("pointermove", onMove, true);
    window.addEventListener("pointerup", endDrag, true);
    window.addEventListener("pointercancel", endDrag, true);

    event.preventDefault();
  });
}

/**
 * エディタとログの横スプリッター（上下が逆にならない版）
 * 「ポインタ位置＝スプリッター位置」として editor/log を直接計算する
 */
function setupHorizontalSplitter() {
  const { editorLogContainer, horizontalSplitter, editorContainer, logArea } =
    elements;
  if (!editorLogContainer || !horizontalSplitter || !editorContainer || !logArea)
    return;
  if (markInitialized(horizontalSplitter)) return;

  let dragging = false;
  let pointerId = null;
  let grabOffsetY = 0;

  const MIN_EDITOR = 160;
  const MIN_LOG = 80;

  const onMove = (event) => {
    if (!dragging) return;

    const rect = editorLogContainer.getBoundingClientRect();
    const splitterRect = horizontalSplitter.getBoundingClientRect();
    const splitterHeight = splitterRect.height;

    const available = Math.max(0, rect.height - splitterHeight);

    const minEditor = Math.min(MIN_EDITOR, available);
    const maxEditor = Math.max(0, available - MIN_LOG);

    // スプリッター上端位置（container上端基準）＝ editor高さ
    let y = event.clientY - rect.top - grabOffsetY;
    const newEditorHeight = clamp(y, minEditor, maxEditor);
    const newLogHeight = Math.max(0, available - newEditorHeight);

    editorContainer.style.flexBasis = `${newEditorHeight}px`;
    logArea.style.flexBasis = `${newLogHeight}px`;
  };

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    pointerId = null;
    document.body.classList.remove("resizing-y");
    window.removeEventListener("pointermove", onMove, true);
    window.removeEventListener("pointerup", endDrag, true);
    window.removeEventListener("pointercancel", endDrag, true);
  };

  horizontalSplitter.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const splitterRect = horizontalSplitter.getBoundingClientRect();
    grabOffsetY = event.clientY - splitterRect.top; // 棒の中で掴んだ位置を保持

    dragging = true;
    pointerId = event.pointerId;

    document.body.classList.add("resizing-y");

    try {
      horizontalSplitter.setPointerCapture(pointerId);
    } catch (_) {}

    window.addEventListener("pointermove", onMove, true);
    window.addEventListener("pointerup", endDrag, true);
    window.addEventListener("pointercancel", endDrag, true);

    event.preventDefault();
  });
}

export function setupSplitters() {
  setupVerticalSplitter();
  setupHorizontalSplitter();
}
