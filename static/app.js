const runButton = document.getElementById("run-button");
const resetButton = document.getElementById("reset-button");
const executionTime = document.getElementById("execution-time");
const combinedLogOutput = document.getElementById("combined-log");
const lessonTitle = document.getElementById("lesson-title");
const lessonContent = document.getElementById("lesson-content");
const prevLessonButton = document.getElementById("prev-lesson");
const nextLessonButton = document.getElementById("next-lesson");
const defaultCodeTemplate = document.getElementById("default-code");
const fontSizeControl = document.getElementById("font-size-control");
const fontSizeValue = document.getElementById("font-size-value");
const callTeacherButton = document.getElementById("call-teacher-button");

const teacherAudio = new Audio("/static/call_teacher.wav");
teacherAudio.preload = "auto";

let editorInstance = null;
let materialsMeta = [];
const unlockedMaterials = new Map();
let currentLessonIndex = 0;

/* =========================
   Bokeh 動的ロード（返却JSONのversionに完全同期）
   ========================= */
let loadedBokehVersion = null;
let bokehLoadingPromise = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.onload = resolve;
    el.onerror = () => reject(new Error(`failed to load: ${src}`));
    document.head.appendChild(el);
  });
}

/**
 * 返ってきた json_item（result.plot）の version に合わせて
 * 必要なら BokehJS をロード/差し替えする
 */
async function ensureBokehVersion(requiredVersion) {
  if (window.Bokeh && loadedBokehVersion === requiredVersion) return;

  if (bokehLoadingPromise) {
    try {
      await bokehLoadingPromise;
    } catch {
      /* noop */
    }
    if (window.Bokeh && loadedBokehVersion === requiredVersion) return;
  }

  bokehLoadingPromise = (async () => {
    const url = `https://cdn.bokeh.org/bokeh/release/bokeh-${requiredVersion}.min.js`;
    await loadScript(url);
    if (!window.Bokeh) throw new Error("BokehJS の読み込みに失敗しました。");
    loadedBokehVersion = window.Bokeh.version || requiredVersion;
  })();

  await bokehLoadingPromise;
}

/* =========================
   UI: タブ、教材、エディタ
   ========================= */

function activateTab(targetId) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
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

function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.tab;
      activateTab(targetId);
    });
  });
}

function sanitizeHtml(html) {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

function updateLessonNavigation() {
  prevLessonButton.disabled = currentLessonIndex <= 0;
  nextLessonButton.disabled =
    materialsMeta.length === 0 || currentLessonIndex >= materialsMeta.length - 1;
}

function renderLesson(material) {
  if (!material) {
    lessonTitle.textContent = "教材";
    lessonContent.innerHTML = "<p>教材が見つかりません。</p>";
    return;
  }
  lessonTitle.textContent = material.title || "教材";
  lessonContent.innerHTML = sanitizeHtml(material.content);
}

async function fetchMaterialsMeta() {
  try {
    const response = await axios.get("/api/materials");
    materialsMeta = response.data.materials || [];
    updateLessonNavigation();
  } catch (error) {
    console.error(error);
    lessonTitle.textContent = "教材読み込みエラー";
    lessonContent.innerHTML =
      "<p>教材一覧の取得に失敗しました。ページを更新して再度お試しください。</p>";
  }
}

async function fetchLesson(index, options = {}) {
  if (unlockedMaterials.has(index)) {
    currentLessonIndex = index;
    renderLesson(unlockedMaterials.get(index));
    updateLessonNavigation();
    return;
  }

  try {
    let response;
    if (index === 0) {
      response = await axios.get(`/api/materials/${index}`);
    } else if (options.password) {
      response = await axios.post(`/api/materials/${index}/unlock`, {
        password: options.password,
      });
    } else {
      throw new Error("locked");
    }
    const material = response.data;
    unlockedMaterials.set(index, material);
    currentLessonIndex = index;
    renderLesson(material);
    updateLessonNavigation();
  } catch (error) {
    if (error.response && error.response.status === 403) {
      alert("パスワードが正しくありません。");
    } else if (error.message === "locked") {
      alert("この教材を表示するにはパスワードが必要です。");
    } else {
      alert("教材の取得に失敗しました。");
    }
  }
}

function resetEditor() {
  if (!editorInstance) return;
  const defaultCode = (defaultCodeTemplate.textContent || "").trim();
  editorInstance.setValue(defaultCode);
  editorInstance.focus();
}

function updateLog(result) {
  executionTime.textContent = result.execution_time
    ? `${result.execution_time.toFixed(3)} 秒`
    : "-";
  if (!combinedLogOutput) return;
  const hasStdout = Boolean(result.stdout);
  const hasStderr = Boolean(result.stderr);
  let combined = "";
  if (hasStdout && hasStderr) {
    combined = `${result.stdout}\n${result.stderr}`;
  } else if (hasStdout) {
    combined = result.stdout;
  } else if (hasStderr) {
    combined = result.stderr;
  }
  combinedLogOutput.textContent = combined;
  combinedLogOutput.classList.toggle("error", hasStderr);
}

/* =========================
   プロット描画（version 同期後に埋め込み）
   ========================= */
async function renderPlot(plotItem) {
  const plotContainer = document.getElementById("bokeh-plot");
  if (!plotContainer) return;

  while (plotContainer.firstChild) {
    plotContainer.removeChild(plotContainer.firstChild);
  }

  if (!plotItem) return;

  const required =
    plotItem.version || (window.Bokeh && window.Bokeh.version) || "3.3.3";
  await ensureBokehVersion(required);

  window.Bokeh.embed.embed_item(plotItem, "bokeh-plot");
}

/* =========================
   コード実行
   ========================= */
async function executeCode() {
  if (!editorInstance) return;

  // 実行したら必ずグラフタブを表示
  activateTab("graph");

  runButton.disabled = true;
  runButton.textContent = "実行...";
  if (combinedLogOutput) {
    combinedLogOutput.textContent = "";
    combinedLogOutput.classList.remove("error");
  }
  const code = editorInstance.getValue();

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
    runButton.disabled = false;
    runButton.textContent = "実行";
  }
}

/* =========================
   エディタ初期化
   ========================= */
function initializeEditor() {
  const defaultCode = (defaultCodeTemplate.textContent || "").trim();
  const defaultFontSize =
    fontSizeControl ? Number(fontSizeControl.value) || 15 : 15;
  require(["vs/editor/editor.main"], () => {
    editorInstance = monaco.editor.create(
      document.getElementById("editor"),
      {
        value: defaultCode,
        language: "python",
        theme: "vs-dark",
        automaticLayout: true,
        fontSize: defaultFontSize,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
      }
    );
  });
}

/* =========================
   スプリッター（ドラッグでサイズ変更）
   ========================= */

function setupSplitters() {
  const workspace = document.querySelector(".workspace");
  const leftPane = document.querySelector(".left-pane");
  const vSplitter = document.getElementById("vertical-splitter");

  if (workspace && leftPane && vSplitter) {
    let isDraggingV = false;
    let offsetX = 0;

    vSplitter.addEventListener("mousedown", (e) => {
      isDraggingV = true;

      // スプリッター左端からの相対位置を記録
      const splitterRect = vSplitter.getBoundingClientRect();
      offsetX = e.clientX - splitterRect.left;

      document.body.classList.add("resizing-x");
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDraggingV) return;

      const rect = workspace.getBoundingClientRect();
      const splitterWidth = vSplitter.getBoundingClientRect().width;

      // マウス位置 - オフセット - workspace左端
      let x = e.clientX - offsetX - rect.left;

      const minLeft = 280;
      const minRight = 320;
      const maxLeft = rect.width - splitterWidth - minRight;

      x = Math.max(minLeft, Math.min(maxLeft, x));

      leftPane.style.flexBasis = `${x}px`;
    });

    window.addEventListener("mouseup", () => {
      if (isDraggingV) {
        isDraggingV = false;
        document.body.classList.remove("resizing-x");
      }
    });
  }

  const editorLogContainer = document.querySelector(".editor-log-container");
  const hSplitter = document.getElementById("horizontal-splitter");
  const editorEl = document.getElementById("editor");
  const logArea = document.querySelector(".log-area");

  if (editorLogContainer && hSplitter && editorEl && logArea) {
    let isDraggingH = false;
    let startY = 0;
    let startLogHeight = 0;

    hSplitter.addEventListener("mousedown", (e) => {
      isDraggingH = true;
      startY = e.clientY;
      startLogHeight = logArea.getBoundingClientRect().height;

      document.body.classList.add("resizing-y");
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDraggingH) return;

      const rect = editorLogContainer.getBoundingClientRect();
      const splitterHeight = hSplitter.getBoundingClientRect().height;

      const delta = e.clientY - startY;
      const minEditor = 160;
      const minLog = 80;
      const maxLog = rect.height - splitterHeight - minEditor;

      let newLogHeight = startLogHeight + delta;
      newLogHeight = Math.max(minLog, Math.min(maxLog, newLogHeight));

      const newEditorHeight = rect.height - splitterHeight - newLogHeight;

      editorEl.style.flexBasis = `${newEditorHeight}px`;
      logArea.style.flexBasis = `${newLogHeight}px`;
    });

    window.addEventListener("mouseup", () => {
      if (isDraggingH) {
        isDraggingH = false;
        document.body.classList.remove("resizing-y");
      }
    });
  }
}





/* =========================
   イベント & 初期化
   ========================= */
runButton.addEventListener("click", executeCode);
resetButton.addEventListener("click", resetEditor);

// Ctrl + Enter で実行
document.addEventListener("keydown", (event) => {
  const isCtrlEnter = event.key === "Enter" && event.ctrlKey;
  if (isCtrlEnter) {
    event.preventDefault();
    if (!runButton.disabled) {
      executeCode();
    }
  }
});

if (callTeacherButton) {
  callTeacherButton.addEventListener("click", () => {
    try {
      teacherAudio.pause();
      teacherAudio.currentTime = 0;
    } catch (error) {
      /* noop */
    }
    const playPromise = teacherAudio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  });
};

function updateFontSizeDisplay(value) {
  if (!fontSizeValue) return;
  fontSizeValue.textContent = `${value}px`;
}

if (fontSizeControl) {
  updateFontSizeDisplay(fontSizeControl.value);

  fontSizeControl.addEventListener("input", () => {
    const size = Number(fontSizeControl.value);
    updateFontSizeDisplay(size);
    if (editorInstance) {
      editorInstance.updateOptions({ fontSize: size });
    }
  });
}

prevLessonButton.addEventListener("click", () => {
  if (currentLessonIndex <= 0) return;
  const previousIndex = currentLessonIndex - 1;
  if (unlockedMaterials.has(previousIndex)) {
    currentLessonIndex = previousIndex;
    renderLesson(unlockedMaterials.get(previousIndex));
    updateLessonNavigation();
  }
});

nextLessonButton.addEventListener("click", async () => {
  if (currentLessonIndex >= materialsMeta.length - 1) return;
  const nextIndex = currentLessonIndex + 1;
  if (unlockedMaterials.has(nextIndex)) {
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

setupTabs();
initializeEditor();
setupSplitters();

fetchMaterialsMeta().then(() => {
  if (materialsMeta.length > 0) {
    fetchLesson(0);
  } else {
    lessonTitle.textContent = "教材";
    lessonContent.innerHTML = "<p>教材が登録されていません。</p>";
  }
});
