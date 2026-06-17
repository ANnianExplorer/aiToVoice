import client from './client';

interface RankingItem {
  rankPosition: number;
  song: {
    id: number;
    title: string;
    artistName: string;
    albumName: string;
    coverUrl: string;
    duration: number;
    playCount: number;
  };
  score: number;
}

export const getHotRanking = () =>
  client.get<RankingItem[]>('/rankings/hot').then(r => r.data);

export const getNewRanking = () =>
  client.get<RankingItem[]>('/rankings/new').then(r => r.data);

export const getRisingRanking = () =>
  client.get<RankingItem[]>('/rankings/rising').then(r => r.data);

export const getGenreRanking = (genreId: number) =>
  client.get<RankingItem[]>(`/rankings/genre/${genreId}`).then(r => r.data);
