package com.jm.spring_web.application.branch.usecase;

import com.jm.spring_web.application.branch.model.BranchResult;
import com.jm.spring_web.application.branch.port.BranchRepositoryPort;
import com.jm.spring_web.application.common.exception.NotFoundException;

import java.util.Objects;
import java.util.UUID;

public class GetBranchUseCase {
    private final BranchRepositoryPort branchRepositoryPort;

    public GetBranchUseCase(BranchRepositoryPort branchRepositoryPort) {
        this.branchRepositoryPort = Objects.requireNonNull(branchRepositoryPort);
    }

    public BranchResult execute(UUID branchId) {
        return branchRepositoryPort.findById(branchId)
                .map(BranchMapper::toResult)
                .orElseThrow(() -> new NotFoundException("Branch not found"));
    }
}
