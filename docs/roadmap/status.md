# Roadmap — Delivery status

Living checklist: update when a milestone closes. Technical detail stays in module READMEs.

**Ordered evolution (versions, waves, BE+FE together):** [**evolution.md**](evolution.md) — read this first for **what to do next** and **v1.x** base template bumps.

## Delivery timeline (read this first)

### Done — **v1.0** baseline

| Step | Code | Scope | Status |
|------|------|--------|--------|
| **1** | **B1** | Backend — API maturity (OpenAPI, Problem Details, pagination, tests) | **Done** |
| **2** | **B2** | Backend — Security & operations (JWT, refresh cookie, Docker, metrics) | **Done** |
| **3** | **F1** | Frontend — First slice: shell, login, branch **list + create**, prefs, i18n, OpenAPI typings, unit + smoke E2E | **Done** |
| **4** | **F2** | Frontend — Second slice: branch **detail + update + deactivate** (API was already in B1) | **Done** |
| **5** | **H1** | Frontend **hardening**: silent **refresh** interceptor + **CSP** / security headers on Nginx (`web`) | **Done** |

### Planned — map to [evolution.md](evolution.md)

| Version | Wave | Codes (summary) | Status |
|---------|------|-----------------|--------|
| **v1.1** | 1 | **IAM1** | Planned |
| **v1.2** | 2 | **IAM2**, **IAM3** | Planned |
| **v1.3** | 3 | **F3** | **Done** |
| **v1.4** | 4 | **IAM4** | Planned |
| **v1.5** | 5 | **IAM5** | Planned |
| **v1.6** | 6 | **IAM6** | Planned |
| **v1.7** | 7 | **IAM7** | Planned |

Detail per milestone: [auth-platform.md](auth-platform.md), [frontend.md](frontend.md). Cross-cutting: [security.md](../security.md).

### Progress note (current branch)

- IAM2/IAM3 advanced with reusable validation utilities:
  - Backend shared password policy utility wired into admin user creation.
  - Frontend reusable account validation utility + visual password rules checklist in Admin create-user flow.
- List endpoints: default `size` aligned to **10** in `PageRequestParams` (matches Admin UI / branches list).
- **F3 (wave 3):** TanStack Query (`@tanstack/angular-query-experimental`) — branches **and admin users/roles** use query keys + cached reads (`staleTime` 5 min, `refetchOnWindowFocus`) with invalidation on mutations.
- Lazy loading refined by moving `admin` and `branches` trees to route-level `loadChildren` groups for cleaner chunk boundaries.
- Delivery tuning: DaisyUI `include` subset in `styles.css` (smaller CSS), `nginx.conf` gzip + long-cache hashed assets + no-store `index.html`, Angular `initial` budget aligned (~`560kB` warning).

---

## B1 — Backend (recap)

OpenAPI, `PagedResponse`, Problem Details, branch CRUD + list endpoints, tests.

## B2 — Backend (recap)

JWT + HttpOnly refresh cookie, auth matrix, observability, Compose `app` / `web`.

## F1 — Frontend first slice (recap)

| Item | Notes |
|------|--------|
| Stack | Angular 21, Signals, Tailwind, DaisyUI |
| Shell + auth | Login, guards, `withCredentials` |
| Branches | Paged list + create |
| UX | Theme + locale prefs, responsive footer, toasts, route errors |
| Quality | Unit tests, Playwright smoke, `openapi-typescript` + `api-types` + `ApiPaths` |

## F2 — Frontend second slice (recap)

| Item | Notes |
|------|--------|
| Detail | `GET /api/v1/branches/{id}` — `BranchDetailComponent`, link from list |
| Update | `PUT /api/v1/branches/{id}` — `BranchEditComponent` (name/city; code read-only) |
| Deactivate | `PATCH .../deactivate` — in-app confirmation modal, hides action when inactive |
| Paths | `branchByIdPath` / `branchDeactivatePath` in `api-paths.ts` |
| E2E | Smoke extended: list → detail → edit → deactivate |

## F2+ — UI polish (recap)

Shared loading, shell (account menu, tab title, favicon), footer — see [frontend/README.md](../../frontend/README.md) (*Reusable loading*, *Branding & shell UX*).

## H1 — Hardening (refresh + headers)

| Item | Notes |
|------|--------|
| Refresh interceptor | `core/interceptors/refresh.interceptor.ts`: on `401`, one `POST /api/v1/auth/refresh` via `HttpBackend` (no interceptor loop), single-flight, retry original request with `X-Retry-After-Refresh`; order with `apiInterceptor` / `authErrorInterceptor` documented in `app.config.ts` |
| CSP & headers | `frontend/nginx.conf`: `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` |
| FOUC + CSP | Inline theme script moved to `public/theme-init.js` so `script-src 'self'` works under CSP (`index.html` loads it) |

`ng serve` does **not** apply Nginx headers; CSP applies to the **`web`** Docker image and similar deployments.

## Verification (quick)

```bash
# Backend (from repo root)
cd backend && ./gradlew test

# Frontend
cd frontend && npm ci && npm run build && npm test
```

## Git workflow

See [overview.md §9.1](overview.md#91-mandatory-delivery-format-per-phase): branch, commit, push are executed manually.

---

[← Frontend roadmap](frontend.md) · [Overview →](overview.md)
