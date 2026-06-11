package com.aitovoice.social.dto;

import java.time.LocalDateTime;

public record CommentDto(
        Long id, Long userId, String username, String avatarUrl,
        Long songId, Long parentId, String content, Long likesCount,
        LocalDateTime createdAt
) {}
