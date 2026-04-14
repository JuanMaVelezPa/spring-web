package com.jm.spring_web.entrypoints.rest.mapper;

import com.jm.spring_web.application.common.pagination.PageResult;
import com.jm.spring_web.entrypoints.rest.dto.PagedResponse;

import java.util.function.Function;

public final class PageMapper {
    private PageMapper() {
    }

    public static <I, O> PagedResponse<O> toPagedResponse(PageResult<I> page, Function<I, O> itemMapper) {
        return new PagedResponse<>(
                page.content().stream().map(itemMapper).toList(),
                page.totalElements(),
                page.page(),
                page.size(),
                page.totalPages());
    }
}
