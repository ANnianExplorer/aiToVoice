import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { usePlayerStore } from '../stores/playerStore';

export function useAudio() {
  const howlRef = useRef<Howl | null>(null);
  const animRef = useRef<number>(0);
  const progressRef = useRef(0);
  const {
    currentSong, isPlaying, volume,
    setProgress, setDuration, playNext,
  } = usePlayerStore();

  const baseUrl = import.meta.env.VITE_FILE_BASE_URL || '';

  useEffect(() => {
    if (!currentSong) return;

    if (howlRef.current) {
      howlRef.current.unload();
    }

    const howl = new Howl({
      src: [`${baseUrl}/api/files/audio/${currentSong.id}`],
      html5: true,
      volume,
      onload: () => setDuration(howl.duration()),
      onend: () => playNext(),
    });

    howlRef.current = howl;
    progressRef.current = 0;
    setProgress(0);

    // Auto-play when a new song is set
    if (isPlaying) {
      howl.play();
    }

    return () => {
      howl.unload();
      cancelAnimationFrame(animRef.current);
    };
  }, [currentSong?.id]);

  useEffect(() => {
    howlRef.current?.volume(volume);
  }, [volume]);

  // rAF loop — update ref only (no store writes)
  useEffect(() => {
    if (!howlRef.current) return;
    if (isPlaying) {
      howlRef.current.play();
      const tick = () => {
        if (howlRef.current?.playing()) {
          progressRef.current = howlRef.current.seek() as number;
          animRef.current = requestAnimationFrame(tick);
        }
      };
      animRef.current = requestAnimationFrame(tick);
    } else {
      howlRef.current.pause();
      cancelAnimationFrame(animRef.current);
    }
  }, [isPlaying]);

  // Sync progress to Zustand store every 500ms
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(progressRef.current);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isPlaying, setProgress]);

  const seek = (time: number) => {
    howlRef.current?.seek(time);
    progressRef.current = time;
    setProgress(time);
  };

  return { seek };
}
