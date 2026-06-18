import { useState, useEffect } from 'react';
import { Typography, Input, List, Button, message, Tabs, Tag, Space, Row, Col, Card } from 'antd';
import { SearchOutlined, PlayCircleOutlined, HeartOutlined, GlobalOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { searchSongs, toggleFavorite, getHotSongs } from '../../api/songs';
import { searchExternal, getExternalTrending, type ExternalTrack } from '../../api/musicSource';
import client from '../../api/client';
import { usePlayerStore } from '../../stores/playerStore';
import { useTheme } from '../../theme/ThemeProvider';
import type { Song } from '../../types';

const { Title, Text } = Typography;

interface Genre {
  id: number;
  name: string;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localResults, setLocalResults] = useState<Song[]>([]);
  const [externalResults, setExternalResults] = useState<ExternalTrack[]>([]);
  const [hotSongs, setHotSongs] = useState<Song[]>([]);
  const [trending, setTrending] = useState<ExternalTrack[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');
  const query = searchParams.get('q') || '';
  const { setCurrentSong, setPlaylist } = usePlayerStore();
  const { tokens } = useTheme();

  // 加载初始数据
  useEffect(() => {
    Promise.all([
      getHotSongs(20).catch(() => []),
      getExternalTrending(20).catch(() => []),
      client.get('/genres').then(r => r.data.data).catch(() => []),
    ]).then(([hot, ext, g]) => {
      setHotSongs(hot);
      setTrending(ext);
      setGenres(g);
    });
  }, []);

  // 搜索
  const handleSearch = async (value: string) => {
    if (!value.trim()) return;
    setSearchParams({ q: value });
    setLoading(true);
    setActiveTab('search');
    try {
      const [localRes, extRes] = await Promise.all([
        searchSongs(value).catch(() => ({ content: [] })),
        searchExternal(value).catch(() => []),
      ]);
      setLocalResults(localRes?.content || []);
      setExternalResults(extRes || []);
    } catch {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  // 按流派筛选
  const handleGenreClick = async (_genreId: number, genreName: string) => {
    setLoading(true);
    setActiveTab('search');
    try {
      const res = await searchSongs(genreName, 0, 50).catch(() => ({ content: [] }));
      setLocalResults(res?.content || []);
      const extRes = await searchExternal(genreName).catch(() => []);
      setExternalResults(extRes || []);
    } catch {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) handleSearch(query);
  }, []);

  const playLocalSong = (song: Song) => {
    setPlaylist(localResults.length > 0 ? localResults : hotSongs);
    setCurrentSong(song);
  };

  const playExternalSong = (track: ExternalTrack) => {
    const song = {
      id: -1, title: track.title, artistName: track.artistName,
      albumName: track.albumName ?? '', coverUrl: track.coverUrl ?? '',
      duration: track.durationSec, sourceType: track.source,
      streamUrl: track.streamUrl, playCount: track.playCount, likeCount: 0,
    } as Song;
    setPlaylist([song]);
    setCurrentSong(song);
  };

  const playLocal = (song: Song, list: Song[]) => {
    setPlaylist(list);
    setCurrentSong(song);
  };

  const handleFavorite = async (songId: number) => {
    try {
      await toggleFavorite(songId);
      message.success('已收藏');
    } catch {
      message.error('收藏失败');
    }
  };

  const formatDuration = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;

  const listItemStyle = {
    background: tokens.bgCard, marginBottom: 4,
    borderRadius: tokens.borderRadius, padding: '12px 16px',
    border: `1px solid ${tokens.border}`,
  };

  const genreColors = ['#1DB954', '#E74C3C', '#3498DB', '#9B59B6', '#F39C12', '#1ABC9C', '#E67E22', '#2ECC71'];

  return (
    <div>
      <Title level={2} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>发现</Title>
      <Input
        prefix={<SearchOutlined style={{ color: tokens.textTertiary }} />}
        placeholder="搜索歌曲、歌手、流派..."
        size="large"
        defaultValue={query}
        onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
        style={{
          background: tokens.bgElevated, border: `1px solid ${tokens.border}`,
          borderRadius: 20, maxWidth: 600, marginBottom: 24,
        }}
      />

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'discover',
            label: '发现',
            children: (
              <>
                {/* 流派分类 */}
                {genres.length > 0 && (
                  <div style={{ marginBottom: 32 }}>
                    <Title level={4} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
                      浏览全部
                    </Title>
                    <Row gutter={[12, 12]}>
                      {genres.map((genre, i) => (
                        <Col xs={12} sm={8} md={6} lg={4} key={genre.id}>
                          <Card
                            hoverable
                            style={{
                              background: genreColors[i % genreColors.length],
                              border: 'none',
                              borderRadius: tokens.borderRadiusLg,
                              cursor: 'pointer',
                            }}
                            bodyStyle={{ padding: '16px' }}
                            onClick={() => handleGenreClick(genre.id, genre.name)}
                          >
                            <Text style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
                              {genre.name}
                            </Text>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* 在线热门 */}
                {trending.length > 0 && (
                  <div style={{ marginBottom: 32 }}>
                    <Title level={4} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
                      <GlobalOutlined style={{ color: tokens.accent, marginRight: 8 }} />
                      在线热门
                      <Tag color="blue" style={{ marginLeft: 12 }}>Audius</Tag>
                    </Title>
                    <Row gutter={[12, 12]}>
                      {trending.map((track) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={track.sourceId}>
                          <Card
                            hoverable
                            style={{
                              background: tokens.bgCard,
                              border: `1px solid ${tokens.border}`,
                              borderRadius: tokens.borderRadiusLg,
                            }}
                            cover={
                              track.coverUrl ? (
                                <img src={track.coverUrl} alt={track.title}
                                  style={{ height: 140, objectFit: 'cover' }} />
                              ) : (
                                <div style={{
                                  height: 140, background: tokens.bgElevated,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                  <PlayCircleOutlined style={{ fontSize: 40, color: tokens.accent }} />
                                </div>
                              )
                            }
                            onClick={() => playExternalSong(track)}
                          >
                            <Card.Meta
                              title={<Text style={{ color: tokens.textPrimary, fontSize: 14 }} ellipsis>{track.title}</Text>}
                              description={
                                <Space size={4}>
                                  <Text style={{ color: tokens.textSecondary, fontSize: 12 }} ellipsis>{track.artistName}</Text>
                                  {track.genre && <Tag style={{ fontSize: 10, margin: 0 }}>{track.genre}</Tag>}
                                </Space>
                              }
                            />
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* 本地热门 */}
                {hotSongs.length > 0 && (
                  <div style={{ marginBottom: 32 }}>
                    <Title level={4} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
                      本地热门
                    </Title>
                    <List
                      dataSource={hotSongs.slice(0, 10)}
                      renderItem={(song) => (
                        <List.Item
                          style={listItemStyle}
                          actions={[
                            <Button type="text" icon={<PlayCircleOutlined />}
                              onClick={() => playLocal(song, hotSongs)}
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
                  </div>
                )}
              </>
            ),
          },
          {
            key: 'search',
            label: `搜索结果 (local: ${localResults.length}, online: ${externalResults.length})`,
            children: (
              <>
                {localResults.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <Title level={5} style={{ color: tokens.textPrimary }}>本地曲库</Title>
                    <List
                      loading={loading}
                      dataSource={localResults}
                      renderItem={(song) => (
                        <List.Item
                          style={listItemStyle}
                          actions={[
                            <Button type="text" icon={<PlayCircleOutlined />}
                              onClick={() => playLocalSong(song)}
                              style={{ color: tokens.accent }} />,
                            <Button type="text" icon={<HeartOutlined />}
                              onClick={() => handleFavorite(song.id)}
                              style={{ color: tokens.textSecondary }} />,
                          ]}
                        >
                          <List.Item.Meta
                            title={<Text style={{ color: tokens.textPrimary }}>{song.title}</Text>}
                            description={<Text style={{ color: tokens.textSecondary }}>{song.artistName} · {song.albumName}</Text>}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                )}
                {externalResults.length > 0 && (
                  <div>
                    <Title level={5} style={{ color: tokens.textPrimary }}>
                      <GlobalOutlined style={{ marginRight: 8 }} />在线音乐
                    </Title>
                    <List
                      loading={loading}
                      dataSource={externalResults}
                      renderItem={(track) => (
                        <List.Item
                          style={listItemStyle}
                          actions={[
                            <Button type="text" icon={<PlayCircleOutlined />}
                              onClick={() => playExternalSong(track)}
                              style={{ color: tokens.accent }} />,
                          ]}
                        >
                          <List.Item.Meta
                            title={
                              <Space>
                                <Text style={{ color: tokens.textPrimary }}>{track.title}</Text>
                                <Tag color="blue" style={{ fontSize: 11 }}>{track.source}</Tag>
                              </Space>
                            }
                            description={
                              <Space>
                                <Text style={{ color: tokens.textSecondary }}>{track.artistName}</Text>
                                {track.durationSec > 0 && (
                                  <Text style={{ color: tokens.textTertiary, fontSize: 12 }}>
                                    {formatDuration(track.durationSec)}
                                  </Text>
                                )}
                              </Space>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                )}
                {localResults.length === 0 && externalResults.length === 0 && !loading && (
                  <div style={{ textAlign: 'center', padding: 60 }}>
                    <Text style={{ color: tokens.textSecondary }}>未找到结果</Text>
                  </div>
                )}
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
