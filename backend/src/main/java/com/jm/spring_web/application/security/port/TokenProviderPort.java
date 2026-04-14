package com.jm.spring_web.application.security.port;

public interface TokenProviderPort {
    String issueAccessToken(String username);

    String issueRefreshToken(String username);

    String extractSubjectFromAccessToken(String token);

    String extractSubjectFromRefreshToken(String token);
}
