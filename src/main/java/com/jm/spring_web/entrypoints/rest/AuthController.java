package com.jm.spring_web.entrypoints.rest;

import com.jm.spring_web.application.security.model.AuthResult;
import com.jm.spring_web.application.security.model.AuthenticateCommand;
import com.jm.spring_web.application.security.model.RefreshTokenCommand;
import com.jm.spring_web.application.security.usecase.AuthenticateUserUseCase;
import com.jm.spring_web.application.security.usecase.RefreshTokenUseCase;
import com.jm.spring_web.infrastructure.observability.AppMetrics;
import com.jm.spring_web.infrastructure.security.JwtProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import io.micrometer.core.instrument.Timer;
import com.jm.spring_web.entrypoints.rest.dto.LoginRequest;
import com.jm.spring_web.entrypoints.rest.dto.LoginResponse;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private static final String REFRESH_AUTH_USE_CASE = "refresh_token";
    private final AuthenticateUserUseCase authenticateUserUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;
    private final JwtProperties jwtProperties;
    private final AppMetrics appMetrics;
    private final boolean secureCookies;

    public AuthController(
            AuthenticateUserUseCase authenticateUserUseCase,
            RefreshTokenUseCase refreshTokenUseCase,
            JwtProperties jwtProperties,
            AppMetrics appMetrics,
            @Value("${security.cookies.secure:false}") boolean secureCookies) {
        this.authenticateUserUseCase = authenticateUserUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
        this.jwtProperties = jwtProperties;
        this.appMetrics = appMetrics;
        this.secureCookies = secureCookies;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        Timer.Sample sample = appMetrics.startSample();
        try {
            AuthResult result = authenticateUserUseCase.execute(new AuthenticateCommand(request.username(), request.password()));
            addRefreshCookie(response, result.refreshToken());
            appMetrics.incrementAuthLoginSuccess();
            appMetrics.recordUseCaseDuration(sample, "authenticate_user", "success");
            return new LoginResponse(result.token());
        } catch (RuntimeException exception) {
            appMetrics.incrementAuthLoginFailure(exception.getClass().getSimpleName());
            appMetrics.recordUseCaseDuration(sample, "authenticate_user", "failure");
            throw exception;
        }
    }

    @PostMapping("/refresh")
    public LoginResponse refresh(
            HttpServletRequest request,
            HttpServletResponse response) {
        Timer.Sample sample = appMetrics.startSample();
        try {
            String refreshToken = extractRefreshTokenFromCookies(request);
            AuthResult result = refreshTokenUseCase.execute(new RefreshTokenCommand(refreshToken));
            addRefreshCookie(response, result.refreshToken());
            appMetrics.recordUseCaseDuration(sample, REFRESH_AUTH_USE_CASE, "success");
            return new LoginResponse(result.token());
        } catch (RuntimeException exception) {
            appMetrics.recordUseCaseDuration(sample, REFRESH_AUTH_USE_CASE, "failure");
            throw exception;
        }
    }

    private void addRefreshCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from(jwtProperties.refreshCookieName(), refreshToken)
                .httpOnly(true)
                .secure(secureCookies)
                .sameSite("Lax")
                .path("/api/v1/auth")
                .maxAge(jwtProperties.refreshExpirationSeconds())
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String extractRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (jwtProperties.refreshCookieName().equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
