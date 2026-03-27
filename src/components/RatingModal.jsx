import React, { useState } from 'react';
import { VOCAL_LABELS } from '../constants';

const SCORE_COLORS = {
  1: '#ff0033', 2: '#ff3300', 3: '#ff6600', 4: '#ff9900', 5: '#ffcc00',
  6: '#ccff00', 7: '#99ff00', 8: '#00ff41', 9: '#00ffcc', 10: '#00ffff',
};

function getVocalLabel(score) {
  return VOCAL_LABELS.find((l) => score >= l.min && score < l.max) || VOCAL_LABELS[VOCAL_LABELS.length - 1];
}

export default function RatingModal({ singer, songTitle, vocalScore, triviaBonus, onSubmit }) {
  const [audienceRating, setAudienceRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const singerColor = singer?.color || 'var(--neon-cyan)';
  const singerName = singer?.name || 'UNKNOWN';
  const vLabel = vocalScore !== null ? getVocalLabel(vocalScore) : null;

  const finalScore = audienceRating !== null
    ? Math.round(
        (vocalScore || 0) * 0.4 +
        audienceRating * 10 * 0.4 +
        triviaBonus * 0.2
      )
    : null;

  const handleSubmit = () => {
    if (audienceRating === null) return;
    setSubmitted(true);
    setTimeout(() => {
      onSubmit(audienceRating);
      setSubmitted(false);
      setAudienceRating(null);
    }, 700);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 300,
      background: 'rgba(10,10,15,0.92)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Scanlines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,255,0.02) 2px, rgba(255,0,255,0.02) 4px)',
        pointerEvents: 'none',
        animation: 'scanlines 8s linear infinite',
      }} />

      <div className="cyber-panel" style={{
        width: '100%',
        maxWidth: '580px',
        padding: '32px',
        position: 'relative',
        animation: 'winner-zoom 0.4s ease',
        boxShadow: `0 0 40px ${singerColor}44, 0 0 80px rgba(255,0,255,0.1)`,
        border: `1px solid ${singerColor}88`,
      }}>
        {/* Corner accents */}
        {[
          { top: -2, left: -2, borderTop: `2px solid ${singerColor}`, borderLeft: `2px solid ${singerColor}` },
          { top: -2, right: -2, borderTop: `2px solid ${singerColor}`, borderRight: `2px solid ${singerColor}` },
          { bottom: -2, left: -2, borderBottom: '2px solid var(--neon-magenta)', borderLeft: '2px solid var(--neon-magenta)' },
          { bottom: -2, right: -2, borderBottom: '2px solid var(--neon-magenta)', borderRight: '2px solid var(--neon-magenta)' },
        ].map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: '24px', height: '24px', ...s }} />
        ))}

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '10px',
            letterSpacing: '4px',
            color: 'var(--neon-magenta)',
            marginBottom: '8px',
          }}>
            // PERFORMANCE REVIEW
          </div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '24px',
            fontWeight: '900',
            letterSpacing: '3px',
            color: singerColor,
            textShadow: `0 0 10px ${singerColor}, 0 0 20px ${singerColor}66`,
          }}>
            {singerName.toUpperCase()}
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            marginTop: '6px',
          }}>
            {songTitle}
          </div>
        </div>

        {/* Vocal Score */}
        {vocalScore !== null && vLabel && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: `${vLabel.color}0d`,
            border: `1px solid ${vLabel.color}44`,
            padding: '14px 16px',
            marginBottom: '20px',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '9px',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '2px',
                color: 'var(--text-muted)',
                marginBottom: '4px',
              }}>
                VOCAL POWER SCORE
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '11px',
                color: vLabel.color,
                letterSpacing: '2px',
              }}>
                {vLabel.label}
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '48px',
              fontWeight: '900',
              color: vLabel.color,
              textShadow: `0 0 15px ${vLabel.color}`,
              lineHeight: 1,
            }}>
              {vocalScore}
            </div>
          </div>
        )}

        {/* Audience Rating */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontSize: '10px',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '3px',
            color: 'var(--neon-cyan)',
            marginBottom: '10px',
          }}>
            AUDIENCE RATING
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gap: '6px',
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
              const color = SCORE_COLORS[n];
              const isSelected = audienceRating === n;
              return (
                <button
                  key={n}
                  onClick={() => setAudienceRating(n)}
                  style={{
                    background: isSelected ? `${color}22` : 'transparent',
                    border: `2px solid ${isSelected ? color : `${color}44`}`,
                    color: isSelected ? color : `${color}88`,
                    fontFamily: 'var(--font-heading)',
                    fontSize: '16px',
                    fontWeight: '800',
                    padding: '10px 0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? `0 0 10px ${color}55` : 'none',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = `${color}11`;
                      e.currentTarget.style.borderColor = color;
                      e.currentTarget.style.color = color;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = `${color}44`;
                      e.currentTarget.style.color = `${color}88`;
                    }
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trivia bonus + final score */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          marginBottom: '20px',
          padding: '12px',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(0,255,255,0.1)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '9px', fontFamily: 'var(--font-heading)', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              VOCAL (40%)
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: 'var(--neon-cyan)' }}>
              {vocalScore !== null ? Math.round((vocalScore || 0) * 0.4) : '--'}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '9px', fontFamily: 'var(--font-heading)', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              AUDIENCE (40%)
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: 'var(--neon-cyan)' }}>
              {audienceRating !== null ? Math.round(audienceRating * 10 * 0.4) : '--'}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '9px', fontFamily: 'var(--font-heading)', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              TRIVIA (20%)
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: 'var(--neon-magenta)' }}>
              +{Math.round(triviaBonus * 0.2)}
            </div>
          </div>
        </div>

        {finalScore !== null && (
          <div style={{
            textAlign: 'center',
            marginBottom: '16px',
            animation: 'score-pop 0.5s ease',
          }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '11px',
              letterSpacing: '3px',
              color: 'var(--text-muted)',
              marginBottom: '4px',
            }}>
              FINAL SCORE
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '42px',
              fontWeight: '900',
              color: singerColor,
              textShadow: `0 0 20px ${singerColor}, 0 0 40px ${singerColor}66`,
            }}>
              {finalScore}
            </div>
          </div>
        )}

        <button
          className="neon-btn green"
          onClick={handleSubmit}
          disabled={audienceRating === null}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '14px',
            letterSpacing: '3px',
            opacity: audienceRating === null ? 0.4 : 1,
            animation: audienceRating !== null && !submitted ? 'neon-pulse 1.5s infinite' : 'none',
            background: submitted ? 'rgba(0,255,65,0.2)' : undefined,
          }}
        >
          {submitted ? '✓ SCORE LOGGED' : '▶ SUBMIT SCORE'}
        </button>
      </div>
    </div>
  );
}
