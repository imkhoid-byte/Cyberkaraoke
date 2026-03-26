import React, { useState } from 'react';

export default function ApiKeySetup({ onSave }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError('API key cannot be empty');
      return;
    }
    onSave(trimmed);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(10, 10, 15, 0.97)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Scanline overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.015) 2px, rgba(0,255,255,0.015) 4px)',
        pointerEvents: 'none',
      }} />

      <div className="cyber-panel" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '32px',
        position: 'relative',
        animation: 'slide-in-up 0.4s ease',
      }}>
        {/* Corner decorations */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '2px solid var(--neon-cyan)', borderLeft: '2px solid var(--neon-cyan)' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '2px solid var(--neon-cyan)', borderRight: '2px solid var(--neon-cyan)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '2px solid var(--neon-magenta)', borderLeft: '2px solid var(--neon-magenta)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '2px solid var(--neon-magenta)', borderRight: '2px solid var(--neon-magenta)' }} />

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '10px',
            letterSpacing: '4px',
            color: 'var(--neon-magenta)',
            textShadow: '0 0 8px var(--neon-magenta)',
            marginBottom: '8px',
          }}>
            // SYSTEM INITIALIZATION
          </div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '22px',
            fontWeight: '800',
            letterSpacing: '3px',
            color: 'var(--neon-cyan)',
            textShadow: 'var(--glow-cyan)',
          }}>
            API KEY REQUIRED
          </h2>
          <p style={{
            marginTop: '12px',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            lineHeight: '1.6',
          }}>
            A YouTube Data API v3 key is required to search for karaoke songs.
            Your key is stored locally and never sent to any server.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-heading)',
              fontSize: '10px',
              letterSpacing: '2px',
              color: 'var(--neon-cyan)',
              marginBottom: '8px',
            }}>
              YOUTUBE DATA API v3 KEY
            </label>
            <input
              className="cyber-input"
              type="text"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(''); }}
              placeholder="AIzaSy..."
              autoFocus
              style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
            />
            {error && (
              <div style={{
                color: 'var(--neon-orange)',
                fontSize: '11px',
                marginTop: '6px',
                fontFamily: 'var(--font-mono)',
              }}>
                ⚠ {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="neon-btn green"
            style={{ width: '100%', padding: '12px', fontSize: '13px' }}
          >
            ▶ INITIALIZE SYSTEM
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: 'rgba(0,255,255,0.05)',
          border: '1px solid rgba(0,255,255,0.15)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          lineHeight: '1.7',
        }}>
          <div style={{ color: 'var(--neon-cyan)', marginBottom: '6px', fontFamily: 'var(--font-heading)', fontSize: '9px', letterSpacing: '2px' }}>
            HOW TO GET A KEY:
          </div>
          1. Go to{' '}
          <a
            href="https://console.cloud.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--neon-magenta)', textDecoration: 'none' }}
          >
            console.cloud.google.com
          </a>
          <br />
          2. Create a project &amp; enable YouTube Data API v3<br />
          3. Create credentials → API Key<br />
          4. Paste it above
        </div>
      </div>
    </div>
  );
}
