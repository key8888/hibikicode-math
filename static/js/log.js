import { elements } from "./domElements.js";

/**
 * 実行結果の標準出力/標準エラーと実行時間を UI に反映する。
 * @param {{execution_time?: number, stdout?: string, stderr?: string}} result
 */
export function updateLog(result) {
  const { executionTime, combinedLogOutput } = elements;
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
