import { create } from 'zustand';
import type { Song } from '../types';

interface PlayerState {
  currentSong: Song | null;
  playlist: Song[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playMode: 'sequential' | 'shuffle' | 'repeat-one';
  setCurrentSong: (song: Song) => void;
  setPlaylist: (songs: Song[]) => void;
  togglePlay: () => void;
  setVolume: (vol: number) => void;
  setProgress: (prog: number) => void;
  setDuration: (dur: number) => void;
  setPlayMode: (mode: PlayerState['playMode']) => void;
  playNext: () => void;
  playPrev: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  playlist: [],
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  playMode: 'sequential',

  setCurrentSong: (song) => set({ currentSong: song, isPlaying: true, progress: 0 }),
  setPlaylist: (songs) => set({ playlist: songs }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setPlayMode: (playMode) => set({ playMode }),

  playNext: () => {
    const { playlist, currentSong, playMode } = get();
    if (!currentSong || playlist.length === 0) return;
    const idx = playlist.findIndex((s) => s.id === currentSong.id);

    if (playMode === 'repeat-one') {
      set({ progress: 0, isPlaying: true });
      return;
    }

    if (playMode === 'shuffle') {
      const next = playlist[Math.floor(Math.random() * playlist.length)];
      set({ currentSong: next, progress: 0, isPlaying: true });
      return;
    }

    const nextIdx = (idx + 1) % playlist.length;
    set({ currentSong: playlist[nextIdx], progress: 0, isPlaying: true });
  },

  playPrev: () => {
    const { playlist, currentSong } = get();
    if (!currentSong || playlist.length === 0) return;
    const idx = playlist.findIndex((s) => s.id === currentSong.id);
    const prevIdx = (idx - 1 + playlist.length) % playlist.length;
    set({ currentSong: playlist[prevIdx], progress: 0, isPlaying: true });
  },
}));
