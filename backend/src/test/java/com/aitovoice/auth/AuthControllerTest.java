package com.aitovoice.auth;

import com.aitovoice.user.dto.UserDto;
import com.aitovoice.user.entity.User;
import com.aitovoice.user.mapper.UserMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    private AuthService authService;
    private UserMapper userMapper;
    private AuthController authController;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        authService = mock(AuthService.class);
        userMapper = mock(UserMapper.class);
        authController = new AuthController(authService, userMapper);
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Test
    void meEndpoint_doesNotContainPasswordHash() throws Exception {
        var user = User.builder()
                .username("testuser")
                .email("test@test.com")
                .passwordHash("$2a$10$hashedPasswordSecret")
                .nickname("tester")
                .role(User.UserRole.USER)
                .status(User.UserStatus.ACTIVE)
                .build();
        user.setId(1L);
        user.setCreatedAt(LocalDateTime.now());

        var userDto = new UserDto(
                1L, "testuser", "test@test.com", "tester",
                null, "USER", "ACTIVE", user.getCreatedAt()
        );

        when(userMapper.toDto(any(User.class))).thenReturn(userDto);

        var response = authController.me(user);

        assertNotNull(response);
        assertNotNull(response.data());
        assertEquals(1L, response.data().id());
        assertEquals("testuser", response.data().username());
        assertEquals("test@test.com", response.data().email());

        // Serialize to JSON and verify passwordHash is not present
        String json = objectMapper.writeValueAsString(response);
        assertFalse(json.contains("passwordHash"), "Response JSON should not contain passwordHash");
        assertTrue(json.contains("testuser"), "Response JSON should contain username");

        verify(userMapper).toDto(user);
    }

    @Test
    void meEndpoint_returnsUserDtoNotUser() {
        var user = User.builder()
                .username("testuser")
                .email("test@test.com")
                .passwordHash("$2a$10$hashedPasswordSecret")
                .nickname("tester")
                .role(User.UserRole.USER)
                .status(User.UserStatus.ACTIVE)
                .build();
        user.setId(1L);

        var userDto = new UserDto(
                1L, "testuser", "test@test.com", "tester",
                null, "USER", "ACTIVE", LocalDateTime.now()
        );

        when(userMapper.toDto(any(User.class))).thenReturn(userDto);

        var response = authController.me(user);

        assertInstanceOf(UserDto.class, response.data(),
                "me() should return UserDto, not User entity");
    }
}
