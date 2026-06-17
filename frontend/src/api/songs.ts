import client from './client';
import type { Song, PageResponse } from '../types';

export const getHotSongs = (limit = 50) =>
  client.get<Song[]>('/songs/hot', { params: { limit } }).then(r => r.data);

export const getNewSongs = (limit = 50) =>
  client.get<Song[]>('/songs/new', { params: { limit } }).then(r => r.data);

export const getSong = (id: number) =>
  client.get<Song>(`/songs/${id}`).then(r => r.data);

export const searchSongs = (keyword: string, page = 0, size = 20) =>
  client.get<PageResponse<Song>>('/songs/search', { params: { keyword, page, size } }).then(r => r.data);

export const recordPlay = (id: number) =>
  client.post<void>(`/songs/${id}/play`).then(r => r.data);

export const toggleFavorite = (id: number) =>
  client.post<void>(`/songs/${id}/favorite`).then(r => r.data);

export const getFavorites = () =>
  client.get<Song[]>('/songs/favorites').then(r => r.data);

export const getHistory = () =>
  client.get<Song[]>('/songs/history').then(r => r.data);

export const uploadSong = (file: File, title: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  return client.post<Song>('/songs/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};
