package com.aitovoice.social.controller;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.social.dto.MessageDto;
import com.aitovoice.social.dto.SendMessageRequest;
import com.aitovoice.social.service.MessageService;
import com.aitovoice.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/{userId}")
    public ApiResponse<List<MessageDto>> getConversation(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId) {
        return ApiResponse.success(messageService.getConversation(user.getId(), userId));
    }

    @PostMapping("/{userId}")
    public ApiResponse<MessageDto> send(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId,
            @Valid @RequestBody SendMessageRequest request) {
        return ApiResponse.success(messageService.send(user.getId(), userId, request));
    }
}
