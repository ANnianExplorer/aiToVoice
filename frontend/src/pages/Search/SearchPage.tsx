import { useState, useEffect } from 'react';
import { Typography, Input, List, Button, message, Tabs, Tag, Space } from 'antd';
import { SearchOutlined, PlayCircleOutlined, HeartOutlined, GlobalOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { searchSongs, toggleFavorite } from '../../api/songs';
import { searchExternal, type ExternalTrack } from '../../api/musicSource';
import { usePlayerStore } from '../../stores/playerStore';
import { useTheme } from '../../theme/ThemeProvider';
import type { Song } from '../../types';

const { Title, Text } = Typography;

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

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localResults, setLocalResults] = useState<Song[]>([]);
  const [externalResults, setExternalResults] = useState<ExternalTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('local');
  const query = searchParams.get('q') || '';
  const { setCurrentSong, setPlaylist } = usePlayerStore();
  const { tokens } = useTheme();

  const handleSearch = async (value: string) => {
    if (!value.trim()) return;
    setSearchParams({ q: value });
    setLoading(true);

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

  const playLocalSong = (song: Song) => {
    setPlaylist(localResults);
    setCurrentSong(song);
  };

  const playExternalSong = (track: ExternalTrack) => {
    const song = externalToSong(track);
    setPlaylist([song]);
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

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const listItemStyle = {
    background: tokens.bgCard,
    marginBottom: 4,
    borderRadius: tokens.borderRadius,
    padding: '12px 16px',
    border: `1px solid ${tokens.border}`,
  };

  return (
    <div>
      <Title level={2} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>发现</Title>
      <Input
        prefix={<SearchOutlined style={{ color: tokens.textTertiary }} />}
        placeholder="搜索歌曲、歌手、歌单..."
        size="large"
        defaultValue={query}
        onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
        style={{
          background: tokens.bgElevated,
          border: `1px solid ${tokens.border}`,
          borderRadius: 20,
          maxWidth: 600,
          marginBottom: 24,
          color: tokens.textPrimary,
        }}
      />

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'local',
            label: `本地曲库 (${localResults.length})`,
            children: (
              <List
                loading={loading}
                dataSource={localResults}
                locale={{ emptyText: '暂无结果' }}
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
                      description={
                        <Text style={{ color: tokens.textSecondary }}>
                          {song.artistName} · {song.albumName}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'external',
            label: <span><GlobalOutlined /> 在线音乐 ({externalResults.length})</span>,
            children: (
              <List
                loading={loading}
                dataSource={externalResults}
                locale={{ emptyText: '暂无结果' }}
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
                          {track.playCount > 0 && (
                            <Text style={{ color: tokens.textTertiary, fontSize: 12 }}>
                              ▶ {track.playCount.toLocaleString()}
                            </Text>
                          )}
                          {track.genre && <Tag style={{ fontSize: 11 }}>{track.genre}</Tag>}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
