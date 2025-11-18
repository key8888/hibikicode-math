import { elements } from "./domElements.js";
import { state } from "./state.js";
import { apiClient, getStoredToken, setAuthToken } from "./api.js";

function applyProfile(payload) {
  const unlocks = Array.isArray(payload.unlocks) ? payload.unlocks : [];
  state.currentUser = payload.user || null;
  state.unlockedMaterials = new Map();
  state.unlockedMaterialIndexes = new Set([0, ...unlocks]);
  state.currentLessonIndex = 0;
}

function toggleOverlay(show) {
  const overlay = elements.authOverlay;
  if (!overlay) return;
  overlay.classList.toggle("hidden", !show);
}

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
