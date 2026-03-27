import React, { useState, useCallback } from 'react';
import { YOUTUBE_SEARCH_URL } from '../constants';

export default function SearchPanel({ apiKey, singers, selectedSinger, onSelectSinger, onAddToQueue }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addedIds, setAddedIds] = useState(new Set());

  const handleSearch = useCallback(async (e) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (!apiKey) {
      setError('No API key set. Please refresh to configure.');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const searchQuery = q.toLowerCase().includes('karaoke') ? q : `${q} karaoke`;
      const url = new URL(YOUTUBE_SEARCH_URL);
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('q', searchQuery);
      url.searchParams.set('type', 'video');
      url.searchParams.set('maxResults', '10');
      url.searchParams.set('key', apiKey);

      const res = await fetch(url.toString());
      const data = await res.json();

      if (data.error) {
        setError(data.error.message || 'API error');
        return;
      }

      const items = (data.items || []).map((item) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.default?.url || item.snippet.thumbnails?.medium?.url || '',
        channelTitle: item.snippet.channelTitle,
      }));
      setResults(items);
    } catch (err) {
      setError('Network error. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, [query, apiKey]);

  const handleAdd = useCallback((video) => {
    onAddToQueue(video);
    setAddedIds((prev) => new Set([...prev, video.videoId]));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(video.videoId);
        return next;
      });
    }, 2000);
  }, [onAddToQueue]);

  return (
    <div className="cyber-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      maxHeight: '55%',
    }}>
      <div className="section-header" style={{ color: 'var(--neon-magenta)', borderBottomColor: 'rgba(255,0,255,0.2)' }}>
        <span className="indicator" style={{ background: 'var(--neon-magenta)', boxShadow: 'var(--glow-magenta)' }} />
        SEARCH
      </div>

      <div style={{ padding: '10px', flexShrink: 0 }}>
        {/* Singer selector for adding */}
        {singers.length > 0 && (
          <div style={{ marginBottom: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {singers.map((singer) => (
              <button
                key={singer.id}
                onClick={() => onSelectSinger(selectedSinger?.id === singer.id ? null : singer)}
                style={{
                  background: selectedSinger?.id === singer.id ? `${singer.color}22` : 'transparent',
                  border: `1px solid ${selectedSinger?.id === singer.id ? singer.color : 'rgba(255,255,255,0.15)'}`,
                  color: selectedSinger?.id === singer.id ? singer.color : 'var(--text-secondary)',
                  padding: '3px 8px',
                  fontSize: '10px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  transition: 'all 0.15s',
                  boxShadow: selectedSinger?.id === singer.id ? `0 0 6px ${singer.color}44` : 'none',
                }}
              >
                {singer.name}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '6px' }}>
          <input
            className="cyber-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs... (karaoke auto-appended)"
            style={{ flex: 1, fontSize: '12px' }}
          />
          <button
            type="submit"
            className="neon-btn magenta"
            style={{ padding: '8px 12px', flexShrink: 0 }}
            disabled={loading}
          >
            {loading ? '...' : '🔍'}
          </button>
        </form>

        {error && (
          <div style={{
            color: 'var(--neon-orange)',
            fontSize: '11px',
            marginTop: '6px',
            fontFamily: 'var(--font-mono)',
            padding: '6px',
            background: 'rgba(255,102,0,0.1)',
            border: '1px solid rgba(255,102,0,0.3)',
          }}>
            ⚠ {error}
          </div>
        )}
      </div>

      {/* Results */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        minHeight: 0,
      }}>
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '24px',
            color: 'var(--neon-magenta)',
            fontFamily: 'var(--font-heading)',
            fontSize: '11px',
            letterSpacing: '2px',
            animation: 'neon-pulse 1s infinite',
          }}>
            SCANNING DATABASE...
          </div>
        )}
        {!loading && results.length === 0 && query && !error && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: 'var(--text-muted)',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
          }}>
            No results found. Try a different query.
          </div>
        )}
        {results.map((video) => {
          const wasAdded = addedIds.has(video.videoId);
          return (
            <div
              key={video.videoId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                transition: 'background 0.15s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,0,255,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt=""
                  style={{
                    width: '56px',
                    height: '42px',
                    objectFit: 'cover',
                    flexShrink: 0,
                    border: '1px solid rgba(255,0,255,0.3)',
                  }}
                />
              ) : (
                <div style={{
                  width: '56px',
                  height: '42px',
                  background: 'rgba(255,0,255,0.1)',
                  border: '1px solid rgba(255,0,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}>
                  🎵
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="truncate" style={{
                  fontSize: '11px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: '1.3',
                  marginBottom: '2px',
                }}>
                  {video.title}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {video.channelTitle}
                </div>
                {selectedSinger && (
                  <div style={{
                    fontSize: '9px',
                    color: selectedSinger.color,
                    fontFamily: 'var(--font-mono)',
                    marginTop: '2px',
                  }}>
                    → {selectedSinger.name}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleAdd(video)}
                className="neon-btn"
                style={{
                  padding: '5px 8px',
                  fontSize: '11px',
                  flexShrink: 0,
                  borderColor: wasAdded ? 'var(--neon-green)' : undefined,
                  color: wasAdded ? 'var(--neon-green)' : undefined,
                }}
              >
                {wasAdded ? '✓' : '+'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
