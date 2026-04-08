package com.jm.spring_web.application.branch.port;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.jm.spring_web.domain.branch.Branch;

public interface BranchRepositoryPort {
    boolean existsByCode(String code);

    Branch save(Branch branch);

    Optional<Branch> findById(UUID id);

    List<Branch> findAll();
}
