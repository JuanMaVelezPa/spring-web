# Roadmap — Overview

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
  backend/                # Spring Boot (Gradle)
    src/
  frontend/               # Angular app
  docs/
    roadmap/              # Phased plan (this folder)
    postman/              # Postman collection (API contract)
  monitoring/
  docker-compose.yml
  README.md               # Hub: links to backend/, frontend/, docs/
```

**Why monorepo:** one clone, aligned API versions, simpler CI (backend tests + frontend tests in one pipeline), ideal for a learning portfolio.

---

## 6) Cross-Phase Documentation Requirements

- Keep module READMEs updated at each phase close (`backend/README.md`, `frontend/README.md`).
- Add short architecture decision records for key decisions (optional under `docs/`).
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

**Current focus:** close **Frontend first slice** gaps (tests + E2E), then **second slice** (branch detail / update / deactivate) as needed.

Live checklist: [status.md](status.md).

Suggested next tasks:

1. Add **frontend unit tests** for auth/preferences utilities and critical services.
2. Add **one E2E smoke** (Playwright): login → paged list → create branch (happy path).
3. Plan **second vertical slice** for branches (detail, update, deactivate) against existing API.

### 9.1) Mandatory delivery format per phase

At the end of each phase, produce:

1. **Phase Summary (plain English)** — What changed; why it matters; what was deferred (YAGNI).
2. **Verification Guide** — Exact commands; expected output/result.
3. **Git Commands (manual execution by user)** — Branch, add, commit, optional push.

Example:

```text
git checkout main
git pull
git checkout -b feat/backend-phase1-problem-details
git add <files>
git commit -m "feat(api): standardize problem details across endpoints"
git push -u origin feat/backend-phase1-problem-details
```

---

**Next:** [Backend phases](backend.md) · [Frontend phase](frontend.md)
