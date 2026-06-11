package com.aitovoice.social.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCommentRequest(
        @NotBlank String content,
        Long parentId
) {}
