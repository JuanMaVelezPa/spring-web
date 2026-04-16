package com.jm.spring_web.application.security;

import com.jm.spring_web.application.common.pagination.SortDirection;
import com.jm.spring_web.application.common.pagination.SortOrder;
import com.jm.spring_web.application.common.pagination.SortPolicy;

import java.util.Set;

public final class IamAuditLogListPagination {
    private IamAuditLogListPagination() {
    }

    public static final SortPolicy SORT_POLICY = new SortPolicy(
            new SortOrder("createdAt", SortDirection.DESC),
            Set.of("createdAt", "action"));
}
