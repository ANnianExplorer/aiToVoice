import { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Spin } from 'antd';
import { PlayCircleOutlined, FireOutlined } from '@ant-design/icons';
import { getHotSongs, getNewSongs } from '../../api/songs';
import { usePlayerStore } from '../../stores/playerStore';
import type { Song } from '../../types';

const { Title, Text } = Typography;

export default function HomePage() {
  const [hotSongs, setHotSongs] = useState<Song[]>([]);
  const [newSongs, setNewSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentSong, setPlaylist } = usePlayerStore();

  useEffect(() => {
    Promise.all([
      getHotSongs(20).catch(() => [] as Song[]),
      getNewSongs(20).catch(() => [] as Song[]),
    ]).then(([hot, newSongs]) => {
      setHotSongs(hot);
      setNewSongs(newSongs);
    }).finally(() => setLoading(false));
  }, []);

  const playSong = (song: Song, list: Song[]) => {
    setPlaylist(list);
    setCurrentSong(song);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <Title level={2} style={{ color: '#fff', marginBottom: 24 }}>发现音乐</Title>

      <div style={{ marginBottom: 32 }}>
        <Title level={4} style={{ color: '#fff' }}>
          <FireOutlined style={{ color: '#E74C3C', marginRight: 8 }} />热门歌曲
        </Title>
        <Row gutter={[16, 16]}>
          {hotSongs.slice(0, 8).map((song) => (
            <Col span={6} key={song.id}>
              <Card
                hoverable
                style={{ background: '#181818', border: '1px solid #282828' }}
                cover={
                  <div style={{
                    height: 160, background: '#282828',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <PlayCircleOutlined style={{ fontSize: 48, color: '#1DB954' }} />
                  </div>
                }
                onClick={() => playSong(song, hotSongs)}
              >
                <Card.Meta
                  title={<Text style={{ color: '#fff' }} ellipsis>{song.title}</Text>}
                  description={<Text style={{ color: '#B3B3B3' }} ellipsis>{song.artistName}</Text>}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div>
        <Title level={4} style={{ color: '#fff' }}>新歌速递</Title>
        <Row gutter={[16, 16]}>
          {newSongs.slice(0, 8).map((song) => (
            <Col span={6} key={song.id}>
              <Card
                hoverable
                style={{ background: '#181818', border: '1px solid #282828' }}
                onClick={() => playSong(song, newSongs)}
              >
                <Card.Meta
                  title={<Text style={{ color: '#fff' }} ellipsis>{song.title}</Text>}
                  description={<Text style={{ color: '#B3B3B3' }} ellipsis>{song.artistName}</Text>}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
