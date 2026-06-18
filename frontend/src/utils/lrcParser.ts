/** 解析后的歌词行 */
export interface LyricLine {
  /** 时间点（毫秒） */
  time: number;
  /** 歌词文本 */
  text: string;
}

/** LRC 时间标签正则：[mm:ss.xx] 或 [mm:ss.xxx] */
const LRC_TIME_RE = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/g;

/**
 * 解析 LRC 格式歌词
 * 支持 [mm:ss.xx] 和 [mm:ss.xxx] 两种精度
 * 2位数字=百分秒，3位数字=毫秒
 */
export function parseLrc(lrc: string): LyricLine[] {
  if (!lrc) return [];

  const lines: LyricLine[] = [];
  const msMultiplier: Record<number, number> = { 2: 10, 3: 1 };

  for (const rawLine of lrc.split('\n')) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    let match: RegExpExecArray | null;
    // 一行可能有多个时间标签 [00:10.00][00:20.00]你好
    const timeTags: number[] = [];

    // 重置 lastIndex
    LRC_TIME_RE.lastIndex = 0;
    while ((match = LRC_TIME_RE.exec(trimmed)) !== null) {
      const min = parseInt(match[1], 10);
      const sec = parseInt(match[2], 10);
      const msStr = match[3];
      const ms = parseInt(msStr, 10) * (msMultiplier[msStr.length] ?? 1);
      timeTags.push((min * 60 + sec) * 1000 + ms);
    }

    // 提取歌词文本（最后一个 ] 之后的内容）
    const lastBracket = trimmed.lastIndexOf(']');
    const text = lastBracket >= 0 ? trimmed.slice(lastBracket + 1).trim() : '';

    if (!text) continue;

    for (const time of timeTags) {
      lines.push({ time, text });
    }
  }

  // 按时间排序
  lines.sort((a, b) => a.time - b.time);
  return lines;
}

/**
 * 根据当前播放时间找到对应的歌词行索引
 * 返回最后一个 time <= currentTime 的索引
 */
export function findCurrentLine(lines: LyricLine[], currentTimeMs: number): number {
  if (lines.length === 0) return -1;

  let lo = 0;
  let hi = lines.length - 1;
  let result = -1;

  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (lines[mid].time <= currentTimeMs) {
      result = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return result;
}
