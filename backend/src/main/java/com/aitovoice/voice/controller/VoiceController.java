package com.aitovoice.voice.controller;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.voice.dto.AnalysisResultDto;
import com.aitovoice.voice.dto.PracticeProgressDto;
import com.aitovoice.voice.dto.VoiceRecordDto;
import com.aitovoice.voice.service.VoiceService;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/voice")
@RequiredArgsConstructor
public class VoiceController {

    private final VoiceService voiceService;

    @PostMapping("/record")
    public ApiResponse<VoiceRecordDto> upload(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "songId", required = false) Long songId) {
        return ApiResponse.success(voiceService.uploadRecord(user.getId(), file, songId));
    }

    @GetMapping("/records")
    public ApiResponse<List<VoiceRecordDto>> myRecords(@AuthenticationPrincipal User user) {
        return ApiResponse.success(voiceService.getUserRecords(user.getId()));
    }

    @PostMapping("/records/{id}/analyze")
    public ApiResponse<AnalysisResultDto> analyze(@PathVariable Long id) {
        return ApiResponse.success(voiceService.analyzeRecord(id));
    }

    @GetMapping("/progress")
    public ApiResponse<List<PracticeProgressDto>> myProgress(@AuthenticationPrincipal User user) {
        return ApiResponse.success(voiceService.getUserProgress(user.getId()));
    }

    @PostMapping("/progress/{exerciseId}/submit")
    public ApiResponse<PracticeProgressDto> submit(
            @AuthenticationPrincipal User user,
            @PathVariable Long exerciseId,
            @RequestParam("recordId") Long recordId) {
        return ApiResponse.success(voiceService.submitPractice(user.getId(), exerciseId, recordId));
    }
}
