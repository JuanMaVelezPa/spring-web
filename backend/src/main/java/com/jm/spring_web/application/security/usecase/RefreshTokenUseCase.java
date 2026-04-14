package com.jm.spring_web.application.security.usecase;

import com.jm.spring_web.application.common.exception.UnauthorizedException;
import com.jm.spring_web.application.security.model.AuthResult;
import com.jm.spring_web.application.security.model.RefreshTokenCommand;
import com.jm.spring_web.application.security.port.TokenProviderPort;

import java.util.Objects;

public class RefreshTokenUseCase {
    private final TokenProviderPort tokenProviderPort;

    public RefreshTokenUseCase(TokenProviderPort tokenProviderPort) {
        this.tokenProviderPort = Objects.requireNonNull(tokenProviderPort);
    }

    public AuthResult execute(RefreshTokenCommand command) {
        if (command == null || command.refreshToken() == null || command.refreshToken().isBlank()) {
            throw new UnauthorizedException("Refresh token is required");
        }

        try {
            String subject = tokenProviderPort.extractSubjectFromRefreshToken(command.refreshToken());
            return new AuthResult(
                    tokenProviderPort.issueAccessToken(subject),
                    tokenProviderPort.issueRefreshToken(subject));
        } catch (RuntimeException ex) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }
    }
}
