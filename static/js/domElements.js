/**
 * UI 内で何度も参照する DOM 要素をまとめてエクスポートするモジュール。
 */
export const elements = {
  runButton: document.getElementById("run-button"),
  resetButton: document.getElementById("reset-button"),
  executionTime: document.getElementById("execution-time"),
  combinedLogOutput: document.getElementById("combined-log"),
  lessonTitle: document.getElementById("lesson-title"),
  lessonContent: document.getElementById("lesson-content"),
  prevLessonButton: document.getElementById("prev-lesson"),
  nextLessonButton: document.getElementById("next-lesson"),
  defaultCodeTemplate: document.getElementById("default-code"),
  fontSizeControl: document.getElementById("font-size-control"),
  fontSizeValue: document.getElementById("font-size-value"),
  callTeacherButton: document.getElementById("call-teacher-button"),
  plotContainer: document.getElementById("bokeh-plot"),
  editorContainer: document.getElementById("editor"),
  workspace: document.querySelector(".workspace"),
  leftPane: document.querySelector(".left-pane"),
  verticalSplitter: document.getElementById("vertical-splitter"),
  editorLogContainer: document.querySelector(".editor-log-container"),
  horizontalSplitter: document.getElementById("horizontal-splitter"),
  logArea: document.querySelector(".log-area"),
  materialsList: document.getElementById("materials-list"),
};
