import client from './client';

export interface ExternalTrack {
  sourceId: string;
  source: string;
  title: string;
  artistName: string;
  albumName: string | null;
  coverUrl: string | null;
  streamUrl: string;
  durationSec: number;
  playCount: number;
  genre: string | null;
}

/** 搜索外部音乐源 */
export const searchExternal = (keyword: string, limit = 20) =>
  client.get<ExternalTrack[]>('/music-source/search', { params: { keyword, limit } }).then(r => r.data);

/** 获取热门歌曲 */
export const getExternalTrending = (limit = 20) =>
  client.get<ExternalTrack[]>('/music-source/trending', { params: { limit } }).then(r => r.data);

/** 获取流式播放 URL */
export const getExternalStreamUrl = (source: string, trackId: string) =>
  client.get<string>('/music-source/stream', { params: { source, trackId } }).then(r => r.data);

/** 获取歌曲详情 */
export const getExternalTrackDetail = (source: string, trackId: string) =>
  client.get<ExternalTrack>('/music-source/track', { params: { source, trackId } }).then(r => r.data);

/** 获取可用源列表 */
export const getAvailableSources = () =>
  client.get<string[]>('/music-source/sources').then(r => r.data);
