package com.aitovoice.music.dto;

public record RecommendDto(
        SongDto song,
        double score,
        String reason,
        String algorithm
) {}
