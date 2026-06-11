package com.aitovoice.user.dto;

import java.time.LocalDateTime;

public record UserProfileDto(
        Long id,
        String username,
        String email,
        String avatarUrl,
        String nickname,
        String bio,
        String role,
        LocalDateTime createdAt
) {}
