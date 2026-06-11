package com.aitovoice.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private final String secret = "myTestSecretKeyThatIsLongEnoughForHmacSha256Algorithm2024!";

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider(secret, 3600000, 604800000);
    }

    @Test
    void generateToken_returnsValidToken() {
        var token = tokenProvider.generateToken(1L, "testuser");

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void validateToken_validToken_returnsTrue() {
        var token = tokenProvider.generateToken(1L, "testuser");

        assertTrue(tokenProvider.validateToken(token));
    }

    @Test
    void validateToken_invalidToken_returnsFalse() {
        assertFalse(tokenProvider.validateToken("invalid.token.here"));
    }

    @Test
    void getUserIdFromToken_returnsCorrectId() {
        var token = tokenProvider.generateToken(42L, "testuser");

        assertEquals(42L, tokenProvider.getUserIdFromToken(token));
    }

    @Test
    void getUsernameFromToken_returnsCorrectUsername() {
        var token = tokenProvider.generateToken(1L, "alice");

        assertEquals("alice", tokenProvider.getUsernameFromToken(token));
    }
}
