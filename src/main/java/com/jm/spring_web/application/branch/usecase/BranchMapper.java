package com.jm.spring_web.application.branch.usecase;

import com.jm.spring_web.application.branch.model.BranchResult;
import com.jm.spring_web.domain.branch.Branch;

final class BranchMapper {
    private BranchMapper() {
    }

    static BranchResult toResult(Branch branch) {
        return new BranchResult(
                branch.id(),
                branch.code(),
                branch.name(),
                branch.city(),
                branch.active(),
                branch.createdAt(),
                branch.updatedAt());
    }
}
