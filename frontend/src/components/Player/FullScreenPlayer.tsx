import { useState, useEffect } from 'react';
import { Button, Slider, Typography, Space } from 'antd';
import {
  PlayCircleOutlined, PauseCircleOutlined,
  StepBackwardOutlined, StepForwardOutlined,
  SoundOutlined, ReloadOutlined,
  SwapOutlined, OrderedListOutlined,
  CloseOutlined, FileTextOutlined,
} from '@ant-design/icons';
import { usePlayerStore } from '../../stores/playerStore';
import { useAudio } from '../../hooks/useAudio';
import { useTheme } from '../../theme/ThemeProvider';
import SyncedLyrics from '../Lyrics/SyncedLyrics';

const { Text } = Typography;

interface FullScreenPlayerProps {
  open: boolean;
  onClose: () => void;
}

export default function FullScreenPlayer({ open, onClose }: FullScreenPlayerProps) {
  const {
    currentSong, isPlaying, volume, progress, duration, playMode,
    togglePlay, setVolume, playNext, playPrev, setPlayMode, setProgress,
  } = usePlayerStore();
  const { seek } = useAudio();
  const { tokens } = useTheme();

  const [isDragging, setIsDragging] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);

  useEffect(() => {
    if (!isDragging) setSliderValue(progress);
  }, [progress, isDragging]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const cycleMode = () => {
    const modes: Array<'sequential' | 'shuffle' | 'repeat-one'> = ['sequential', 'shuffle', 'repeat-one'];
    setPlayMode(modes[(modes.indexOf(playMode) + 1) % modes.length]);
  };

  const modeIcon = {
    sequential: <OrderedListOutlined />,
    shuffle: <SwapOutlined />,
    'repeat-one': <ReloadOutlined />,
  }[playMode];

  if (!open || !currentSong) return null;

  const coverUrl = currentSong.coverUrl || '';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999,
        background: `linear-gradient(135deg, ${tokens.bgPrimary}, ${tokens.bgSecondary})`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 入场动画覆盖层 */}
      <style>{`
        .fs-player-enter { animation: fadeInUp 0.3s ease-out; }
        .fs-cover-spin { animation: spin 20s linear infinite; }
        .fs-cover-spin-paused { animation: spin 20s linear infinite; animation-play-state: paused; }
      `}</style>

      <div className="fs-player-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* 顶部栏 */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px',
        }}>
          <Button type="text" icon={<CloseOutlined />}
            onClick={onClose}
            style={{ color: tokens.textSecondary, fontSize: 20 }} />
          <Text style={{ color: tokens.textSecondary, fontSize: 13 }}>
            {currentSong.sourceType === 'AUDIUS' ? 'Audius' : currentSong.sourceType === 'JAMENDO' ? 'Jamendo' : '本地'}
          </Text>
          <Button type="text" icon={<FileTextOutlined />}
            onClick={() => setShowLyrics(!showLyrics)}
            style={{ color: showLyrics ? tokens.accent : tokens.textSecondary, fontSize: 20 }} />
        </div>

        {/* 主体区域 */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* 左侧：封面 + 歌曲信息 */}
          <div style={{
            flex: showLyrics ? '0 0 40%' : '1',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: 24,
            transition: 'flex 0.3s ease',
          }}>
            {/* 封面旋转 — 用原生 img 替代 Ant Design Image */}
            <div style={{
              width: 280, height: 280, borderRadius: '50%', overflow: 'hidden',
              boxShadow: isPlaying
                ? `0 0 40px ${tokens.accent}40, 0 0 80px ${tokens.accent}20`
                : tokens.shadowElevated,
              transition: 'box-shadow 0.5s ease',
            }}>
              <img
                src={coverUrl}
                alt={currentSong.title}
                className={isPlaying ? 'fs-cover-spin' : 'fs-cover-spin-paused'}
                style={{
                  width: 280,
                  height: 280,
                  objectFit: 'cover',
                  borderRadius: '50%',
                  display: 'block',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Crect fill='%23282828' width='280' height='280'/%3E%3Ccircle cx='140' cy='140' r='40' fill='%231DB954'/%3E%3C/svg%3E";
                }}
              />
            </div>

            {/* 歌曲信息 */}
            <div style={{ textAlign: 'center', marginTop: 32, maxWidth: 320 }}>
              <Text style={{
                color: tokens.textPrimary, fontSize: 22, fontWeight: 700,
                display: 'block', marginBottom: 8,
              }} ellipsis>
                {currentSong.title}
              </Text>
              <Text style={{ color: tokens.textSecondary, fontSize: 16 }} ellipsis>
                {currentSong.artistName}
              </Text>
            </div>
          </div>

          {/* 右侧：歌词 */}
          {showLyrics && (
            <div style={{
              flex: '1', overflow: 'hidden',
              borderLeft: `1px solid ${tokens.border}`,
            }}>
              <SyncedLyrics
                songId={currentSong.id}
                currentTime={progress}
                onSeek={(t) => { seek(t); setProgress(t); }}
              />
            </div>
          )}
        </div>

        {/* 底部控制区 */}
        <div style={{ padding: '0 48px 40px', maxWidth: 700, margin: '0 auto', width: '100%' }}>
          {/* 进度条 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <Text style={{ color: tokens.textTertiary, fontSize: 12, width: 40, textAlign: 'right' }}>
              {formatTime(sliderValue)}
            </Text>
            <Slider
              value={sliderValue}
              max={duration || 1}
              onChange={(v: number) => { setIsDragging(true); setSliderValue(v); }}
              onAfterChange={(v: number) => { setIsDragging(false); seek(v); setProgress(v); }}
              styles={{
                track: { background: tokens.accent },
                rail: { background: tokens.border },
                handle: { borderColor: tokens.accent, background: tokens.accent },
              }}
              tooltip={{ formatter: null }}
            />
            <Text style={{ color: tokens.textTertiary, fontSize: 12, width: 40 }}>
              {formatTime(duration)}
            </Text>
          </div>

          {/* 控制按钮 */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
            <Button type="text" icon={modeIcon} onClick={cycleMode}
              style={{ color: tokens.textSecondary, fontSize: 18 }} />
            <Button type="text" icon={<StepBackwardOutlined />} onClick={playPrev}
              style={{ color: tokens.textPrimary, fontSize: 24 }} />
            <Button
              type="text"
              icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={togglePlay}
              style={{
                color: tokens.accent, fontSize: 52,
                filter: isPlaying ? `drop-shadow(0 0 12px ${tokens.accent})` : 'none',
              }}
            />
            <Button type="text" icon={<StepForwardOutlined />} onClick={playNext}
              style={{ color: tokens.textPrimary, fontSize: 24 }} />
            <Space size={8}>
              <SoundOutlined style={{ color: tokens.textSecondary }} />
              <Slider value={volume} max={1} step={0.01} onChange={setVolume}
                style={{ width: 80 }}
                styles={{ track: { background: tokens.accent }, rail: { background: tokens.border } }}
              />
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
}