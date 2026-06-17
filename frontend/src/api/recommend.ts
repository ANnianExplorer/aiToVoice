import client from './client';
import type { ApiResponse, Song } from '../types';

interface RecommendItem {
  song: Song;
  score: number;
  reason: string;
  algorithm: string;
}

export const getDailyRecommend = () =>
  client.get<ApiResponse<RecommendItem[]>>('/recommend/daily').then(r => r.data);

export const getRandomFM = () =>
  client.get<ApiResponse<Song>>('/recommend/fm').then(r => r.data);

export const getSimilarSongs = (songId: number) =>
  client.get<ApiResponse<Song[]>>(`/recommend/similar/${songId}`).then(r => r.data);

export const submitFeedback = (songId: number, liked: boolean) =>
  client.post<ApiResponse<void>>('/recommend/feedback', null, { params: { songId, liked } }).then(r => r.data);
