import React, { useMemo } from 'react';

const RANK_MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function Leaderboard({ singers, scores, onEndSession, onEndNight }) {
  const ranked = useMemo(() => {
    return singers
      .map((singer) => ({
        ...singer,
        total: scores[singer.id]?.total || 0,
        songs: scores[singer.id]?.songs || 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [singers, scores]);

  const maxScore = Math.max(...ranked.map((s) => s.total), 1);

  return (
    <div className="cyber-panel" style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div className="section-header">
        <span className="indicator" />
        LEADERBOARD
        {ranked.some((s) => s.total > 0) && (
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
              const barWidth = maxScore > 0 ? (singer.total / maxScore) * 100 : 0;
              return (
                <div
                  key={singer.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 8px',
                    background: rank === 1 && singer.total > 0
                      ? `${singer.color}12`
                      : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${rank === 1 && singer.total > 0 ? `${singer.color}44` : 'rgba(255,255,255,0.05)'}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Score bar bg */}
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

                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    width: '22px',
                    textAlign: 'center',
                    flexShrink: 0,
                    zIndex: 1,
                  }}>
                    {RANK_MEDALS[rank] || `#${rank}`}
                  </div>

                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: singer.color,
                    boxShadow: `0 0 6px ${singer.color}`,
                    flexShrink: 0,
                    zIndex: 1,
                  }} />

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

                  <div style={{
                    fontSize: '9px',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    flexShrink: 0,
                    zIndex: 1,
                    marginRight: '4px',
                  }}>
                    {singer.songs}s
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: singer.total > 0 ? singer.color : 'var(--text-muted)',
                    textShadow: singer.total > 0 ? `0 0 8px ${singer.color}` : 'none',
                    flexShrink: 0,
                    zIndex: 1,
                    minWidth: '32px',
                    textAlign: 'right',
                  }}>
                    {singer.total}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {singers.length > 0 && (
          <button
            className="neon-btn"
            onClick={onEndNight || onEndSession}
            style={{
              width: '100%',
              marginTop: '10px',
              borderColor: '#ff3366',
              color: '#ff3366',
              fontSize: '11px',
            }}
          >
            ■ END NIGHT
          </button>
        )}
      </div>
    </div>
  );
}
