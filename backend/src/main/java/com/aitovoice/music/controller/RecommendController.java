package com.aitovoice.music.controller;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.music.dto.SongDto;
import com.aitovoice.music.dto.RecommendDto;
import com.aitovoice.music.service.RecommendService;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommend")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    @GetMapping("/daily")
    public ApiResponse<List<RecommendDto>> daily(@AuthenticationPrincipal User user) {
        return ApiResponse.success(recommendService.getDailyRecommend(user.getId()));
    }

    @GetMapping("/fm")
    public ApiResponse<SongDto> fm(@AuthenticationPrincipal User user) {
        return ApiResponse.success(recommendService.getRandomForFM(user.getId()));
    }

    @GetMapping("/similar/{songId}")
    public ApiResponse<List<SongDto>> similar(@PathVariable Long songId) {
        return ApiResponse.success(recommendService.getSimilar(songId));
    }

    @PostMapping("/feedback")
    public ApiResponse<Void> feedback(
            @AuthenticationPrincipal User user,
            @RequestParam Long songId,
            @RequestParam boolean liked) {
        recommendService.feedback(user.getId(), songId, liked);
        return ApiResponse.success(null);
    }
}
