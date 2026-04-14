# Backend — Spring Web API

Spring Boot **4** service (Java **25**, Gradle). Clean Architecture: `domain` → `application` → `infrastructure` → `entrypoints`.

**Monorepo:** run Docker Compose and Git commands from the **repository root** unless noted. Gradle output lives in `backend/build/` (standard for this module).

## What this demonstrates

- JWT auth, refresh cookie, Problem Details (RFC 7807)
- Transactional outbox + Kafka, retries, DLT, idempotent consumer
- JSON logging + `transactionId`, Prometheus metrics, Grafana dashboards

## Tech stack

- Java 25, Spring Boot 4, Gradle
- PostgreSQL, Flyway, Spring Security
- Apache Kafka, Micrometer, Actuator

## Run with Docker (full stack)

From **repo root**:

```bash
cp .env.example .env
cp monitoring/alertmanager/alertmanager.local.yml.example monitoring/alertmanager/alertmanager.local.yml
cp monitoring/alertmanager/discord-webhook-url.example monitoring/alertmanager/discord-webhook-url
docker compose up -d --build
```

Configure `JWT_SECRET`, `APP_PASSWORD`, and (optional) Discord webhook per root `.env.example`.

**URLs (Docker Compose on the host):**

| Service | Host port | Notes |
|--------|-----------|--------|
| **`web`** (Nginx + Angular) | **8080** | Browser entry. Proxies `/api`, `/actuator`, `/swagger-ui`, `/v3/*` to `app` so the UI keeps a single origin. |
| **`app`** (Spring Boot) | **8081** | Direct API: Postman, `curl`, Swagger UI at http://localhost:8081/swagger-ui.html, Actuator, etc. |
| Grafana | 3000 | |
| Prometheus | 9090 | Scrapes **`app:8080`** on the Compose network (not via the host port). |

Separate images: **`app`** is built from `backend/` (Spring Boot only); **`web`** from `frontend/` (Angular production build + `nginx` image with `nginx.conf`).

## Production-like compose

From **repo root**:

```bash
cp .env.prod.example .env.prod
docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

With `prod`: Swagger disabled, actuator reduced, health details hidden.

## Architecture

| Layer | Responsibility |
|-------|----------------|
| `domain` | Entities and core rules |
| `application` | Use cases, ports |
| `infrastructure` | DB, Kafka, security, observability |
| `entrypoints` | REST controllers |

**Branch flow:** controller → use case → persist `branch` + `outbox_event` → relay publishes to Kafka → consumer idempotent via `processed_event`.

## Security matrix (summary)

- Public: `/api/v1/auth/**`, Swagger/OpenAPI (non-prod), `GET /actuator/health`, `GET /actuator/info`
- Optional public: `/actuator/metrics/**`, `/actuator/prometheus` (configurable)
- **ADMIN:** `/api/v1/branches/**`
- Other routes: authenticated

Spring does **not** serve the static UI; the **`web`** container (Nginx) does on host port **8080**. The API is also reachable **directly** on host port **8081** for tools and clarity.

**Auth:** login sets HttpOnly refresh cookie; access token in response body (SPA keeps it in memory). `POST /api/v1/auth/logout` clears refresh cookie (`204`).

## Pagination

`GET /api/v1/branches?page=0&size=20` returns `content`, `totalElements`, `page`, `size`, `totalPages`. Defaults `page=0`, `size=20`, max `size=100`. Utilities: `PageSlice`, `PageResult`, `PagedResponse`, `PageMapper`, `PageRequestParams`.

## Problem Details (errors)

Handled errors use `application/problem+json`-style bodies (`type`, `title`, `status`, `detail`, `instance`, `timestamp`, optional `errors`).

## Metrics (examples)

`outbox_lag`, `failed_notifications`, `app_auth_login_total`, `app_branch_command_total`, `app_use_case_duration`, `app_outbox_publish_total`, `app_notification_consumer_total`.

## Alerting

Prometheus rules → Alertmanager → Discord (see `monitoring/`). Alerts include app down, Kafka/Postgres, outbox lag, consumer DLT, etc.

## Tests

From **`backend/`**:

```bash
./gradlew clean test
```

Windows: `gradlew.bat`. Optional:

```bash
RUN_ALERTMANAGER_TEST=true ./gradlew test --tests AlertmanagerDiscordIntegrationTest
```

## Layout

```text
backend/
  src/main/java/com/jm/spring_web/
  build.gradle
  Dockerfile    # Spring Boot only (compose: build.context ./backend)
```

## Related docs

- [Repository hub (root)](../README.md)
- [Documentation index — roadmap & Postman](../docs/README.md)
- [Frontend](../frontend/README.md)
