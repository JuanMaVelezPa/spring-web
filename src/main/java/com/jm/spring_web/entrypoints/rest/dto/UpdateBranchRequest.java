package com.jm.spring_web.entrypoints.rest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateBranchRequest(
        @NotBlank
        @Size(max = 150)
        String name,
        @NotBlank
        @Size(max = 120)
        String city) {
}
