package com.aitovoice.music.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePlaylistRequest(
        @NotBlank @Size(max = 200) String name,
        @Size(max = 1000) String description,
        Boolean isPublic
) {}
