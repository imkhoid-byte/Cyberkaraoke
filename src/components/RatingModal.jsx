import React, { useState } from 'react';

const SCORE_COLORS = {
  1: '#ff0033',
  2: '#ff3300',
  3: '#ff6600',
  4: '#ff9900',
  5: '#ffcc00',
  6: '#ccff00',
  7: '#99ff00',
  8: '#00ff41',
  9: '#00ffcc',
  10: '#00ffff',
};

export default function RatingModal({ singer, songTitle, onRate, onSkip }) {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    setTimeout(() => {
      onRate(selected);
      setSelected(null);
      setConfirmed(false);
    }, 600);
  };

  const singerColor = singer?.color || 'var(--neon-cyan)';
  const singerName = singer?.name || 'UNKNOWN';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 300,
      background: 'rgba(10,10,15,0.92)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Animated scanlines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,255,0.02) 2px, rgba(255,0,255,0.02) 4px)',
        pointerEvents: 'none',
        animation: 'scanlines 8s linear infinite',
      }} />

      <div className="cyber-panel" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '36px',
        position: 'relative',
        animation: 'winner-zoom 0.4s ease',
        boxShadow: `0 0 40px ${singerColor}44, 0 0 80px rgba(255,0,255,0.1)`,
        border: `1px solid ${singerColor}88`,
      }}>
        {/* Corner accents */}
        <div style={{ position: 'absolute', top: -2, left: -2, width: '24px', height: '24px', borderTop: `2px solid ${singerColor}`, borderLeft: `2px solid ${singerColor}` }} />
        <div style={{ position: 'absolute', top: -2, right: -2, width: '24px', height: '24px', borderTop: `2px solid ${singerColor}`, borderRight: `2px solid ${singerColor}` }} />
        <div style={{ position: 'absolute', bottom: -2, left: -2, width: '24px', height: '24px', borderBottom: '2px solid var(--neon-magenta)', borderLeft: '2px solid var(--neon-magenta)' }} />
        <div style={{ position: 'absolute', bottom: -2, right: -2, width: '24px', height: '24px', borderBottom: '2px solid var(--neon-magenta)', borderRight: '2px solid var(--neon-magenta)' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '10px',
            letterSpacing: '4px',
            color: 'var(--neon-magenta)',
            marginBottom: '10px',
          }}>
            // PERFORMANCE REVIEW
          </div>
          <h2
            className="glitch-text"
            data-text={`RATE ${singerName}`}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '26px',
              fontWeight: '900',
              letterSpacing: '3px',
              color: singerColor,
              textShadow: `0 0 10px ${singerColor}, 0 0 20px ${singerColor}66`,
            }}
          >
            RATE {singerName}
          </h2>
          <div style={{
            marginTop: '10px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            maxWidth: '360px',
            margin: '10px auto 0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {songTitle}
          </div>
        </div>

        {/* Rating Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px',
          marginBottom: '28px',
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
            const color = SCORE_COLORS[n];
            const isSelected = selected === n;
            return (
              <button
                key={n}
                onClick={() => setSelected(n)}
                style={{
                  background: isSelected ? `${color}22` : 'transparent',
                  border: `2px solid ${isSelected ? color : `${color}55`}`,
                  color: isSelected ? color : `${color}aa`,
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: '800',
                  padding: '14px 0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? `0 0 12px ${color}66, inset 0 0 8px ${color}22` : 'none',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = `${color}11`;
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.color = color;
                    e.currentTarget.style.boxShadow = `0 0 8px ${color}44`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = `${color}55`;
                    e.currentTarget.style.color = `${color}aa`;
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {n}
              </button>
            );
          })}
        </div>

        {/* Selected score display */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {selected !== null ? (
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '13px',
              letterSpacing: '2px',
              color: SCORE_COLORS[selected],
              textShadow: `0 0 10px ${SCORE_COLORS[selected]}`,
            }}>
              SCORE: {selected}/10 — {
                selected <= 2 ? 'SYSTEM FAILURE' :
                selected <= 4 ? 'NEEDS WORK' :
                selected <= 6 ? 'DECENT EFFORT' :
                selected <= 8 ? 'SOLID PERFORMANCE' :
                selected === 9 ? 'OUTSTANDING' :
                'LEGENDARY'
              }
            </div>
          ) : (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-muted)',
            }}>
              Select a score above
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="neon-btn"
            onClick={onSkip}
            style={{ flex: 1 }}
          >
            SKIP RATING
          </button>
          <button
            className="neon-btn green"
            onClick={handleConfirm}
            disabled={selected === null}
            style={{
              flex: 2,
              opacity: selected === null ? 0.4 : 1,
              fontSize: '13px',
              animation: selected !== null && !confirmed ? 'neon-pulse 1.5s infinite' : 'none',
              background: confirmed ? 'rgba(0,255,65,0.2)' : undefined,
            }}
          >
            {confirmed ? '✓ LOGGED' : '▶ CONFIRM SCORE'}
          </button>
        </div>
      </div>
    </div>
  );
}
