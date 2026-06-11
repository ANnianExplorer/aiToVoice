import client from './client';
import type { ApiResponse, Song, PageResponse } from '../types';

export const getHotSongs = (limit = 50) =>
  client.get<ApiResponse<Song[]>>('/songs/hot', { params: { limit } });

export const getNewSongs = (limit = 50) =>
  client.get<ApiResponse<Song[]>>('/songs/new', { params: { limit } });

export const getSong = (id: number) =>
  client.get<ApiResponse<Song>>(`/songs/${id}`);

export const searchSongs = (keyword: string, page = 0, size = 20) =>
  client.get<ApiResponse<PageResponse<Song>>>('/songs/search', { params: { keyword, page, size } });

export const recordPlay = (id: number) =>
  client.post<ApiResponse<void>>(`/songs/${id}/play`);

export const toggleFavorite = (id: number) =>
  client.post<ApiResponse<void>>(`/songs/${id}/favorite`);

export const getFavorites = () =>
  client.get<ApiResponse<Song[]>>('/songs/favorites');

export const getHistory = () =>
  client.get<ApiResponse<Song[]>>('/songs/history');

export const uploadSong = (file: File, title: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  return client.post<ApiResponse<Song>>('/songs/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
