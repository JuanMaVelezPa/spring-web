package com.jm.spring_web.entrypoints.rest.dto;

import jakarta.validation.constraints.NotNull;

public record SetUserEnabledRequest(@NotNull Boolean enabled) {
}

