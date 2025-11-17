import { elements } from "./domElements.js";

let loadedBokehVersion = null;
let bokehLoadingPromise = null;

/**
 * 指定された script を動的に読み込むヘルパー。
 */
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
 * サーバーが返す BokehJS バージョンとローカルを同期する。
 */
export async function ensureBokehVersion(requiredVersion) {
  if (window.Bokeh && loadedBokehVersion === requiredVersion) return;

  if (bokehLoadingPromise) {
    try {
      await bokehLoadingPromise;
    } catch {
      // noop
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

/**
 * 受け取った plotItem を所定のコンテナに埋め込む。
 */
export async function renderPlot(plotItem) {
  const { plotContainer } = elements;
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
