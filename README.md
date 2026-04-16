# Spring Web — Monorepo

Portfolio **full-stack** project: **Spring Boot** API (`backend/`), **Angular** SPA (`frontend/`), and **observability** (`monitoring/`). HTTP contract is the boundary between Java and TypeScript.

| Start here | Description |
|------------|-------------|
| [backend/README.md](backend/README.md) | API, Docker, security matrix, tests, Gradle |
| [frontend/README.md](frontend/README.md) | Angular dev server, proxy, UI stack |
| [docs/README.md](docs/README.md) | **Roadmap** + [**evolution (v1.x waves)**](docs/roadmap/evolution.md) + [IAM](docs/roadmap/auth-platform.md) + **Postman** + [security](docs/security.md) |

## Repository layout

```text
backend/           # Spring Boot (Gradle); build output: backend/build/
frontend/          # Angular SPA
docs/
  roadmap/         # Phased plan, IAM (auth-platform.md), backend/frontend phases
  postman/         # Postman collection (shared API contract)
monitoring/        # Prometheus, Grafana, Alertmanager, …
docker-compose.yml # Root: separate services (e.g. API `app`, Nginx `web`, Prometheus, Kafka, …)
```

## Quick start

### Full stack with Docker Compose (quick)

From the **repository root** (where `docker-compose.yml` lives):

```bash
cp .env.example .env
# Edit .env: JWT_SECRET and APP_SUPER_ADMIN_PASSWORD are required (see .env.example).
# Optional (local Alertmanager): see [backend/README.md](backend/README.md).

docker compose up -d --build
```

- **`--build`** rebuilds images (`app`, `web`, …). If you did not change code/images, `docker compose up -d` is enough.
- **Ports (host):** SPA (Nginx) **http://localhost:8080** · API (Spring) **http://localhost:8081** (Postman, Swagger, Actuator direct). The SPA still calls **`/api` on :8080**; Nginx forwards those requests to `app` so the browser stays same-origin (no extra CORS setup).
- **Grafana:** http://localhost:3000 · **Prometheus:** http://localhost:9090  
- Stop: `docker compose down` · Logs: `docker compose logs -f web app`

### Database URLs (avoid 5432/5433 confusion)

- **When the API runs in Docker Compose** (service `app`): use the Compose hostname  
  - `DB_URL=jdbc:postgresql://postgres:5432/companydb` (this is the default in `.env.example`)
- **When the API runs on your machine** (Gradle / debugger) but you still use the Compose Postgres container: use the host-mapped port  
  - `DB_URL=jdbc:postgresql://localhost:5433/companydb` (Compose maps `5433 -> 5432`)

### UI login (default values)

After `cp .env.example .env`, the API creates the application user defined in `.env`. **Defaults** (from `.env.example`):

| | |
|--|--|
| **Username** | `admin@example.com` |
| **Password** | `Admin_ChangeMe_2026!` |

If you changed `APP_SUPER_ADMIN_EMAIL` or `APP_SUPER_ADMIN_PASSWORD` in your `.env`, use those values in the login form.

**If login responds `422 Unprocessable Content`:** the response body is typically *Invalid credentials* — the API is rejecting username/password. Check that `.env` has no quotes around `APP_SUPER_ADMIN_PASSWORD`, no trailing spaces, and **restart the `app` container** after changing it (the SUPER_ADMIN is seeded at startup if missing).

Nota: para el login usa `APP_SUPER_ADMIN_EMAIL` / `APP_SUPER_ADMIN_PASSWORD` (no `APP_USER` / `APP_PASSWORD`).

Variables, Alertmanager, and production-like compose: [backend/README.md](backend/README.md).

### Without Docker

1. Run the API on port **8080**, then [frontend/README.md](frontend/README.md) (`npm start` → http://localhost:4200/ with `/api` proxy).

## Planning & standards

Phased delivery, Git workflow, and decided standards: [docs/roadmap/overview.md](docs/roadmap/overview.md).  
What is done vs next: [docs/roadmap/status.md](docs/roadmap/status.md).

## Author

**JuanMa** — Backend Java Developer

- GitHub: https://github.com/JuanMaVelezPa
- LinkedIn: https://www.linkedin.com/in/juanmavelezdev/
- Email: juanmavelezpa@gmail.com

## Note for recruiters

Small business scope, high engineering signal: architecture, reliability patterns, tests, and production-oriented observability in one repo.
