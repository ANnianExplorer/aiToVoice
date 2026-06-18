package com.aitovoice.auth;

import com.aitovoice.auth.dto.AuthResponse;
import com.aitovoice.auth.dto.LoginRequest;
import com.aitovoice.auth.dto.RegisterRequest;
import com.aitovoice.common.ApiResponse;
import com.aitovoice.user.dto.UserDto;
import com.aitovoice.user.entity.User;
import com.aitovoice.user.mapper.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "认证", description = "用户注册、登录、Token 管理")
public class AuthController {

    private final AuthService authService;
    private final UserMapper userMapper;

    @Operation(summary = "用户注册", description = "注册新用户账号")
    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success("注册成功", authService.register(request));
    }

    @Operation(summary = "用户登录", description = "用户名密码登录，返回 JWT Token")
    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("登录成功", authService.login(request));
    }

    @Operation(summary = "获取当前用户", description = "根据 Token 获取当前登录用户信息")
    @GetMapping("/me")
    public ApiResponse<UserDto> me(@AuthenticationPrincipal User user) {
        return ApiResponse.success(userMapper.toDto(user));
    }

    @Operation(summary = "刷新 Token", description = "使用 Refresh Token 获取新的 Access Token")
    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@RequestParam String refreshToken) {
        return ApiResponse.success(authService.refresh(refreshToken));
    }
}
