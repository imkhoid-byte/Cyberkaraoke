import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ApiKeySetup from './components/ApiKeySetup';
import SingerManager from './components/SingerManager';
import SearchPanel from './components/SearchPanel';
import VideoPlayer from './components/VideoPlayer';
import Queue from './components/Queue';
import RatingModal from './components/RatingModal';
import Leaderboard from './components/Leaderboard';
import WinnerScreen from './components/WinnerScreen';
import { useQueue } from './hooks/useQueue';
import { SINGER_COLORS } from './constants';

let singerIdCounter = 0;
const genSingerId = () => `singer-${++singerIdCounter}`;

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('yt_api_key') || '');
  const [singers, setSingers] = useState([]);
  const [scores, setScores] = useState({});
  const [sessionActive, setSessionActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [lastSongSinger, setLastSongSinger] = useState(null);
  const [lastSongTitle, setLastSongTitle] = useState('');
  const [selectedSinger, setSelectedSinger] = useState(null);

  const {
    queue,
    currentSong,
    setCurrentSong,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    nextSong,
    skipCurrent,
    randomSong,
    clearQueue,
  } = useQueue();

  // User clicked LAUNCH — video opened in YouTube, mark as playing
  const handleLaunch = useCallback(() => {
    setIsPlaying(true);
    setSessionActive(true);
  }, []);

  // User clicked DONE SINGING — show rating modal
  const handleDoneSinging = useCallback(() => {
    setIsPlaying(false);
    if (currentSong) {
      setLastSongSinger(currentSong.singer);
      setLastSongTitle(currentSong.title);
    }
    setShowRating(true);
  }, [currentSong]);

  const handleRatingSubmit = useCallback((score) => {
    if (lastSongSinger) {
      setScores((prev) => ({
        ...prev,
        [lastSongSinger.id]: (prev[lastSongSinger.id] || 0) + score,
      }));
    }
    setShowRating(false);
    nextSong();
  }, [lastSongSinger, nextSong]);

  const handleRatingSkip = useCallback(() => {
    setShowRating(false);
    nextSong();
  }, [nextSong]);

  const handleAddSinger = useCallback((name) => {
    const id = genSingerId();
    const color = SINGER_COLORS[singers.length % SINGER_COLORS.length];
    setSingers((prev) => [...prev, { id, name, color }]);
  }, [singers.length]);

  const handleRemoveSinger = useCallback((id) => {
    setSingers((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleAddToQueue = useCallback((video) => {
    addToQueue(video, selectedSinger || (singers[0] || null));
  }, [addToQueue, selectedSinger, singers]);

  const handleRandomSong = useCallback(() => {
    randomSong(singers);
  }, [randomSong, singers]);

  const handleSkip = useCallback(() => {
    setIsPlaying(false);
    skipCurrent();
  }, [skipCurrent]);

  const handleEndSession = useCallback(() => {
    setIsPlaying(false);
    setSessionActive(false);
    setShowWinner(true);
  }, []);

  const handleNewSession = useCallback(() => {
    setSingers([]);
    setScores({});
    clearQueue();
    setCurrentSong(null);
    setSessionActive(false);
    setIsPlaying(false);
    setShowWinner(false);
    setShowRating(false);
    setLastSongSinger(null);
  }, [clearQueue, setCurrentSong]);

  const handleSaveApiKey = useCallback((key) => {
    localStorage.setItem('yt_api_key', key);
    setApiKey(key);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 1,
    }}>
      <Header sessionActive={sessionActive} onEndSession={handleEndSession} />

      {!apiKey && (
        <ApiKeySetup onSave={handleSaveApiKey} />
      )}

      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '280px 1fr 320px',
        gap: '8px',
        padding: '8px',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden', minHeight: 0 }}>
          <Leaderboard
            singers={singers}
            scores={scores}
            onEndSession={handleEndSession}
            sessionActive={sessionActive}
          />
          <SingerManager
            singers={singers}
            onAdd={handleAddSinger}
            onRemove={handleRemoveSinger}
            selectedSinger={selectedSinger}
            onSelectSinger={setSelectedSinger}
          />
        </div>

        {/* Center Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden', minHeight: 0 }}>
          <VideoPlayer
            currentSong={currentSong}
            isPlaying={isPlaying}
            onLaunch={handleLaunch}
            onDoneSinging={handleDoneSinging}
            onSkip={handleSkip}
          />

          {/* Controls bar */}
          <div className="cyber-panel" style={{
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
          }}>
            <button className="neon-btn green" onClick={handleRandomSong} title="Add random karaoke classic to queue">
              ⚡ RANDOM
            </button>
            <button
              className="neon-btn orange"
              onClick={handleSkip}
              disabled={!currentSong}
              style={{ opacity: currentSong ? 1 : 0.4 }}
            >
              ⏭ SKIP
            </button>
            {currentSong && !isPlaying && (
              <button
                className="neon-btn green"
                onClick={handleLaunch}
                style={{ fontSize: '12px' }}
              >
                ▶ LAUNCH
              </button>
            )}
            {currentSong && isPlaying && (
              <button
                className="neon-btn magenta"
                onClick={handleDoneSinging}
              >
                ✓ DONE SINGING
              </button>
            )}
            <div style={{ flex: 1 }} />
            <button
              className="neon-btn"
              style={{ borderColor: '#ff3366', color: '#ff3366' }}
              onClick={handleEndSession}
            >
              ■ END SESSION
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden', minHeight: 0 }}>
          <SearchPanel
            apiKey={apiKey}
            singers={singers}
            selectedSinger={selectedSinger}
            onSelectSinger={setSelectedSinger}
            onAddToQueue={handleAddToQueue}
          />
          <Queue
            queue={queue}
            currentSong={currentSong}
            singers={singers}
            selectedSinger={selectedSinger}
            onSelectSinger={setSelectedSinger}
            onRemove={removeFromQueue}
            onReorder={reorderQueue}
            onUpdateSinger={() => {}}
          />
        </div>
      </div>

      {showRating && (
        <RatingModal
          singer={lastSongSinger}
          songTitle={lastSongTitle}
          onRate={handleRatingSubmit}
          onSkip={handleRatingSkip}
        />
      )}

      {showWinner && (
        <WinnerScreen
          singers={singers}
          scores={scores}
          onNewSession={handleNewSession}
        />
      )}
    </div>
  );
}
