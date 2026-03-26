import React from 'react';

export default function VideoPlayer({ currentSong, isPlaying }) {
  return (
    <div style={{
      flex: 1,
      position: 'relative',
      background: '#000',
      border: '1px solid rgba(0,255,255,0.3)',
      overflow: 'hidden',
      minHeight: 0,
    }}>
      {/* CRT Corner decorations */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '16px', height: '16px', borderTop: '2px solid var(--neon-cyan)', borderLeft: '2px solid var(--neon-cyan)', zIndex: 4, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: '16px', height: '16px', borderTop: '2px solid var(--neon-cyan)', borderRight: '2px solid var(--neon-cyan)', zIndex: 4, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '16px', height: '16px', borderBottom: '2px solid var(--neon-magenta)', borderLeft: '2px solid var(--neon-magenta)', zIndex: 4, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', borderBottom: '2px solid var(--neon-magenta)', borderRight: '2px solid var(--neon-magenta)', zIndex: 4, pointerEvents: 'none' }} />

      {/* YouTube IFrame container */}
      <div
        id="youtube-player"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Scanline overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* Vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* No song placeholder */}
      {!currentSong && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          background: 'rgba(0,0,0,0.85)',
          gap: '12px',
        }}>
          <div style={{
            fontSize: '48px',
            filter: 'drop-shadow(0 0 12px var(--neon-cyan))',
          }}>
            🎤
          </div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '14px',
            letterSpacing: '4px',
            color: 'var(--neon-cyan)',
            textShadow: 'var(--glow-cyan)',
            animation: 'neon-pulse 2s infinite',
          }}>
            AWAITING PERFORMANCE
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            maxWidth: '200px',
            lineHeight: '1.6',
          }}>
            Search for songs and add them to the queue to begin
          </div>
        </div>
      )}

      {/* Current song info overlay */}
      {currentSong && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '10px 16px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%)',
          zIndex: 4,
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
          pointerEvents: 'none',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="truncate" style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 0 8px rgba(0,0,0,0.8)',
              marginBottom: '2px',
            }}>
              {currentSong.title}
            </div>
            {currentSong.singer && (
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '10px',
                letterSpacing: '2px',
                color: currentSong.singer.color,
                textShadow: `0 0 8px ${currentSong.singer.color}`,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: currentSong.singer.color,
                  boxShadow: `0 0 6px ${currentSong.singer.color}`,
                  animation: isPlaying ? 'neon-pulse 1s infinite' : 'none',
                }} />
                {currentSong.singer.name}
              </div>
            )}
          </div>
          {isPlaying && (
            <div style={{
              display: 'flex',
              gap: '3px',
              alignItems: 'flex-end',
              height: '20px',
            }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '3px',
                    background: 'var(--neon-cyan)',
                    boxShadow: 'var(--glow-cyan)',
                    animation: `neon-pulse ${0.4 + i * 0.15}s infinite alternate`,
                    height: `${40 + i * 15}%`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
