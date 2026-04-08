package com.jm.spring_web.application.branch.usecase;

import com.jm.spring_web.application.branch.model.BranchResult;
import com.jm.spring_web.application.branch.port.BranchRepositoryPort;
import com.jm.spring_web.application.common.exception.NotFoundException;
import com.jm.spring_web.domain.branch.Branch;

import java.util.Objects;
import java.util.UUID;

public class DeactivateBranchUseCase {
    private final BranchRepositoryPort branchRepositoryPort;

    public DeactivateBranchUseCase(BranchRepositoryPort branchRepositoryPort) {
        this.branchRepositoryPort = Objects.requireNonNull(branchRepositoryPort);
    }

    public BranchResult execute(UUID branchId) {
        Branch existing = branchRepositoryPort.findById(branchId)
                .orElseThrow(() -> new NotFoundException("Branch not found"));

        Branch saved = branchRepositoryPort.save(existing.deactivate());
        return BranchMapper.toResult(saved);
    }
}
