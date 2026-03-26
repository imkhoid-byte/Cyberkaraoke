import React, { useMemo, useEffect, useState } from 'react';

function Confetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: ['#00ffff', '#ff00ff', '#00ff41', '#ff6600', '#ffff00'][Math.floor(Math.random() * 5)],
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 3}s`,
      size: `${4 + Math.random() * 6}px`,
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 6px ${p.color}`,
            animation: `confetti-fall ${p.duration} ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function WinnerScreen({ singers, scores, onNewSession }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  const ranked = useMemo(() => {
    return singers
      .map((singer) => ({ ...singer, score: scores[singer.id] || 0 }))
      .sort((a, b) => b.score - a.score);
  }, [singers, scores]);

  const winner = ranked[0];
  const hasScores = ranked.some((s) => s.score > 0);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 400,
      background: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflow: 'auto',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <Confetti />

      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%',
        animation: show ? 'winner-zoom 0.6s ease' : 'none',
      }}>
        {/* Session Over label */}
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '11px',
          letterSpacing: '5px',
          color: 'var(--neon-magenta)',
          textShadow: 'var(--glow-magenta)',
          marginBottom: '12px',
          animation: 'neon-pulse 2s infinite',
        }}>
          // SESSION COMPLETE
        </div>

        {/* WINNER header */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <h1
            className="glitch-text"
            data-text="WINNER"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(48px, 8vw, 80px)',
              fontWeight: '900',
              letterSpacing: '8px',
              color: 'var(--neon-cyan)',
              textShadow: 'var(--glow-cyan)',
              lineHeight: 1,
            }}
          >
            WINNER
          </h1>
        </div>

        {winner && hasScores ? (
          <>
            {/* Winner name */}
            <div
              className="glitch-text"
              data-text={winner.name.toUpperCase()}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(28px, 5vw, 48px)',
                fontWeight: '800',
                letterSpacing: '4px',
                color: winner.color,
                textShadow: `0 0 20px ${winner.color}, 0 0 40px ${winner.color}66`,
                marginBottom: '8px',
              }}
            >
              {winner.name.toUpperCase()}
            </div>

            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '16px',
              letterSpacing: '3px',
              color: winner.color,
              marginBottom: '32px',
              opacity: 0.8,
            }}>
              FINAL SCORE: {winner.score}
            </div>
          </>
        ) : (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '16px',
            color: 'var(--text-secondary)',
            marginBottom: '32px',
          }}>
            {singers.length === 0
              ? 'No singers participated'
              : 'No scores recorded this session'}
          </div>
        )}

        {/* Score table */}
        {ranked.length > 0 && (
          <div className="cyber-panel" style={{
            padding: '0',
            marginBottom: '32px',
            textAlign: 'left',
            overflow: 'hidden',
          }}>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <span className="indicator" />
              FINAL STANDINGS
            </div>
            <div style={{ padding: '8px' }}>
              {ranked.map((singer, index) => (
                <div
                  key={singer.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 10px',
                    borderBottom: index < ranked.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: index === 0 && singer.score > 0 ? `${singer.color}0d` : 'transparent',
                    animation: index === 0 && singer.score > 0 && show ? `slide-in-up ${0.3 + index * 0.1}s ease` : 'none',
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '18px',
                    width: '30px',
                    textAlign: 'center',
                  }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: singer.color,
                    boxShadow: `0 0 8px ${singer.color}`,
                    flexShrink: 0,
                  }} />
                  <div style={{
                    flex: 1,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    color: singer.color,
                    fontWeight: index === 0 ? '600' : '400',
                  }}>
                    {singer.name}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: singer.score > 0 ? singer.color : 'var(--text-muted)',
                    textShadow: singer.score > 0 ? `0 0 10px ${singer.color}` : 'none',
                  }}>
                    {singer.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          className="neon-btn green"
          onClick={onNewSession}
          style={{
            padding: '14px 40px',
            fontSize: '14px',
            letterSpacing: '3px',
            animation: 'neon-pulse 2s infinite',
          }}
        >
          ▶ NEW SESSION
        </button>
      </div>
    </div>
  );
}
