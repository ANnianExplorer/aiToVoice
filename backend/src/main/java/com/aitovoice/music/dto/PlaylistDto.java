package com.aitovoice.music.dto;

import java.time.LocalDateTime;

public record PlaylistDto(
        Long id, Long userId, String name, String description,
        String coverUrl, Boolean isPublic, Long playCount,
        Integer songCount, LocalDateTime createdAt
) {}
