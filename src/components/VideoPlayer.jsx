import React, { useState, useEffect } from 'react';

function useTimer(active) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!active) { setSeconds(0); return; }
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function VideoPlayer({ currentSong, isPlaying, onLaunch, onDoneSinging, onSkip }) {
  const timer = useTimer(isPlaying);

  const handleLaunch = () => {
    if (!currentSong) return;
    window.open(`https://www.youtube.com/watch?v=${currentSong.videoId}`, '_blank');
    onLaunch?.();
  };

  return (
    <div style={{
      flex: 1,
      position: 'relative',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d0d20 100%)',
      border: '1px solid rgba(0,255,255,0.3)',
      overflow: 'hidden',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* CRT corners */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '16px', height: '16px', borderTop: '2px solid var(--neon-cyan)', borderLeft: '2px solid var(--neon-cyan)', zIndex: 4, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: '16px', height: '16px', borderTop: '2px solid var(--neon-cyan)', borderRight: '2px solid var(--neon-cyan)', zIndex: 4, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '16px', height: '16px', borderBottom: '2px solid var(--neon-magenta)', borderLeft: '2px solid var(--neon-magenta)', zIndex: 4, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', borderBottom: '2px solid var(--neon-magenta)', borderRight: '2px solid var(--neon-magenta)', zIndex: 4, pointerEvents: 'none' }} />

      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
      }} />

      {!currentSong ? (
        /* Idle state */
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '24px',
        }}>
          <div style={{ fontSize: '56px', filter: 'drop-shadow(0 0 16px var(--neon-cyan))' }}>🎤</div>
          <div style={{
            fontFamily: 'var(--font-heading)', fontSize: '16px', letterSpacing: '4px',
            color: 'var(--neon-cyan)', textShadow: 'var(--glow-cyan)', animation: 'neon-pulse 2s infinite',
          }}>
            AWAITING PERFORMANCE
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)',
            textAlign: 'center', maxWidth: '240px', lineHeight: '1.7',
          }}>
            Search for songs and add them to the queue. Hit <span style={{ color: 'var(--neon-green)' }}>LAUNCH</span> to open the video in YouTube — ad-free with your Premium account.
          </div>
        </div>
      ) : (
        /* Now playing state */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

          {/* Thumbnail background blur */}
          {currentSong.thumbnail && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${currentSong.thumbnail})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'blur(20px) brightness(0.15)',
              zIndex: 0,
            }} />
          )}

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '20px', position: 'relative', zIndex: 2 }}>

            {/* Thumbnail */}
            {currentSong.thumbnail && (
              <div style={{ position: 'relative' }}>
                <img
                  src={currentSong.thumbnail.replace('default', 'mqdefault')}
                  alt=""
                  style={{
                    width: '200px', height: '113px', objectFit: 'cover',
                    border: isPlaying ? '2px solid var(--neon-cyan)' : '2px solid rgba(0,255,255,0.3)',
                    boxShadow: isPlaying ? '0 0 24px rgba(0,255,255,0.5), 0 0 48px rgba(0,255,255,0.2)' : 'none',
                    transition: 'all 0.3s',
                  }}
                />
                {isPlaying && (
                  <div style={{
                    position: 'absolute', top: '6px', right: '6px',
                    background: '#ff0000', color: '#fff',
                    fontFamily: 'var(--font-heading)', fontSize: '9px',
                    padding: '2px 6px', letterSpacing: '1px',
                    animation: 'neon-pulse 1s infinite',
                  }}>
                    ● LIVE
                  </div>
                )}
              </div>
            )}

            {/* Song title */}
            <div style={{ textAlign: 'center', maxWidth: '280px' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#fff',
                lineHeight: '1.4', marginBottom: '8px',
                textShadow: '0 0 12px rgba(255,255,255,0.3)',
              }}>
                {currentSong.title}
              </div>

              {/* Singer badge */}
              {currentSong.singer && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  border: `1px solid ${currentSong.singer.color}`,
                  padding: '4px 12px',
                  boxShadow: `0 0 10px ${currentSong.singer.color}44`,
                }}>
                  <div style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: currentSong.singer.color,
                    boxShadow: `0 0 8px ${currentSong.singer.color}`,
                    animation: isPlaying ? 'neon-pulse 1s infinite' : 'none',
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-heading)', fontSize: '11px',
                    letterSpacing: '2px', color: currentSong.singer.color,
                  }}>
                    {currentSong.singer.name}
                  </span>
                </div>
              )}
            </div>

            {/* Timer */}
            {isPlaying && (
              <div style={{
                fontFamily: 'var(--font-heading)', fontSize: '28px',
                color: 'var(--neon-cyan)', letterSpacing: '6px',
                textShadow: 'var(--glow-cyan)',
              }}>
                {timer}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {!isPlaying ? (
                <button
                  className="neon-btn green"
                  onClick={handleLaunch}
                  style={{ fontSize: '14px', padding: '12px 24px', letterSpacing: '3px' }}
                >
                  ▶ LAUNCH IN YOUTUBE
                </button>
              ) : (
                <>
                  <button
                    className="neon-btn green"
                    onClick={handleLaunch}
                    style={{ fontSize: '11px', padding: '8px 14px' }}
                  >
                    ↗ REOPEN
                  </button>
                  <button
                    className="neon-btn magenta"
                    onClick={onDoneSinging}
                    style={{ fontSize: '13px', padding: '10px 20px', letterSpacing: '2px' }}
                  >
                    ✓ DONE SINGING
                  </button>
                </>
              )}
            </div>

            {!isPlaying && (
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)',
                textAlign: 'center',
              }}>
                Opens in YouTube · Ad-free with Premium · Cast to TV via AirPlay
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
