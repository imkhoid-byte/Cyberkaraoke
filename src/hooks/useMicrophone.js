import { useState, useRef, useCallback } from 'react';

export function getWaveformData(analyser) {
  if (!analyser) return new Uint8Array(0);
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  return data;
}

export function useMicrophone() {
  const [isListening, setIsListening] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [peakVolume, setPeakVolume] = useState(0);
  const [volumeHistory, setVolumeHistory] = useState([]);
  const [vocalScore, setVocalScore] = useState(null);
  const [error, setError] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const volumeHistoryRef = useRef([]);
  const peakRef = useRef(0);

  const analyseFrame = useCallback(() => {
    if (!analyserRef.current) return;

    const data = new Uint8Array(analyserRef.current.fftSize);
    analyserRef.current.getByteTimeDomainData(data);

    // Calculate RMS
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / data.length);
    const vol = Math.min(100, Math.round(rms * 300));

    setCurrentVolume(vol);

    if (vol > peakRef.current) {
      peakRef.current = vol;
      setPeakVolume(vol);
    }

    volumeHistoryRef.current.push(vol);
    // Keep only last 200 samples for memory
    if (volumeHistoryRef.current.length > 200) {
      volumeHistoryRef.current = volumeHistoryRef.current.slice(-200);
    }
    setVolumeHistory([...volumeHistoryRef.current]);

    rafRef.current = requestAnimationFrame(analyseFrame);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setVocalScore(null);
    volumeHistoryRef.current = [];
    peakRef.current = 0;
    setPeakVolume(0);
    setVolumeHistory([]);
    setCurrentVolume(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      startTimeRef.current = Date.now();
      setIsListening(true);
      rafRef.current = requestAnimationFrame(analyseFrame);
    } catch (err) {
      setError(err.message || 'Microphone access denied');
    }
  }, [analyseFrame]);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    analyserRef.current = null;

    const history = volumeHistoryRef.current;
    const duration = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;

    // Score calculation
    let score = 0;
    if (history.length > 0) {
      const avg = history.reduce((a, b) => a + b, 0) / history.length;
      const peakCount = history.filter((v) => v > 60).length;
      const peakRatio = peakCount / history.length;
      const consistency = 1 - (history.reduce((acc, v) => acc + Math.abs(v - avg), 0) / history.length) / 100;
      const durationBonus = Math.min(1, duration / 60);

      // Weighted formula
      score = Math.round(
        avg * 0.4 +
        peakRatio * 100 * 0.3 +
        consistency * 100 * 0.2 +
        durationBonus * 100 * 0.1
      );
      score = Math.max(0, Math.min(100, score));
    }

    setVocalScore(score);
    setIsListening(false);
    setCurrentVolume(0);

    return { score, peak: peakRef.current, duration, history };
  }, []);

  return {
    isListening,
    volumeHistory,
    currentVolume,
    peakVolume,
    vocalScore,
    start,
    stop,
    error,
    analyserRef,
  };
}
