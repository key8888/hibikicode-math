import { elements } from "./domElements.js";
import { state } from "./state.js";
import { apiClient, getStoredToken, setAuthToken } from "./api.js";

// ログインダイアログの表示制御とトークン管理、プロフィール取得を担う認証モジュール。

/**
 * ログイン状態に応じてユーザー名表示や管理ボタンの活性/非表示を切り替える。
 */
function updateUserInterface() {
  if (elements.currentUsername) {
    const username = state.currentUser?.username || "";
    elements.currentUsername.textContent = username;
  }
  if (elements.userManagementButton) {
    const shouldShow = Boolean(state.currentUser?.is_admin);
    elements.userManagementButton.classList.toggle("hidden-control", !shouldShow);
  }
  if (elements.logoutButton) {
    elements.logoutButton.disabled = !state.currentUser;
  }
}

/**
 * サーバーから受け取ったプロフィール情報を state へ反映し、UI を最新化する。
 */
function applyProfile(payload) {
  const unlocks = Array.isArray(payload.unlocks) ? payload.unlocks : [];
  state.currentUser = payload.user || null;
  state.unlockedMaterials = new Map();
  state.unlockedMaterialIndexes = new Set([0, ...unlocks]);
  state.currentLessonIndex = 0;
  updateUserInterface();
}

function toggleOverlay(show) {
  const overlay = elements.authOverlay;
  if (!overlay) return;
  overlay.classList.toggle("hidden", !show);
}

/**
 * 現在のトークンでプロフィールを取得し、state へ取り込む。
 */
async function fetchProfile() {
  const response = await apiClient.get("/api/auth/me");
  applyProfile(response.data);
  return response.data;
}

function showError(message) {
  if (elements.loginError) {
    elements.loginError.textContent = message || "";
  }
}

updateUserInterface();

/**
 * ログインフォーム送信時の処理。バリデーション、API 呼び出し、UI 更新を担当する。
 */
async function handleLoginSubmit(event, resolve) {
  event.preventDefault();
  if (!elements.loginForm || !elements.loginUsername || !elements.loginPassword) {
    resolve();
    return;
  }

  const username = elements.loginUsername.value.trim();
  const password = elements.loginPassword.value;
  if (!username || !password) {
    showError("ユーザー名とパスワードを入力してください");
    return;
  }

  elements.loginSubmit.disabled = true;
  elements.loginSubmit.textContent = "認証中...";
  showError("");

  try {
    const response = await apiClient.post("/api/auth/login", { username, password });
    const { token } = response.data;
    setAuthToken(token, { remember: true });
    state.authToken = token;
    applyProfile(response.data);
    toggleOverlay(false);
    showError("");
    elements.loginForm.reset();
    resolve();
  } catch (error) {
    if (error.response?.data?.detail) {
      showError(error.response.data.detail);
    } else {
      showError("ログインに失敗しました。時間をおいて再試行してください。");
    }
  } finally {
    elements.loginSubmit.disabled = false;
    elements.loginSubmit.textContent = "ログイン";
  }
}

/**
 * 保存済みトークンの検証またはログイン UI 表示を行い、認証完了まで待機する。
 */
export async function ensureAuthenticated() {
  state.authToken = null;
  const storedToken = getStoredToken();
  if (storedToken) {
    setAuthToken(storedToken);
    try {
      await fetchProfile();
      state.authToken = storedToken;
      toggleOverlay(false);
      return;
    } catch (error) {
      console.warn("Stored token invalid", error);
      setAuthToken(null);
      state.authToken = null;
      state.currentUser = null;
      updateUserInterface();
    }
  }

  toggleOverlay(true);

  await new Promise((resolve) => {
    if (!elements.loginForm) {
      resolve();
      return;
    }
    const listener = (event) => handleLoginSubmit(event, () => {
      elements.loginForm?.removeEventListener("submit", listener);
      resolve();
    });
    elements.loginForm.addEventListener("submit", listener);
  });
}

/**
 * ログアウト API を呼び出し、トークンと状態をクリアして画面を再読み込みする。
 */
export async function logout() {
  try {
    await apiClient.post("/api/auth/logout");
  } catch (error) {
    console.warn("Logout failed", error);
  } finally {
    setAuthToken(null);
    state.authToken = null;
    state.currentUser = null;
    updateUserInterface();
    window.location.reload();
  }
}
