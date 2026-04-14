package com.jm.spring_web.entrypoints.rest.dto;

import java.util.List;

public record PagedResponse<T>(
        List<T> content,
        long totalElements,
        int page,
        int size,
        int totalPages) {
}
