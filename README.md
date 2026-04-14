# Spring Web - Branch Management API

Production-style backend project focused on **Clean Architecture**, **reliability patterns**, and **operational maturity**.

This API manages company branches and demonstrates how to build a small domain with strong engineering practices.

## What this project demonstrates

- Clean Architecture with clear boundaries (`domain`, `application`, `infrastructure`, `entrypoints`)
- JWT authentication with stateless security
- Transactional Outbox + Kafka for reliable async delivery
- Retry, DLT, and idempotent consumer behavior
- Structured JSON logging with end-to-end `transactionId` traceability
- Observability stack (Micrometer, Prometheus, Grafana, Alertmanager, Discord)
- Automated tests (unit, web, integration with Testcontainers)

## Tech stack

- Java 25, Spring Boot 4
- PostgreSQL, Flyway
- Spring Security + JWT
- Apache Kafka
- Micrometer + Actuator + Prometheus
- Grafana + Alertmanager + Blackbox Exporter
- Docker Compose
- JUnit 5, Mockito, MockMvc, Testcontainers

## Quick start (local)

```bash
cp .env.example .env
cp monitoring/alertmanager/alertmanager.local.yml.example monitoring/alertmanager/alertmanager.local.yml
cp monitoring/alertmanager/discord-webhook-url.example monitoring/alertmanager/discord-webhook-url
docker compose up -d --build
```

Then set your real Discord webhook URL in `monitoring/alertmanager/discord-webhook-url` (single line).

Main URLs:

- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Prometheus: `http://localhost:9090`
- Alertmanager: `http://localhost:9093`
- Grafana: `http://localhost:3000` (`admin` / `admin`)

## Production-like run

```bash
cp .env.prod.example .env.prod
docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

With `prod` profile:

- Swagger/OpenAPI disabled
- Actuator exposure reduced to `health` and `info`
- Health details hidden

## Architecture overview

| Layer | Responsibility |
|---|---|
| `domain` | Business entities and core rules |
| `application` | Use cases, ports, application logic |
| `infrastructure` | DB, Kafka, security, logging, observability adapters |
| `entrypoints` | REST controllers and API contracts |

Branch creation flow:

1. Controller calls use case
2. Use case saves `branch` + `outbox_event` in one transaction
3. Outbox relay publishes to Kafka and marks event `PROCESSED` only after ACK
4. Consumer processes event with idempotency (`processed_event` table)

## Security, logging, and observability

- Stateless JWT for protected endpoints
- `X-Correlation-Id` propagated as `transactionId` across HTTP -> app -> Kafka -> consumer
- JSON logs for easier debugging and filtering
- Metrics via `/actuator/prometheus`
- Prebuilt Grafana dashboard: `monitoring/grafana/dashboards/spring-web-observability.json`

### API error contract (Problem Details)

The API uses `application/problem+json` style responses for handled errors.
Typical fields include:

- `type` (error category URI)
- `title` (HTTP reason phrase)
- `status` (HTTP status code)
- `detail` (human-readable message)
- `instance` (request path)
- `timestamp`
- `transactionId` (when available from request correlation)
- `errors` (validation details, when applicable)

Validation example:

```json
{
  "type": "https://api.spring-web/errors/400",
  "title": "Bad Request",
  "status": 400,
  "detail": "Validation failed for one or more fields",
  "instance": "/api/v1/branches",
  "timestamp": "2026-04-14T16:00:00Z",
  "errors": [
    { "field": "name", "message": "name is mandatory" }
  ]
}
```

Custom business metrics include:

- `outbox_lag`
- `failed_notifications`
- `app_auth_login_total`
- `app_branch_command_total`
- `app_use_case_duration`
- `app_outbox_publish_total`
- `app_notification_consumer_total`

## Alerting (Discord)

Alert pipeline:

1. Prometheus evaluates rules (`monitoring/prometheus/alerts.yml`)
2. Alertmanager routes alerts (`monitoring/alertmanager/alertmanager.local.yml`)
3. Discord notification is sent using `webhook_url_file`

Configured alerts:

- `SpringWebAppDown`
- `SpringWebAppFlapping`
- `KafkaDown`
- `PostgresDown`
- `GrafanaDown`
- `OutboxLagHigh`
- `FailedNotificationsIncreasing`
- `BranchCommandFailures`
- `OutboxPublishFailures`
- `ConsumerDltEvents`

## Testing

Run full test suite:

```bash
./gradlew clean test
```

Optional manual Discord alert test:

```bash
RUN_ALERTMANAGER_TEST=true ./gradlew test --tests AlertmanagerDiscordIntegrationTest
```

## Project structure

```text
src/main/java/com/jm/spring_web/
  domain/
  application/
  infrastructure/
  entrypoints/
monitoring/
  prometheus/
  alertmanager/
  grafana/
  blackbox/
postman/
```

## Author

**JuanMa**  
Backend Java Developer

- GitHub: `https://github.com/JuanMaVelezPa`
- LinkedIn: `https://www.linkedin.com/in/juanmavelezdev/`
- Email: `juanmavelezpa@gmail.com`

## Note for recruiters

This project intentionally keeps business scope small and engineering quality high.  
It is designed to demonstrate architecture decisions, reliability patterns, testing depth, and production-oriented observability in a compact portfolio project.
