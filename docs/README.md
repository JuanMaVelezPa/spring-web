# Documentation

Central index for **roadmap**, **API tooling**, and cross-cutting planning.

**Handoff:** Implementation detail (pagination, loading, i18n, etc.) lives in **`backend/README.md`** and **`frontend/README.md`**. You do not need a fresh chat window if you read those; roadmap files only summarize phases and status.

## Roadmap

| Document | Contents |
|----------|----------|
| [Overview & standards](roadmap/overview.md) | Principles, monorepo layout, cross-phase docs, cadence, decided standards, Git workflow |
| [**Delivery status (checklist)**](roadmap/status.md) | Timeline **B1 → B2 → F1 → F2 → H1**; **F2+** UI polish recap; verification commands |
| [Backend phases](roadmap/backend.md) | Phase 1 (API maturity), Phase 2 (security & reliability) |
| [Frontend phase](roadmap/frontend.md) | Angular stack, slices, folder rules, DoD |
| [**Security (backend vs frontend, by phase)**](security.md) | i18n vs ngx-translate, production builds, obfuscation myths, hardening checklist |

## API contract tooling

- **Postman:** import [`postman/spring-web.postman_collection.json`](postman/spring-web.postman_collection.json) (collection lives with docs so backend and frontend share one obvious contract reference).

## Language

Roadmap and technical docs in this repo are maintained in **English** (see [overview](roadmap/overview.md) — aligns with code and commit messages).
