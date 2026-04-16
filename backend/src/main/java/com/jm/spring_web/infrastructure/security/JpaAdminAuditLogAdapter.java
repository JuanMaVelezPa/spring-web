package com.jm.spring_web.infrastructure.security;

import com.jm.spring_web.application.common.pagination.PageQuery;
import com.jm.spring_web.application.common.pagination.PageResult;
import com.jm.spring_web.application.security.model.AdminAuditLogResult;
import com.jm.spring_web.application.security.port.AdminAuditLogPort;
import com.jm.spring_web.infrastructure.persistence.SpringPageRequests;
import com.jm.spring_web.infrastructure.persistence.iam.IamAuditLogJpaEntity;
import com.jm.spring_web.infrastructure.persistence.iam.IamAuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class JpaAdminAuditLogAdapter implements AdminAuditLogPort {
    private final IamAuditLogRepository auditLogs;

    public JpaAdminAuditLogAdapter(IamAuditLogRepository auditLogs) {
        this.auditLogs = auditLogs;
    }

    @Override
    public PageResult<AdminAuditLogResult> list(PageQuery query) {
        Page<IamAuditLogJpaEntity> page = auditLogs.findAll(SpringPageRequests.from(query));
        return PageResult.of(
                page.getContent().stream().map(this::toResult).toList(),
                page.getTotalElements(),
                query.page(),
                query.size());
    }

    private AdminAuditLogResult toResult(IamAuditLogJpaEntity e) {
        return new AdminAuditLogResult(
                e.getId(),
                e.getActorUserId(),
                e.getAction(),
                e.getTargetUserId(),
                e.getMetadata(),
                e.getCreatedAt());
    }
}
