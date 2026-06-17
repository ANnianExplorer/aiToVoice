import client from './client';
import type { Song } from '../types';

interface RecommendItem {
  song: Song;
  score: number;
  reason: string;
  algorithm: string;
}

export const getDailyRecommend = () =>
  client.get<RecommendItem[]>('/recommend/daily').then(r => r.data);

export const getRandomFM = () =>
  client.get<Song>('/recommend/fm').then(r => r.data);

export const getSimilarSongs = (songId: number) =>
  client.get<Song[]>(`/recommend/similar/${songId}`).then(r => r.data);

export const submitFeedback = (songId: number, liked: boolean) =>
  client.post<void>('/recommend/feedback', null, { params: { songId, liked } }).then(r => r.data);
