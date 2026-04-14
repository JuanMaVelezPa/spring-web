package com.jm.spring_web.application.branch.port;

import com.jm.spring_web.application.common.pagination.PageSlice;
import java.util.Optional;
import java.util.UUID;

import com.jm.spring_web.domain.branch.Branch;

public interface BranchRepositoryPort {
    boolean existsByCode(String code);

    Branch save(Branch branch);

    Optional<Branch> findById(UUID id);

    PageSlice<Branch> findAll(int page, int pageSize);
}
