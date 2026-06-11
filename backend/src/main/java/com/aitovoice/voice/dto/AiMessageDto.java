package com.aitovoice.voice.dto;

import java.time.LocalDateTime;

public record AiMessageDto(
        Long id, String role, String content, String msgType,
        String metadata, LocalDateTime createdAt
) {}
