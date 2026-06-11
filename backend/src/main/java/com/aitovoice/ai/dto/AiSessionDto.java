package com.aitovoice.ai.dto;

import java.time.LocalDateTime;

public record AiSessionDto(
        Long id, String title, String sessionType,
        String summary, LocalDateTime createdAt
) {}
