import React, { useMemo } from 'react';

const RANK_MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function Leaderboard({ singers, scores, onEndSession, sessionActive }) {
  const ranked = useMemo(() => {
    return singers
      .map((singer) => ({ ...singer, score: scores[singer.id] || 0 }))
      .sort((a, b) => b.score - a.score);
  }, [singers, scores]);

  const maxScore = ranked.length > 0 ? Math.max(...ranked.map((s) => s.score), 1) : 1;

  return (
    <div className="cyber-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div className="section-header">
        <span className="indicator" />
        LEADERBOARD
        {sessionActive && (
          <span style={{
            marginLeft: 'auto',
            fontSize: '9px',
            color: 'var(--neon-green)',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '1px',
            animation: 'neon-pulse 2s infinite',
          }}>
            LIVE
          </span>
        )}
      </div>

      <div style={{ padding: '8px' }}>
        {singers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '12px',
            color: 'var(--text-muted)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
          }}>
            No singers yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {ranked.map((singer, index) => {
              const rank = index + 1;
              const barWidth = maxScore > 0 ? (singer.score / maxScore) * 100 : 0;
              return (
                <div
                  key={singer.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 8px',
                    background: rank === 1 && singer.score > 0
                      ? `${singer.color}12`
                      : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${rank === 1 && singer.score > 0 ? `${singer.color}44` : 'rgba(255,255,255,0.05)'}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Score bar background */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${barWidth}%`,
                    background: `${singer.color}0a`,
                    transition: 'width 0.5s ease',
                    pointerEvents: 'none',
                  }} />

                  {/* Rank */}
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    width: '20px',
                    textAlign: 'center',
                    flexShrink: 0,
                    zIndex: 1,
                  }}>
                    {RANK_MEDALS[rank] || `#${rank}`}
                  </div>

                  {/* Color dot */}
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: singer.color,
                    boxShadow: `0 0 6px ${singer.color}`,
                    flexShrink: 0,
                    zIndex: 1,
                  }} />

                  {/* Name */}
                  <div style={{
                    flex: 1,
                    fontSize: '12px',
                    color: singer.color,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: rank === 1 ? '600' : '400',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    zIndex: 1,
                  }}>
                    {singer.name}
                  </div>

                  {/* Score */}
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: singer.score > 0 ? singer.color : 'var(--text-muted)',
                    textShadow: singer.score > 0 ? `0 0 8px ${singer.color}` : 'none',
                    flexShrink: 0,
                    zIndex: 1,
                    minWidth: '28px',
                    textAlign: 'right',
                  }}>
                    {singer.score}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
