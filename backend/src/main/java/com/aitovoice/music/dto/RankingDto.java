package com.aitovoice.music.dto;

public record RankingDto(
        Integer rankPosition,
        SongDto song,
        Double score
) {}
