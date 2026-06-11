package com.aitovoice.recommend.dto;

import com.aitovoice.music.dto.SongDto;

public record RecommendDto(
        SongDto song,
        double score,
        String reason,
        String algorithm
) {}
