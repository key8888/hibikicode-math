/**
 * アプリ全体で共有したい状態をひとまとめにしたモジュール。
 * グローバル変数を避け、他のモジュールからインポートして利用する。
 */
export const state = {
  /** @type {import('monaco-editor').editor.IStandaloneCodeEditor | null} */
  editorInstance: null,
  /** @type {Array<{title: string, content: string}>} */
  materialsMeta: [],
  /** 取得済み教材（インデックス -> 教材データ）のキャッシュ */
  unlockedMaterials: new Map(),
  /** 現在表示している教材のインデックス */
  currentLessonIndex: 0,
};
