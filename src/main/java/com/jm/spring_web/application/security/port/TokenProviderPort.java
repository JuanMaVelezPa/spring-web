package com.jm.spring_web.application.security.port;

public interface TokenProviderPort {
    String issueToken(String username);
}
