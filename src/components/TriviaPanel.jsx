import React from 'react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function TriviaPanel({
  questions,
  currentQ,
  loading,
  currentArtist,
  onAnswer,
  onNext,
  triviaBonus,
  phase,
}) {
  const q = questions[currentQ];
  const allDone = questions.length > 0 && questions.every((q) => q.answered);
  const correctCount = questions.filter((q) => q.wasCorrect).length;

  return (
    <div className="cyber-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      <div className="section-header">
        <span className="indicator" style={{
          background: 'var(--neon-magenta)',
          boxShadow: 'var(--glow-magenta)',
        }} />
        AUDIENCE TRIVIA
        {phase === 'performing' && questions.length > 0 && (
          <span style={{
            marginLeft: 'auto',
            fontSize: '9px',
            fontFamily: 'var(--font-heading)',
            color: 'var(--neon-magenta)',
            animation: 'neon-pulse 2s infinite',
          }}>
            LIVE
          </span>
        )}
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
        gap: '12px',
        overflow: 'auto',
      }}>
        {/* Idle */}
        {phase === 'idle' && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}>
            <div style={{ fontSize: '40px', opacity: 0.4 }}>🧠</div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '12px',
              letterSpacing: '2px',
              color: 'var(--text-muted)',
              textAlign: 'center',
            }}>
              TRIVIA LOADS WHEN PERFORMANCE STARTS
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '14px',
              letterSpacing: '3px',
              color: 'var(--neon-cyan)',
              animation: 'neon-pulse 1s infinite',
            }}>
              LOADING INTEL...
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--neon-magenta)',
                    animation: `neon-pulse 1s ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Artist label */}
        {!loading && currentArtist && questions.length > 0 && (
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '13px',
            letterSpacing: '2px',
            color: 'var(--neon-magenta)',
            textShadow: 'var(--glow-magenta)',
            textAlign: 'center',
            padding: '4px 0',
          }}>
            {currentArtist.toUpperCase()} INTEL
          </div>
        )}

        {/* Score dots */}
        {questions.length > 0 && !loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: '9px',
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-muted)',
              letterSpacing: '1px',
            }}>
              AUDIENCE BONUS
            </span>
            {questions.map((q, i) => (
              <div
                key={i}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: q.answered
                    ? (q.wasCorrect ? '#00ff41' : '#ff3366')
                    : (i === currentQ ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.1)'),
                  boxShadow: q.answered && q.wasCorrect ? '0 0 6px #00ff41' : 'none',
                  border: i === currentQ && !q.answered ? '1px solid var(--neon-cyan)' : '1px solid transparent',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
        )}

        {/* All done */}
        {allDone && (
          <div style={{
            background: 'rgba(0,255,65,0.05)',
            border: '1px solid rgba(0,255,65,0.3)',
            padding: '16px',
            textAlign: 'center',
            animation: 'slide-in-up 0.4s ease',
          }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '13px',
              letterSpacing: '2px',
              color: 'var(--neon-green)',
              textShadow: 'var(--glow-green)',
              marginBottom: '6px',
            }}>
              TRIVIA COMPLETE
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '20px',
              color: 'var(--neon-yellow)',
              textShadow: '0 0 10px var(--neon-yellow)',
            }}>
              BONUS: +{triviaBonus}pts
            </div>
            <div style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              marginTop: '4px',
            }}>
              {correctCount}/{questions.length} correct answers
            </div>
          </div>
        )}

        {/* Current question */}
        {!loading && q && !allDone && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div style={{
              fontSize: '10px',
              letterSpacing: '2px',
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-muted)',
            }}>
              Q{currentQ + 1} OF {questions.length}
            </div>

            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              padding: '10px',
              background: 'rgba(0,255,255,0.03)',
              border: '1px solid rgba(0,255,255,0.15)',
              minHeight: '60px',
            }}>
              {q.question}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {q.options.map((opt, i) => {
                const isCorrect = opt === q.correct;
                const isAnswered = q.answered;
                let bg = 'transparent';
                let border = 'rgba(0,255,255,0.25)';
                let color = 'var(--text-primary)';
                let shadow = 'none';

                if (isAnswered) {
                  if (isCorrect) {
                    bg = 'rgba(0,255,65,0.1)';
                    border = '#00ff41';
                    color = '#00ff41';
                    shadow = '0 0 8px rgba(0,255,65,0.4)';
                  } else {
                    bg = 'rgba(255,51,102,0.05)';
                    border = 'rgba(255,51,102,0.3)';
                    color = 'var(--text-muted)';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => !q.answered && onAnswer(opt)}
                    disabled={q.answered}
                    style={{
                      background: bg,
                      border: `1px solid ${border}`,
                      color,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      padding: '10px 12px',
                      textAlign: 'left',
                      cursor: q.answered ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: shadow,
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'flex-start',
                    }}
                    onMouseEnter={(e) => {
                      if (!q.answered) {
                        e.currentTarget.style.background = 'rgba(0,255,255,0.08)';
                        e.currentTarget.style.borderColor = 'var(--neon-cyan)';
                        e.currentTarget.style.color = 'var(--neon-cyan)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!q.answered) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(0,255,255,0.25)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '11px',
                      color: q.answered ? (isCorrect ? '#00ff41' : 'var(--text-muted)') : 'var(--neon-magenta)',
                      flexShrink: 0,
                      minWidth: '16px',
                    }}>
                      {OPTION_LABELS[i]}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {q.answered && currentQ < questions.length - 1 && (
              <button
                className="neon-btn"
                onClick={onNext}
                style={{ marginTop: 'auto' }}
              >
                NEXT QUESTION →
              </button>
            )}

            {q.answered && q.wasCorrect && (
              <div style={{
                fontSize: '11px',
                color: '#00ff41',
                textShadow: '0 0 8px #00ff41',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '2px',
                textAlign: 'center',
                animation: 'score-pop 0.5s ease',
              }}>
                +5 BONUS POINTS!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
