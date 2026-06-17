import client from './client';
import type { ApiResponse, Playlist, Song } from '../types';

export const getMyPlaylists = () =>
  client.get<ApiResponse<Playlist[]>>('/playlists/my').then(r => r.data);

export const getPlaylist = (id: number) =>
  client.get<ApiResponse<Playlist>>(`/playlists/${id}`).then(r => r.data);

export const getPlaylistSongs = (id: number) =>
  client.get<ApiResponse<Song[]>>(`/playlists/${id}/songs`).then(r => r.data);

export const createPlaylist = (data: { name: string; description?: string; isPublic?: boolean }) =>
  client.post<ApiResponse<Playlist>>('/playlists', data).then(r => r.data);

export const addSongToPlaylist = (playlistId: number, songId: number) =>
  client.post<ApiResponse<void>>(`/playlists/${playlistId}/songs/${songId}`).then(r => r.data);

export const removeSongFromPlaylist = (playlistId: number, songId: number) =>
  client.delete<ApiResponse<void>>(`/playlists/${playlistId}/songs/${songId}`).then(r => r.data);

export const deletePlaylist = (id: number) =>
  client.delete<ApiResponse<void>>(`/playlists/${id}`).then(r => r.data);
