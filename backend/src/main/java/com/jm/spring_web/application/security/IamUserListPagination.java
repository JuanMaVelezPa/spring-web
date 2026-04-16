package com.jm.spring_web.application.security;

import com.jm.spring_web.application.common.pagination.SortOrder;
import com.jm.spring_web.application.common.pagination.SortPolicy;
import com.jm.spring_web.application.common.pagination.SortDirection;

import java.util.Set;

public final class IamUserListPagination {
    private IamUserListPagination() {
    }

    public static final SortPolicy SORT_POLICY = new SortPolicy(
            new SortOrder("createdAt", SortDirection.DESC),
            Set.of("email", "enabled", "createdAt")
    );
}

