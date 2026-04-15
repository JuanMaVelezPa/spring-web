# Branches UI (Angular)

Angular SPA for the portfolio monorepo: **login**, **paged branch list**, and **create branch**. It targets the backend contract under `/api/v1` and surfaces **Problem Details** messages when the API returns them.

## Stack

- Angular 21 (standalone components, lazy routes)
- Signals for local UI state
- **Tailwind CSS v4** with **PostCSS** (official Angular guide: [Install Tailwind CSS with Angular](https://tailwindcss.com/docs/installation/framework-guides/angular))
- **DaisyUI v5** as a Tailwind plugin ([install](https://daisyui.com/docs/install/), [themes](https://daisyui.com/docs/themes/))
- Vitest via `ng test`

### Tailwind + DaisyUI (how this repo is wired)

| Piece | Purpose |
|-------|---------|
| `.postcssrc.json` | Registers `@tailwindcss/postcss` exactly as in the Tailwind + Angular docs. |
| `src/styles.css` | `@import "tailwindcss" source(".")` limits scanning to `src/` (paths are relative to the stylesheet). |
| `@plugin "daisyui" { themes: … }` | Enables **light** (default) and **dark** (`prefers-color-scheme: dark`). Matches toggling `data-theme` on `<html>` in `index.html` and `app-shell`. |
| `angular.json` → `styles` | Includes `src/styles.css` so the CLI runs PostCSS on the global stylesheet. |

Production build turns off `inlineCritical` for styles so the main stylesheet is not deferred via the `media="print"` trick (avoids unstyled first paint in some browsers).

## Tooling versions (last reviewed)

These match the **latest stable** lines on npm for this stack (April 2026), except where noted:

| Package | Version | Notes |
|--------|---------|--------|
| `@angular/core` and Angular framework packages | **21.2.8** | Latest patch on the stable 21.x line. |
| `@angular/cli` / `@angular/build` | **21.2.7** | Latest CLI on npm; patch may trail framework slightly. |
| `tailwindcss` / `@tailwindcss/postcss` | **4.2.2** | Latest Tailwind v4 on npm. |
| `daisyui` | **5.5.19** | Latest v5 (Tailwind v4 plugin). |
| `typescript` | **~5.9.x** | Required by Angular 21 (`>=5.9 <6.1`); do not jump to TS 6 until Angular supports it. |
| `rxjs` | **~7.8.2** | Latest 7.8.x. |

Angular **22** exists as **prerelease** (`next`); this project stays on **21.x stable** for portfolio stability.

## Prerequisites

- Node.js 20+ (tested with Node 22)
- For local dev: API at `http://localhost:8080` when you run Spring alone (Gradle). With **Docker Compose**, use the SPA at **http://localhost:8080** (`web`) and the API **direct** at **http://localhost:8081** (`app`); the bundled UI still uses relative `/api` on :8080, which Nginx forwards to Spring.

## Install

```bash
cd frontend
npm ci
```

## Development

`ng serve` is configured with **`proxy.conf.json`**: browser calls go to `http://localhost:4200/api/...` and are forwarded to the Spring app, so **JWT stays in memory** and the **refresh cookie** can be set on the same host as the dev server.

```bash
npm start
```

Open `http://localhost:4200/`. Default credentials (if you copied [`.env.example`](../.env.example) to `.env` at repo root): **username** `admin`, **password** `Admin_ChangeMe_2026!`. If you changed `APP_USER` / `APP_PASSWORD`, use those values instead ([root README](../README.md#ui-login-default-values)).

## Build

```bash
npm run build
```

This runs `ng build` (default **production** configuration) then `scripts/patch-index-html.mjs` so hashed `styles-*.css` / `main-*.js` / `chunk-*.js` links in `index.html` are **root-absolute** (`/…`), which avoids broken asset URLs on deep links when a client ignores `<base href="/">`.

Output (Angular application builder): **`dist/frontend/browser/`** — that folder is what you copy to a static host ([manual deployment](https://angular.dev/tools/cli/deployment)).

## Docker (local / Compose)

Aligned with Angular’s deployment guide: **multi-stage image** — Node stage runs `npm ci` + `npm run build`, then static files are copied into **nginx**.

- **Build stage:** `ENV NODE_ENV=development` so `npm ci` installs **devDependencies** (Tailwind, Postcss, DaisyUI, `@angular/build`, etc.); without this, production installs can skip them and ship broken CSS.
- **Runtime:** `nginx.conf` serves `browser/` output, uses **`try_files $uri $uri/ /index.html`** for SPA deep links, and a regex location so real **`.css` / `.js`** files never fall back to `index.html` (which would break MIME types).
- **Compose:** from the repo root, service **`web`** publishes **:8080**; API **`app`** is **:8081** for direct access; the UI still calls `/api` on **:8080** through the nginx proxy.

```bash
# from repository root
docker compose build --no-cache web
docker compose up -d web
```

## Tests

```bash
npm test
```

### E2E smoke (Playwright)

```bash
# install browsers once
npx playwright install

# run the critical-path smoke
npm run test:e2e:smoke
```

Defaults:
- `E2E_BASE_URL=http://localhost:8080`
- `E2E_USER=admin`
- `E2E_PASSWORD=Admin_ChangeMe_2026!`

The smoke verifies: login -> branches list -> create branch -> back to list with created code visible.

## i18n (EN/ES)

- Runtime i18n is implemented with a lightweight `I18nService` (`core/i18n`), no external runtime dependency.
- Locale is persisted via `UserPreferencesService` (`spring-web.pref.v1.locale`), and can be switched from login and shell headers.
- Supported locales: `en`, `es`.

## OpenAPI generation (typed models baseline)

Generate/update the frontend OpenAPI typings from the backend:

```bash
# default source: http://localhost:8081/v3/api-docs
npm run openapi:generate
```

Optional custom spec URL:

```bash
OPENAPI_SPEC_URL=http://localhost:8081/v3/api-docs npm run openapi:generate
```

Output file: `src/app/core/models/openapi.generated.ts`.

## Phase 5 completion snapshot

- First vertical slice complete: login + paged branch list + create branch.
- Theme + language preferences persisted (theme + locale).
- Quality gate complete:
  - `npm test` (unit tests) passes.
  - `npm run test:e2e:smoke` (Playwright smoke) passes.
  - `npm run openapi:generate` refreshes typed OpenAPI models when backend is reachable.

## Folder layout

```text
src/app/
  core/           # Auth, HTTP interceptor, branch API client, shared types
  features/       # auth/login, branches/list, branches/create (each: .ts + .html)
  layout/         # App shell (nav, theme toggle, logout) — .ts + .html
  shared/footer/  # Site footer (author links); reused in shell + login
```

## Documentation

- [Repository hub](../README.md)
- [Roadmap & Postman](../docs/README.md)

## Contract notes

- List: `GET /api/v1/branches?page=&size=` returns `PagedResponse` (`content`, `totalElements`, `page`, `size`, `totalPages`).
- Login: `POST /api/v1/auth/login` returns `{ "token": "..." }`; refresh cookie is HttpOnly and not read by this UI.
- Logout: `POST /api/v1/auth/logout` clears the refresh cookie; the SPA clears the access token from memory.
