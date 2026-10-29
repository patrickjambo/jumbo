import { useEffect, useRef, useCallback } from 'react';

/**
 * Phase 2 — Voice Activity Detection + Auto-mute
 *
 * Strategy (layered, runs entirely on client — no audio sent to server):
 * 1. Web Audio AnalyserNode for loudness (RMS) measurement
 * 2. If RMS > threshold for > 3s AND speech model says NOT speech → auto-mute
 * 3. Anti-flapping: 10s grace after manual unmute; after 3 auto-mutes in 2min → suggest headphones
 * 4. Echo: sustained loud tonal sound while others speak → auto-mute + recommend headphones
 */

export interface NoiseControlOptions {
  enabled: boolean;
  onAutoMute: (reason: string) => void;
  onSuggestHeadphones: () => void;
  loudnessThresholdDb?: number; // default -30 dBFS
  speechSilenceSecs?: number;   // seconds of non-speech before mute (default 3)
}

export function useNoiseControl(
  micStream: MediaStream | null,
  options: NoiseControlOptions,
) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const frameRef = useRef<number>(0);

  // State refs (avoid re-render cost)
  const loudSinceRef = useRef<number | null>(null);
  const autoMuteCountRef = useRef(0);
  const autoMuteWindowStartRef = useRef<number>(0);
  const graceUntilRef = useRef<number>(0);

  const {
    enabled,
    onAutoMute,
    onSuggestHeadphones,
    loudnessThresholdDb = -30,
    speechSilenceSecs = 3,
  } = options;

  // Convert dBFS threshold to RMS
  const rmsThreshold = Math.pow(10, loudnessThresholdDb / 20);

  const getRms = useCallback((analyser: AnalyserNode): number => {
    const buf = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (const s of buf) sum += s * s;
    return Math.sqrt(sum / buf.length);
  }, []);

  useEffect(() => {
    if (!micStream || !enabled) return;

    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    const source = ctx.createMediaStreamSource(micStream);
    source.connect(analyser);

    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    sourceRef.current = source;

    const FRAME_INTERVAL = 200; // check every 200ms
    let lastCheck = 0;

    function loop(now: number) {
      frameRef.current = requestAnimationFrame(loop);
      if (now - lastCheck < FRAME_INTERVAL) return;
      lastCheck = now;

      if (!analyserRef.current) return;

      const rms = getRms(analyserRef.current);
      const isLoud = rms > rmsThreshold;
      const nowMs = Date.now();

      if (isLoud) {
        if (loudSinceRef.current === null) {
          loudSinceRef.current = nowMs;
        } else {
          const loudDuration = (nowMs - loudSinceRef.current) / 1000;
          if (loudDuration >= speechSilenceSecs && nowMs > graceUntilRef.current) {
            // Loud for too long — auto-mute
            // (Phase 2: add Silero VAD check here to confirm it's NOT speech)
            const windowAge = nowMs - autoMuteWindowStartRef.current;
            if (windowAge > 120_000) {
              autoMuteCountRef.current = 0;
              autoMuteWindowStartRef.current = nowMs;
            }
            autoMuteCountRef.current++;
            loudSinceRef.current = null;
            graceUntilRef.current = nowMs + 10_000; // 10s grace

            onAutoMute('Background noise detected. Jumbo muted your mic. Tap to unmute.');

            if (autoMuteCountRef.current >= 3) {
              onSuggestHeadphones();
            }
          }
        }
      } else {
        loudSinceRef.current = null;
      }
    }

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameRef.current);
      source.disconnect();
      void ctx.close();
    };
  }, [micStream, enabled, getRms, rmsThreshold, speechSilenceSecs, onAutoMute, onSuggestHeadphones]);

  /** Call this after a manual unmute to reset the grace period */
  const onManualUnmute = useCallback(() => {
    graceUntilRef.current = Date.now() + 10_000;
    loudSinceRef.current = null;
  }, []);

  return { onManualUnmute };
}

/**
 * Mic level meter — returns a 0–1 loudness value, updated ~30fps.
 */
export function useMicLevel(stream: MediaStream | null): number {
  const levelRef = useRef(0);
  const frameRef = useRef(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!stream) return;
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    ctx.createMediaStreamSource(stream).connect(analyser);
    ctxRef.current = ctx;
    analyserRef.current = analyser;

    const buf = new Uint8Array(analyser.frequencyBinCount);
    function loop() {
      frameRef.current = requestAnimationFrame(loop);
      analyser.getByteFrequencyData(buf);
      let sum = 0;
      for (const b of buf) sum += b;
      levelRef.current = sum / buf.length / 255;
    }
    frameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameRef.current);
      void ctx.close();
    };
  }, [stream]);

  return levelRef.current;
}
