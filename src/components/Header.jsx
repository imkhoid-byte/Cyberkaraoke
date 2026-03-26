import React from 'react';

export default function Header({ sessionActive, onEndSession }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      height: '56px',
      background: 'linear-gradient(180deg, #0d0d1a 0%, #0a0a0f 100%)',
      borderBottom: '1px solid rgba(0,255,255,0.3)',
      boxShadow: '0 2px 20px rgba(0,255,255,0.1)',
      position: 'relative',
      zIndex: 10,
      flexShrink: 0,
    }}>
      {/* Left: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: 'transparent',
          border: '2px solid var(--neon-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--glow-cyan)',
          fontSize: '16px',
          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
        }}>
          🎤
        </div>
        <div>
          <h1
            className="glitch-text"
            data-text="CYBERKARAOKE"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '18px',
              fontWeight: '900',
              letterSpacing: '4px',
              color: 'var(--neon-cyan)',
              textShadow: 'var(--glow-cyan)',
              lineHeight: 1,
            }}
          >
            CYBERKARAOKE
          </h1>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '3px',
            color: 'var(--neon-magenta)',
            textShadow: '0 0 8px var(--neon-magenta)',
          }}>
            // NEON STAGE v1.0
          </div>
        </div>
      </div>

      {/* Center: Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: sessionActive ? 'var(--neon-green)' : 'var(--text-muted)',
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: sessionActive ? 'var(--neon-green)' : 'var(--text-muted)',
          boxShadow: sessionActive ? 'var(--glow-green)' : 'none',
          animation: sessionActive ? 'neon-pulse 1.5s infinite' : 'none',
        }} />
        {sessionActive ? 'SESSION ACTIVE' : 'STANDBY'}
      </div>

      {/* Right: Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-muted)',
          letterSpacing: '1px',
        }}>
          {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </div>
        <div style={{
          width: '1px',
          height: '24px',
          background: 'rgba(0,255,255,0.2)',
        }} />
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'rgba(0,255,255,0.4)',
          letterSpacing: '1px',
        }}>
          CYBER//STAGE
        </div>
      </div>
    </header>
  );
}
