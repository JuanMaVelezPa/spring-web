package com.jm.spring_web.application.security.port;

/**
 * Tracks failed/successful password logins for account lockout (IAM1).
 */
public interface LoginAttemptPort {
    void onFailedLogin(String attemptedEmail);

    void onSuccessfulLogin(String email);
}
