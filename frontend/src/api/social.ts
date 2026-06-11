import client from './client';
import type { ApiResponse } from '../types';

interface Comment {
  id: number;
  userId: number;
  username: string;
  avatarUrl: string;
  songId: number;
  parentId: number | null;
  content: string;
  likesCount: number;
  createdAt: string;
}

export const getSongComments = (songId: number, page = 0, size = 20) =>
  client.get<ApiResponse<{ content: Comment[] }>>(`/songs/${songId}/comments`, { params: { page, size } });

export const postComment = (songId: number, content: string, parentId?: number) =>
  client.post<ApiResponse<Comment>>(`/songs/${songId}/comments`, { content, parentId });

export const deleteComment = (id: number) =>
  client.delete<ApiResponse<void>>(`/comments/${id}`);

export const followUser = (id: number) =>
  client.post<ApiResponse<void>>(`/users/${id}/follow`);

export const unfollowUser = (id: number) =>
  client.delete<ApiResponse<void>>(`/users/${id}/follow`);

export const getFollowStats = (id: number) =>
  client.get<ApiResponse<{ followers: number; following: number }>>(`/users/${id}/follow-stats`);
