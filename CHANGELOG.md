# Changelog

All notable changes to this template are documented here. Version labels **`v1.x`** follow [docs/roadmap/evolution.md](docs/roadmap/evolution.md) (template maturity), not npm or Gradle artifact versions.

## v1.1.0

**Closed:** IAM1 baseline for this repo (email/password identity, lockout, DB users) plus current-user profile for the SPA.

- **Backend:** `GET /api/v1/me` returns id, email, enabled, lock state, `createdAt`, roles (any authenticated user).
- **Frontend:** route `/me`, shell nav **Profile** / **Perfil**, TanStack Query + cache invalidation on login/logout.
- **Tooling:** Postman request **1.05 Me - Current profile** (after **1. Auth - Login**).
- **Docs:** `status.md` marks **v1.1** **Done**; roadmap index updated.

To record this release in Git (optional):

```bash
git tag -a v1.1.0 -m "Template v1.1: IAM1 + GET /me"
```
