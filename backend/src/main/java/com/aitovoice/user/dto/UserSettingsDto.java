package com.aitovoice.user.dto;

public record UserSettingsDto(
        String theme,
        String language,
        String audioOutputDevice,
        String audioQuality,
        Boolean crossfadeEnabled,
        Integer crossfadeDuration,
        String hotkeyConfig,
        Integer lyricFontSize,
        Boolean lyricDesktopEnabled,
        Boolean notificationEnabled,
        Integer cacheMaxMb,
        Boolean autoPlayOnLaunch
) {}
