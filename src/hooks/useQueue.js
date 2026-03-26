import { useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { KARAOKE_CLASSICS } from '../constants';

let idCounter = 0;
const genId = () => `q-${++idCounter}-${Date.now()}`;

export function useQueue() {
  const [queue, setQueue] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  const addToQueue = useCallback((video, singer) => {
    const item = {
      id: genId(),
      videoId: video.videoId,
      title: video.title,
      thumbnail: video.thumbnail,
      singer: singer || null,
    };
    setQueue((prev) => [...prev, item]);
    return item;
  }, []);

  const removeFromQueue = useCallback((id) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const reorderQueue = useCallback((oldIndex, newIndex) => {
    setQueue((prev) => arrayMove(prev, oldIndex, newIndex));
  }, []);

  const nextSong = useCallback(() => {
    setQueue((prev) => {
      if (prev.length === 0) {
        setCurrentSong(null);
        return prev;
      }
      const [next, ...rest] = prev;
      setCurrentSong(next);
      return rest;
    });
  }, []);

  const skipCurrent = useCallback(() => {
    nextSong();
  }, [nextSong]);

  const randomSong = useCallback((singers) => {
    const pick = KARAOKE_CLASSICS[Math.floor(Math.random() * KARAOKE_CLASSICS.length)];
    const singer = singers && singers.length > 0
      ? singers[Math.floor(Math.random() * singers.length)]
      : null;

    const video = {
      videoId: null,
      title: pick.title,
      thumbnail: null,
      searchQuery: pick.query,
      isRandom: true,
    };

    const item = {
      id: genId(),
      videoId: null,
      title: pick.title,
      thumbnail: null,
      searchQuery: pick.query,
      isRandom: true,
      singer: singer || null,
    };

    setQueue((prev) => [...prev, item]);
    return item;
  }, []);

  const resolveRandomSong = useCallback((id, videoId, thumbnail) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, videoId, thumbnail, isRandom: false } : item
      )
    );
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentSong(null);
  }, []);

  return {
    queue,
    currentSong,
    setCurrentSong,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    nextSong,
    skipCurrent,
    randomSong,
    resolveRandomSong,
    clearQueue,
  };
}
