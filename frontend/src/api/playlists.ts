import client from './client';
import type { Playlist, Song } from '../types';

export const getMyPlaylists = () =>
  client.get<Playlist[]>('/playlists/my').then(r => r.data);

export const getPlaylist = (id: number) =>
  client.get<Playlist>(`/playlists/${id}`).then(r => r.data);

export const getPlaylistSongs = (id: number) =>
  client.get<Song[]>(`/playlists/${id}/songs`).then(r => r.data);

export const createPlaylist = (data: { name: string; description?: string; isPublic?: boolean }) =>
  client.post<Playlist>('/playlists', data).then(r => r.data);

export const addSongToPlaylist = (playlistId: number, songId: number) =>
  client.post<void>(`/playlists/${playlistId}/songs/${songId}`).then(r => r.data);

export const removeSongFromPlaylist = (playlistId: number, songId: number) =>
  client.delete<void>(`/playlists/${playlistId}/songs/${songId}`).then(r => r.data);

export const deletePlaylist = (id: number) =>
  client.delete<void>(`/playlists/${id}`).then(r => r.data);
