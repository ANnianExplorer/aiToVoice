package com.aitovoice.user.controller;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.user.dto.UserSettingsDto;
import com.aitovoice.user.entity.User;
import com.aitovoice.user.service.UserSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class UserSettingsController {

    private final UserSettingsService settingsService;

    @GetMapping
    public ApiResponse<UserSettingsDto> get(@AuthenticationPrincipal User user) {
        return ApiResponse.success(settingsService.getSettings(user.getId()));
    }

    @PutMapping
    public ApiResponse<UserSettingsDto> update(
            @AuthenticationPrincipal User user,
            @RequestBody UserSettingsDto dto) {
        return ApiResponse.success(settingsService.updateSettings(user.getId(), dto));
    }
}
