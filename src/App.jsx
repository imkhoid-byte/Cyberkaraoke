import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import SingerManager from './components/SingerManager';
import SongEntry from './components/SongEntry';
import PerformanceAnalyzer from './components/PerformanceAnalyzer';
import TriviaPanel from './components/TriviaPanel';
import RatingModal from './components/RatingModal';
import Leaderboard from './components/Leaderboard';
import WinnerScreen from './components/WinnerScreen';
import { useMicrophone } from './hooks/useMicrophone';
import { useTrivia } from './hooks/useTrivia';
import { SINGER_COLORS } from './constants';

let singerIdCounter = 0;
const genSingerId = () => `singer-${++singerIdCounter}`;

export default function App() {
  const [singers, setSingers] = useState([]);
  const [scores, setScores] = useState({});
  const [currentSinger, setCurrentSinger] = useState(null);
  const [currentArtist, setCurrentArtist] = useState('');
  const [currentSong, setCurrentSong] = useState('');
  const [phase, setPhase] = useState('idle'); // 'idle' | 'performing' | 'rating' | 'winner'
  const [vocalScore, setVocalScore] = useState(null);
  const [triviaBonus, setTriviaBonus] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [elapsedTimer, setElapsedTimer] = useState(0);
  const timerRef = useRef(null);
  const timerStartRef = useRef(null);

  const mic = useMicrophone();
  const trivia = useTrivia();

  const startTimer = () => {
    timerStartRef.current = Date.now();
    setElapsedTimer(0);
    timerRef.current = setInterval(() => {
      setElapsedTimer(Math.floor((Date.now() - timerStartRef.current) / 1000));
    }, 500);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStartPerformance = useCallback(async (singer, artist, song) => {
    setCurrentSinger(singer);
    setCurrentArtist(artist);
    setCurrentSong(song);
    setVocalScore(null);
    setTriviaBonus(0);
    setPhase('performing');
    setSessionActive(true);

    // Start mic
    await mic.start();

    // Fetch trivia
    trivia.fetchTrivia(artist);

    startTimer();
  }, [mic, trivia]);

  const handleSongOver = useCallback(() => {
    stopTimer();
    const result = mic.stop();
    const score = result?.score ?? mic.vocalScore ?? 0;
    setVocalScore(score);

    // Trivia bonus: 5 pts per correct answer
    const bonus = trivia.questions.filter((q) => q.wasCorrect).length * 5;
    setTriviaBonus(bonus);

    setPhase('rating');
  }, [mic, trivia.questions]);

  const handleSubmitRating = useCallback((audienceRating) => {
    if (!currentSinger) return;

    const vocal = vocalScore ?? 0;
    const finalScore = Math.round(vocal * 0.4 + audienceRating * 10 * 0.4 + triviaBonus * 0.2);

    setScores((prev) => {
      const existing = prev[currentSinger.id] || { total: 0, songs: 0 };
      return {
        ...prev,
        [currentSinger.id]: {
          total: existing.total + finalScore,
          songs: existing.songs + 1,
          vocalAvg: Math.round(((existing.vocalAvg || 0) * existing.songs + vocal) / (existing.songs + 1)),
          triviaBonus: (existing.triviaBonus || 0) + triviaBonus,
        },
      };
    });

    // Reset for next song
    setPhase('idle');
    setCurrentSinger(null);
    setCurrentArtist('');
    setCurrentSong('');
    setVocalScore(null);
    setTriviaBonus(0);
    trivia.resetTrivia();
  }, [currentSinger, vocalScore, triviaBonus, trivia]);

  const handleEndSession = useCallback(() => {
    stopTimer();
    if (mic.isListening) mic.stop();
    setPhase('winner');
  }, [mic]);

  const handleNewSession = useCallback(() => {
    stopTimer();
    setSingers([]);
    setScores({});
    setCurrentSinger(null);
    setCurrentArtist('');
    setCurrentSong('');
    setPhase('idle');
    setVocalScore(null);
    setTriviaBonus(0);
    setSessionActive(false);
    trivia.resetTrivia();
  }, [trivia]);

  const handleAddSinger = useCallback((name) => {
    const id = genSingerId();
    const color = SINGER_COLORS[singers.length % SINGER_COLORS.length];
    setSingers((prev) => [...prev, { id, name, color }]);
  }, [singers.length]);

  const handleRemoveSinger = useCallback((id) => {
    setSingers((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleRandomSinger = useCallback(() => {
    if (singers.length === 0) return;
    const randomSinger = singers[Math.floor(Math.random() * singers.length)];
    // Just highlight it — user still needs to enter song
    alert(`Random pick: ${randomSinger.name}!`);
  }, [singers]);

  const handleTriviaAnswer = useCallback((answer) => {
    trivia.answerQuestion(answer);
  }, [trivia]);

  const handleTriviaNext = useCallback(() => {
    trivia.nextQuestion();
  }, [trivia]);


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

      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '280px 1fr 300px',
        gap: '8px',
        padding: '8px',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'auto', minHeight: 0 }}>
          <Leaderboard
            singers={singers}
            scores={scores}
            onEndNight={handleEndSession}
            onEndSession={handleEndSession}
            sessionActive={sessionActive}
          />
          <SingerManager
            singers={singers}
            onAdd={handleAddSinger}
            onRemove={handleRemoveSinger}
            selectedSinger={currentSinger}
            onSelectSinger={() => {}}
          />
        </div>

        {/* Center Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden', minHeight: 0 }}>
          <SongEntry
            singers={singers}
            currentSinger={currentSinger}
            onStart={handleStartPerformance}
            phase={phase}
          />

          <PerformanceAnalyzer
            phase={phase}
            isListening={mic.isListening}
            currentVolume={mic.currentVolume}
            peakVolume={mic.peakVolume}
            vocalScore={mic.vocalScore ?? vocalScore}
            analyserRef={mic.analyserRef}
            currentSinger={currentSinger}
            currentArtist={currentArtist}
            currentSong={currentSong}
          />

          {/* Controls bar */}
          <div className="cyber-panel" style={{
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
          }}>
            {phase === 'idle' && (
              <button
                className="neon-btn green"
                onClick={handleRandomSinger}
                disabled={singers.length === 0}
                style={{ opacity: singers.length === 0 ? 0.4 : 1 }}
              >
                ⚡ RANDOM SINGER
              </button>
            )}

            {phase === 'performing' && (
              <>
                <button
                  className="neon-btn"
                  onClick={handleSongOver}
                  style={{
                    borderColor: '#ff3366',
                    color: '#ff3366',
                    fontSize: '14px',
                    padding: '10px 24px',
                    letterSpacing: '2px',
                    animation: 'neon-pulse 2s infinite',
                  }}
                >
                  ■ SONG OVER
                </button>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '13px',
                  color: 'var(--neon-green)',
                  textShadow: 'var(--glow-green)',
                }}>
                  {String(Math.floor(elapsedTimer / 60)).padStart(2, '0')}:{String(elapsedTimer % 60).padStart(2, '0')}
                </div>
              </>
            )}

            <div style={{ flex: 1 }} />

            {mic.error && (
              <div style={{
                fontSize: '10px',
                color: '#ff3366',
                fontFamily: 'var(--font-mono)',
              }}>
                MIC: {mic.error}
              </div>
            )}

            <button
              className="neon-btn"
              onClick={handleEndSession}
              style={{ borderColor: '#ff3366', color: '#ff3366', fontSize: '11px' }}
            >
              END NIGHT
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
          <TriviaPanel
            questions={trivia.questions}
            currentQ={trivia.currentQ}
            loading={trivia.loading}
            currentArtist={currentArtist}
            onAnswer={handleTriviaAnswer}
            onNext={handleTriviaNext}
            triviaBonus={trivia.questions.filter((q) => q.wasCorrect).length * 5}
            phase={phase}
          />
        </div>
      </div>

      {phase === 'rating' && currentSinger && (
        <RatingModal
          singer={currentSinger}
          songTitle={currentSong}
          vocalScore={vocalScore}
          triviaBonus={triviaBonus}
          onSubmit={handleSubmitRating}
        />
      )}

      {phase === 'winner' && (
        <WinnerScreen
          singers={singers}
          scores={Object.fromEntries(
            Object.entries(scores).map(([id, s]) => [id, s.total || 0])
          )}
          onNewSession={handleNewSession}
        />
      )}
    </div>
  );
}
