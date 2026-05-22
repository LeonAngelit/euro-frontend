# Tasks — Comprehensive Architecture and Styling Analysis

> All tasks operate on the single output file `docs/ARCHITECTURE.md`.
> No source code or tests are modified.

## Prerequisites

- [x] `docs/ARCHITECTURE.md` must be read and understood before any edit.
- [x] `src/` directory tree must be freshly enumerated.
- [x] `package.json` dependencies must be read for version accuracy.
- [x] Every `.vue` file in `src/components/` must be read to extract props,
      slots, and purpose.
- [x] Every `.vue` file in `src/views/` must be read to understand state and
      API dependencies.
- [x] `src/index.css` must be read for styling documentation accuracy.
- [x] `src/stores/app.ts` must be read for state management documentation.
- [x] `src/router/index.ts` must be read for routing documentation.
- [x] `src/composables/*.ts` must be read for composables documentation.
- [x] `src/locales/*` must be read for i18n documentation.
- [x] `src/cli.ts`, `src/notes.ts`, `src/storage.ts`, `src/features.ts`,
      `src/prompts.ts` must be read for CLI documentation.
- [x] `tsconfig.json`, `vite.config.js`, `Dockerfile`, `vercel.json` must be
      read for build/deployment documentation.
- [x] `tests/` directory must be enumerated for testing strategy documentation.

## Implementation Tasks

### T1 — Write Project Overview section
- [x] Replace the existing opening paragraphs with a summary describing the
      Vue 3 SPA for Eurovision voting rooms and the separate CLI subsystem.
      Covers: R1, R14.

### T2 — Write Tech Stack section
- [x] Create a table listing every dependency from `package.json` grouped by
      category (Framework, Routing, State, i18n, HTTP, UI, Auth, Bundler,
      Testing, CLI, Linting, Deployment). Include version and purpose.
      Covers: R1.

### T3 — Write Project Structure section
- [x] Document the complete `src/` directory tree in a code block, listing
      all files. Covers: R2.

### T4 — Write Component Catalog
- [x] Document AdminPanel (Form ref pattern, password dialog). Covers: R3.
- [x] Document ClassificationView (UserCard list, computed sorting). Covers: R3.
- [x] Document UserCard (glassmorphism, gold frame, glow, position badges,
      color overlay). Covers: R3, R5.
- [x] Document Collapsible (toggle visibility). Covers: R3.
- [x] Document CountryPicker (flag cards, checkboxes). Covers: R3.
- [x] Document Footer (copyright, gradients). Covers: R3.
- [x] Document Form (callback ref pattern). Covers: R3.
- [x] Document Modal (message, confirm, component, Eurovision styling). Covers: R3, R5.
- [x] Document Navigation (user menu, admin panel, pink gradient). Covers: R3, R5.
- [x] Document NotFound (404, auto-redirect). Covers: R3.
- [x] Document RoomPicker (room cards, CRUD actions). Covers: R3.
- [x] Document RoomNameEditForm (inline editor in Modal). Covers: R3.

### T5 — Write View Catalog
- [x] Document all 10 views with route, purpose, state/API dependencies.
      Covers: R4.

### T6 — Write Styling Theme section
- [x] Document CSS custom properties color system. Covers: R5.
- [x] Document body background layers (spotlights, sparkles, gradient). Covers: R5.
- [x] Document glassmorphism pattern (.container backdrop-filter). Covers: R5.
- [x] Document Navigation styling. Covers: R5.
- [x] Document button system (.btn-primary, .btn-secondary). Covers: R5.
- [x] Document typography (pink headings, gold h1). Covers: R5.
- [x] Document card patterns (.room-card glass effect). Covers: R5.
- [x] Document UserCard deep-dive styling. Covers: R5.
- [x] Document form inputs styling. Covers: R5.
- [x] Document modal styling. Covers: R5.
- [x] Document scrollbar and selection styling. Covers: R5.
- [x] Document responsive breakpoints and mobile-first approach. Covers: R5.
- [x] Document active link styling (.router-link-exact-active). Covers: R5.

### T7 — Write State Management section
- [x] Document Pinia store fields, actions, custom storage, persist config,
      and auto-fetch watcher. Covers: R6.

### T8 — Write Routing section
- [x] Document route table, navigation guards, createWebHistory, and Suspense
      integration. Covers: R7.

### T9 — Write API Integration section
- [x] Document direct axios pattern, base URL, auth flow, and endpoint
      categories. Covers: R8.

### T10 — Write i18n section
- [x] Document vue-i18n setup, locale files, IP-based detection composable,
      default/fallback. Covers: R9.

### T11 — Write Composables section
- [x] List all 8 composables with file path, purpose, and return value.
      Covers: R10.

### T12 — Write CLI Subsystem section
- [x] Document src/cli.ts commands, domain models, storage strategy, and
      feature-add flow. Covers: R11.

### T13 — Write Testing Strategy section
- [x] Document Vitest setup, component tests, CLI tests, 40 test files
      overview, build verification test. Covers: R12.

### T14 — Write Build & Deployment section
- [x] Document npm scripts, Docker multi-stage build, Vercel deployment, PWA
      config. Covers: R13.

### T15 — Write Architectural Patterns section
- [x] Document callback refs pattern, polling, direct API calls, known issues.
      Covers: R14.

### T16 — Final review pass
- [x] Verify every R1–R14 section is present. Covers: R15, R16, R17.
- [x] Verify all file paths mentioned in the document match the actual source
      tree. Covers: R16.
- [x] Run `./init.sh` to ensure no tests are broken (should be a no-op since
      no source code changes). Covers: stability gate.
- [x] Update `progress/current.md` with session summary.

## Traceability Map (to be filled by implementer)

- R1 → T2
- R2 → T3
- R3 → T4
- R4 → T5
- R5 → T6
- R6 → T7
- R7 → T8
- R8 → T9
- R9 → T10
- R10 → T11
- R11 → T12
- R12 → T13
- R13 → T14
- R14 → T15
- R15 → T16
- R16 → T16
- R17 → T16
