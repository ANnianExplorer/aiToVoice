import { useState, useEffect } from 'react';
import { Typography, Input, List, Button, message, Tabs, Tag, Space, Row, Col, Card, Avatar } from 'antd';
import { SearchOutlined, PlayCircleOutlined, HeartOutlined, GlobalOutlined, UserOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { searchSongs, toggleFavorite } from '../../api/songs';
import { searchExternal, getExternalTrending, type ExternalTrack } from '../../api/musicSource';
import { getDiscoverData, type DiscoverData } from '../../api/discover';
import { usePlayerStore } from '../../stores/playerStore';
import { useTheme } from '../../theme/ThemeProvider';
import type { Song } from '../../types';

const { Title, Text } = Typography;

const genreColors = [
  '#1DB954', '#E74C3C', '#3498DB', '#9B59B6',
  '#F39C12', '#1ABC9C', '#E67E22', '#2ECC71',
  '#E91E63', '#00BCD4', '#FF5722', '#607D8B',
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setCurrentSong, setPlaylist } = usePlayerStore();
  const { tokens } = useTheme();

  const [discover, setDiscover] = useState<DiscoverData | null>(null);
  const [localResults, setLocalResults] = useState<Song[]>([]);
  const [externalResults, setExternalResults] = useState<ExternalTrack[]>([]);
  const [trending, setTrending] = useState<ExternalTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');
  const query = searchParams.get('q') || '';

  // 加载发现页数据
  useEffect(() => {
    Promise.all([
      getDiscoverData().catch(() => null),
      getExternalTrending(12).catch(() => []),
    ]).then(([data, ext]) => {
      setDiscover(data);
      setTrending(ext);
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

  useEffect(() => {
    if (query) handleSearch(query);
  }, []);

  const playSong = (song: Song, list?: Song[]) => {
    if (list) setPlaylist(list);
    setCurrentSong(song);
  };

  const playExternal = (track: ExternalTrack) => {
    const song = {
      id: -1, title: track.title, artistName: track.artistName,
      albumName: track.albumName ?? '', coverUrl: track.coverUrl ?? '',
      duration: track.durationSec, sourceType: track.source,
      streamUrl: track.streamUrl, playCount: track.playCount, likeCount: 0,
    } as Song;
    setPlaylist([song]);
    setCurrentSong(song);
  };

  const handleFavorite = async (songId: number) => {
    try { await toggleFavorite(songId); message.success('已收藏'); }
    catch { message.error('收藏失败'); }
  };

  const fmt = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;

  const cardStyle = {
    background: tokens.bgCard, border: `1px solid ${tokens.border}`,
    borderRadius: tokens.borderRadiusLg, overflow: 'hidden' as const,
  };

  const listItemStyle = {
    background: tokens.bgCard, marginBottom: 4,
    borderRadius: tokens.borderRadius, padding: '12px 16px',
    border: `1px solid ${tokens.border}`,
  };

  /** 歌曲列表（通用） */
  const SongList = ({ songs, showIndex = false }: { songs: Song[]; showIndex?: boolean }) => (
    <List
      dataSource={songs}
      renderItem={(song, i) => (
        <List.Item
          style={listItemStyle}
          actions={[
            <Button type="text" icon={<PlayCircleOutlined />}
              onClick={() => playSong(song, songs)}
              style={{ color: tokens.accent }} />,
            song.id > 0 && <Button type="text" icon={<HeartOutlined />}
              onClick={() => handleFavorite(song.id)}
              style={{ color: tokens.textSecondary }} />,
          ]}
        >
          {showIndex && (
            <span style={{ color: tokens.accent, fontWeight: 700, marginRight: 16, fontSize: 16, width: 24, textAlign: 'center' }}>
              {i + 1}
            </span>
          )}
          <List.Item.Meta
            title={<Text style={{ color: tokens.textPrimary }}>{song.title}</Text>}
            description={
              <Space size={4}>
                <Text style={{ color: tokens.textSecondary }}>{song.artistName}</Text>
                {song.albumName && <Text style={{ color: tokens.textTertiary }}>· {song.albumName}</Text>}
                {song.duration > 0 && <Text style={{ color: tokens.textTertiary, fontSize: 12 }}>{fmt(song.duration)}</Text>}
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );

  /** 歌曲卡片网格 */
  const SongGrid = ({ songs, external }: { songs?: Song[]; external?: ExternalTrack[] }) => (
    <Row gutter={[12, 12]}>
      {songs?.map((song) => (
        <Col xs={12} sm={8} md={6} lg={4} key={song.id}>
          <Card hoverable style={cardStyle}
            cover={
              song.coverUrl ? (
                <img src={song.coverUrl} alt={song.title} style={{ height: 140, objectFit: 'cover' }} />
              ) : (
                <div style={{ height: 140, background: tokens.bgElevated, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlayCircleOutlined style={{ fontSize: 40, color: tokens.accent }} />
                </div>
              )
            }
            onClick={() => playSong(song, songs)}
          >
            <Card.Meta
              title={<Text style={{ color: tokens.textPrimary, fontSize: 13 }} ellipsis>{song.title}</Text>}
              description={<Text style={{ color: tokens.textSecondary, fontSize: 12 }} ellipsis>{song.artistName}</Text>}
            />
          </Card>
        </Col>
      ))}
      {external?.map((track) => (
        <Col xs={12} sm={8} md={6} lg={4} key={track.sourceId}>
          <Card hoverable style={cardStyle}
            cover={
              track.coverUrl ? (
                <img src={track.coverUrl} alt={track.title} style={{ height: 140, objectFit: 'cover' }} />
              ) : (
                <div style={{ height: 140, background: tokens.bgElevated, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlayCircleOutlined style={{ fontSize: 40, color: tokens.accent }} />
                </div>
              )
            }
            onClick={() => playExternal(track)}
          >
            <Card.Meta
              title={<Text style={{ color: tokens.textPrimary, fontSize: 13 }} ellipsis>{track.title}</Text>}
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
  );

  // ========== 发现页（未搜索状态） ==========
  const DiscoverContent = () => {
    if (!discover && trending.length === 0) {
      return <div style={{ textAlign: 'center', padding: 60 }}><Text style={{ color: tokens.textSecondary }}>加载中...</Text></div>;
    }

    const hasLocal = discover && (
      discover.hotSongs.length > 0 || discover.newSongs.length > 0 || discover.artists.length > 0
    );

    return (
      <>
        {/* 在线热门 — Audius/Jamendo */}
        {trending.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <Title level={4} style={{ color: tokens.textPrimary, margin: 0, fontFamily: tokens.fontFamily }}>
                <GlobalOutlined style={{ color: tokens.accent, marginRight: 8 }} />
                在线热门
              </Title>
              <Tag color="blue" style={{ marginLeft: 12 }}>Audius · 免费可播放</Tag>
            </div>
            <SongGrid external={trending} />
          </section>
        )}

        {/* 热门歌手 */}
        {discover && discover.artists.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <Title level={4} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
              热门歌手
            </Title>
            <Row gutter={[16, 16]}>
              {discover.artists.map((artist) => (
                <Col xs={8} sm={6} md={4} lg={3} key={artist.id}>
                  <div style={{ textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => handleSearch(artist.name)}>
                    <Avatar size={64} icon={<UserOutlined />}
                      style={{ background: tokens.bgElevated, marginBottom: 8 }} />
                    <Text style={{ color: tokens.textPrimary, fontSize: 13, display: 'block' }} ellipsis>
                      {artist.name}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </section>
        )}

        {/* 热门歌曲 */}
        {discover && discover.hotSongs.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <Title level={4} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
              🔥 热门歌曲
            </Title>
            <SongGrid songs={discover.hotSongs} />
          </section>
        )}

        {/* 新歌速递 */}
        {discover && discover.newSongs.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <Title level={4} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
              ✨ 新歌速递
            </Title>
            <SongList songs={discover.newSongs} showIndex />
          </section>
        )}

        {/* 各流派热门 */}
        {discover && Object.entries(discover.genreHot).map(([genre, songs]) => (
          songs.length > 0 && (
            <section key={genre} style={{ marginBottom: 40 }}>
              <Title level={4} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
                {genre}
              </Title>
              <SongGrid songs={songs} />
            </section>
          )
        ))}

        {/* 流派分类卡片 */}
        {discover && discover.genres.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <Title level={4} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
              浏览全部
            </Title>
            <Row gutter={[12, 12]}>
              {discover.genres.map((genre, i) => (
                <Col xs={12} sm={8} md={6} lg={4} key={genre.id}>
                  <Card hoverable
                    style={{
                      background: genreColors[i % genreColors.length],
                      border: 'none', borderRadius: tokens.borderRadiusLg, cursor: 'pointer',
                    }}
                    bodyStyle={{ padding: '20px 16px' }}
                    onClick={() => handleSearch(genre.name)}
                  >
                    <Text style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{genre.name}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>
        )}

        {!hasLocal && trending.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Text style={{ color: tokens.textSecondary, fontSize: 16 }}>
              暂无数据，后端启动后会自动同步在线音乐
            </Text>
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      <Title level={2} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily, marginBottom: 16 }}>
        发现
      </Title>
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
            children: <DiscoverContent />,
          },
          {
            key: 'search',
            label: `搜索结果 (${localResults.length + externalResults.length})`,
            children: (
              <>
                {localResults.length > 0 && (
                  <section style={{ marginBottom: 24 }}>
                    <Title level={5} style={{ color: tokens.textPrimary }}>本地曲库</Title>
                    <SongList songs={localResults} />
                  </section>
                )}
                {externalResults.length > 0 && (
                  <section>
                    <Title level={5} style={{ color: tokens.textPrimary }}>
                      <GlobalOutlined style={{ marginRight: 8 }} />在线音乐
                    </Title>
                    <SongGrid external={externalResults} />
                  </section>
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
