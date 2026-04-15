package com.jm.spring_web.application.common.pagination;

import java.util.Objects;

/**
 * Framework-agnostic page request: index, size, and sort. Controllers build instances from
 * {@link com.jm.spring_web.entrypoints.rest.dto.PageRequestParams} via {@link
 * com.jm.spring_web.entrypoints.rest.pagination.PaginationBinding}.
 */
public record PageQuery(int page, int size, SortOrder sort) {

    public PageQuery {
        if (page < 0) {
            throw new IllegalArgumentException("page must be >= 0");
        }
        if (size < 1) {
            throw new IllegalArgumentException("size must be >= 1");
        }
        Objects.requireNonNull(sort, "sort");
    }
}
