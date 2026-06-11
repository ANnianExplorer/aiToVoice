package com.aitovoice.social.dto;

import jakarta.validation.constraints.NotBlank;

public record SendMessageRequest(
        @NotBlank String content,
        String msgType,
        Long refId
) {}
