package com.jm.spring_web.application.security.model;

public record AuthResult(String token, String refreshToken) {
}
