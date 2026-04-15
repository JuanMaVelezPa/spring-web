# Roadmap — Frontend

## Frontend milestones (**F1** & **F2**) — Angular + Signals + Tailwind + DaisyUI

> **Naming:** **F1** = first UI slice (list + create). **F2** = second slice (detail + update + deactivate).  
> Backend work is **B1** / **B2** in [backend.md](backend.md). Full order: [status.md](status.md).

### Technical Stack

- Angular (latest stable)
- Signals for local reactive state
- Tailwind CSS
- DaisyUI with **two themes:** `light` and `dark` (toggle via `data-theme` on `html`)
- Typed API layer: **OpenAPI-generated** `openapi.generated.ts` + **`api-types.ts`** aliases + **`ApiPaths`** + path helpers (`branchByIdPath`, …) in `core/api/api-paths.ts`
- i18n: lightweight **`I18nService`** (EN/ES dictionaries), **not** `ngx-translate` or Angular `$localize` (see [security.md §2](../security.md#2-internationalization--do-we-use-angular-translate--ngx-translate))

### Goals

- Build a simple, clean UI with good UX.
- Demonstrate full-stack integration quality (auth + CRUD + errors).
- Keep frontend architecture maintainable and easy to explain in interviews.

### Release scope (YAGNI)

- **F1 — First slice:** login + branch list + create branch (+ error handling and loading states).
- **F2 — Second slice:** detail, update, deactivate — **Done** in repo; API existed from **B1**.

### Proposed Frontend Modules

1. App Shell
   - Layout (topbar or topbar + compact nav)
   - Theme switcher (`light` / `dark`)
   - Route-level loading and error display

2. Authentication
   - Login page
   - Session handling aligned with Backend Phase 2 (access in memory + refresh cookie when available)
   - Route guards for protected routes

3. Branch Management (by milestone)
   - **F1:** list + create
   - **F2:** detail + update + deactivate

4. Shared UX
   - Reusable form patterns; toasts / inline errors; empty states
   - Loading, shell (account menu, title, favicon): see [frontend/README.md](../../frontend/README.md) (*Reusable loading*, *Branding & shell UX*)

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

**Progress:** see [status.md](status.md). **F1**, **F2**, and hardening **H1** (refresh interceptor + Nginx CSP) are **closed**.  
**Next (optional):** stricter CSP, new product milestones.

---

[← Backend](backend.md) · [Overview →](overview.md) · [Status →](status.md)
