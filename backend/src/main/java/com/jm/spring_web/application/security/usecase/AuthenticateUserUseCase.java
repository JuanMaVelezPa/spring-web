package com.jm.spring_web.application.security.usecase;

import com.jm.spring_web.application.common.exception.UnprocessableEntityException;
import com.jm.spring_web.application.security.model.AuthResult;
import com.jm.spring_web.application.security.model.AuthenticateCommand;
import com.jm.spring_web.application.security.model.UserAccount;
import com.jm.spring_web.application.security.port.TokenProviderPort;
import com.jm.spring_web.application.security.port.UserCredentialsPort;
import com.jm.spring_web.application.security.port.UserDirectoryPort;

import java.util.Objects;

public class AuthenticateUserUseCase {
    private final UserCredentialsPort userCredentialsPort;
    private final TokenProviderPort tokenProviderPort;
    private final UserDirectoryPort userDirectoryPort;

    public AuthenticateUserUseCase(
            UserCredentialsPort userCredentialsPort,
            TokenProviderPort tokenProviderPort,
            UserDirectoryPort userDirectoryPort) {
        this.userCredentialsPort = Objects.requireNonNull(userCredentialsPort);
        this.tokenProviderPort = Objects.requireNonNull(tokenProviderPort);
        this.userDirectoryPort = Objects.requireNonNull(userDirectoryPort);
    }

    public AuthResult execute(AuthenticateCommand command) {
        if (!userCredentialsPort.authenticate(command.username(), command.password())) {
            throw new UnprocessableEntityException("Invalid credentials");
        }
        UserAccount account = userDirectoryPort.findByEmail(command.username())
                .orElseThrow(() -> new UnprocessableEntityException("Invalid credentials"));
        return new AuthResult(
                tokenProviderPort.issueAccessToken(account.id().toString(), account.roles()),
                tokenProviderPort.issueRefreshToken(account.id().toString(), account.roles()));
    }
}
