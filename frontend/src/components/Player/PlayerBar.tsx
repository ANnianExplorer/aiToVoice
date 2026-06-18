import { useState, useEffect } from 'react';
import { Button, Slider, Typography, Space } from 'antd';

const { Text } = Typography;
import {
  PlayCircleOutlined, PauseCircleOutlined,
  StepBackwardOutlined, StepForwardOutlined,
  SoundOutlined, ReloadOutlined,
  SwapOutlined, OrderedListOutlined,
  FileTextOutlined, ExpandOutlined,
} from '@ant-design/icons';
import { usePlayerStore } from '../../stores/playerStore';
import { useAudio } from '../../hooks/useAudio';
import { useTheme } from '../../theme/ThemeProvider';
import LyricsDrawer from '../Lyrics/LyricsDrawer';
import FullScreenPlayer from './FullScreenPlayer';

export default function PlayerBar() {
  const {
    currentSong, isPlaying, volume, progress, duration, playMode,
    togglePlay, setVolume, playNext, playPrev, setPlayMode, setProgress,
  } = usePlayerStore();
  const { seek } = useAudio();
  const { tokens } = useTheme();

  const [isDragging, setIsDragging] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

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

  const handleLyricsSeek = (timeSec: number) => {
    seek(timeSec);
    setProgress(timeSec);
  };

  if (!currentSong) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 24px' }}>
        <Text style={{ color: tokens.textTertiary, fontSize: 15 }}>
          ♪ 选择一首歌曲开始播放
        </Text>
      </div>
    );
  }

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', height: '100%',
        padding: '0 16px', gap: 16,
      }}>
        {/* 歌曲信息 — 点击展开全屏 */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', minWidth: 0 }}
          onClick={() => setFullScreen(true)}
        >
          {/* 用原生 img 替代 Ant Design Image，避免点击事件被拦截 */}
          <img
            src={currentSong.coverUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='52'%3E%3Crect fill='%23282828' width='52' height='52' rx='4'/%3E%3Ccircle cx='26' cy='26' r='10' fill='%231DB954'/%3E%3C/svg%3E"}
            alt={currentSong.title}
            style={{
              width: 52, height: 52,
              borderRadius: tokens.borderRadius,
              flexShrink: 0,
              objectFit: 'cover',
            }}
          />
          <div style={{ minWidth: 0, maxWidth: 160 }}>
            <Text strong style={{ color: tokens.textPrimary, display: 'block', fontSize: 14 }} ellipsis>
              {currentSong.title}
            </Text>
            <Text style={{ color: tokens.textSecondary, fontSize: 12, display: 'block' }} ellipsis>
              {currentSong.artistName}
            </Text>
          </div>
        </div>

        {/* 播放控制 */}
        <Space size={4}>
          <Button type="text" icon={modeIcon} onClick={cycleMode}
            style={{ color: tokens.textSecondary }} />
          <Button type="text" icon={<StepBackwardOutlined />} onClick={playPrev}
            style={{ color: tokens.textSecondary }} />
          <Button type="text"
            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={togglePlay}
            style={{ color: tokens.textPrimary, fontSize: 28 }} />
          <Button type="text" icon={<StepForwardOutlined />} onClick={playNext}
            style={{ color: tokens.textSecondary }} />
        </Space>

        {/* 进度条 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <Text style={{ color: tokens.textTertiary, fontSize: 12, width: 36, textAlign: 'right', flexShrink: 0 }}>
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
            }}
            tooltip={{ formatter: (v) => formatTime(v ?? 0) }}
          />
          <Text style={{ color: tokens.textTertiary, fontSize: 12, width: 36, flexShrink: 0 }}>
            {formatTime(duration)}
          </Text>
        </div>

        {/* 右侧按钮 */}
        <Space size={4}>
          <SoundOutlined style={{ color: tokens.textSecondary }} />
          <Slider value={volume} max={1} step={0.01} onChange={setVolume}
            style={{ width: 80 }}
            styles={{ track: { background: tokens.accent }, rail: { background: tokens.border } }}
          />
          <Button type="text" icon={<FileTextOutlined />}
            onClick={() => setLyricsOpen(!lyricsOpen)}
            style={{ color: lyricsOpen ? tokens.accent : tokens.textSecondary }}
            title="歌词" />
          <Button type="text" icon={<ExpandOutlined />}
            onClick={() => setFullScreen(true)}
            style={{ color: tokens.textSecondary }}
            title="全屏" />
        </Space>
      </div>

      <LyricsDrawer
        open={lyricsOpen}
        onClose={() => setLyricsOpen(false)}
        onSeek={handleLyricsSeek}
      />

      <FullScreenPlayer
        open={fullScreen}
        onClose={() => setFullScreen(false)}
      />
    </>
  );
}
