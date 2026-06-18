import client from './client';
import type { Song } from '../types';

export interface DiscoverData {
  onlineSongs: Song[];
  hotSongs: Song[];
  newSongs: Song[];
  artists: { id: number; name: string }[];
  genres: { id: number; name: string }[];
}

/** 获取发现页全部数据 */
export const getDiscoverData = () =>
  client.get<DiscoverData>('/discover').then(r => r.data);
