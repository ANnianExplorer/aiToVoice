import client from './client';

/** 获取原始 LRC 歌词文本 */
export const getLyrics = (songId: number) =>
  client.get<string>(`/songs/${songId}/lyrics`).then(r => r.data);

/** 获取解析后的歌词 Map<时间毫秒, 歌词文本> */
export const getParsedLyrics = (songId: number) =>
  client.get<Record<string, string>>(`/songs/${songId}/lyrics/parsed`).then(r => r.data);

/** 保存歌词（管理员） */
export const saveLyrics = (songId: number, content: string, source = 'manual') =>
  client.post<void>(`/songs/${songId}/lyrics`, content, {
    params: { source },
    headers: { 'Content-Type': 'text/plain' },
  }).then(r => r.data);
