import { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Spin, message } from 'antd';
import { PlayCircleOutlined, FireOutlined } from '@ant-design/icons';
import { getHotSongs, getNewSongs } from '../../api/songs';
import { usePlayerStore } from '../../stores/playerStore';
import { useTheme } from '../../theme/ThemeProvider';
import type { Song } from '../../types';

const { Title, Text } = Typography;

export default function HomePage() {
  const [hotSongs, setHotSongs] = useState<Song[]>([]);
  const [newSongs, setNewSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentSong, setPlaylist } = usePlayerStore();
  const { tokens } = useTheme();

  useEffect(() => {
    Promise.all([
      getHotSongs(20).catch(() => { message.error('加载热门歌曲失败'); return [] as Song[]; }),
      getNewSongs(20).catch(() => { message.error('加载新歌失败'); return [] as Song[]; }),
    ]).then(([hot, fresh]) => {
      setHotSongs(hot);
      setNewSongs(fresh);
    }).finally(() => setLoading(false));
  }, []);

  const playSong = (song: Song, list: Song[]) => {
    setPlaylist(list);
    setCurrentSong(song);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  }

  const cardStyle = () => ({
    background: tokens.bgCard,
    border: `1px solid ${tokens.border}`,
    borderRadius: tokens.borderRadiusLg,
    overflow: 'hidden' as const,
  });

  return (
    <div>
      <Title level={2} style={{ color: tokens.textPrimary, marginBottom: 24, fontFamily: tokens.fontFamily }}>
        发现音乐
      </Title>

      {/* 热门歌曲 */}
      <div style={{ marginBottom: 32 }}>
        <Title level={4} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
          <FireOutlined style={{ color: '#E74C3C', marginRight: 8 }} />热门歌曲
        </Title>
        <Row gutter={[16, 16]}>
          {hotSongs.slice(0, 8).map((song) => (
            <Col xs={24} sm={12} md={8} lg={6} key={song.id}>
              <Card
                hoverable
                style={cardStyle()}
                cover={
                  <div style={{
                    height: 160,
                    background: tokens.bgElevated,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <PlayCircleOutlined style={{ fontSize: 48, color: tokens.accent }} />
                  </div>
                }
                onClick={() => playSong(song, hotSongs)}
              >
                <Card.Meta
                  title={<Text style={{ color: tokens.textPrimary }} ellipsis>{song.title}</Text>}
                  description={<Text style={{ color: tokens.textSecondary }} ellipsis>{song.artistName}</Text>}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 新歌速递 */}
      <div>
        <Title level={4} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
          新歌速递
        </Title>
        <Row gutter={[16, 16]}>
          {newSongs.slice(0, 8).map((song) => (
            <Col xs={24} sm={12} md={8} lg={6} key={song.id}>
              <Card
                hoverable
                style={cardStyle()}
                onClick={() => playSong(song, newSongs)}
              >
                <Card.Meta
                  title={<Text style={{ color: tokens.textPrimary }} ellipsis>{song.title}</Text>}
                  description={<Text style={{ color: tokens.textSecondary }} ellipsis>{song.artistName}</Text>}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
