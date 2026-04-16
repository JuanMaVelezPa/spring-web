package com.jm.spring_web.entrypoints.rest.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record MeResponse(
        UUID id,
        String email,
        boolean enabled,
        Instant lockedUntil,
        Instant createdAt,
        List<String> roles
) {
}
