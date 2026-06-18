import { useState, useEffect } from 'react';
import { Button, Slider, Typography, Space, Image } from 'antd';
import {
  PlayCircleOutlined, PauseCircleOutlined,
  StepBackwardOutlined, StepForwardOutlined,
  SoundOutlined, ReloadOutlined,
  SwapOutlined, OrderedListOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { usePlayerStore } from '../../stores/playerStore';
import { useAudio } from '../../hooks/useAudio';
import LyricsDrawer from '../Lyrics/LyricsDrawer';

export default function PlayerBar() {
  const {
    currentSong, isPlaying, volume, progress, duration, playMode,
    togglePlay, setVolume, playNext, playPrev, setPlayMode, setProgress,
  } = usePlayerStore();
  const { seek } = useAudio();

  const [isDragging, setIsDragging] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [lyricsOpen, setLyricsOpen] = useState(false);

  // Sync slider from store when not dragging
  useEffect(() => {
    if (!isDragging) {
      setSliderValue(progress);
    }
  }, [progress, isDragging]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const cycleMode = () => {
    const modes: Array<'sequential' | 'shuffle' | 'repeat-one'> =
      ['sequential', 'shuffle', 'repeat-one'];
    const idx = modes.indexOf(playMode);
    setPlayMode(modes[(idx + 1) % modes.length]);
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
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 16px' }}>
        <Typography.Text style={{ color: '#6A6A6A' }}>选择一首歌曲开始播放</Typography.Text>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 16px', gap: 16 }}>
        {/* 歌曲信息 */}
        <Image src={currentSong.coverUrl} width={56} height={56} style={{ borderRadius: 4 }}
          fallback="data:image/png;base64,iVBORw0KGgo=" preview={false} />
        <div style={{ width: 160 }}>
          <Typography.Text strong style={{ color: '#fff', display: 'block' }} ellipsis>
            {currentSong.title}
          </Typography.Text>
          <Typography.Text style={{ color: '#B3B3B3', fontSize: 12 }} ellipsis>
            {currentSong.artistName}
          </Typography.Text>
        </div>

        {/* 播放控制 */}
        <Space>
          <Button type="text" icon={modeIcon} onClick={cycleMode} style={{ color: '#B3B3B3' }} />
          <Button type="text" icon={<StepBackwardOutlined />} onClick={playPrev} style={{ color: '#B3B3B3' }} />
          <Button type="text" icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={togglePlay} style={{ color: '#fff', fontSize: 28 }} />
          <Button type="text" icon={<StepForwardOutlined />} onClick={playNext} style={{ color: '#B3B3B3' }} />
        </Space>

        {/* 进度条 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Typography.Text style={{ color: '#B3B3B3', fontSize: 12, width: 40 }}>
            {formatTime(sliderValue)}
          </Typography.Text>
          <Slider
            value={sliderValue}
            max={duration}
            onChange={(v: number) => {
              setIsDragging(true);
              setSliderValue(v);
            }}
            onAfterChange={(v: number) => {
              setIsDragging(false);
              seek(v);
              setProgress(v);
            }}
            styles={{ track: { background: '#1DB954' }, rail: { background: '#404040' } }}
            tooltip={{ formatter: (v) => formatTime(v ?? 0) }} />
          <Typography.Text style={{ color: '#B3B3B3', fontSize: 12, width: 40 }}>
            {formatTime(duration)}
          </Typography.Text>
        </div>

        {/* 音量 + 歌词按钮 */}
        <Space>
          <SoundOutlined style={{ color: '#B3B3B3' }} />
          <Slider value={volume} max={1} step={0.01} onChange={setVolume}
            style={{ width: 100 }}
            styles={{ track: { background: '#1DB954' }, rail: { background: '#404040' } }} />
          <Button
            type="text"
            icon={<FileTextOutlined />}
            onClick={() => setLyricsOpen(!lyricsOpen)}
            style={{ color: lyricsOpen ? '#1DB954' : '#B3B3B3' }}
            title="歌词"
          />
        </Space>
      </div>

      <LyricsDrawer
        open={lyricsOpen}
        onClose={() => setLyricsOpen(false)}
        onSeek={handleLyricsSeek}
      />
    </>
  );
}
