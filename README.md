# ZigWheels Automation Framework

UI + API test automation for [zigwheels.com](https://www.zigwheels.com), built with **Playwright** and **TypeScript** using a hybrid Page Object Model.

---

## Stack

| Concern        | Choice                                 |
| -------------- | -------------------------------------- |
| Runner         | Playwright Test                        |
| Language       | TypeScript 5 (strict)                  |
| Design pattern | Page Object Model + component objects  |
| Test data      | External JSON (`test-data/`)           |
| Config         | Env-driven (`config/env/.env.<env>`)   |
| Reporting      | HTML, Allure, JUnit, JSON              |
| Quality gates  | ESLint + Prettier + `tsc --noEmit`     |
| CI             | GitHub Actions (matrix + nightly cron) |

---

## Project structure

```
zigwheels-automation/
├── .github/workflows/playwright.yml   # CI pipeline (matrix + nightly)
├── .vscode/                           # Shared editor settings
├── config/
│   ├── app.config.ts                  # Typed config resolver, single source of truth
│   └── env/                           # .env.qa / .env.prod / .env.example
├── src/
│   ├── api/ApiClient.ts               # Request wrapper for API specs
│   ├── constants/                     # Routes, timeouts, expected copy
│   ├── fixtures/                      # Custom Playwright fixtures (DI for pages)
│   ├── pages/
│   │   ├── base/BasePage.ts           # Shared waits, clicks, overlay handling
│   │   ├── components/                # Header, Footer - reused across pages
│   │   └── *.Page.ts                  # HomePage, NewCarsPage, BikesPage, ...
│   ├── types/                         # Domain interfaces
│   └── utils/                         # logger, data-reader, helpers
├── test-data/                         # JSON data for data-driven specs
├── tests/
│   ├── api/                           # Headless endpoint checks
│   ├── e2e/                           # Multi-page user journeys
│   └── ui/{smoke,regression}/         # Tagged UI suites
├── reports/                           # Generated - git-ignored
├── playwright.config.ts
└── tsconfig.json
```

### Layer rules

1. **Specs never contain locators.** They call page-object methods only.
2. **Page objects never contain `expect`.** They return state; specs assert.
3. **No hardcoded waits or timeouts** in specs - use `src/constants/timeouts.ts`.
4. **No hardcoded test data** in specs - use `test-data/*.json` via `readJson`.
5. Anything used by two or more pages becomes a **component** in `src/pages/components/`.

---

## Getting started

```bash
npm install
npm run prepare:browsers      # downloads Playwright browsers
npm test                      # full suite
```

## Running tests

```bash
npm run test:smoke            # @smoke tagged
npm run test:regression       # @regression tagged
npm run test:api              # API project, no browser
npm run test:e2e              # journey specs
npm run test:chrome           # single browser
npm run test:headed           # watch it run
npm run test:debug            # Playwright inspector
npm run test:ui               # Playwright UI mode
npm run test:qa               # TEST_ENV=qa
npm run test:prod             # TEST_ENV=prod
```

## Reports

```bash
npm run report                # HTML report
npm run report:allure         # Allure (requires allure CLI on PATH)
npm run trace reports/...     # open a trace file
```

Traces, screenshots, and video are captured **on failure only**.

## Quality gates

```bash
npm run typecheck             # tsc --noEmit
npm run lint                  # ESLint
npm run format                # Prettier write
```

---

## Environments

`TEST_ENV` selects `config/env/.env.<env>` (default `qa`). Precedence is:

1. Real process environment (what CI injects)
2. The `.env.<env>` file
3. Defaults in `config/app.config.ts`

Never commit real credentials - `.env.*` is git-ignored except `.env.example`. In CI, inject them as repository secrets (see the workflow's `env:` block).

---

## Adding a new page object

1. Create `src/pages/YourPage.ts` extending `BasePage`; implement `path` and `pageIdentifier`.
2. Add its route to `src/constants/endpoints.ts`.
3. Register it as a fixture in `src/fixtures/pages.fixture.ts`.
4. Export it from `src/pages/index.ts`.
5. Write the spec under `tests/ui/<suite>/`, importing `{ test, expect }` from `@fixtures/index`.

## Path aliases

Configured in `tsconfig.json` and honoured by the Playwright runner:

`@pages/*` `@components/*` `@fixtures/*` `@utils/*` `@constants/*` `@models/*` `@api/*` `@config/*` `@data/*`

---

## Tagging convention

| Tag           | Meaning                                   |
| ------------- | ----------------------------------------- |
| `@smoke`      | Build-verification, must pass on every PR |
| `@regression` | Full functional coverage, nightly         |
| `@e2e`        | Cross-page user journeys                  |
| `@api`        | Endpoint-level, no browser                |

---

## A note on locators

ZigWheels is a third-party site with no test IDs and markup that changes without notice. The locators in `src/pages/` are written defensively (role-based first, class-fragment fallbacks) but **must be re-verified against the live DOM** before you trust a suite. Use `npm run codegen` to capture current selectors, and keep every fix inside the page object - never in a spec.
