package com.aitovoice.music.source;

/**
 * 外部音乐源的歌曲数据
 */
public record ExternalTrack(
        String sourceId,
        String source,
        String title,
        String artistName,
        String albumName,
        String coverUrl,
        String streamUrl,
        Integer durationSec,
        Integer playCount,
        String genre
) {}
