import { useEffect, useRef, useState, useCallback } from 'react';
import { Spin, Typography } from 'antd';
import { parseLrc, findCurrentLine, type LyricLine } from '../../utils/lrcParser';
import { getLyrics } from '../../api/lyrics';

const { Text } = Typography;

interface SyncedLyricsProps {
  songId: number | null;
  currentTime: number; // 秒
  onSeek?: (timeMs: number) => void;
}

export default function SyncedLyrics({ songId, currentTime, onSeek }: SyncedLyricsProps) {
  const [lines, setLines] = useState<LyricLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 加载歌词
  useEffect(() => {
    if (!songId) {
      setLines([]);
      setActiveIndex(-1);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getLyrics(songId)
      .then((raw) => {
        if (cancelled) return;
        const parsed = parseLrc(raw || '');
        setLines(parsed);
        setActiveIndex(-1);
      })
      .catch(() => {
        if (!cancelled) {
          setLines([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [songId]);

  // 更新当前行
  useEffect(() => {
    if (lines.length === 0) return;
    const currentTimeMs = currentTime * 1000;
    const idx = findCurrentLine(lines, currentTimeMs);
    setActiveIndex(idx);
  }, [currentTime, lines]);

  // 自动滚动到当前行
  useEffect(() => {
    if (activeIndex < 0 || !containerRef.current) return;
    const activeLine = lineRefs.current[activeIndex];
    if (!activeLine) return;

    const container = containerRef.current;
    const containerHeight = container.clientHeight;
    const lineTop = activeLine.offsetTop;
    const lineHeight = activeLine.clientHeight;
    const scrollTarget = lineTop - containerHeight / 2 + lineHeight / 2;

    container.scrollTo({
      top: scrollTarget,
      behavior: 'smooth',
    });
  }, [activeIndex]);

  const handleClick = useCallback((index: number) => {
    if (onSeek && lines[index]) {
      onSeek(lines[index].time / 1000);
    }
  }, [onSeek, lines]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Text style={{ color: '#B3B3B3', fontSize: 16 }}>暂无歌词</Text>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        height: '100%',
        overflowY: 'auto',
        padding: '40px 0',
        scrollBehavior: 'smooth',
        /* 隐藏滚动条 */
        scrollbarWidth: 'none',
      }}
    >
      {/* 顶部留白，让第一行可以滚到中间 */}
      <div style={{ height: '40%' }} />

      {lines.map((line, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={`${line.time}-${i}`}
            ref={(el) => { lineRefs.current[i] = el; }}
            onClick={() => handleClick(i)}
            style={{
              padding: '8px 24px',
              cursor: onSeek ? 'pointer' : 'default',
              transition: 'all 0.3s ease',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <Text
              style={{
                fontSize: isActive ? 20 : 15,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                lineHeight: 1.8,
                display: 'block',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              {line.text}
            </Text>
          </div>
        );
      })}

      {/* 底部留白 */}
      <div style={{ height: '40%' }} />
    </div>
  );
}
