import { elements } from "./domElements.js";
import { state } from "./state.js";
import { apiClient } from "./api.js";

const PASSWORD_PROMPT_MESSAGE =
  "先生に確認しましたか？\n先生に「パスワード」をもらってください";

/**
 * HTML を DOMPurify で無害化してから反映する。
 */
function sanitizeHtml(html) {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

function requestMathTypeset() {
  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise([elements.lessonContent]).catch((error) => {
      console.warn("MathJax rendering error", error);
    });
  }
}

function isMaterialUnlocked(index) {
  return state.unlockedMaterialIndexes.has(index);
}

/**
 * 教材の前後ボタンの活性状態を更新する。
 */
export function updateLessonNavigation() {
  const { prevLessonButton, nextLessonButton } = elements;
  prevLessonButton.disabled = state.currentLessonIndex <= 0;
  nextLessonButton.disabled =
    state.materialsMeta.length === 0 ||
    state.currentLessonIndex >= state.materialsMeta.length - 1;
}

/**
 * 教材本文とタイトルを DOM に描画する。
 */
function renderLesson(material) {
  const { lessonTitle, lessonContent } = elements;
  if (!material) {
    lessonTitle.textContent = "教材";
    lessonContent.innerHTML = "<p>教材が見つかりません。</p>";
    return;
  }
  lessonTitle.textContent = material.title || "教材";
  lessonContent.innerHTML = sanitizeHtml(material.content);
  requestMathTypeset();
}

function renderMaterialsList() {
  const { materialsList } = elements;
  if (!materialsList) return;

  materialsList.innerHTML = "";
  if (!state.materialsMeta.length) {
    materialsList.innerHTML = "<p>教材が登録されていません。</p>";
    return;
  }

  const list = document.createElement("ul");
  list.className = "materials-list-items";

  state.materialsMeta.forEach((material, index) => {
    const listItem = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "materials-list-item";
    button.dataset.index = String(index);

    if (index === state.currentLessonIndex) {
      button.classList.add("current");
    }

    const titleSpan = document.createElement("span");
    titleSpan.className = "material-title";
    titleSpan.textContent = material.title || `教材 ${index + 1}`;

    const statusSpan = document.createElement("span");
    const unlocked = isMaterialUnlocked(index);
    statusSpan.className = `material-status ${unlocked ? "unlock" : "lock"}`;
    statusSpan.textContent = unlocked ? "unlock" : "lock";

    button.appendChild(titleSpan);
    button.appendChild(statusSpan);
    listItem.appendChild(button);
    list.appendChild(listItem);
  });

  materialsList.appendChild(list);
}

/**
 * サーバーから教材一覧メタデータを取得する。
 */
export async function fetchMaterialsMeta() {
  try {
    const response = await apiClient.get("/api/materials");
    state.materialsMeta = response.data.materials || [];
    updateLessonNavigation();
    renderMaterialsList();
  } catch (error) {
    console.error(error);
    elements.lessonTitle.textContent = "教材読み込みエラー";
    elements.lessonContent.innerHTML =
      "<p>教材一覧の取得に失敗しました。ページを更新して再度お試しください。</p>";
    if (elements.materialsList) {
      elements.materialsList.innerHTML =
        "<p>教材一覧の取得に失敗しました。</p>";
    }
  }
}

/**
 * 指定インデックスの教材をキャッシュから取得、なければ API から取得する。
 */
export async function fetchLesson(index, options = {}) {
  if (state.unlockedMaterials.has(index)) {
    state.currentLessonIndex = index;
    renderLesson(state.unlockedMaterials.get(index));
    updateLessonNavigation();
    return;
  }

  try {
    let response;
    if (index === 0 || state.unlockedMaterialIndexes.has(index)) {
      response = await apiClient.get(`/api/materials/${index}`);
    } else if (options.password) {
      response = await apiClient.post(`/api/materials/${index}/unlock`, {
        password: options.password,
      });
      state.unlockedMaterialIndexes.add(index);
    } else {
      throw new Error("locked");
    }

    const material = response.data;
    state.unlockedMaterials.set(index, material);
    state.unlockedMaterialIndexes.add(index);
    state.currentLessonIndex = index;
    renderLesson(material);
    updateLessonNavigation();
    renderMaterialsList();
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

export function setupMaterialsList() {
  const { materialsList } = elements;
  if (!materialsList) return;

  materialsList.addEventListener("click", (event) => {
    const target = event.target.closest(".materials-list-item");
    if (!target) return;

    const index = Number.parseInt(target.dataset.index ?? "", 10);
    if (Number.isNaN(index)) return;

    if (isMaterialUnlocked(index)) {
      fetchLesson(index);
      return;
    }

    const password = prompt(PASSWORD_PROMPT_MESSAGE, "");
    if (password === null) return;
    fetchLesson(index, { password });
  });
}
