package com.aitovoice.user.dto;

import java.time.LocalDateTime;

public record UserDto(
        Long id,
        String username,
        String email,
        String nickname,
        String avatarUrl,
        String role,
        String status,
        LocalDateTime createdAt
) {}
