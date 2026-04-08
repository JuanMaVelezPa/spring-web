package com.jm.spring_web.application.branch.usecase;

import com.jm.spring_web.application.branch.model.BranchResult;
import com.jm.spring_web.application.branch.port.BranchRepositoryPort;

import java.util.List;
import java.util.Objects;

public class ListBranchesUseCase {
    private final BranchRepositoryPort branchRepositoryPort;

    public ListBranchesUseCase(BranchRepositoryPort branchRepositoryPort) {
        this.branchRepositoryPort = Objects.requireNonNull(branchRepositoryPort);
    }

    public List<BranchResult> execute() {
        return branchRepositoryPort.findAll()
                .stream()
                .map(BranchMapper::toResult)
                .toList();
    }
}
