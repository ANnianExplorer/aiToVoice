import { useEffect, useState } from 'react';
import { Typography, Tabs, List, Button } from 'antd';
import { FireOutlined, RocketOutlined, RiseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { getHotRanking, getNewRanking, getRisingRanking } from '../../api/rankings';
import { usePlayerStore } from '../../stores/playerStore';

const { Title, Text } = Typography;

interface RankingItem {
  rankPosition: number;
  song: { id: number; title: string; artistName: string; coverUrl: string; duration: number };
  score: number;
}

export default function RankingsPage() {
  const [hot, setHot] = useState<RankingItem[]>([]);
  const [newSongs, setNewSongs] = useState<RankingItem[]>([]);
  const [rising, setRising] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentSong, setPlaylist } = usePlayerStore();

  useEffect(() => {
    Promise.all([
      getHotRanking().catch(() => [] as RankingItem[]),
      getNewRanking().catch(() => [] as RankingItem[]),
      getRisingRanking().catch(() => [] as RankingItem[]),
    ]).then(([h, n, r]) => {
      setHot(h);
      setNewSongs(n);
      setRising(r);
    }).finally(() => setLoading(false));
  }, []);

  const renderList = (items: RankingItem[]) => (
    <List
      loading={loading}
      dataSource={items}
      renderItem={(item) => (
        <List.Item
          style={{ background: '#181818', marginBottom: 4, borderRadius: 8, padding: '12px 16px' }}
          actions={[
            <Button type="text" icon={<PlayCircleOutlined />} style={{ color: '#1DB954' }}
              onClick={() => {
                setPlaylist(items.map(i => ({ ...i.song, artistName: '', albumName: '', genreName: '', sourceType: 'LOCAL' as const, playCount: 0, likeCount: 0 })));
                setCurrentSong({ ...item.song, artistName: '', albumName: '', genreName: '', sourceType: 'LOCAL' as const, playCount: 0, likeCount: 0 });
              }} />,
          ]}
        >
          <span style={{ color: '#1DB954', fontWeight: 700, marginRight: 16, fontSize: 18 }}>
            {item.rankPosition}
          </span>
          <List.Item.Meta
            title={<Text style={{ color: '#fff' }}>{item.song.title}</Text>}
          />
        </List.Item>
      )}
    />
  );

  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>排行榜</Title>
      <Tabs items={[
        { key: 'hot', label: '热歌榜', icon: <FireOutlined />, children: renderList(hot) },
        { key: 'new', label: '新歌榜', icon: <RocketOutlined />, children: renderList(newSongs) },
        { key: 'rising', label: '飙升榜', icon: <RiseOutlined />, children: renderList(rising) },
      ]} />
    </div>
  );
}
