package com.aitovoice.music.controller;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.music.dto.SongDto;
import com.aitovoice.music.dto.SongSearchRequest;
import com.aitovoice.music.service.SongService;
import com.aitovoice.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
@Tag(name = "歌曲", description = "歌曲上传、搜索、收藏、播放历史")
public class SongController {

    private final SongService songService;

    @Operation(summary = "上传歌曲", description = "上传音频文件并创建歌曲记录")
    @PostMapping("/upload")
    public ApiResponse<SongDto> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "artistId", required = false) Long artistId,
            @RequestParam(value = "genreId", required = false) Long genreId) {
        return ApiResponse.success(songService.upload(file, title, artistId, genreId));
    }

    @Operation(summary = "搜索歌曲", description = "按关键词、歌手、流派搜索歌曲")
    @GetMapping("/search")
    public ApiResponse<?> search(SongSearchRequest request) {
        return ApiResponse.success(songService.search(request));
    }

    @Operation(summary = "热门歌曲", description = "获取播放量最高的歌曲列表")
    @GetMapping("/hot")
    public ApiResponse<List<SongDto>> hot(@RequestParam(defaultValue = "50") int limit) {
        return ApiResponse.success(songService.getHotSongs(limit));
    }

    @Operation(summary = "最新歌曲", description = "获取最新上传的歌曲列表")
    @GetMapping("/new")
    public ApiResponse<List<SongDto>> newSongs(@RequestParam(defaultValue = "50") int limit) {
        return ApiResponse.success(songService.getNewSongs(limit));
    }

    @Operation(summary = "获取歌曲详情", description = "根据 ID 获取歌曲详细信息")
    @GetMapping("/{id}")
    public ApiResponse<SongDto> getSong(@PathVariable Long id) {
        return ApiResponse.success(songService.getSong(id));
    }

    @Operation(summary = "记录播放", description = "记录用户播放歌曲，增加播放计数")
    @PostMapping("/{id}/play")
    public ApiResponse<Void> recordPlay(@AuthenticationPrincipal User user, @PathVariable Long id) {
        songService.recordPlay(user.getId(), id);
        return ApiResponse.success(null);
    }

    @Operation(summary = "收藏歌曲", description = "收藏指定歌曲")
    @PostMapping("/{id}/favorite")
    public ApiResponse<Void> favorite(@AuthenticationPrincipal User user, @PathVariable Long id) {
        songService.toggleFavorite(user.getId(), id);
        return ApiResponse.success(null);
    }

    @Operation(summary = "取消收藏", description = "取消收藏指定歌曲")
    @DeleteMapping("/{id}/favorite")
    public ApiResponse<Void> unfavorite(@AuthenticationPrincipal User user, @PathVariable Long id) {
        songService.toggleFavorite(user.getId(), id);
        return ApiResponse.success(null);
    }

    @Operation(summary = "收藏列表", description = "获取当前用户收藏的歌曲列表")
    @GetMapping("/favorites")
    public ApiResponse<List<SongDto>> favorites(@AuthenticationPrincipal User user) {
        return ApiResponse.success(songService.getFavorites(user.getId()));
    }

    @Operation(summary = "播放历史", description = "获取当前用户的播放历史记录")
    @GetMapping("/history")
    public ApiResponse<List<SongDto>> history(@AuthenticationPrincipal User user) {
        return ApiResponse.success(songService.getHistory(user.getId()));
    }
}
