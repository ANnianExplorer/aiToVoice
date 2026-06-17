import client from './client';

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
  client.get<{ content: Comment[] }>(`/songs/${songId}/comments`, { params: { page, size } }).then(r => r.data);

export const postComment = (songId: number, content: string, parentId?: number) =>
  client.post<Comment>(`/songs/${songId}/comments`, { content, parentId }).then(r => r.data);

export const deleteComment = (id: number) =>
  client.delete<void>(`/comments/${id}`).then(r => r.data);

export const followUser = (id: number) =>
  client.post<void>(`/users/${id}/follow`).then(r => r.data);

export const unfollowUser = (id: number) =>
  client.delete<void>(`/users/${id}/follow`).then(r => r.data);

export const getFollowStats = (id: number) =>
  client.get<{ followers: number; following: number }>(`/users/${id}/follow-stats`).then(r => r.data);
