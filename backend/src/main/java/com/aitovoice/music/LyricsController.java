package com.aitovoice.music;

import com.aitovoice.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/songs/{songId}/lyrics")
@RequiredArgsConstructor
public class LyricsController {

    private final LyricsService lyricsService;

    @GetMapping
    public ApiResponse<String> getLyrics(@PathVariable Long songId) {
        return ApiResponse.success(lyricsService.getLyrics(songId));
    }

    @GetMapping("/parsed")
    public ApiResponse<Map<Long, String>> getParsedLyrics(@PathVariable Long songId) {
        var raw = lyricsService.getLyrics(songId);
        return ApiResponse.success(lyricsService.parseLrc(raw));
    }

    @PostMapping
    public ApiResponse<Void> saveLyrics(
            @PathVariable Long songId,
            @RequestBody String content,
            @RequestParam(defaultValue = "manual") String source) {
        lyricsService.saveLyrics(songId, content, source);
        return ApiResponse.success(null);
    }
}
