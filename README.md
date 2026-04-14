# Spring Web — Monorepo

Portfolio **full-stack** project: **Spring Boot** API (`backend/`), **Angular** SPA (`frontend/`), and **observability** (`monitoring/`). HTTP contract is the boundary between Java and TypeScript.

| Start here | Description |
|------------|-------------|
| [backend/README.md](backend/README.md) | API, Docker, security matrix, tests, Gradle |
| [frontend/README.md](frontend/README.md) | Angular dev server, proxy, UI stack |
| [docs/README.md](docs/README.md) | **Roadmap** (phased plan) + **Postman** collection |

## Repository layout

```text
backend/           # Spring Boot (Gradle); build output: backend/build/
frontend/          # Angular SPA
docs/
  roadmap/         # Phased plan (overview, backend, frontend)
  postman/         # Postman collection (shared API contract)
monitoring/        # Prometheus, Grafana, Alertmanager, …
docker-compose.yml # Root: separate services (e.g. API `app`, Nginx `web`, Prometheus, Kafka, …)
```

## Quick start

### Full stack with Docker Compose (quick)

From the **repository root** (where `docker-compose.yml` lives):

```bash
cp .env.example .env
# Edit .env: JWT_SECRET and APP_PASSWORD are required (see .env.example).
# Optional (local Alertmanager): see [backend/README.md](backend/README.md).

docker compose up -d --build
```

- **`--build`** rebuilds images (`app`, `web`, …). If you did not change code/images, `docker compose up -d` is enough.
- **Ports (host):** SPA (Nginx) **http://localhost:8080** · API (Spring) **http://localhost:8081** (Postman, Swagger, Actuator direct). The SPA still calls **`/api` on :8080**; Nginx forwards those requests to `app` so the browser stays same-origin (no extra CORS setup).
- **Grafana:** http://localhost:3000 · **Prometheus:** http://localhost:9090  
- Stop: `docker compose down` · Logs: `docker compose logs -f web app`

### Login en la UI (valores por defecto)

Tras `cp .env.example .env`, la API crea el usuario de aplicación definido en `.env`. **Por defecto** (según `.env.example`):

| | |
|--|--|
| **Usuario** | `admin` |
| **Contraseña** | `Admin_ChangeMe_2026!` |

Si cambiaste `APP_USER` o `APP_PASSWORD` en tu `.env`, usa esos valores en el formulario de login.

**Si el login responde `422 Unprocessable Content`:** el cuerpo suele ser *Invalid credentials* — la API está rechazando usuario/contraseña. Comprueba que en `.env` no haya comillas alrededor de `APP_PASSWORD`, que no queden espacios raros, y que **reinicies el contenedor `app`** (o el proceso Spring) tras cambiar la contraseña: el usuario en memoria se crea al arranque con el valor entonces vigente.

Variables, Alertmanager, and production-like compose: [backend/README.md](backend/README.md).

### Without Docker

1. Run the API on port **8080**, then [frontend/README.md](frontend/README.md) (`npm start` → http://localhost:4200/ with `/api` proxy).

## Planning & standards

Phased delivery, Git workflow, and decided standards: [docs/roadmap/overview.md](docs/roadmap/overview.md).

## Author

**JuanMa** — Backend Java Developer

- GitHub: https://github.com/JuanMaVelezPa
- LinkedIn: https://www.linkedin.com/in/juanmavelezdev/
- Email: juanmavelezpa@gmail.com

## Note for recruiters

Small business scope, high engineering signal: architecture, reliability patterns, tests, and production-oriented observability in one repo.
