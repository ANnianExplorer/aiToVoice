import { Drawer } from 'antd';
import SyncedLyrics from './SyncedLyrics';
import { usePlayerStore } from '../../stores/playerStore';

interface LyricsDrawerProps {
  open: boolean;
  onClose: () => void;
  onSeek?: (timeSec: number) => void;
}

export default function LyricsDrawer({ open, onClose, onSeek }: LyricsDrawerProps) {
  const { currentSong, progress } = usePlayerStore();

  return (
    <Drawer
      title={currentSong ? `${currentSong.title} - ${currentSong.artistName}` : '歌词'}
      placement="bottom"
      height="60vh"
      open={open}
      onClose={onClose}
      styles={{
        header: { background: '#181818', borderBottom: '1px solid #282828', color: '#fff' },
        body: { background: '#121212', padding: 0 },
      }}
      closeIcon={<span style={{ color: '#B3B3B3', fontSize: 18 }}>✕</span>}
    >
      <SyncedLyrics
        songId={currentSong?.id ?? null}
        currentTime={progress}
        onSeek={onSeek}
      />
    </Drawer>
  );
}
