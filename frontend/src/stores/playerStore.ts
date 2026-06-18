import { create } from 'zustand';
import type { Song } from '../types';

const STORAGE_KEY = 'player-state';

/** 从 localStorage 恢复播放状态 */
function loadPersistedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        volume: parsed.volume ?? 0.7,
        playMode: parsed.playMode ?? 'sequential',
      };
    }
  } catch { /* ignore */ }
  return { volume: 0.7, playMode: 'sequential' as const };
}

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

const persisted = loadPersistedState();

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  playlist: [],
  isPlaying: false,
  volume: persisted.volume,
  progress: 0,
  duration: 0,
  playMode: persisted.playMode,

  setCurrentSong: (song) => set({ currentSong: song, isPlaying: true, progress: 0 }),
  setPlaylist: (songs) => set({ playlist: songs }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setVolume: (volume) => {
    set({ volume });
    persistState({ volume });
  },

  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),

  setPlayMode: (playMode) => {
    set({ playMode });
    persistState({ playMode });
  },

  playNext: () => {
    const { playlist, currentSong, playMode } = get();
    if (!currentSong || playlist.length === 0) return;
    const idx = playlist.findIndex((s) => s.id === currentSong.id);

    if (playMode === 'repeat-one') {
      set({ progress: 0, isPlaying: true });
      return;
    }

    if (playMode === 'shuffle') {
      const candidates = playlist.filter((s) => s.id !== currentSong.id);
      if (candidates.length === 0) {
        set({ progress: 0, isPlaying: true });
        return;
      }
      const next = candidates[Math.floor(Math.random() * candidates.length)];
      set({ currentSong: next, progress: 0, isPlaying: true });
      return;
    }

    // Sequential: guard against song not in playlist
    if (idx === -1) {
      set({ currentSong: playlist[0], progress: 0, isPlaying: true });
      return;
    }
    const nextIdx = (idx + 1) % playlist.length;
    set({ currentSong: playlist[nextIdx], progress: 0, isPlaying: true });
  },

  playPrev: () => {
    const { playlist, currentSong } = get();
    if (!currentSong || playlist.length === 0) return;
    const idx = playlist.findIndex((s) => s.id === currentSong.id);
    // Guard against song not in playlist
    if (idx === -1) {
      set({ currentSong: playlist[playlist.length - 1], progress: 0, isPlaying: true });
      return;
    }
    const prevIdx = (idx - 1 + playlist.length) % playlist.length;
    set({ currentSong: playlist[prevIdx], progress: 0, isPlaying: true });
  },
}));

/** 持久化播放偏好到 localStorage */
function persistState(data: Partial<{ volume: number; playMode: string }>) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...data }));
  } catch { /* ignore */ }
}
