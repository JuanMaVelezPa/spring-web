package com.jm.spring_web.application.security.usecase;

import com.jm.spring_web.application.common.pagination.PageQuery;
import com.jm.spring_web.application.common.pagination.PageResult;
import com.jm.spring_web.application.security.model.AdminUserResult;
import com.jm.spring_web.application.security.port.AdminUserPort;

import java.util.Objects;

public class AdminListUsersUseCase {
    private final AdminUserPort adminUserPort;

    public AdminListUsersUseCase(AdminUserPort adminUserPort) {
        this.adminUserPort = Objects.requireNonNull(adminUserPort);
    }

    public PageResult<AdminUserResult> execute(PageQuery query) {
        if (query == null) {
            throw new IllegalArgumentException("query is required");
        }
        return adminUserPort.list(query);
    }
}

