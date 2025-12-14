// axios の共通設定とトークンの永続化・適用を行うユーティリティ。

const TOKEN_STORAGE_KEY = "hibikicode-math-token";
let activeToken = null;

// 共通ヘッダーを持つ axios インスタンス。個別 API 呼び出しはこれ経由で行う。
export const apiClient = axios.create({
  headers: { "Content-Type": "application/json" },
});

/**
 * アクセストークンを axios のデフォルトヘッダーとローカルストレージへ反映する。
 */
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

/**
 * ローカルストレージに保存されているトークンを読み出す。
 */
export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}
