package com.jm.spring_web.infrastructure.security;

import io.jsonwebtoken.security.WeakKeyException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtTokenServiceTest {

    @Test
    void shouldIssueAndParseToken() {
        JwtTokenService service = new JwtTokenService(new JwtProperties("test-secret-test-secret-test-secret-123", 3600));

        String token = service.issueToken("admin");

        assertEquals("admin", service.extractSubject(token));
    }

    @Test
    void shouldFailWithInvalidToken() {
        JwtTokenService service = new JwtTokenService(new JwtProperties("test-secret-test-secret-test-secret-123", 3600));

        assertThrows(RuntimeException.class, () -> service.extractSubject("invalid-token"));
    }

    @Test
    void shouldFailWhenTokenIsExpired() throws InterruptedException {
        JwtTokenService service = new JwtTokenService(new JwtProperties("test-secret-test-secret-test-secret-123", 1));
        String token = service.issueToken("admin");

        Thread.sleep(1200);

        assertThrows(RuntimeException.class, () -> service.extractSubject(token));
    }

    @Test
    void shouldFailWithWeakSecret() {
        assertThrows(WeakKeyException.class, () -> new JwtTokenService(new JwtProperties("short-secret", 3600)));
    }
}
