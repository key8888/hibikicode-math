const runButton = document.getElementById("run-button");
const resetButton = document.getElementById("reset-button");
const executionTime = document.getElementById("execution-time");
const stdoutOutput = document.getElementById("stdout");
const stderrOutput = document.getElementById("stderr");
const lessonTitle = document.getElementById("lesson-title");
const lessonContent = document.getElementById("lesson-content");
const prevLessonButton = document.getElementById("prev-lesson");
const nextLessonButton = document.getElementById("next-lesson");
const defaultCodeTemplate = document.getElementById("default-code");

let editorInstance = null;
let materialsMeta = [];
const unlockedMaterials = new Map();
let currentLessonIndex = 0;

function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.tab;
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(targetId).classList.add("active");
    });
  });
}

function sanitizeHtml(html) {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

function updateLessonNavigation() {
  prevLessonButton.disabled = currentLessonIndex <= 0;
  nextLessonButton.disabled = materialsMeta.length === 0 || currentLessonIndex >= materialsMeta.length - 1;
}

function renderLesson(material) {
  if (!material) {
    lessonTitle.textContent = "教材";
    lessonContent.innerHTML = "<p>教材が見つかりません。</p>";
    return;
  }
  lessonTitle.textContent = material.title;
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
    lessonContent.innerHTML = `<p>教材一覧の取得に失敗しました。ページを更新して再度お試しください。</p>`;
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
      response = await axios.post(`/api/materials/${index}/unlock`, { password: options.password });
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
  executionTime.textContent = result.execution_time ? `${result.execution_time.toFixed(3)} 秒` : "-";
  stdoutOutput.textContent = result.stdout || "";
  stderrOutput.textContent = result.stderr || "";
}

function renderPlot(plotItem) {
  const plotContainer = document.getElementById("bokeh-plot");
  if (!plotContainer) return;
  while (plotContainer.firstChild) {
    plotContainer.removeChild(plotContainer.firstChild);
  }
  if (plotItem) {
    Bokeh.embed.embed_item(plotItem, "bokeh-plot");
  }
}

async function executeCode() {
  if (!editorInstance) return;
  runButton.disabled = true;
  runButton.textContent = "実行中...";
  stderrOutput.textContent = "";
  const code = editorInstance.getValue();

  try {
    const response = await axios.post("/api/execute", { code });
    const result = response.data;
    updateLog(result);
    if (result.success && result.plot) {
      renderPlot(result.plot);
    } else {
      renderPlot(null);
      if (result.stderr) {
        alert("エラーが発生しました。実行ログを確認してください。");
      }
    }
  } catch (error) {
    console.error(error);
    alert("コードの実行に失敗しました。");
  } finally {
    runButton.disabled = false;
    runButton.textContent = "実行";
  }
}

function initializeEditor() {
  const defaultCode = (defaultCodeTemplate.textContent || "").trim();
  require(["vs/editor/editor.main"], () => {
    editorInstance = monaco.editor.create(document.getElementById("editor"), {
      value: defaultCode,
      language: "python",
      theme: "vs-dark",
      automaticLayout: true,
      fontSize: 15,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
    });
  });
}

runButton.addEventListener("click", executeCode);
resetButton.addEventListener("click", resetEditor);

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
  const password = prompt("先生に確認しましたか？\n四桁のパスワードを入力してください。", "");
  if (password === null) {
    return;
  }
  await fetchLesson(nextIndex, { password });
});

setupTabs();
initializeEditor();
fetchMaterialsMeta().then(() => {
  if (materialsMeta.length > 0) {
    fetchLesson(0);
  } else {
    lessonTitle.textContent = "教材";
    lessonContent.innerHTML = "<p>教材が登録されていません。</p>";
  }
});
