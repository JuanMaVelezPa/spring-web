package com.jm.spring_web.infrastructure.config;

import com.jm.spring_web.application.branch.port.BranchRepositoryPort;
import com.jm.spring_web.application.branch.usecase.CreateBranchUseCase;
import com.jm.spring_web.application.branch.usecase.DeactivateBranchUseCase;
import com.jm.spring_web.application.branch.usecase.GetBranchUseCase;
import com.jm.spring_web.application.branch.usecase.ListBranchesUseCase;
import com.jm.spring_web.application.branch.usecase.UpdateBranchUseCase;
import com.jm.spring_web.application.notification.port.OutboxEventRepositoryPort;
import com.jm.spring_web.application.security.port.TokenProviderPort;
import com.jm.spring_web.application.security.port.UserCredentialsPort;
import com.jm.spring_web.application.security.port.UserDirectoryPort;
import com.jm.spring_web.application.security.port.AdminUserPort;
import com.jm.spring_web.application.security.port.IamAuditPort;
import com.jm.spring_web.application.security.usecase.AuthenticateUserUseCase;
import com.jm.spring_web.application.security.usecase.RefreshTokenUseCase;
import com.jm.spring_web.application.security.usecase.AdminCreateUserUseCase;
import com.jm.spring_web.application.security.usecase.AdminGetUserUseCase;
import com.jm.spring_web.application.security.usecase.AdminListUsersUseCase;
import com.jm.spring_web.application.security.usecase.AdminSetUserEnabledUseCase;
import com.jm.spring_web.application.security.usecase.AdminSetUserRolesUseCase;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationUseCaseConfig {
    @Bean
    CreateBranchUseCase createBranchUseCase(
            BranchRepositoryPort branchRepositoryPort,
            OutboxEventRepositoryPort outboxEventRepositoryPort
    ) {
        return new CreateBranchUseCase(branchRepositoryPort, outboxEventRepositoryPort);
    }

    @Bean
    GetBranchUseCase getBranchUseCase(BranchRepositoryPort branchRepositoryPort) {
        return new GetBranchUseCase(branchRepositoryPort);
    }

    @Bean
    ListBranchesUseCase listBranchesUseCase(BranchRepositoryPort branchRepositoryPort) {
        return new ListBranchesUseCase(branchRepositoryPort);
    }

    @Bean
    UpdateBranchUseCase updateBranchUseCase(BranchRepositoryPort branchRepositoryPort) {
        return new UpdateBranchUseCase(branchRepositoryPort);
    }

    @Bean
    DeactivateBranchUseCase deactivateBranchUseCase(BranchRepositoryPort branchRepositoryPort) {
        return new DeactivateBranchUseCase(branchRepositoryPort);
    }

    @Bean
    AuthenticateUserUseCase authenticateUserUseCase(
            UserCredentialsPort userCredentialsPort,
            TokenProviderPort tokenProviderPort,
            UserDirectoryPort userDirectoryPort) {
        return new AuthenticateUserUseCase(userCredentialsPort, tokenProviderPort, userDirectoryPort);
    }

    @Bean
    RefreshTokenUseCase refreshTokenUseCase(TokenProviderPort tokenProviderPort, UserDirectoryPort userDirectoryPort) {
        return new RefreshTokenUseCase(tokenProviderPort, userDirectoryPort);
    }

    @Bean
    AdminCreateUserUseCase adminCreateUserUseCase(AdminUserPort adminUserPort, IamAuditPort auditPort) {
        return new AdminCreateUserUseCase(adminUserPort, auditPort);
    }

    @Bean
    AdminGetUserUseCase adminGetUserUseCase(AdminUserPort adminUserPort) {
        return new AdminGetUserUseCase(adminUserPort);
    }

    @Bean
    AdminListUsersUseCase adminListUsersUseCase(AdminUserPort adminUserPort) {
        return new AdminListUsersUseCase(adminUserPort);
    }

    @Bean
    AdminSetUserEnabledUseCase adminSetUserEnabledUseCase(AdminUserPort adminUserPort, IamAuditPort auditPort) {
        return new AdminSetUserEnabledUseCase(adminUserPort, auditPort);
    }

    @Bean
    AdminSetUserRolesUseCase adminSetUserRolesUseCase(AdminUserPort adminUserPort, IamAuditPort auditPort) {
        return new AdminSetUserRolesUseCase(adminUserPort, auditPort);
    }
}
