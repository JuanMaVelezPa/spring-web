package com.jm.spring_web.entrypoints.rest.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record CreateUserRequest(
        @NotBlank @Email String email,
        @NotBlank String password,
        List<String> roles
) {
}

