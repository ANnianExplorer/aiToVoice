import { useEffect, useState } from 'react';
import { Typography, Tabs, List, Button, message } from 'antd';
import { HeartOutlined, HistoryOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { getFavorites, getHistory } from '../../api/songs';
import { usePlayerStore } from '../../stores/playerStore';
import { useTheme } from '../../theme/ThemeProvider';
import type { Song } from '../../types';

const { Title, Text } = Typography;

export default function LibraryPage() {
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [history, setHistory] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentSong, setPlaylist } = usePlayerStore();
  const { tokens } = useTheme();

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
          style={{
            background: tokens.bgCard,
            marginBottom: 4,
            borderRadius: tokens.borderRadius,
            padding: '12px 16px',
            border: `1px solid ${tokens.border}`,
          }}
          actions={[
            <Button type="text" icon={<PlayCircleOutlined />}
              onClick={() => playSong(song, songs)}
              style={{ color: tokens.accent }} />,
          ]}
        >
          <List.Item.Meta
            title={<Text style={{ color: tokens.textPrimary }}>{song.title}</Text>}
            description={<Text style={{ color: tokens.textSecondary }}>{song.artistName}</Text>}
          />
        </List.Item>
      )}
    />
  );

  return (
    <div>
      <Title level={2} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
        我的音乐库
      </Title>
      <Tabs items={[
        { key: 'favorites', label: '我喜欢的', icon: <HeartOutlined />, children: renderList(favorites) },
        { key: 'history', label: '最近播放', icon: <HistoryOutlined />, children: renderList(history) },
      ]} />
    </div>
  );
}
