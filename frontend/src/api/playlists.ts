import client from './client';
import type { ApiResponse, Playlist, Song } from '../types';

export const getMyPlaylists = () =>
  client.get<ApiResponse<Playlist[]>>('/playlists/my');

export const getPlaylist = (id: number) =>
  client.get<ApiResponse<Playlist>>(`/playlists/${id}`);

export const getPlaylistSongs = (id: number) =>
  client.get<ApiResponse<Song[]>>(`/playlists/${id}/songs`);

export const createPlaylist = (data: { name: string; description?: string; isPublic?: boolean }) =>
  client.post<ApiResponse<Playlist>>('/playlists', data);

export const addSongToPlaylist = (playlistId: number, songId: number) =>
  client.post<ApiResponse<void>>(`/playlists/${playlistId}/songs/${songId}`);

export const removeSongFromPlaylist = (playlistId: number, songId: number) =>
  client.delete<ApiResponse<void>>(`/playlists/${playlistId}/songs/${songId}`);

export const deletePlaylist = (id: number) =>
  client.delete<ApiResponse<void>>(`/playlists/${id}`);
