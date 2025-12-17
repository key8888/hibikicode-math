import { elements } from "./domElements.js";

const teacherAudio = new Audio("/static/call_teacher.mp3");
teacherAudio.preload = "auto";

/**
 * 「先生を召喚する」ボタンがクリックされた際に音声を再生する。
 */
export function setupTeacherButton() {
  const { callTeacherButton } = elements;
  if (!callTeacherButton) return;

  callTeacherButton.addEventListener("click", () => {
    try {
      teacherAudio.pause();
      teacherAudio.currentTime = 0;
    } catch (error) {
      // noop
    }
    const playPromise = teacherAudio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  });
}
