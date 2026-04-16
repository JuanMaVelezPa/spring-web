package com.jm.spring_web.entrypoints.rest.pagination;

import com.jm.spring_web.application.common.pagination.PageQuery;
import com.jm.spring_web.application.common.pagination.SortPolicy;
import com.jm.spring_web.entrypoints.rest.dto.PageRequestParams;

/**
 * Maps HTTP {@link PageRequestParams} (+ resource {@link SortPolicy}) to application {@link PageQuery}.
 */
public final class PaginationBinding {

    private PaginationBinding() {}

    public static PageQuery toPageQuery(PageRequestParams params, SortPolicy sortPolicy) {
        return new PageQuery(params.getPage(), params.getSize(), sortPolicy.resolve(params.getSort()));
    }
}
