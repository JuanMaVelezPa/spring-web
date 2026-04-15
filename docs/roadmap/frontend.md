# Roadmap — Frontend

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

**Progress:** see [status.md](status.md) for a maintained checklist (preferences, responsive layout, docs, tests, i18n/OpenAPI).  
Current remaining focus after first-slice closure: **second slice** (branch detail, update, deactivate) and optional UX hardening (global toasts/error boundary).

---

[← Backend](backend.md) · [Overview →](overview.md) · [Status →](status.md)
