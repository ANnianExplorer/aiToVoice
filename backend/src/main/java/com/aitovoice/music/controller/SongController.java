package com.aitovoice.music.controller;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.music.dto.SongDto;
import com.aitovoice.music.dto.SongSearchRequest;
import com.aitovoice.music.service.SongService;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;

    @PostMapping("/upload")
    public ApiResponse<SongDto> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "artistId", required = false) Long artistId,
            @RequestParam(value = "genreId", required = false) Long genreId) {
        return ApiResponse.success(songService.upload(file, title, artistId, genreId));
    }

    @GetMapping("/search")
    public ApiResponse<?> search(SongSearchRequest request) {
        return ApiResponse.success(songService.search(request));
    }

    @GetMapping("/hot")
    public ApiResponse<List<SongDto>> hot(@RequestParam(defaultValue = "50") int limit) {
        return ApiResponse.success(songService.getHotSongs(limit));
    }

    @GetMapping("/new")
    public ApiResponse<List<SongDto>> newSongs(@RequestParam(defaultValue = "50") int limit) {
        return ApiResponse.success(songService.getNewSongs(limit));
    }

    @GetMapping("/{id}")
    public ApiResponse<SongDto> getSong(@PathVariable Long id) {
        return ApiResponse.success(songService.getSong(id));
    }

    @PostMapping("/{id}/play")
    public ApiResponse<Void> recordPlay(@AuthenticationPrincipal User user, @PathVariable Long id) {
        songService.recordPlay(user.getId(), id);
        return ApiResponse.success(null);
    }

    @PostMapping("/{id}/favorite")
    public ApiResponse<Void> favorite(@AuthenticationPrincipal User user, @PathVariable Long id) {
        songService.toggleFavorite(user.getId(), id);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}/favorite")
    public ApiResponse<Void> unfavorite(@AuthenticationPrincipal User user, @PathVariable Long id) {
        songService.toggleFavorite(user.getId(), id);
        return ApiResponse.success(null);
    }

    @GetMapping("/favorites")
    public ApiResponse<List<SongDto>> favorites(@AuthenticationPrincipal User user) {
        return ApiResponse.success(songService.getFavorites(user.getId()));
    }

    @GetMapping("/history")
    public ApiResponse<List<SongDto>> history(@AuthenticationPrincipal User user) {
        return ApiResponse.success(songService.getHistory(user.getId()));
    }
}
