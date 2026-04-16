package com.jm.spring_web.infrastructure.security;

import com.jm.spring_web.application.security.port.IamAuditPort;
import com.jm.spring_web.infrastructure.persistence.iam.IamAuditLogJpaEntity;
import com.jm.spring_web.infrastructure.persistence.iam.IamAuditLogRepository;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
public class JpaIamAuditAdapter implements IamAuditPort {
    private final IamAuditLogRepository repository;

    public JpaIamAuditAdapter(IamAuditLogRepository repository) {
        this.repository = repository;
    }

    @Override
    public void record(UUID actorUserId, String action, UUID targetUserId, String metadata) {
        repository.save(new IamAuditLogJpaEntity(
                UUID.randomUUID(),
                actorUserId,
                action,
                targetUserId,
                metadata,
                Instant.now()
        ));
    }
}

