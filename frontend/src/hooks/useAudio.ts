import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { usePlayerStore } from '../stores/playerStore';

export function useAudio() {
  const howlRef = useRef<Howl | null>(null);
  const animRef = useRef<number>(0);
  const {
    currentSong, isPlaying, volume,
    setProgress, setDuration, togglePlay, playNext,
  } = usePlayerStore();

  useEffect(() => {
    if (!currentSong) return;

    if (howlRef.current) {
      howlRef.current.unload();
    }

    const howl = new Howl({
      src: [`http://localhost:8080/api/files/audio/${currentSong.id}`],
      html5: true,
      volume,
      onload: () => setDuration(howl.duration()),
      onend: () => playNext(),
    });

    howlRef.current = howl;
    setProgress(0);

    return () => {
      howl.unload();
      cancelAnimationFrame(animRef.current);
    };
  }, [currentSong?.id]);

  useEffect(() => {
    howlRef.current?.volume(volume);
  }, [volume]);

  useEffect(() => {
    if (!howlRef.current) return;
    if (isPlaying) {
      howlRef.current.play();
      const updateProgress = () => {
        if (howlRef.current?.playing()) {
          setProgress(howlRef.current.seek() as number);
          animRef.current = requestAnimationFrame(updateProgress);
        }
      };
      animRef.current = requestAnimationFrame(updateProgress);
    } else {
      howlRef.current.pause();
      cancelAnimationFrame(animRef.current);
    }
  }, [isPlaying]);

  const seek = (time: number) => {
    howlRef.current?.seek(time);
    setProgress(time);
  };

  return { seek };
}
