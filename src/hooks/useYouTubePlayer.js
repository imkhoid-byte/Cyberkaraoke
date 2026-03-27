import { useEffect, useRef, useCallback, useState } from 'react';

const YT_SCRIPT_ID = 'youtube-iframe-api';

function loadYouTubeAPI() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    if (document.getElementById(YT_SCRIPT_ID)) {
      // Script already loading, wait for it
      const interval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(interval);
          resolve(window.YT);
        }
      }, 100);
      return;
    }
    const tag = document.createElement('script');
    tag.id = YT_SCRIPT_ID;
    tag.src = 'https://www.youtube.com/iframe_api';
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    document.head.appendChild(tag);
  });
}

export function useYouTubePlayer({ onVideoEnd, onVideoStart, onVideoError }) {
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const onVideoEndRef = useRef(onVideoEnd);
  const onVideoStartRef = useRef(onVideoStart);
  const onVideoErrorRef = useRef(onVideoError);

  useEffect(() => {
    onVideoEndRef.current = onVideoEnd;
  }, [onVideoEnd]);

  useEffect(() => {
    onVideoStartRef.current = onVideoStart;
  }, [onVideoStart]);

  useEffect(() => {
    onVideoErrorRef.current = onVideoError;
  }, [onVideoError]);

  useEffect(() => {
    let mounted = true;

    loadYouTubeAPI().then((YT) => {
      if (!mounted) return;

      const container = document.getElementById('youtube-player');
      if (!container) return;

      playerRef.current = new YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: '',
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: () => {
            if (mounted) setIsReady(true);
          },
          onError: () => {
            if (mounted) {
              setIsPlaying(false);
              onVideoErrorRef.current?.();
            }
          },
          onStateChange: (event) => {
            const YTState = window.YT.PlayerState;
            if (event.data === YTState.ENDED) {
              setIsPlaying(false);
              onVideoEndRef.current?.();
            } else if (event.data === YTState.PLAYING) {
              setIsPlaying(true);
              onVideoStartRef.current?.();
            } else if (event.data === YTState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    });

    return () => {
      mounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const play = useCallback((videoId) => {
    if (playerRef.current && isReady) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [isReady]);

  const pause = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.pauseVideo();
    }
  }, [isReady]);

  const resume = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.playVideo();
    }
  }, [isReady]);

  const stop = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.stopVideo();
    }
  }, [isReady]);

  return { play, pause, resume, stop, isReady, isPlaying };
}
