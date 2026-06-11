package com.aitovoice.auth;

import com.aitovoice.auth.dto.LoginRequest;
import com.aitovoice.auth.dto.RegisterRequest;
import com.aitovoice.common.BusinessException;
import com.aitovoice.user.entity.User;
import com.aitovoice.user.mapper.UserMapper;
import com.aitovoice.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private UserMapper userMapper;
    @Mock
    private JwtTokenProvider tokenProvider;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .passwordHash("$2a$10$encodedPassword")
                .nickname("testuser")
                .role(User.UserRole.USER)
                .status(User.UserStatus.ACTIVE)
                .build();
        testUser.setId(1L);
    }

    @Test
    void register_success() {
        var request = new RegisterRequest("newuser", "new@example.com", "password123");
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("$2a$10$encoded");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(tokenProvider.generateToken(any(), any())).thenReturn("token");
        when(tokenProvider.generateRefreshToken(any(), any())).thenReturn("refresh");
        when(userMapper.toProfileDto(any())).thenReturn(null);

        var result = authService.register(request);

        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_duplicateUsername_throwsException() {
        var request = new RegisterRequest("existing", "new@example.com", "password123");
        when(userRepository.existsByUsername("existing")).thenReturn(true);

        assertThrows(BusinessException.class, () -> authService.register(request));
    }

    @Test
    void register_duplicateEmail_throwsException() {
        var request = new RegisterRequest("newuser", "existing@example.com", "password123");
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(BusinessException.class, () -> authService.register(request));
    }

    @Test
    void login_success() {
        var request = new LoginRequest("testuser", "password123");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "$2a$10$encodedPassword")).thenReturn(true);
        when(tokenProvider.generateToken(any(), any())).thenReturn("token");
        when(tokenProvider.generateRefreshToken(any(), any())).thenReturn("refresh");
        when(userMapper.toProfileDto(any())).thenReturn(null);

        var result = authService.login(request);

        assertNotNull(result);
        assertEquals("token", result.token());
    }

    @Test
    void login_wrongPassword_throwsException() {
        var request = new LoginRequest("testuser", "wrongpassword");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", "$2a$10$encodedPassword")).thenReturn(false);

        assertThrows(BusinessException.class, () -> authService.login(request));
    }

    @Test
    void login_userNotFound_throwsException() {
        var request = new LoginRequest("nonexistent", "password123");
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        assertThrows(BusinessException.class, () -> authService.login(request));
    }
}
