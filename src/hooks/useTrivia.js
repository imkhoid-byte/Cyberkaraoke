import { useState, useCallback } from 'react';
import { ARTIST_TRIVIA } from '../constants';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestion(q) {
  return {
    question: q.question,
    correct: q.correct,
    options: shuffle([q.correct, ...q.wrong]),
    answered: false,
    wasCorrect: null,
  };
}

function fuzzyMatch(artistName, keys) {
  const lower = artistName.toLowerCase().trim();
  // Exact match first
  if (keys.includes(lower)) return lower;
  // Partial match
  const partial = keys.find((k) => lower.includes(k) || k.includes(lower));
  if (partial) return partial;
  // Word-level match
  const words = lower.split(/\s+/);
  const wordMatch = keys.find((k) => words.some((w) => k.includes(w) && w.length > 3));
  return wordMatch || null;
}

async function fetchFromOTDB() {
  try {
    const url = 'https://opentdb.com/api.php?amount=5&category=12&type=multiple&encode=url3986';
    const res = await fetch(url);
    const data = await res.json();
    if (data.response_code !== 0) throw new Error('OTDB returned error');
    return data.results.map((item) => ({
      question: decodeURIComponent(item.question),
      correct: decodeURIComponent(item.correct_answer),
      options: shuffle([
        decodeURIComponent(item.correct_answer),
        ...item.incorrect_answers.map(decodeURIComponent),
      ]),
      answered: false,
      wasCorrect: null,
    }));
  } catch {
    return null;
  }
}

export function useTrivia() {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTrivia = useCallback(async (artistName) => {
    setLoading(true);
    setQuestions([]);
    setCurrentQ(0);
    setScore(0);

    let qs = null;

    if (artistName) {
      const keys = Object.keys(ARTIST_TRIVIA);
      const match = fuzzyMatch(artistName, keys);
      if (match && ARTIST_TRIVIA[match]) {
        qs = ARTIST_TRIVIA[match].map(buildQuestion);
      }
    }

    if (!qs) {
      qs = await fetchFromOTDB();
    }

    if (!qs) {
      // Fallback generic questions
      qs = [
        { question: "What is the best-selling music format of all time?", correct: "Vinyl", options: shuffle(["Vinyl", "CD", "Cassette", "8-Track"]), answered: false, wasCorrect: null },
        { question: "Which decade is known as the golden age of disco?", correct: "1970s", options: shuffle(["1970s", "1960s", "1980s", "1990s"]), answered: false, wasCorrect: null },
        { question: "How many strings does a standard guitar have?", correct: "6", options: shuffle(["6", "4", "8", "12"]), answered: false, wasCorrect: null },
        { question: "What does 'BPM' stand for in music?", correct: "Beats Per Minute", options: shuffle(["Beats Per Minute", "Bass Per Measure", "Beat Pattern Mode", "Bars Per Melody"]), answered: false, wasCorrect: null },
        { question: "Which instrument is associated with karaoke performances?", correct: "Microphone", options: shuffle(["Microphone", "Guitar", "Piano", "Drums"]), answered: false, wasCorrect: null },
      ];
    }

    setQuestions(qs);
    setLoading(false);
  }, []);

  const answerQuestion = useCallback((answer) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const q = updated[currentQ];
      if (!q || q.answered) return prev;
      const wasCorrect = answer === q.correct;
      updated[currentQ] = { ...q, answered: true, wasCorrect };
      if (wasCorrect) setScore((s) => s + 1);
      return updated;
    });
  }, [currentQ]);

  const nextQuestion = useCallback(() => {
    setCurrentQ((q) => Math.min(q + 1, questions.length - 1));
  }, [questions.length]);

  const resetTrivia = useCallback(() => {
    setQuestions([]);
    setCurrentQ(0);
    setScore(0);
    setLoading(false);
  }, []);

  return {
    questions,
    currentQ,
    nextQuestion,
    answerQuestion,
    score,
    resetTrivia,
    loading,
  };
}
