let sharedContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedContext || sharedContext.state === "closed") {
    sharedContext = new Ctor();
  }
  return sharedContext;
}

/** Short paper / page-turn rustle — Web Audio only, no asset file. Safe to call from a click handler. */
export async function playPaperRustleSound(): Promise<void> {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === "suspended") await ctx.resume();

    const now = ctx.currentTime;
    const duration = 0.22;
    const sampleRate = ctx.sampleRate;
    const frameCount = Math.floor(sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, frameCount, sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      const t = i / frameCount;
      const env = Math.sin(Math.PI * Math.min(t * 4, 1)) * Math.exp(-5.5 * t);
      data[i] = (Math.random() * 2 - 1) * 0.42 * env;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(2800, now);
    bandpass.frequency.exponentialRampToValueAtTime(900, now + duration);
    bandpass.Q.setValueAtTime(0.65, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.55, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration + 0.05);

    const clickOsc = ctx.createOscillator();
    clickOsc.type = "sine";
    clickOsc.frequency.setValueAtTime(1800, now);
    clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.06);
    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.0001, now);
    clickGain.gain.linearRampToValueAtTime(0.08, now + 0.002);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.08);
  } catch {
    /* ignore — audio optional */
  }
}
