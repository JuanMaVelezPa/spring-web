package com.jm.spring_web.application.branch.usecase;

import com.jm.spring_web.application.branch.port.BranchRepositoryPort;
import com.jm.spring_web.domain.branch.Branch;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ListBranchesUseCaseTest {

    @Test
    void shouldReturnMappedBranches() {
        BranchRepositoryPort repository = Mockito.mock(BranchRepositoryPort.class);
        Mockito.when(repository.findAll()).thenReturn(List.of(
                Branch.createNew("BR001", "Main", "Madrid"),
                Branch.createNew("BR002", "North", "Bilbao")
        ));
        ListBranchesUseCase useCase = new ListBranchesUseCase(repository);

        var result = useCase.execute();

        assertEquals(2, result.size());
        assertEquals("BR001", result.get(0).code());
        assertEquals("BR002", result.get(1).code());
    }

    @Test
    void shouldReturnEmptyListWhenNoBranchesExist() {
        BranchRepositoryPort repository = Mockito.mock(BranchRepositoryPort.class);
        Mockito.when(repository.findAll()).thenReturn(List.of());
        ListBranchesUseCase useCase = new ListBranchesUseCase(repository);

        var result = useCase.execute();

        assertEquals(0, result.size());
    }
}
