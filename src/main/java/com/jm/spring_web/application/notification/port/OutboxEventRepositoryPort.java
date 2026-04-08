package com.jm.spring_web.application.notification.port;

import com.jm.spring_web.application.notification.model.OutboxEventCommand;

public interface OutboxEventRepositoryPort {
    void savePending(OutboxEventCommand command);
}
