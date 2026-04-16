# Documentation

Central index for **roadmap**, **API tooling**, and cross-cutting planning.

**Handoff:** Implementation detail (pagination, loading, i18n, etc.) lives in **`backend/README.md`** and **`frontend/README.md`**. You do not need a fresh chat window if you read those; roadmap files only summarize phases and status.

## Roadmap

| Document | Contents |
|----------|----------|
| [Overview & standards](roadmap/overview.md) | Principles, monorepo layout, cross-phase docs, cadence, decided standards, Git workflow |
| [**Base evolution (waves & v1.x)**](roadmap/evolution.md) | **Single ordered plan** — backend + frontend by wave; version bumps of the template |
| [**Delivery status (checklist)**](roadmap/status.md) | **v1.0** + **F3** done; **IAM1–IAM3** mostly done with explicit [gaps](roadmap/status.md#iam-implementation-and-gaps-this-repo); later waves in [evolution.md](roadmap/evolution.md); verification commands |
| [Backend phases](roadmap/backend.md) | Phase 1 (API maturity), Phase 2 (security & reliability) |
| [Frontend phase](roadmap/frontend.md) | Angular stack, slices, folder rules, DoD, **F3** client query cache |
| [**Security (backend vs frontend, by phase)**](security.md) | i18n vs ngx-translate, production builds, obfuscation myths, hardening checklist |
| [**Identity & access (IAM1–IAM7)**](roadmap/auth-platform.md) | **§1.1** identity; **§2.2** priorities; **§2.3** ops/email/OAuth/compliance; phases IAM1–IAM7 |

## API contract tooling

- **Postman:** import [`postman/spring-web.postman_collection.json`](postman/spring-web.postman_collection.json) (collection lives with docs so backend and frontend share one obvious contract reference).

## Language

Roadmap and technical docs in this repo are maintained in **English** (see [overview](roadmap/overview.md) — aligns with code and commit messages).
