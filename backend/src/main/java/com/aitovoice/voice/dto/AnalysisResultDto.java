package com.aitovoice.voice.dto;

public record AnalysisResultDto(
        double averagePitch,
        double maxPitch,
        double minPitch,
        int stabilityScore,
        int rhythmScore,
        int overallScore,
        String feedback
) {}
