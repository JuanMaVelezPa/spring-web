package com.jm.spring_web.application.security.usecase;

import com.jm.spring_web.application.common.pagination.PageQuery;
import com.jm.spring_web.application.common.pagination.PageResult;
import com.jm.spring_web.application.security.model.AdminAuditLogResult;
import com.jm.spring_web.application.security.port.AdminAuditLogPort;

import java.util.Objects;

public class AdminListAuditLogUseCase {
    private final AdminAuditLogPort auditLogPort;

    public AdminListAuditLogUseCase(AdminAuditLogPort auditLogPort) {
        this.auditLogPort = Objects.requireNonNull(auditLogPort);
    }

    public PageResult<AdminAuditLogResult> execute(PageQuery query) {
        if (query == null) {
            throw new IllegalArgumentException("query is required");
        }
        return auditLogPort.list(query);
    }
}
