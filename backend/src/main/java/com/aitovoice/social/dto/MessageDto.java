package com.aitovoice.social.dto;

import java.time.LocalDateTime;

public record MessageDto(
        Long id, Long senderId, Long receiverId, String content,
        String msgType, Long refId, Boolean isRead, LocalDateTime createdAt
) {}
