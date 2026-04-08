package com.jm.spring_web.application.security.usecase;

import com.jm.spring_web.application.common.exception.UnprocessableEntityException;
import com.jm.spring_web.application.security.model.AuthenticateCommand;
import com.jm.spring_web.application.security.port.TokenProviderPort;
import com.jm.spring_web.application.security.port.UserCredentialsPort;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AuthenticateUserUseCaseTest {

    @Test
    void shouldReturnTokenForValidCredentials() {
        UserCredentialsPort credentials = (username, password) -> "admin".equals(username) && "admin123".equals(password);
        TokenProviderPort tokenProvider = username -> "token-for-" + username;
        AuthenticateUserUseCase useCase = new AuthenticateUserUseCase(credentials, tokenProvider);

        var result = useCase.execute(new AuthenticateCommand("admin", "admin123"));

        assertEquals("token-for-admin", result.token());
    }

    @Test
    void shouldFailForInvalidCredentials() {
        UserCredentialsPort credentials = (username, password) -> false;
        TokenProviderPort tokenProvider = username -> "token";
        AuthenticateUserUseCase useCase = new AuthenticateUserUseCase(credentials, tokenProvider);

        assertThrows(UnprocessableEntityException.class, () -> useCase.execute(new AuthenticateCommand("admin", "wrong")));
    }

    @Test
    void shouldFailWhenCommandIsNull() {
        UserCredentialsPort credentials = (username, password) -> true;
        TokenProviderPort tokenProvider = username -> "token";
        AuthenticateUserUseCase useCase = new AuthenticateUserUseCase(credentials, tokenProvider);

        assertThrows(NullPointerException.class, () -> useCase.execute(null));
    }
}
