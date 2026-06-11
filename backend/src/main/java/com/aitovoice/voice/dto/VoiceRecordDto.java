package com.aitovoice.voice.dto;

import java.time.LocalDateTime;

public record VoiceRecordDto(
        Long id, Long userId, Long songId, String filePath,
        Integer durationSec, String pitchData, Integer score,
        String feedbackText, LocalDateTime createdAt
) {}
