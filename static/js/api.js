const TOKEN_STORAGE_KEY = "hibikicode-math-token";
let activeToken = null;

export const apiClient = axios.create({
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token, { remember = false } = {}) {
  activeToken = token;
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    if (remember) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  } else {
    delete apiClient.defaults.headers.common.Authorization;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function getAuthToken() {
  return activeToken;
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}
