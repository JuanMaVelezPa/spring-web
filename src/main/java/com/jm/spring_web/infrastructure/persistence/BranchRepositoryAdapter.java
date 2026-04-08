package com.jm.spring_web.infrastructure.persistence;

import com.jm.spring_web.application.branch.port.BranchRepositoryPort;
import com.jm.spring_web.domain.branch.Branch;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class BranchRepositoryAdapter implements BranchRepositoryPort {
    private final SpringDataBranchRepository repository;

    public BranchRepositoryAdapter(SpringDataBranchRepository repository) {
        this.repository = repository;
    }

    @Override
    public boolean existsByCode(String code) {
        return repository.existsByCode(code);
    }

    @Override
    public Branch save(Branch branch) {
        BranchJpaEntity entity = repository.save(toEntity(branch));
        return toDomain(entity);
    }

    @Override
    public Optional<Branch> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Branch> findAll() {
        return repository.findAll().stream().map(this::toDomain).toList();
    }

    private BranchJpaEntity toEntity(Branch branch) {
        return BranchJpaEntity.builder()
                .id(branch.id())
                .code(branch.code())
                .name(branch.name())
                .city(branch.city())
                .active(branch.active())
                .createdAt(branch.createdAt())
                .updatedAt(branch.updatedAt())
                .build();
    }

    private Branch toDomain(BranchJpaEntity entity) {
        return Branch.restore(
                entity.getId(),
                entity.getCode(),
                entity.getName(),
                entity.getCity(),
                entity.isActive(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }
}
