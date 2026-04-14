CREATE TABLE IF NOT EXISTS outbox_event (
    id UUID PRIMARY KEY,
    aggregate_type VARCHAR(80) NOT NULL,
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(120) NOT NULL,
    payload TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    processed_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_outbox_event_status_created_at
    ON outbox_event(status, created_at);

CREATE TABLE IF NOT EXISTS processed_event (
    event_id UUID PRIMARY KEY,
    processed_at TIMESTAMP NOT NULL
);
