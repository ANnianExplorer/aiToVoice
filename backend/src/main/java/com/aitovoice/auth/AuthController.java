package com.aitovoice.auth;

import com.aitovoice.auth.dto.AuthResponse;
import com.aitovoice.auth.dto.LoginRequest;
import com.aitovoice.auth.dto.RegisterRequest;
import com.aitovoice.common.ApiResponse;
import com.aitovoice.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success("注册成功", authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("登录成功", authService.login(request));
    }

    @GetMapping("/me")
    public ApiResponse<User> me(@AuthenticationPrincipal User user) {
        return ApiResponse.success(user);
    }
}
