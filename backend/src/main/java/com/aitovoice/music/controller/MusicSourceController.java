package com.aitovoice.music.controller;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.music.source.ExternalTrack;
import com.aitovoice.music.source.MusicSourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 外部音乐源 API
 */
@RestController
@RequestMapping("/api/music-source")
@RequiredArgsConstructor
public class MusicSourceController {

    private final MusicSourceService musicSourceService;

    /** 搜索外部音乐源 */
    @GetMapping("/search")
    public ApiResponse<List<ExternalTrack>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "20") int limit) {
        return ApiResponse.success(musicSourceService.searchAll(keyword, limit));
    }

    /** 获取热门歌曲 */
    @GetMapping("/trending")
    public ApiResponse<List<ExternalTrack>> trending(
            @RequestParam(defaultValue = "20") int limit) {
        return ApiResponse.success(musicSourceService.getTrending(limit));
    }

    /** 获取流式播放 URL */
    @GetMapping("/stream")
    public ApiResponse<String> streamUrl(
            @RequestParam String source,
            @RequestParam String trackId) {
        var url = musicSourceService.getStreamUrl(source, trackId);
        return ApiResponse.success(url);
    }

    /** 获取歌曲详情 */
    @GetMapping("/track")
    public ApiResponse<ExternalTrack> trackDetail(
            @RequestParam String source,
            @RequestParam String trackId) {
        return ApiResponse.success(musicSourceService.getTrackDetail(source, trackId));
    }

    /** 获取可用源列表 */
    @GetMapping("/sources")
    public ApiResponse<List<String>> availableSources() {
        return ApiResponse.success(musicSourceService.getAvailableSources());
    }
}
