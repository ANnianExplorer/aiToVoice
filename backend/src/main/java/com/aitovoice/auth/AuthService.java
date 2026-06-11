package com.aitovoice.auth;

import com.aitovoice.auth.dto.AuthResponse;
import com.aitovoice.auth.dto.LoginRequest;
import com.aitovoice.auth.dto.RegisterRequest;
import com.aitovoice.common.BusinessException;
import com.aitovoice.common.ErrorCode;
import com.aitovoice.user.UserMapper;
import com.aitovoice.user.UserRepository;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new BusinessException(ErrorCode.USER_ALREADY_EXISTS);
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException(ErrorCode.USER_EMAIL_EXISTS);
        }

        var user = User.builder()
                .username(request.username())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .nickname(request.username())
                .build();

        userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        var user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.AUTH_INVALID_CREDENTIALS);
        }

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        var token = tokenProvider.generateToken(user.getId(), user.getUsername());
        var refreshToken = tokenProvider.generateRefreshToken(user.getId(), user.getUsername());
        var profile = userMapper.toProfileDto(user);
        return new AuthResponse(token, refreshToken, profile);
    }
}
