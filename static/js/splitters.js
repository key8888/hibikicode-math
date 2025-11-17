import { elements } from "./domElements.js";

/**
 * 左右ペインをドラッグで変更するためのスプリッター。
 */
function setupVerticalSplitter() {
  const { workspace, leftPane, verticalSplitter } = elements;
  if (!workspace || !leftPane || !verticalSplitter) return;

  let isDragging = false;
  let offsetX = 0;

  verticalSplitter.addEventListener("mousedown", (event) => {
    isDragging = true;
    const splitterRect = verticalSplitter.getBoundingClientRect();
    offsetX = event.clientX - splitterRect.left;
    document.body.classList.add("resizing-x");
    event.preventDefault();
  });

  window.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    const rect = workspace.getBoundingClientRect();
    const splitterWidth = verticalSplitter.getBoundingClientRect().width;
    let x = event.clientX - offsetX - rect.left;
    const minLeft = 280;
    const minRight = 320;
    const maxLeft = rect.width - splitterWidth - minRight;
    x = Math.max(minLeft, Math.min(maxLeft, x));
    leftPane.style.flexBasis = `${x}px`;
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      document.body.classList.remove("resizing-x");
    }
  });
}

/**
 * エディタとログエリアを上下にリサイズするスプリッター。
 */
function setupHorizontalSplitter() {
  const { editorLogContainer, horizontalSplitter, editorContainer, logArea } =
    elements;
  if (!editorLogContainer || !horizontalSplitter || !editorContainer || !logArea)
    return;

  let isDragging = false;
  let startY = 0;
  let startLogHeight = 0;

  horizontalSplitter.addEventListener("mousedown", (event) => {
    isDragging = true;
    startY = event.clientY;
    startLogHeight = logArea.getBoundingClientRect().height;
    document.body.classList.add("resizing-y");
    event.preventDefault();
  });

  window.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    const rect = editorLogContainer.getBoundingClientRect();
    const splitterHeight = horizontalSplitter.getBoundingClientRect().height;
    const delta = event.clientY - startY;
    const minEditor = 160;
    const minLog = 80;
    const maxLog = rect.height - splitterHeight - minEditor;

    let newLogHeight = startLogHeight + delta;
    newLogHeight = Math.max(minLog, Math.min(maxLog, newLogHeight));
    const newEditorHeight = rect.height - splitterHeight - newLogHeight;

    editorContainer.style.flexBasis = `${newEditorHeight}px`;
    logArea.style.flexBasis = `${newLogHeight}px`;
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      document.body.classList.remove("resizing-y");
    }
  });
}

export function setupSplitters() {
  setupVerticalSplitter();
  setupHorizontalSplitter();
}
