package com.jm.spring_web.infrastructure.security;

import io.jsonwebtoken.security.WeakKeyException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtTokenServiceTest {

    @Test
    void shouldIssueAndParseToken() {
        JwtTokenService service = new JwtTokenService(new JwtProperties(
                "test-secret-test-secret-test-secret-123",
                3600,
                7200,
                "REFRESH_TOKEN"));

        String token = service.issueAccessToken("admin");

        assertEquals("admin", service.extractSubjectFromAccessToken(token));
    }

    @Test
    void shouldFailWithInvalidToken() {
        JwtTokenService service = new JwtTokenService(new JwtProperties(
                "test-secret-test-secret-test-secret-123",
                3600,
                7200,
                "REFRESH_TOKEN"));

        assertThrows(RuntimeException.class, () -> service.extractSubjectFromAccessToken("invalid-token"));
    }

    @Test
    void shouldFailWhenTokenIsExpired() throws InterruptedException {
        JwtTokenService service = new JwtTokenService(new JwtProperties(
                "test-secret-test-secret-test-secret-123",
                1,
                2,
                "REFRESH_TOKEN"));
        String token = service.issueAccessToken("admin");

        Thread.sleep(1200);

        assertThrows(RuntimeException.class, () -> service.extractSubjectFromAccessToken(token));
    }

    @Test
    void shouldRejectRefreshTokenWhenParsedAsAccessToken() {
        JwtTokenService service = new JwtTokenService(new JwtProperties(
                "test-secret-test-secret-test-secret-123",
                3600,
                7200,
                "REFRESH_TOKEN"));
        String refreshToken = service.issueRefreshToken("admin");

        assertThrows(RuntimeException.class, () -> service.extractSubjectFromAccessToken(refreshToken));
    }

    @Test
    void shouldFailWithWeakSecret() {
        assertThrows(WeakKeyException.class, () -> new JwtTokenService(new JwtProperties("short-secret", 3600, 7200, "REFRESH_TOKEN")));
    }
}
