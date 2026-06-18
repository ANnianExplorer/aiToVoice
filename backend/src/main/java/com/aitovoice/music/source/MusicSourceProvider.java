package com.aitovoice.music.source;

import java.util.List;

/**
 * 音乐源提供者接口
 * 各外部音乐源（Audius、Netease、Jamendo）实现此接口
 */
public interface MusicSourceProvider {

    /** 提供者名称 */
    String getName();

    /** 搜索歌曲 */
    List<ExternalTrack> search(String keyword, int limit);

    /** 获取热门歌曲 */
    List<ExternalTrack> getTrending(int limit);

    /** 根据 ID 获取歌曲详情 */
    ExternalTrack getTrackDetail(String trackId);

    /** 获取流式播放 URL */
    String getStreamUrl(String trackId);

    /** 是否可用（配置是否完整） */
    boolean isAvailable();
}
