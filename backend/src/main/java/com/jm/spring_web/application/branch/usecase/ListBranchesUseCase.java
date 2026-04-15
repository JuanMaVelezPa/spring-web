package com.jm.spring_web.application.branch.usecase;

import com.jm.spring_web.application.branch.model.BranchResult;
import com.jm.spring_web.application.branch.port.BranchRepositoryPort;
import com.jm.spring_web.application.common.pagination.PageQuery;
import com.jm.spring_web.application.common.pagination.PageResult;
import com.jm.spring_web.application.common.pagination.PageSlice;
import com.jm.spring_web.domain.branch.Branch;

import java.util.Objects;

public class ListBranchesUseCase {
    private final BranchRepositoryPort branchRepositoryPort;

    public ListBranchesUseCase(BranchRepositoryPort branchRepositoryPort) {
        this.branchRepositoryPort = Objects.requireNonNull(branchRepositoryPort);
    }

    public PageResult<BranchResult> execute(PageQuery query) {
        PageSlice<Branch> slice = branchRepositoryPort.findAll(query);
        var content = slice.content().stream().map(BranchMapper::toResult).toList();
        return PageResult.of(content, slice.totalElements(), query.page(), query.size());
    }
}
