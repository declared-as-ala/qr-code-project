const SOUND_URL = "/sounds/page-flip.mp3";

let audioEl: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!audioEl) {
    audioEl = new Audio(SOUND_URL);
    audioEl.preload = "auto";
    audioEl.volume = 0.7;
  }
  return audioEl;
}

/**
 * Plays the page-turn sound (public/sounds/page-flip.mp3). Must be triggered
 * from a user gesture (e.g. a click) for autoplay policies. Rewinds so rapid
 * taps replay cleanly.
 */
export async function playPaperRustleSound(): Promise<void> {
  const el = getAudio();
  if (!el) return;
  try {
    el.currentTime = 0;
    await el.play();
  } catch {
    /* ignore — audio is optional / blocked */
  }
}
