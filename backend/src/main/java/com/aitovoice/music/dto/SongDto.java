package com.aitovoice.music.dto;

public record SongDto(
        Long id,
        String title,
        String artistName,
        String albumName,
        String genreName,
        Integer duration,
        String coverUrl,
        String filePath,
        String sourceType,
        Long playCount,
        Long likeCount
) {}
