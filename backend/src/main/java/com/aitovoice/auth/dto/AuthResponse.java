package com.aitovoice.auth.dto;

import com.aitovoice.user.dto.UserProfileDto;

public record AuthResponse(
        String token,
        String refreshToken,
        UserProfileDto user
) {}
