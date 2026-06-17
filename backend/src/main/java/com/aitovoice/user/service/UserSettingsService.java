package com.aitovoice.user.service;

import com.aitovoice.user.dto.UserSettingsDto;
import com.aitovoice.user.entity.User;
import com.aitovoice.user.entity.UserSettings;
import com.aitovoice.user.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserSettingsService {

    private final UserSettingsRepository settingsRepository;

    @Transactional(readOnly = true)
    public UserSettingsDto getSettings(Long userId) {
        var settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> createDefault(userId));
        return toDto(settings);
    }

    @Transactional
    public UserSettingsDto updateSettings(Long userId, UserSettingsDto dto) {
        var settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> createDefault(userId));

        if (dto.theme() != null) settings.setTheme(UserSettings.Theme.valueOf(dto.theme()));
        if (dto.language() != null) settings.setLanguage(dto.language());
        if (dto.audioOutputDevice() != null) settings.setAudioOutputDevice(dto.audioOutputDevice());
        if (dto.audioQuality() != null) settings.setAudioQuality(dto.audioQuality());
        if (dto.crossfadeEnabled() != null) settings.setCrossfadeEnabled(dto.crossfadeEnabled());
        if (dto.crossfadeDuration() != null) settings.setCrossfadeDuration(dto.crossfadeDuration());
        if (dto.hotkeyConfig() != null) settings.setHotkeyConfig(dto.hotkeyConfig());
        if (dto.lyricFontSize() != null) settings.setLyricFontSize(dto.lyricFontSize());
        if (dto.lyricDesktopEnabled() != null) settings.setLyricDesktopEnabled(dto.lyricDesktopEnabled());
        if (dto.notificationEnabled() != null) settings.setNotificationEnabled(dto.notificationEnabled());
        if (dto.cacheMaxMb() != null) settings.setCacheMaxMb(dto.cacheMaxMb());
        if (dto.autoPlayOnLaunch() != null) settings.setAutoPlayOnLaunch(dto.autoPlayOnLaunch());

        settingsRepository.save(settings);
        return toDto(settings);
    }

    private UserSettings createDefault(Long userId) {
        var settings = UserSettings.builder()
                .user(User.builder().id(userId).build())
                .build();
        return settingsRepository.save(settings);
    }

    private UserSettingsDto toDto(UserSettings s) {
        return new UserSettingsDto(
                s.getTheme().name(), s.getLanguage(), s.getAudioOutputDevice(),
                s.getAudioQuality(), s.getCrossfadeEnabled(), s.getCrossfadeDuration(),
                s.getHotkeyConfig(), s.getLyricFontSize(), s.getLyricDesktopEnabled(),
                s.getNotificationEnabled(), s.getCacheMaxMb(), s.getAutoPlayOnLaunch());
    }
}
