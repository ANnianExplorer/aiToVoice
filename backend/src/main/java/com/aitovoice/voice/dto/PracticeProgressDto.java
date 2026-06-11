package com.aitovoice.voice.dto;

import java.time.LocalDateTime;

public record PracticeProgressDto(
        Long id, Long exerciseId, String exerciseTitle,
        String status, Integer attemptsCount, Integer bestScore,
        Integer latestScore, Integer practiceMinutes,
        LocalDateTime startedAt, LocalDateTime completedAt
) {}
