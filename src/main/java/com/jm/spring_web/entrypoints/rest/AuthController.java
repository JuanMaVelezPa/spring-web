package com.jm.spring_web.entrypoints.rest;

import com.jm.spring_web.application.security.model.AuthResult;
import com.jm.spring_web.application.security.model.AuthenticateCommand;
import com.jm.spring_web.application.security.usecase.AuthenticateUserUseCase;
import com.jm.spring_web.infrastructure.observability.AppMetrics;
import io.micrometer.core.instrument.Timer;
import com.jm.spring_web.entrypoints.rest.dto.LoginRequest;
import com.jm.spring_web.entrypoints.rest.dto.LoginResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthenticateUserUseCase authenticateUserUseCase;
    private final AppMetrics appMetrics;

    public AuthController(AuthenticateUserUseCase authenticateUserUseCase, AppMetrics appMetrics) {
        this.authenticateUserUseCase = authenticateUserUseCase;
        this.appMetrics = appMetrics;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        Timer.Sample sample = appMetrics.startSample();
        try {
            AuthResult result = authenticateUserUseCase.execute(new AuthenticateCommand(request.username(), request.password()));
            appMetrics.incrementAuthLoginSuccess();
            appMetrics.recordUseCaseDuration(sample, "authenticate_user", "success");
            return new LoginResponse(result.token());
        } catch (RuntimeException exception) {
            appMetrics.incrementAuthLoginFailure(exception.getClass().getSimpleName());
            appMetrics.recordUseCaseDuration(sample, "authenticate_user", "failure");
            throw exception;
        }
    }
}
