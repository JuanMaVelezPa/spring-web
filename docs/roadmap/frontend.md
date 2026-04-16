# Roadmap — Frontend

> **Execution order:** follow [**evolution.md**](evolution.md) (waves **v1.1–v1.7**) — frontend milestones are scheduled there together with backend work.

## Frontend milestones (**F1** & **F2**) — Angular + Signals + Tailwind + DaisyUI

> **Naming:** **F1** = first UI slice (list + create). **F2** = second slice (detail + update + deactivate).  
> Backend work is **B1** / **B2** in [backend.md](backend.md). Shipped baseline: [status.md](status.md) (**v1.0**).

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

**Progress:** see [status.md](status.md). **F1**, **F2**, and hardening **H1** (refresh interceptor + Nginx CSP) are **closed**. **F3** is **closed** (branches + admin query cache; see status).  
**Next:** IAM front-end gaps (register, change-password, `/me`, OAuth/phone UX) are tracked in [status.md — IAM3](status.md#iam3-admin-frontend); design reference [auth-platform.md](auth-platform.md). Optionally extend **F3** to other GETs or stricter CSP.

---

## **F3** Client-side query cache (stale-while-revalidate) — branches + admin implemented

**Intent:** Cache **GET** results in the SPA so revisiting a screen or waiting on a timer does not always hit the network; **mutations** (create / update / delete) **invalidate** affected keys so lists stay correct with **fewer redundant backend calls**.

### Is this a good practice?

**Yes**, when applied as **client-side coordination**, not as a source of truth:

| Pros | Cons / caveats |
|------|----------------|
| Fewer HTTP calls on navigation and periodic refresh | Stale data if someone else changes data elsewhere — mitigate with **TTL** + **invalidate on write** + optional **focus refetch** |
| Snappier UX (show cached data, then refresh in background if stale) | Must define **cache keys** per resource + params (e.g. page, sort) or you serve wrong slices |
| Aligns with patterns used by **TanStack Query**, SWR, etc. | Do not cache **sensitive** responses beyond the session without reviewing (usually fine for branch lists under auth) |

The **server** remains authoritative; the cache only avoids repeat reads the user already paid for.

### Suggested behavior (matches your idea)

1. **TTL (e.g. 5 minutes):** treat data as **fresh** for that window; optional **background refetch** when stale (user still sees last good list first).
2. **Invalidate (or refetch) on mutations:** after successful **create / update / delete** on branches, **drop or refresh** all `branch list` cache entries (and **detail** for that `id` if cached).
3. **Optional:** refetch when the **window regains focus** or **manual “Refresh”** — cheap wins without polling every second.
4. Same pattern now applied to **admin users/roles** list endpoints with reusable query key builders and invalidation helpers.

### Reusable implementation (general for future features)

- **Option A — library:** **`@tanstack/angular-query-experimental`** (or the stable Angular Query integration for your Angular major). Gives `queryKey`, `staleTime`, `gcTime`, `refetchInterval`, `queryClient.invalidateQueries()`. **Recommended** if you want a well-tested pattern with minimal custom code.
- **Option B — thin in-house:** A small **`QueryCacheService`** in `core/` holding a `Map<key, { value, fetchedAt }>` + helpers `getOrFetch(key, fetcher, ttl)` and **`invalidatePrefix('branches:')`**. Features call it from services (e.g. `BranchApiService`) or wrappers. Easier to explain in interviews but more maintenance.

**Rules:** cache keys must include **everything** that affects the response (resource name, **page**, **size**, **sort**, filters). One global TTL constant (e.g. `5 * 60 * 1000`) in one place; per-resource override later if needed.

### Open questions (decide before F3 coding)

1. **Scope v1:** Only **branch list** (+ optional **branch by id**), or all GETs globally?
2. **Polling:** Strict **timer every 5 min** for open routes, or only **staleTime** + refetch when user navigates / focuses?
3. **Invalidation:** Broad **invalidate all `branches/*`** on any branch write (simple) vs. **targeted** invalidation (fewer calls, more logic)?

### Verification

- Unit tests on cache key builder + invalidation helpers.
- Manual: load list → wait past TTL → navigate away and back → expect one refetch; create branch → list updates without stale rows.

---

[← Backend](backend.md) · [Overview →](overview.md) · [Status →](status.md)
