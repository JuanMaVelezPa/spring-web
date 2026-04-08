package com.jm.spring_web.infrastructure.security;

import com.jm.spring_web.application.security.port.UserCredentialsPort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class SpringUserCredentialsAdapter implements UserCredentialsPort {
    private final AuthenticationManager authenticationManager;

    public SpringUserCredentialsAdapter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public boolean authenticate(String username, String rawPassword) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, rawPassword));
            return true;
        } catch (AuthenticationException ex) {
            return false;
        }
    }
}
