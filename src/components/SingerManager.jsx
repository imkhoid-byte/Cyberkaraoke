import React, { useState } from 'react';

export default function SingerManager({ singers, onAdd, onRemove, selectedSinger, onSelectSinger }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = inputValue.trim();
    if (!name) return;
    onAdd(name);
    setInputValue('');
  };

  return (
    <div className="cyber-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div className="section-header">
        <span className="indicator" />
        SINGERS
        <span style={{
          marginLeft: 'auto',
          fontSize: '10px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          [{singers.length}]
        </span>
      </div>

      <div style={{ padding: '10px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          <input
            className="cyber-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter singer name..."
            style={{ flex: 1, fontSize: '12px' }}
          />
          <button
            type="submit"
            className="neon-btn green"
            style={{ padding: '8px 10px', fontSize: '12px', flexShrink: 0 }}
          >
            +
          </button>
        </form>

        {singers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '11px',
            padding: '12px 0',
            fontFamily: 'var(--font-mono)',
          }}>
            No singers yet.<br />Add singers to assign them to songs.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {singers.map((singer) => {
              const isSelected = selectedSinger?.id === singer.id;
              return (
                <div
                  key={singer.id}
                  onClick={() => onSelectSinger(isSelected ? null : singer)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 10px',
                    background: isSelected ? `${singer.color}18` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isSelected ? singer.color : 'rgba(255,255,255,0.08)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? `0 0 8px ${singer.color}44` : 'none',
                  }}
                >
                  {/* Color dot */}
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: singer.color,
                    boxShadow: `0 0 6px ${singer.color}`,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    flex: 1,
                    color: isSelected ? singer.color : 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: isSelected ? '600' : '400',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {singer.name}
                  </span>
                  {isSelected && (
                    <span style={{
                      fontSize: '9px',
                      color: singer.color,
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '1px',
                      flexShrink: 0,
                    }}>
                      ACTIVE
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(singer.id); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      lineHeight: 1,
                      padding: '0 2px',
                      flexShrink: 0,
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ff3366'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {singers.length > 0 && (
          <div style={{
            marginTop: '8px',
            fontSize: '10px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'center',
          }}>
            Click a singer to select them for queue assignment
          </div>
        )}
      </div>
    </div>
  );
}
