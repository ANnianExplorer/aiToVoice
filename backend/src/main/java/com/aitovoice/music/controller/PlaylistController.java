package com.aitovoice.music.controller;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.music.dto.SongDto;
import com.aitovoice.music.dto.CreatePlaylistRequest;
import com.aitovoice.music.dto.PlaylistDto;
import com.aitovoice.music.service.PlaylistService;
import com.aitovoice.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;

    @PostMapping
    public ApiResponse<PlaylistDto> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreatePlaylistRequest request) {
        return ApiResponse.success(playlistService.create(user.getId(), request));
    }

    @GetMapping("/{id}")
    public ApiResponse<PlaylistDto> getById(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ApiResponse.success(playlistService.getById(id, user != null ? user.getId() : null));
    }

    @GetMapping("/my")
    public ApiResponse<List<PlaylistDto>> my(@AuthenticationPrincipal User user) {
        return ApiResponse.success(playlistService.getMyPlaylists(user.getId()));
    }

    @GetMapping("/{id}/songs")
    public ApiResponse<List<SongDto>> songs(@PathVariable Long id) {
        return ApiResponse.success(playlistService.getPlaylistSongs(id));
    }

    @PostMapping("/{id}/songs/{songId}")
    public ApiResponse<Void> addSong(
            @AuthenticationPrincipal User user,
            @PathVariable Long id, @PathVariable Long songId) {
        playlistService.addSong(id, songId, user.getId());
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}/songs/{songId}")
    public ApiResponse<Void> removeSong(
            @AuthenticationPrincipal User user,
            @PathVariable Long id, @PathVariable Long songId) {
        playlistService.removeSong(id, songId, user.getId());
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        playlistService.delete(id, user.getId());
        return ApiResponse.success(null);
    }
}
