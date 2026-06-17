import { useState } from 'react';
import { Typography, Input, List, Button, message } from 'antd';
import { SearchOutlined, PlayCircleOutlined, HeartOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { searchSongs } from '../../api/songs';
import { usePlayerStore } from '../../stores/playerStore';
import type { Song } from '../../types';

const { Title, Text } = Typography;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const query = searchParams.get('q') || '';
  const { setCurrentSong, setPlaylist } = usePlayerStore();

  const handleSearch = async (value: string) => {
    if (!value.trim()) return;
    setSearchParams({ q: value });
    setLoading(true);
    try {
      const res = await searchSongs(value);
      setResults(res?.content || []);
    } catch {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  const playSong = (song: Song) => {
    setPlaylist(results);
    setCurrentSong(song);
  };

  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>发现</Title>
      <Input
        prefix={<SearchOutlined />}
        placeholder="搜索歌曲、歌手、歌单..."
        size="large"
        defaultValue={query}
        onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
        style={{ background: '#282828', border: 'none', borderRadius: 20, maxWidth: 600, marginBottom: 24 }}
      />
      <List
        loading={loading}
        dataSource={results}
        renderItem={(song) => (
          <List.Item
            style={{ background: '#181818', marginBottom: 4, borderRadius: 8, padding: '12px 16px' }}
            actions={[
              <Button type="text" icon={<PlayCircleOutlined />} onClick={() => playSong(song)} style={{ color: '#1DB954' }} />,
              <Button type="text" icon={<HeartOutlined />} style={{ color: '#B3B3B3' }} />,
            ]}
          >
            <List.Item.Meta
              title={<Text style={{ color: '#fff' }}>{song.title}</Text>}
              description={<Text style={{ color: '#B3B3B3' }}>{song.artistName} · {song.albumName}</Text>}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
