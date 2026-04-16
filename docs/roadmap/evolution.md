# Roadmap — Base template evolution (waves & versions)

This document is the **single ordered plan** for growing the monorepo: **one wave at a time**, backend and frontend aligned where needed, **learning from each delivery** before scaling scope. Detailed specs stay in [auth-platform.md](auth-platform.md), [frontend.md](frontend.md), [backend.md](backend.md).

**Version label (`v1.x`):** the **base template** maturity for forks — not the npm package version. Bump **`v1.x`** when a **wave** closes (document in commit + short release note in PR).

**Rules**

- Finish **one wave** (tests + docs + verify) before starting the next unless a spike is explicitly time-boxed.
- Each wave has a **vertical slice** when possible: API + UI + contract (OpenAPI) + tests.
- **Defer** IAM4–IAM7 details until earlier waves are stable — see priority tables inside [auth-platform.md](auth-platform.md).

---

## Shipped baseline — **v1.0**

| Layer | Milestones | Notes |
|-------|------------|--------|
| Backend | **B1**, **B2** | API maturity, JWT + refresh cookie, Docker, metrics |
| Frontend | **F1**, **F2**, **H1** | Branches CRUD UI, refresh interceptor, CSP / Nginx headers |

Checklist: [status.md](status.md) (steps 1–5 **Done**).

---

## Wave 1 → **v1.1** — Identity persistence (backend-first)

| Track | Deliverables |
|-------|----------------|
| **Backend** | **IAM1** — DB `users` / roles per §1.1 [auth-platform.md](auth-platform.md), password policy, lockout, seed SUPER_ADMIN, JWT `sub` = user id, replace in-memory `UserDetailsService`. |
| **Frontend** | Minimal alignment: login/register flows still work against new API; optional **/me** or claims display; OpenAPI regenerate. **No** full admin UI yet. |

**Outcome:** Real accounts in PostgreSQL; same fork template, new Flyway migrations.  
**Learn:** End-to-end persistence auth, migration discipline.

---

## Wave 2 → **v1.2** — Authorization + admin UI (vertical slice)

| Track | Deliverables |
|-------|----------------|
| **Backend** | **IAM2** — Admin APIs, `APP_ADMIN` scoping, method security, IAM audit. |
| **Frontend** | **IAM3** — Admin area, role guards, shell updates, OpenAPI alignment. |

**Outcome:** Operators can manage users/roles from the UI (per design).  
**Learn:** Authorization beyond a single `ADMIN` role, audit trail.

---

## Wave 3 → **v1.3** — Client query cache (frontend-first)

| Track | Deliverables |
|-------|----------------|
| **Backend** | No required change (optional HTTP cache headers later). |
| **Frontend** | **F3** — TTL + invalidation on branch CRUD; reusable cache layer for future lists — see **F3** in [frontend.md](frontend.md). |

**Outcome:** Fewer redundant GETs; snappier navigation.  
**Learn:** Stale-while-revalidate, cache keys, invalidation rules.

**Note:** If **v1.3** is needed earlier for UX, you may schedule **F3** right after **v1.0** as a **small side wave** — only if IAM work is not blocking; default order above keeps **identity correct** before optimizing traffic.

---

## Wave 4 → **v1.4** — Operational hardening

| Track | Deliverables |
|-------|----------------|
| **Backend** | **IAM4** — Refresh rotation, session/device metadata, rate limits, TOTP MFA (privileged), security notification emails. |
| **Frontend** | Sessions UI (optional), MFA enrollment, settings. |

**Outcome:** Stronger production posture; fewer abuse windows.  
**Learn:** Token families, MFA, transactional email in prod.

---

## Wave 5 → **v1.5** — Recovery & alternate sign-in

| Track | Deliverables |
|-------|----------------|
| **Backend** | **IAM5** — Forgot password, OTP (email → SMS), Google OAuth, phone verification paths. |
| **Frontend** | Screens for forgot/reset, OAuth buttons, phone OTP UX; i18n strings. |

**Outcome:** Modern login paths; aligns with §1.1 identity anchors.  
**Learn:** OTP lifecycle, OAuth redirect discipline, provider config per environment.

**Reorder note:** If you prefer **forgot password / Google** before **MFA / sessions**, swap **Wave 4** and **Wave 5** — document the choice in your PR when you start.

---

## Wave 6 → **v1.6** — Account lifecycle & trust

| Track | Deliverables |
|-------|----------------|
| **Backend + Frontend** | **IAM6** — Verification enforcement, step-up auth, export/delete, consent versioning, CAPTCHA if needed ([auth-platform.md](auth-platform.md) §2.2 P3). |

---

## Wave 7 → **v1.7** — Advanced credentials & integrations

| Track | Deliverables |
|-------|----------------|
| **Backend + Frontend** | **IAM7** — Passkeys (WebAuthn), API keys / M2M if a fork needs them. |

---

## Cross-cutting (apply when relevant; do not block waves)

| Topic | Where |
|-------|--------|
| Stricter CSP, TLS | [security.md](../security.md), Nginx — incremental with any frontend wave |
| New domain features (non-IAM) | New rows in [status.md](status.md); same wave discipline |
| Free-tier pragmatism | [auth-platform.md](auth-platform.md) (baseline paragraph + §2.3) |

### Template maintenance (forks & staying modern)

These **do not replace** the versioned waves above; revisit them **between** waves or in CI so new apps stay healthy without scope creep.

| Practice | Notes |
|----------|--------|
| **CI on every PR** | Run `./gradlew test` and `npm ci && npm run build && npm test` (and smoke E2E when feasible) so forks do not regress silently. |
| **Dependencies** | Use Dependabot/Renovate or a monthly review — priority: security patches for auth, Spring, Angular. |
| **API contract** | Keep OpenAPI and generated typings aligned; optional CI step fails if spec and code drift. |
| **Git tags + changelog** | Tag **`v1.x`** when a wave closes; one-line **CHANGELOG** entry — helps forks know which baseline they cloned. |
| **Environments** | Same deploy shape for `dev` / `staging` / `prod`; only config/secrets differ (see root `.env.example`). |
| **Container bases** | Periodically bump base images (JDK, Node build stage, Nginx) for CVE fixes. |
| **License & attribution** | Keep **LICENSE** and a short “based on” note when distributing a fork for another company. |
| **i18n & a11y** | New screens: strings via i18n; forms usable with keyboard — matches existing shell patterns. |
| **Frontend weight** | Prefer **lazy routes** and avoid unnecessary bundle growth as features land. |

---

## Summary table

| Version | Wave | Focus | Codes |
|---------|------|--------|--------|
| **v1.0** | — | Baseline shipped | B1, B2, F1, F2, H1 |
| **v1.1** | 1 | DB identity | IAM1 |
| **v1.2** | 2 | Admin + authz | IAM2, IAM3 |
| **v1.3** | 3 | SPA cache | F3 |
| **v1.4** | 4 | MFA, sessions, rate limits | IAM4 |
| **v1.5** | 5 | Recovery + OAuth + phone | IAM5 |
| **v1.6** | 6 | Lifecycle, export, consent | IAM6 |
| **v1.7** | 7 | Passkeys, API keys | IAM7 |

---

[← Status](status.md) · [Overview](overview.md) · [Auth platform](auth-platform.md) · [Frontend](frontend.md)
