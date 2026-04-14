package com.jm.spring_web.application.branch.usecase;

import com.jm.spring_web.application.branch.port.BranchRepositoryPort;
import com.jm.spring_web.application.common.exception.NotFoundException;
import com.jm.spring_web.domain.branch.Branch;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

class DeactivateBranchUseCaseTest {

    @Test
    void shouldDeactivateExistingBranch() {
        BranchRepositoryPort repository = Mockito.mock(BranchRepositoryPort.class);
        UUID id = UUID.randomUUID();
        Branch active = Branch.restore(id, "BR001", "Main", "Madrid", true, LocalDateTime.now(), LocalDateTime.now());
        Mockito.when(repository.findById(id)).thenReturn(Optional.of(active));
        Mockito.when(repository.save(Mockito.any())).thenAnswer(invocation -> invocation.getArgument(0));
        DeactivateBranchUseCase useCase = new DeactivateBranchUseCase(repository);

        var result = useCase.execute(id);

        assertFalse(result.isActive());
    }

    @Test
    void shouldThrowNotFoundWhenBranchDoesNotExist() {
        BranchRepositoryPort repository = Mockito.mock(BranchRepositoryPort.class);
        UUID id = UUID.randomUUID();
        Mockito.when(repository.findById(id)).thenReturn(Optional.empty());
        DeactivateBranchUseCase useCase = new DeactivateBranchUseCase(repository);

        assertThrows(NotFoundException.class, () -> useCase.execute(id));
    }
}
