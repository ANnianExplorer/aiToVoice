import client from './client';
import type { ApiResponse } from '../types';

interface RankingItem {
  rankPosition: number;
  song: {
    id: number;
    title: string;
    artistName: string;
    albumName: string;
    coverUrl: string;
    duration: number;
    playCount: number;
  };
  score: number;
}

export const getHotRanking = () =>
  client.get<ApiResponse<RankingItem[]>>('/rankings/hot');

export const getNewRanking = () =>
  client.get<ApiResponse<RankingItem[]>>('/rankings/new');

export const getRisingRanking = () =>
  client.get<ApiResponse<RankingItem[]>>('/rankings/rising');

export const getGenreRanking = (genreId: number) =>
  client.get<ApiResponse<RankingItem[]>>(`/rankings/genre/${genreId}`);
