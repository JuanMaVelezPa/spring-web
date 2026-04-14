# Implementation Roadmap (Backend -> Frontend)

This document defines the execution plan for evolving the project in structured phases.
All implementation, code comments, commit messages, and documentation should be written in English.

## 1) Guiding Principles

- DRY: avoid duplication in logic, contracts, and configuration.
- YAGNI: implement only what is required for the current learning goal.
- KISS: prefer simple designs over clever complexity.
- SOLID: keep responsibilities isolated and extensible.
- Clean Architecture: preserve boundaries between domain, application, infrastructure, and entrypoints.
- Best Practices: tests, observability, security, clear docs, and reproducible environments.

## 2) Scope Strategy

- Step 1: complete Backend Phase 1.
- Step 2: complete Backend Phase 2.
- Step 3: build a simple but polished Frontend (Angular latest + Signals + Tailwind + DaisyUI).
- Step 4: connect Frontend to stable backend contracts.

This sequencing reduces risk and prevents UI work from masking API design issues.

### 2.1) Repository layout (monorepo)

We use a **single repository** for backend and frontend. Boundaries stay strict: no cross-imports between Java and Angular; the contract is the HTTP API (OpenAPI).

```text
spring-web/
  src/ # Backend (Gradle, Clean Architecture)
  monitoring/
  postman/
  docs/                   # Optional: ADRs, diagrams (recommended)
  frontend/               # Angular app (added in Frontend Phase)
  IMPLEMENTATION_ROADMAP.md
  README.md
  ...
```

**Why monorepo:** one clone, aligned API versions, simpler CI (backend tests + frontend tests in one pipeline), ideal for a learning portfolio.

---

## 3) Backend Phase 1 - API Maturity and Consistency

### Goals

- Stabilize API contract quality for real client consumption.
- Standardize error handling and request/response behavior.
- Ensure documentation and tests match actual behavior.

### Workstreams

1. API Contract
   - Confirm endpoints and payloads under `/api/v1`.
   - Keep OpenAPI spec aligned with implementation.
   - Add request/response examples for key endpoints.

2. Validation and Error Model
   - Standardize on **RFC 7807 Problem Details** (`application/problem+json`) where appropriate for Spring.
   - Normalize validation and business errors into one predictable shape.
   - Keep HTTP status usage strict and predictable.
   - Document all known error cases in README/OpenAPI.

3. Query Behavior
   - Add/standardize pagination for list endpoints.
   - Add simple filtering/sorting only if needed (YAGNI).

4. Test Coverage
   - Keep unit tests focused on use cases.
   - Keep controller tests focused on contract + status + payload.
   - Keep one integration flow proving core happy-path.

### Definition of Done (Phase 1)

- OpenAPI and runtime behavior match.
- Error responses follow Problem Details (or documented equivalent) consistently.
- Test suite passes locally with Gradle and Java 25.
- README includes API usage examples.

---

## 4) Backend Phase 2 - Security and Reliability

### Goals

- Raise production-readiness for auth and service resilience.
- Keep architecture clean without overengineering.

### Workstreams

1. Security Hardening
   - Define endpoint authorization matrix (public/user/admin).
   - Standardize auth error responses (`401`, `403`, `422` where relevant).
   - **Target auth model for SPA:** short-lived **access token** (kept in memory on the client) and **refresh token** in an **HttpOnly, Secure, SameSite** cookie; backend exposes refresh (and optional rotation). Avoid persisting access tokens in `localStorage` / `sessionStorage` as the default.
   - If an interim step keeps Bearer-only headers, document TTL, risks, and the migration path to cookie-based refresh.
   - Review secret configuration and actuator exposure in non-local profiles.

2. Reliability Patterns
   - Keep outbox flow observable and auditable.
   - Add pragmatic retry/timeout/circuit-breaker only where real failure exists.
   - Ensure dead-letter/retry behavior is documented.

3. Observability Quality
   - Confirm useful logs per endpoint and key domain action.
   - Keep metrics tied to business flow (commands, failures, lag).
   - Verify alert behavior and expected delay windows.

4. Operational Readiness
   - Validate Docker behavior and restart expectations.
   - Keep health endpoints and probes aligned with runtime behavior.

### Definition of Done (Phase 2)

- Security matrix implemented and tested.
- Reliability behavior validated with at least one failure simulation.
- Alerts and logs are actionable and documented.
- Backend is stable enough for frontend integration.

---

## 5) Frontend Phase - Angular + Signals + Tailwind + DaisyUI

### Technical Stack

- Angular (latest stable)
- Signals for local reactive state
- Tailwind CSS
- DaisyUI with **two themes:** `light` and `dark` (toggle via `data-theme` on `html`)
- Typed API client layer (manual types first; optional OpenAPI codegen later)

### Goals

- Build a simple, clean UI with good UX.
- Demonstrate full-stack integration quality (auth + CRUD + errors).
- Keep frontend architecture maintainable and easy to explain in interviews.

### Release scope (YAGNI)

- **First vertical slice:** login + branch list + create branch (+ error handling and loading states).
- **Second slice:** detail, update, deactivate (or equivalent) once the first slice is stable.

### Proposed Frontend Modules

1. App Shell
   - Layout (topbar or topbar + compact nav)
   - Theme switcher (`light` / `dark`)
   - Route-level loading and error display

2. Authentication
   - Login page
   - Session handling aligned with Backend Phase 2 (access in memory + refresh cookie when available)
   - Route guards for protected routes

3. Branch Management (by slice)
   - Slice 1: list + create
   - Slice 2: detail + update + deactivate as needed

4. Shared UX
   - Reusable form patterns
   - Toast or inline feedback for success/failure
   - Empty states and sensible loading indicators

### Frontend folder structure (inside `frontend/`)

```text
frontend/
  src/
    app/
      core/                 # Auth, API client, interceptors, app config (singletons)
      shared/               # Reusable UI, pipes, small helpers (no feature logic)
      features/
        auth/               # Login, auth routes
        branches/           # Branch routes, components, feature-level state
      layout/               # Shell, navbar, theme switch
    assets/
    styles/
 public/
```

**Rules:** `core` must not depend on `features`. Features do not import each other’s internals; share only through `shared` or contracts.

### Testing (frontend)

- **Unit tests** for services and non-trivial signal-driven logic.
- **One E2E smoke** (e.g. Playwright): login → list → create → assert validation or success path.

### Definition of Done (Frontend Phase)

- User can complete the first slice (login, list, create) through the UI.
- Theme toggle works between `light` and `dark`.
- Problem Details (or API error shape) surfaced in user-friendly messages.
- `frontend/README.md` documents run, build, test, and folder layout.

---

## 6) Cross-Phase Documentation Requirements

- Keep README updated at each phase close.
- Add short architecture decision records for key decisions.
- Provide verification commands for local validation.
- Keep change logs concise and focused on "why".
- For every phase, document in simple language:
  - What was implemented.
  - Why it was implemented (learning and engineering rationale).
  - How to verify it quickly.
- Every phase must include a **Git execution section**:
  - The assistant proposes exact Git commands.
  - The user runs those commands manually.
  - No hidden Git actions should be assumed.

---

## 7) Suggested Execution Cadence

- Work in small vertical slices.
- One feature = code + tests + docs + verification.
- Avoid large "big bang" merges.
- Suggested branch naming:
  - `feat/backend-phase1-*`
  - `feat/backend-phase2-*`
  - `feat/frontend-*`

---

## 8) Decided standards (baseline for implementation)

| Topic | Decision |
|-------|----------|
| API errors | **RFC 7807 Problem Details** as the target consistent format in Backend Phase 1 |
| SPA auth | **Access token short-lived in memory** + **refresh in HttpOnly cookie** (implemented in Backend Phase 2; document interim if needed) |
| First UI slice | **Login + list + create** only; extend in a second slice |
| DaisyUI themes | **`light` + `dark`** |
| Frontend tests | **Unit tests** + **one E2E smoke** |
| Repository | **Monorepo**; Angular under **`frontend/`** |
| Language | **English** for code, comments, commits, and user-facing docs |

---

## 9) Immediate Next Step

Start Backend Phase 1 with a small task list:

1. Audit and lock `/api/v1` contract.
2. Standardize validation/error payload shape.
3. Verify OpenAPI examples and update docs.
4. Run full tests and capture baseline.

### 9.1) Mandatory delivery format per phase

At the end of each phase, produce:

1. **Phase Summary (plain English)**
   - What changed.
   - Why these changes matter.
   - What was intentionally deferred (YAGNI).

2. **Verification Guide**
   - Exact commands to validate behavior locally.
   - Expected output/result.

3. **Git Commands (manual execution by user)**
   - Create/switch branch.
   - Add relevant files.
   - Commit with message.
   - Optional push/PR commands.

Example format:

```text
git checkout main
git pull
git checkout -b feat/backend-phase1-problem-details
git add <files>
git commit -m "feat(api): standardize problem details across endpoints"
git push -u origin feat/backend-phase1-problem-details
```
