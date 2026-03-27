import React, { useState } from 'react';

export default function SongEntry({ singers, currentSinger, onStart, phase }) {
  const [selectedId, setSelectedId] = useState(currentSinger?.id || '');
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');

  const handleStart = () => {
    const singer = singers.find((s) => s.id === selectedId);
    if (!singer || !artist.trim() || !song.trim()) return;
    onStart(singer, artist.trim(), song.trim());
  };

  const isCompact = phase === 'performing';
  const activeSinger = singers.find((s) => s.id === selectedId);

  if (isCompact && currentSinger) {
    return (
      <div className="cyber-panel" style={{
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
      }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: currentSinger.color,
          boxShadow: `0 0 8px ${currentSinger.color}`,
          animation: 'neon-pulse 1.5s infinite',
          flexShrink: 0,
        }} />
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '13px',
          color: currentSinger.color,
          textShadow: `0 0 8px ${currentSinger.color}`,
        }}>
          {currentSinger.name.toUpperCase()}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>performing</div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          flex: 1,
          textAlign: 'right',
        }}>
          NOW LIVE
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-panel" style={{ flexShrink: 0 }}>
      <div className="section-header">
        <span className="indicator" />
        PERFORMANCE SETUP
      </div>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Singer selector */}
        <div>
          <div style={{
            fontSize: '10px',
            letterSpacing: '2px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-heading)',
            marginBottom: '6px',
          }}>
            SELECT SINGER
          </div>
          {singers.length === 0 ? (
            <div style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              padding: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center',
            }}>
              Add singers in the left panel first
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {singers.map((s) => {
                const isActive = selectedId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    style={{
                      background: isActive ? `${s.color}22` : 'transparent',
                      border: `1px solid ${isActive ? s.color : `${s.color}44`}`,
                      color: isActive ? s.color : `${s.color}aa`,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      boxShadow: isActive ? `0 0 8px ${s.color}44` : 'none',
                    }}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Active singer display */}
        {activeSinger && (
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '18px',
            color: activeSinger.color,
            textShadow: `0 0 10px ${activeSinger.color}`,
            letterSpacing: '3px',
            textAlign: 'center',
            padding: '8px 0',
          }}>
            {activeSinger.name.toUpperCase()}
          </div>
        )}

        {/* Artist input */}
        <div>
          <div style={{
            fontSize: '10px',
            letterSpacing: '2px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-heading)',
            marginBottom: '6px',
          }}>
            ARTIST NAME
          </div>
          <input
            className="cyber-input"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="e.g. Queen, Adele, Eminem..."
          />
        </div>

        {/* Song input */}
        <div>
          <div style={{
            fontSize: '10px',
            letterSpacing: '2px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-heading)',
            marginBottom: '6px',
          }}>
            SONG TITLE
          </div>
          <input
            className="cyber-input"
            type="text"
            value={song}
            onChange={(e) => setSong(e.target.value)}
            placeholder="e.g. Bohemian Rhapsody..."
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />
        </div>

        {/* Start button */}
        <button
          className="neon-btn green"
          onClick={handleStart}
          disabled={!selectedId || !artist.trim() || !song.trim()}
          style={{
            padding: '14px',
            fontSize: '14px',
            letterSpacing: '3px',
            opacity: (!selectedId || !artist.trim() || !song.trim()) ? 0.4 : 1,
            animation: (selectedId && artist.trim() && song.trim()) ? 'neon-pulse 2s infinite' : 'none',
          }}
        >
          ▶ START PERFORMANCE
        </button>
      </div>
    </div>
  );
}
