import { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Spin, Space, Tag } from 'antd';
import { PlayCircleOutlined, FireOutlined, GlobalOutlined } from '@ant-design/icons';
import { getHotSongs, getNewSongs } from '../../api/songs';
import { getExternalTrending, type ExternalTrack } from '../../api/musicSource';
import { usePlayerStore } from '../../stores/playerStore';
import { useTheme } from '../../theme/ThemeProvider';
import type { Song } from '../../types';

const { Title, Text } = Typography;

/** ExternalTrack → Song 播放器用 */
function externalToSong(track: ExternalTrack): Song {
  return {
    id: -1,
    title: track.title,
    artistName: track.artistName,
    albumName: track.albumName ?? '',
    coverUrl: track.coverUrl ?? '',
    duration: track.durationSec,
    sourceType: track.source as Song['sourceType'],
    streamUrl: track.streamUrl,
  } as Song & { streamUrl: string };
}

export default function HomePage() {
  const [hotSongs, setHotSongs] = useState<Song[]>([]);
  const [newSongs, setNewSongs] = useState<Song[]>([]);
  const [trending, setTrending] = useState<ExternalTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentSong, setPlaylist } = usePlayerStore();
  const { tokens } = useTheme();

  useEffect(() => {
    Promise.all([
      getHotSongs(20).catch(() => [] as Song[]),
      getNewSongs(20).catch(() => [] as Song[]),
      getExternalTrending(12).catch(() => [] as ExternalTrack[]),
    ]).then(([hot, fresh, ext]) => {
      setHotSongs(hot);
      setNewSongs(fresh);
      setTrending(ext);
    }).finally(() => setLoading(false));
  }, []);

  const playLocal = (song: Song, list: Song[]) => {
    setPlaylist(list);
    setCurrentSong(song);
  };

  const playExternal = (track: ExternalTrack) => {
    const song = externalToSong(track);
    setPlaylist([song]);
    setCurrentSong(song);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  }

  const cardStyle = {
    background: tokens.bgCard,
    border: `1px solid ${tokens.border}`,
    borderRadius: tokens.borderRadiusLg,
    overflow: 'hidden' as const,
  };

  return (
    <div>
      <Title level={2} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily, marginBottom: 24 }}>
        发现音乐
      </Title>

      {/* Audius 在线热门 — 有真实音频可播放 */}
      {trending.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <Title level={4} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
            <GlobalOutlined style={{ color: tokens.accent, marginRight: 8 }} />
            在线热门
            <Tag color="blue" style={{ marginLeft: 12, fontSize: 12 }}>Audius · 可播放</Tag>
          </Title>
          <Row gutter={[16, 16]}>
            {trending.map((track) => (
              <Col xs={24} sm={12} md={8} lg={6} key={track.sourceId}>
                <Card
                  hoverable
                  style={cardStyle}
                  cover={
                    track.coverUrl ? (
                      <img src={track.coverUrl} alt={track.title}
                        style={{ height: 160, objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        height: 160, background: tokens.bgElevated,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <PlayCircleOutlined style={{ fontSize: 48, color: tokens.accent }} />
                      </div>
                    )
                  }
                  onClick={() => playExternal(track)}
                >
                  <Card.Meta
                    title={<Text style={{ color: tokens.textPrimary }} ellipsis>{track.title}</Text>}
                    description={
                      <Space direction="vertical" size={2}>
                        <Text style={{ color: tokens.textSecondary }} ellipsis>{track.artistName}</Text>
                        <Space size={4}>
                          {track.genre && <Tag style={{ fontSize: 11, margin: 0 }}>{track.genre}</Tag>}
                          {track.playCount > 0 && (
                            <Text style={{ color: tokens.textTertiary, fontSize: 11 }}>
                              ▶ {track.playCount.toLocaleString()}
                            </Text>
                          )}
                        </Space>
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* 本地热门歌曲 */}
      {hotSongs.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <Title level={4} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
            <FireOutlined style={{ color: '#E74C3C', marginRight: 8 }} />热门歌曲
          </Title>
          <Row gutter={[16, 16]}>
            {hotSongs.slice(0, 8).map((song) => (
              <Col xs={24} sm={12} md={8} lg={6} key={song.id}>
                <Card
                  hoverable
                  style={cardStyle}
                  cover={
                    <div style={{
                      height: 160, background: tokens.bgElevated,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <PlayCircleOutlined style={{ fontSize: 48, color: tokens.accent }} />
                    </div>
                  }
                  onClick={() => playLocal(song, hotSongs)}
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
      )}

      {/* 本地新歌 */}
      {newSongs.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <Title level={4} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
            新歌速递
          </Title>
          <Row gutter={[16, 16]}>
            {newSongs.slice(0, 8).map((song) => (
              <Col xs={24} sm={12} md={8} lg={6} key={song.id}>
                <Card hoverable style={cardStyle} onClick={() => playLocal(song, newSongs)}>
                  <Card.Meta
                    title={<Text style={{ color: tokens.textPrimary }} ellipsis>{song.title}</Text>}
                    description={<Text style={{ color: tokens.textSecondary }} ellipsis>{song.artistName}</Text>}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* 无数据提示 */}
      {trending.length === 0 && hotSongs.length === 0 && newSongs.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Text style={{ color: tokens.textSecondary, fontSize: 16 }}>
            暂无音乐数据，请上传歌曲或搜索在线音乐
          </Text>
        </div>
      )}
    </div>
  );
}
