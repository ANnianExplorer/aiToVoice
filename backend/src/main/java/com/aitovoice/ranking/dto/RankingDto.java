package com.aitovoice.ranking.dto;

import com.aitovoice.music.dto.SongDto;

public record RankingDto(
        Integer rankPosition,
        SongDto song,
        Double score
) {}
