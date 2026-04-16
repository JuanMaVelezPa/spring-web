package com.jm.spring_web.application.security.usecase;

import com.jm.spring_web.application.common.exception.UnprocessableEntityException;
import com.jm.spring_web.application.security.model.AuthenticateCommand;
import com.jm.spring_web.application.security.model.UserAccount;
import com.jm.spring_web.application.security.port.TokenProviderPort;
import com.jm.spring_web.application.security.port.UserCredentialsPort;
import com.jm.spring_web.application.security.port.UserDirectoryPort;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AuthenticateUserUseCaseTest {
    private static final UUID ADMIN_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    @Test
    void shouldReturnTokenForValidCredentials() {
        UserCredentialsPort credentials = (username, password) -> "admin".equals(username) && "admin123".equals(password);
        TokenProviderPort tokenProvider = testTokenProvider();
        UserDirectoryPort directory = testDirectory();
        AuthenticateUserUseCase useCase = new AuthenticateUserUseCase(credentials, tokenProvider, directory);

        var result = useCase.execute(new AuthenticateCommand("admin", "admin123"));

        assertEquals("token-for-" + ADMIN_ID, result.token());
        assertEquals("refresh-for-" + ADMIN_ID, result.refreshToken());
    }

    @Test
    void shouldFailForInvalidCredentials() {
        UserCredentialsPort credentials = (username, password) -> false;
        TokenProviderPort tokenProvider = testTokenProvider();
        UserDirectoryPort directory = testDirectory();
        AuthenticateUserUseCase useCase = new AuthenticateUserUseCase(credentials, tokenProvider, directory);

        assertThrows(UnprocessableEntityException.class, () -> useCase.execute(new AuthenticateCommand("admin", "wrong")));
    }

    @Test
    void shouldFailWhenCommandIsNull() {
        UserCredentialsPort credentials = (username, password) -> true;
        TokenProviderPort tokenProvider = testTokenProvider();
        UserDirectoryPort directory = testDirectory();
        AuthenticateUserUseCase useCase = new AuthenticateUserUseCase(credentials, tokenProvider, directory);

        assertThrows(NullPointerException.class, () -> useCase.execute(null));
    }

    private TokenProviderPort testTokenProvider() {
        return new TokenProviderPort() {
            @Override
            public String issueAccessToken(String subject, List<String> roles) {
                return "token-for-" + subject;
            }

            @Override
            public String issueRefreshToken(String subject, List<String> roles) {
                return "refresh-for-" + subject;
            }

            @Override
            public String extractSubjectFromAccessToken(String token) {
                return "admin";
            }

            @Override
            public String extractSubjectFromRefreshToken(String token) {
                return "admin";
            }
        };
    }

    private UserDirectoryPort testDirectory() {
        return new UserDirectoryPort() {
            @Override
            public Optional<UserAccount> findByEmail(String email) {
                if ("admin".equals(email)) {
                    return Optional.of(new UserAccount(ADMIN_ID, List.of("APP_ADMIN")));
                }
                return Optional.empty();
            }

            @Override
            public Optional<UserAccount> findById(UUID id) {
                if (ADMIN_ID.equals(id)) {
                    return Optional.of(new UserAccount(ADMIN_ID, List.of("APP_ADMIN")));
                }
                return Optional.empty();
            }
        };
    }
}
