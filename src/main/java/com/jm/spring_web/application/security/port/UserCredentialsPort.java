package com.jm.spring_web.application.security.port;

public interface UserCredentialsPort {
    boolean authenticate(String username, String rawPassword);
}
