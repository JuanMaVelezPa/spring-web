package com.jm.spring_web.application.security.port;

import com.jm.spring_web.application.security.model.UserAccount;

import java.util.Optional;
import java.util.UUID;

public interface UserDirectoryPort {
    Optional<UserAccount> findByEmail(String email);

    Optional<UserAccount> findById(UUID id);
}

