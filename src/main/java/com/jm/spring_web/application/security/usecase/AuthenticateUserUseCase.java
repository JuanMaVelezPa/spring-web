package com.jm.spring_web.application.security.usecase;

import com.jm.spring_web.application.common.exception.UnprocessableEntityException;
import com.jm.spring_web.application.security.model.AuthResult;
import com.jm.spring_web.application.security.model.AuthenticateCommand;
import com.jm.spring_web.application.security.port.TokenProviderPort;
import com.jm.spring_web.application.security.port.UserCredentialsPort;

import java.util.Objects;

public class AuthenticateUserUseCase {
    private final UserCredentialsPort userCredentialsPort;
    private final TokenProviderPort tokenProviderPort;

    public AuthenticateUserUseCase(UserCredentialsPort userCredentialsPort, TokenProviderPort tokenProviderPort) {
        this.userCredentialsPort = Objects.requireNonNull(userCredentialsPort);
        this.tokenProviderPort = Objects.requireNonNull(tokenProviderPort);
    }

    public AuthResult execute(AuthenticateCommand command) {
        if (!userCredentialsPort.authenticate(command.username(), command.password())) {
            throw new UnprocessableEntityException("Invalid credentials");
        }
        return new AuthResult(tokenProviderPort.issueToken(command.username()));
    }
}
