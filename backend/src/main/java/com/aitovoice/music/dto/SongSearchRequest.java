package com.aitovoice.music.dto;

public record SongSearchRequest(
        String keyword,
        Long genreId,
        int page,
        int size
) {
    public SongSearchRequest {
        if (page < 0) page = 0;
        if (size <= 0 || size > 100) size = 20;
    }
}
