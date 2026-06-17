package com.aitovoice.voice.dto;

import java.time.LocalDateTime;

public record VoiceExerciseDto(
        Long id,
        String title,
        String description,
        String type,
        Integer difficulty,
        String audioExamplePath,
        String instructions,
        Integer durationSec,
        Integer sortOrder,
        LocalDateTime createdAt
) {}
