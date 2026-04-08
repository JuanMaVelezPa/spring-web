package com.jm.spring_web.application.branch.usecase;

import com.jm.spring_web.application.branch.port.BranchRepositoryPort;
import com.jm.spring_web.application.common.exception.NotFoundException;
import com.jm.spring_web.domain.branch.Branch;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class GetBranchUseCaseTest {

    @Test
    void shouldReturnBranchWhenItExists() {
        BranchRepositoryPort repository = Mockito.mock(BranchRepositoryPort.class);
        UUID id = UUID.randomUUID();
        Branch branch = Branch.createNew("BR001", "Main", "Madrid");
        Mockito.when(repository.findById(id)).thenReturn(Optional.of(branch));
        GetBranchUseCase useCase = new GetBranchUseCase(repository);

        var result = useCase.execute(id);

        assertEquals(branch.code(), result.code());
        assertEquals(branch.name(), result.name());
        assertEquals(branch.city(), result.city());
    }

    @Test
    void shouldThrowNotFoundWhenBranchDoesNotExist() {
        BranchRepositoryPort repository = Mockito.mock(BranchRepositoryPort.class);
        UUID id = UUID.randomUUID();
        Mockito.when(repository.findById(id)).thenReturn(Optional.empty());
        GetBranchUseCase useCase = new GetBranchUseCase(repository);

        assertThrows(NotFoundException.class, () -> useCase.execute(id));
    }
}
