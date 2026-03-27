import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getWaveformData } from '../hooks/useMicrophone';
import { VOCAL_LABELS } from '../constants';

function getVocalLabel(score) {
  return VOCAL_LABELS.find((l) => score >= l.min && score < l.max) || VOCAL_LABELS[VOCAL_LABELS.length - 1];
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function PerformanceAnalyzer({
  phase,
  isListening,
  currentVolume,
  peakVolume,
  vocalScore,
  analyserRef,
  currentSinger,
  currentArtist,
  currentSong,
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(null);
  const [showScore, setShowScore] = useState(false);
  const [peakFlash, setPeakFlash] = useState(false);
  const prevPeakRef = useRef(0);

  // Timer
  useEffect(() => {
    if (isListening) {
      startTimeRef.current = Date.now();
      setElapsed(0);
      const interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 500);
      return () => clearInterval(interval);
    } else {
      startTimeRef.current = null;
    }
  }, [isListening]);

  // Peak flash
  useEffect(() => {
    if (peakVolume > prevPeakRef.current + 5) {
      prevPeakRef.current = peakVolume;
      setPeakFlash(true);
      const t = setTimeout(() => setPeakFlash(false), 300);
      return () => clearTimeout(t);
    }
  }, [peakVolume]);

  // Score reveal animation
  useEffect(() => {
    if (phase === 'rating' && vocalScore !== null) {
      setShowScore(false);
      const t = setTimeout(() => setShowScore(true), 400);
      return () => clearTimeout(t);
    }
  }, [phase, vocalScore]);

  // Reset on new performance
  useEffect(() => {
    if (phase === 'performing') {
      prevPeakRef.current = 0;
      setShowScore(false);
    }
  }, [phase]);

  // Canvas waveform
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, W, H);

    if (!isListening || !analyserRef.current) {
      // Idle placeholder bars
      const barCount = 48;
      const barW = Math.floor(W / barCount) - 1;
      for (let i = 0; i < barCount; i++) {
        const h = 4 + Math.sin(Date.now() / 1000 + i * 0.4) * 6;
        const x = i * (barW + 1);
        ctx.fillStyle = 'rgba(0,255,255,0.15)';
        ctx.fillRect(x, H / 2 - h / 2, barW, h);
      }
      return;
    }

    const data = getWaveformData(analyserRef.current);
    const barCount = 64;
    const barW = Math.floor(W / barCount) - 1;
    const step = Math.floor(data.length / barCount);

    for (let i = 0; i < barCount; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) {
        sum += data[i * step + j];
      }
      const avg = sum / step;
      const barH = Math.max(3, (avg / 255) * H * 0.9);
      const x = i * (barW + 1);

      // Color based on height
      const ratio = barH / H;
      let color;
      if (ratio < 0.3) color = '#00ffff';
      else if (ratio < 0.5) color = '#00ff41';
      else if (ratio < 0.7) color = '#ffff00';
      else color = '#ff00ff';

      // Gradient bar
      const grad = ctx.createLinearGradient(x, H, x, H - barH);
      grad.addColorStop(0, color);
      grad.addColorStop(1, `${color}33`);
      ctx.fillStyle = grad;
      ctx.fillRect(x, H - barH, barW, barH);

      // Glow on top of tall bars
      if (ratio > 0.5) {
        ctx.fillStyle = `${color}44`;
        ctx.fillRect(x - 1, H - barH - 2, barW + 2, 3);
      }
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(0,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (H / 4) * i);
      ctx.lineTo(W, (H / 4) * i);
      ctx.stroke();
    }
  }, [isListening, analyserRef]);

  useEffect(() => {
    const loop = () => {
      drawCanvas();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [drawCanvas]);

  // Volume bar color
  const volColor = (() => {
    if (currentVolume < 20) return '#666666';
    if (currentVolume < 40) return '#00ff41';
    if (currentVolume < 60) return '#ffff00';
    if (currentVolume < 80) return '#ff6600';
    return '#ff00ff';
  })();

  return (
    <div className="cyber-panel" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minHeight: 0,
      position: 'relative',
    }}>
      {/* Header */}
      <div className="section-header" style={{
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="indicator" style={{
            background: isListening ? 'var(--neon-green)' : 'var(--neon-cyan)',
            boxShadow: isListening ? 'var(--glow-green)' : 'var(--glow-cyan)',
          }} />
          PERFORMANCE ANALYZER
        </div>
        {isListening && (
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '13px',
            color: 'var(--neon-green)',
            textShadow: 'var(--glow-green)',
            animation: 'neon-pulse 1s infinite',
          }}>
            ● REC {formatTime(elapsed)}
          </div>
        )}
      </div>

      {/* Idle state */}
      {phase === 'idle' && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}>
          <div style={{
            fontSize: '64px',
            animation: 'neon-pulse 2s infinite',
          }}>🎤</div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '18px',
            letterSpacing: '4px',
            color: 'var(--neon-cyan)',
            textShadow: 'var(--glow-cyan)',
          }}>
            READY FOR PERFORMANCE
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'center',
          }}>
            Set up a performance above and hit START
          </div>
        </div>
      )}

      {/* Performing state */}
      {phase === 'performing' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          {/* Singer / Song info */}
          {currentSinger && (
            <div style={{
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              flexShrink: 0,
              borderBottom: '1px solid rgba(0,255,255,0.1)',
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '20px',
                color: currentSinger.color,
                textShadow: `0 0 10px ${currentSinger.color}`,
                letterSpacing: '2px',
              }}>
                {currentSinger.name.toUpperCase()}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>singing</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
              }}>
                {currentSong}
              </div>
            </div>
          )}

          {/* Canvas + Volume meter row */}
          <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            />

            {/* Vertical volume meter */}
            <div style={{
              width: '36px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px 4px',
              gap: '4px',
              background: 'rgba(0,0,0,0.3)',
              flexShrink: 0,
            }}>
              <div style={{
                fontSize: '8px',
                fontFamily: 'var(--font-heading)',
                color: 'var(--text-muted)',
                letterSpacing: '1px',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
                marginBottom: '4px',
              }}>
                VOL
              </div>
              <div style={{
                flex: 1,
                width: '16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(0,255,255,0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${currentVolume}%`,
                  background: `linear-gradient(to top, ${volColor}, ${volColor}88)`,
                  boxShadow: `0 0 8px ${volColor}`,
                  transition: 'height 0.05s, background 0.2s',
                }} />
              </div>
              {/* Peak flash indicator */}
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: peakFlash ? '#ff00ff' : 'transparent',
                border: '1px solid rgba(255,0,255,0.4)',
                boxShadow: peakFlash ? '0 0 12px #ff00ff' : 'none',
                transition: 'all 0.1s',
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Rating/done state — score reveal */}
      {(phase === 'rating') && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
        }}>
          <div
            className="glitch-text"
            data-text="PERFORMANCE COMPLETE"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '20px',
              letterSpacing: '4px',
              color: 'var(--neon-cyan)',
              textShadow: 'var(--glow-cyan)',
            }}
          >
            PERFORMANCE COMPLETE
          </div>

          {showScore && vocalScore !== null && (() => {
            const label = getVocalLabel(vocalScore);
            return (
              <div style={{ textAlign: 'center', animation: 'winner-zoom 0.5s ease' }}>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '72px',
                  fontWeight: '900',
                  color: label.color,
                  textShadow: `0 0 20px ${label.color}, 0 0 40px ${label.color}66`,
                  lineHeight: 1,
                }}>
                  {vocalScore}
                </div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '14px',
                  letterSpacing: '4px',
                  color: label.color,
                  marginTop: '8px',
                }}>
                  {label.label}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  marginTop: '6px',
                  fontFamily: 'var(--font-mono)',
                }}>
                  VOCAL POWER SCORE
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
