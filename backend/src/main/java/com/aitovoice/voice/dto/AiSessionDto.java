package com.aitovoice.voice.dto;

import java.time.LocalDateTime;

public record AiSessionDto(
        Long id, String title, String sessionType,
        String summary, LocalDateTime createdAt
) {}
