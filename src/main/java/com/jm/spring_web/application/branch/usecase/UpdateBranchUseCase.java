package com.jm.spring_web.application.branch.usecase;

import com.jm.spring_web.application.branch.model.BranchResult;
import com.jm.spring_web.application.branch.model.UpdateBranchCommand;
import com.jm.spring_web.application.branch.port.BranchRepositoryPort;
import com.jm.spring_web.application.common.exception.NotFoundException;
import com.jm.spring_web.application.common.exception.UnprocessableEntityException;
import com.jm.spring_web.domain.branch.Branch;

import java.util.Objects;
import java.util.UUID;

public class UpdateBranchUseCase {
    private final BranchRepositoryPort branchRepositoryPort;

    public UpdateBranchUseCase(BranchRepositoryPort branchRepositoryPort) {
        this.branchRepositoryPort = Objects.requireNonNull(branchRepositoryPort);
    }

    public BranchResult execute(UUID branchId, UpdateBranchCommand command) {
        Branch existing = branchRepositoryPort.findById(branchId)
                .orElseThrow(() -> new NotFoundException("Branch not found"));

        if (!existing.active()) {
            throw new UnprocessableEntityException("Inactive branches cannot be updated");
        }

        Branch saved = branchRepositoryPort.save(existing.update(command.name(), command.city()));
        return BranchMapper.toResult(saved);
    }
}
