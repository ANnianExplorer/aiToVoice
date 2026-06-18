export interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  nickname: string;
  bio: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface Song {
  id: number;
  title: string;
  artistName: string;
  albumName: string;
  genreName: string;
  duration: number;
  coverUrl: string;
  sourceType: 'LOCAL' | 'NETEASE' | 'AUDIUS' | 'JAMENDO';
  playCount: number;
  likeCount: number;
  isFavorited?: boolean;
}

export interface Playlist {
  id: number;
  userId: number;
  name: string;
  description: string;
  coverUrl: string;
  isPublic: boolean;
  playCount: number;
  songCount: number;
  createdAt: string;
}

export interface AiSession {
  id: number;
  userId: number;
  sessionType: 'VOICE_COACH' | 'GENERAL';
  title: string;
  createdAt: string;
}

export interface AiMessage {
  id: number;
  sessionId: number;
  role: 'USER' | 'ASSISTANT';
  content: string;
  msgType?: string;
  createdAt: string;
}

export interface VoiceRecord {
  id: number;
  userId: number;
  exerciseId: number;
  filePath: string;
  score: number;
  status: string;
  createdAt: string;
}

export interface VoiceExercise {
  id: number;
  name: string;
  type: string;
  difficulty: number;
  description: string;
}

export const API_SUCCESS = 0;

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
