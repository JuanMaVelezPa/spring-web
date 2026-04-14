package com.jm.spring_web.infrastructure.security;

import com.jm.spring_web.application.security.port.TokenProviderPort;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtTokenService implements TokenProviderPort {
    private static final String TOKEN_TYPE = "token_type";
    private static final String ACCESS = "access";
    private static final String REFRESH = "refresh";
    private final JwtProperties jwtProperties;
    private final SecretKey secretKey;

    public JwtTokenService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.secretKey = Keys.hmacShaKeyFor(jwtProperties.secret().getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public String issueAccessToken(String username) {
        return issueToken(username, jwtProperties.expirationSeconds(), ACCESS);
    }

    @Override
    public String issueRefreshToken(String username) {
        return issueToken(username, jwtProperties.refreshExpirationSeconds(), REFRESH);
    }

    @Override
    public String extractSubjectFromAccessToken(String token) {
        return extractSubject(token, ACCESS);
    }

    @Override
    public String extractSubjectFromRefreshToken(String token) {
        return extractSubject(token, REFRESH);
    }

    private String issueToken(String username, long expirationSeconds, String tokenType) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(username)
                .claim(TOKEN_TYPE, tokenType)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(expirationSeconds)))
                .signWith(secretKey)
                .compact();
    }

    private String extractSubject(String token, String expectedType) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        String tokenType = claims.get(TOKEN_TYPE, String.class);
        if (!expectedType.equals(tokenType)) {
            throw new IllegalArgumentException("Invalid token type");
        }
        return claims.getSubject();
    }
}
