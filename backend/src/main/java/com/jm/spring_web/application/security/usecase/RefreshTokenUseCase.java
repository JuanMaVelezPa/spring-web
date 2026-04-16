package com.jm.spring_web.application.security.usecase;

import com.jm.spring_web.application.common.exception.UnauthorizedException;
import com.jm.spring_web.application.security.model.AuthResult;
import com.jm.spring_web.application.security.model.RefreshTokenCommand;
import com.jm.spring_web.application.security.port.TokenProviderPort;
import com.jm.spring_web.application.security.port.UserDirectoryPort;

import java.util.UUID;
import java.util.Objects;

public class RefreshTokenUseCase {
    private final TokenProviderPort tokenProviderPort;
    private final UserDirectoryPort userDirectoryPort;

    public RefreshTokenUseCase(TokenProviderPort tokenProviderPort, UserDirectoryPort userDirectoryPort) {
        this.tokenProviderPort = Objects.requireNonNull(tokenProviderPort);
        this.userDirectoryPort = Objects.requireNonNull(userDirectoryPort);
    }

    public AuthResult execute(RefreshTokenCommand command) {
        if (command == null || command.refreshToken() == null || command.refreshToken().isBlank()) {
            throw new UnauthorizedException("Refresh token is required");
        }

        try {
            String subject = tokenProviderPort.extractSubjectFromRefreshToken(command.refreshToken());
            UUID userId = UUID.fromString(subject);
            var account = userDirectoryPort.findById(userId)
                    .orElseThrow(() -> new UnauthorizedException("Invalid or expired refresh token"));
            return new AuthResult(
                    tokenProviderPort.issueAccessToken(subject, account.roles()),
                    tokenProviderPort.issueRefreshToken(subject, account.roles()));
        } catch (RuntimeException ex) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }
    }
}
