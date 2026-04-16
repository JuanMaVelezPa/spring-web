package com.jm.spring_web.application.security.usecase;

import com.jm.spring_web.application.common.exception.UnprocessableEntityException;
import com.jm.spring_web.application.security.model.AdminUserResult;
import com.jm.spring_web.application.security.port.AdminUserPort;
import com.jm.spring_web.application.security.port.IamAuditPort;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

public class AdminSetUserRolesUseCase {
    private final AdminUserPort adminUserPort;
    private final IamAuditPort auditPort;

    public AdminSetUserRolesUseCase(AdminUserPort adminUserPort, IamAuditPort auditPort) {
        this.adminUserPort = Objects.requireNonNull(adminUserPort);
        this.auditPort = Objects.requireNonNull(auditPort);
    }

    public AdminUserResult execute(UUID actorUserId, UUID targetUserId, List<String> roles) {
        if (actorUserId == null) {
            throw new IllegalArgumentException("actorUserId is required");
        }
        if (targetUserId == null) {
            throw new IllegalArgumentException("targetUserId is required");
        }
        if (roles == null || roles.isEmpty()) {
            throw new UnprocessableEntityException("At least one role is required");
        }

        // Safety: do not allow removing SUPER_ADMIN from your own account (hard to recover).
        if (actorUserId.equals(targetUserId) && roles.stream().noneMatch(r -> "SUPER_ADMIN".equalsIgnoreCase(r))) {
            throw new UnprocessableEntityException("You cannot remove SUPER_ADMIN from your own account");
        }

        AdminUserResult updated = adminUserPort.setRoles(targetUserId, roles);
        auditPort.record(actorUserId, "iam.user.set_roles", targetUserId, "roles=" + String.join(",", updated.roles()));
        return updated;
    }
}

