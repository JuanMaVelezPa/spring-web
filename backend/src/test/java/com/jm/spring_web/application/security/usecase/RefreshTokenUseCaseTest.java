package com.jm.spring_web.application.security.usecase;

import com.jm.spring_web.application.common.exception.UnauthorizedException;
import com.jm.spring_web.application.security.model.RefreshTokenCommand;
import com.jm.spring_web.application.security.port.TokenProviderPort;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class RefreshTokenUseCaseTest {

    @Test
    void shouldIssueNewTokensWhenRefreshTokenIsValid() {
        RefreshTokenUseCase useCase = new RefreshTokenUseCase(tokenProvider());

        var result = useCase.execute(new RefreshTokenCommand("refresh-token"));

        assertEquals("new-access-token", result.token());
        assertEquals("new-refresh-token", result.refreshToken());
    }

    @Test
    void shouldFailWhenRefreshTokenIsMissing() {
        RefreshTokenUseCase useCase = new RefreshTokenUseCase(tokenProvider());

        assertThrows(UnauthorizedException.class, () -> useCase.execute(new RefreshTokenCommand("")));
    }

    @Test
    void shouldFailWhenRefreshTokenIsInvalid() {
        TokenProviderPort tokenProvider = new TokenProviderPort() {
            @Override
            public String issueAccessToken(String username) {
                return "new-access-token";
            }

            @Override
            public String issueRefreshToken(String username) {
                return "new-refresh-token";
            }

            @Override
            public String extractSubjectFromAccessToken(String token) {
                return "admin";
            }

            @Override
            public String extractSubjectFromRefreshToken(String token) {
                throw new RuntimeException("bad token");
            }
        };
        RefreshTokenUseCase useCase = new RefreshTokenUseCase(tokenProvider);

        assertThrows(UnauthorizedException.class, () -> useCase.execute(new RefreshTokenCommand("bad-token")));
    }

    private TokenProviderPort tokenProvider() {
        return new TokenProviderPort() {
            @Override
            public String issueAccessToken(String username) {
                return "new-access-token";
            }

            @Override
            public String issueRefreshToken(String username) {
                return "new-refresh-token";
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
}
