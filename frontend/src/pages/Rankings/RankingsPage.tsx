import { useEffect, useState } from 'react';
import { Typography, Tabs, List, Button, message } from 'antd';
import { FireOutlined, RocketOutlined, RiseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { getHotRanking, getNewRanking, getRisingRanking, type RankingItem } from '../../api/rankings';
import { usePlayerStore } from '../../stores/playerStore';
import { useTheme } from '../../theme/ThemeProvider';
import type { Song } from '../../types';

const { Title, Text } = Typography;

export default function RankingsPage() {
  const [hot, setHot] = useState<RankingItem[]>([]);
  const [newSongs, setNewSongs] = useState<RankingItem[]>([]);
  const [rising, setRising] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentSong, setPlaylist } = usePlayerStore();
  const { tokens } = useTheme();

  useEffect(() => {
    Promise.all([
      getHotRanking().catch(() => { message.error('加载热歌榜失败'); return [] as RankingItem[]; }),
      getNewRanking().catch(() => { message.error('加载新歌榜失败'); return [] as RankingItem[]; }),
      getRisingRanking().catch(() => { message.error('加载飙升榜失败'); return [] as RankingItem[]; }),
    ]).then(([h, n, r]) => {
      setHot(h);
      setNewSongs(n);
      setRising(r);
    }).finally(() => setLoading(false));
  }, []);

  const toSong = (item: RankingItem): Song => ({
    id: item.song.id,
    title: item.song.title,
    artistName: item.song.artistName || '',
    albumName: item.song.albumName || '',
    genreName: '',
    sourceType: 'LOCAL',
    duration: item.song.duration || 0,
    coverUrl: item.song.coverUrl || '',
    playCount: item.song.playCount || 0,
    likeCount: 0,
  });

  const renderList = (items: RankingItem[]) => (
    <List
      loading={loading}
      dataSource={items}
      renderItem={(item) => (
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
              style={{ color: tokens.accent }}
              onClick={() => {
                setPlaylist(items.map(toSong));
                setCurrentSong(toSong(item));
              }} />,
          ]}
        >
          <span style={{ color: tokens.accent, fontWeight: 700, marginRight: 16, fontSize: 18 }}>
            {item.rankPosition}
          </span>
          <List.Item.Meta
            title={<Text style={{ color: tokens.textPrimary }}>{item.song.title}</Text>}
            description={<Text style={{ color: tokens.textSecondary }}>{item.song.artistName || ''}</Text>}
          />
        </List.Item>
      )}
    />
  );

  return (
    <div>
      <Title level={2} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>排行榜</Title>
      <Tabs items={[
        { key: 'hot', label: '热歌榜', icon: <FireOutlined />, children: renderList(hot) },
        { key: 'new', label: '新歌榜', icon: <RocketOutlined />, children: renderList(newSongs) },
        { key: 'rising', label: '飙升榜', icon: <RiseOutlined />, children: renderList(rising) },
      ]} />
    </div>
  );
}
