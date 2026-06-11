package com.aitovoice.ai;

import com.aitovoice.ai.dto.*;
import com.aitovoice.common.ApiResponse;
import com.aitovoice.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/sessions")
    public ApiResponse<AiSessionDto> createSession(
            @AuthenticationPrincipal User user,
            @RequestBody CreateSessionRequest request) {
        return ApiResponse.success(aiService.createSession(user.getId(), request));
    }

    @GetMapping("/sessions")
    public ApiResponse<List<AiSessionDto>> mySessions(@AuthenticationPrincipal User user) {
        return ApiResponse.success(aiService.getUserSessions(user.getId()));
    }

    @GetMapping("/sessions/{id}/messages")
    public ApiResponse<List<AiMessageDto>> sessionMessages(@PathVariable Long id) {
        return ApiResponse.success(aiService.getSessionMessages(id));
    }

    @PostMapping("/sessions/{id}/messages")
    public ApiResponse<AiMessageDto> sendMessage(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody SendMessageRequest request) {
        return ApiResponse.success(aiService.sendMessage(id, user.getId(), request));
    }
}
