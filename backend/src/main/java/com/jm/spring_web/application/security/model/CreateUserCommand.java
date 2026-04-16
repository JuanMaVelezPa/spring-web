package com.jm.spring_web.application.security.model;

import java.util.List;

public record CreateUserCommand(
        String email,
        String rawPassword,
        List<String> roles
) {
}

