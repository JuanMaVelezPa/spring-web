package com.jm.spring_web.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpringDataProcessedEventRepository extends JpaRepository<ProcessedEventJpaEntity, UUID> {
}
