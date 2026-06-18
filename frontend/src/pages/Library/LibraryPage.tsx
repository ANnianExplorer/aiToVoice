import { useEffect, useState } from 'react';
import { Typography, Tabs, List, Button, message } from 'antd';
import { HeartOutlined, HistoryOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { getFavorites, getHistory } from '../../api/songs';
import { usePlayerStore } from '../../stores/playerStore';
import type { Song } from '../../types';

const { Title, Text } = Typography;

export default function LibraryPage() {
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [history, setHistory] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentSong, setPlaylist } = usePlayerStore();

  useEffect(() => {
    Promise.all([
      getFavorites().catch(() => { message.error('加载收藏失败'); return [] as Song[]; }),
      getHistory().catch(() => { message.error('加载播放历史失败'); return [] as Song[]; }),
    ]).then(([fav, hist]) => {
      setFavorites(fav);
      setHistory(hist);
    }).finally(() => setLoading(false));
  }, []);

  const playSong = (song: Song, list: Song[]) => {
    setPlaylist(list);
    setCurrentSong(song);
  };

  const renderList = (songs: Song[]) => (
    <List
      loading={loading}
      dataSource={songs}
      renderItem={(song) => (
        <List.Item
          style={{ background: '#181818', marginBottom: 4, borderRadius: 8, padding: '12px 16px' }}
          actions={[
            <Button type="text" icon={<PlayCircleOutlined />} onClick={() => playSong(song, songs)} style={{ color: '#1DB954' }} />,
          ]}
        >
          <List.Item.Meta
            title={<Text style={{ color: '#fff' }}>{song.title}</Text>}
            description={<Text style={{ color: '#B3B3B3' }}>{song.artistName}</Text>}
          />
        </List.Item>
      )}
    />
  );

  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>我的音乐库</Title>
      <Tabs items={[
        { key: 'favorites', label: '我喜欢的', icon: <HeartOutlined />, children: renderList(favorites) },
        { key: 'history', label: '最近播放', icon: <HistoryOutlined />, children: renderList(history) },
      ]} />
    </div>
  );
}
