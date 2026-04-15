# Roadmap — Delivery status

Living checklist: update when a slice closes. Technical detail stays in module READMEs.

## Backend

| Phase | Theme | Status | Notes |
|-------|--------|--------|--------|
| 1 | API maturity, Problem Details, pagination, tests | **Done** | OpenAPI, `PagedResponse`, MockMvc + integration flow |
| 2 | Security (JWT + refresh cookie), observability, Docker | **Done** | Auth matrix, cookie path, metrics; API behind Compose `app` |

## Frontend (Phase 5 — first vertical slice)

| Item | Status | Notes |
|------|--------|--------|
| Stack: Angular + Signals + Tailwind + DaisyUI | **Done** | Angular 21; themes `light` / `dark` |
| App shell (nav, logout) | **Done** | `layout/app-shell` |
| Theme toggle (`data-theme` on `<html>`) | **Done** | Shared `ThemeToggleComponent`; FOUC script in `index.html` |
| User preferences (reusable storage) | **Done** | `core/preferences`: `LocalPreferenceStore`, `UserPreferencesService`; keys for future `locale` |
| Login + session (access in memory, refresh cookie) | **Done** | `withCredentials`; guards |
| Branch list (paged) + create | **Done** | Problem Details surfaced via shared alert |
| `frontend/README.md` | **Done** | Run, build, proxy, Docker, contract notes |
| Responsive layout (footer, shell, login) | **Done** | Safe-area padding, compact single-line footer |
| Default login documented + aligned `.env` / Spring default | **Done** | Root + frontend README; `APP_PASSWORD` default in `application.properties` |

### Deferred (YAGNI / next slices)

| Item | Status | Notes |
|------|--------|--------|
| Branch detail, update, deactivate UI | **Pending** | Second slice per [frontend.md](frontend.md) |
| Unit tests (services, preferences) | **Done** | Added `auth.service.spec.ts` and `user-preferences.service.spec.ts`; `npm test` green. |
| One E2E smoke (e.g. Playwright) | **Done** | `frontend/e2e/smoke.spec.ts` passes (`npm run test:e2e:smoke`) against running stack on `http://localhost:8080`. |
| OpenAPI-generated client | **Done** | `npm run openapi:generate` wired with `openapi-typescript`; generation validated against running backend endpoint. |
| i18n / `locale` wired to UI | **Done** | `I18nService` (EN/ES), language switcher in login/shell, locale persisted in preferences. |
| Route-level global error boundary / toasts | **Done** | Global toast layer added; router navigation errors and session-expired events are surfaced globally. |

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
