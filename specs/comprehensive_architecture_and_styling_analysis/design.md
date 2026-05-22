# Design — Comprehensive Architecture and Styling Analysis

## Single Output

The only output of this feature is the file `docs/ARCHITECTURE.md`. No source
code in `src/` or `tests/` is modified.

## Document Structure

The updated `docs/ARCHITECTURE.md` SHALL be organized into the following
top-level sections (in order):

### 1. Project Overview
- What the project is: a Vue 3 SPA for Eurovision Song Contest voting rooms
- The separate CLI subsystem for notes/feature management
- Core principles: SPA is direct-API-call pattern; CLI is atomic-file-storage

### 2. Tech Stack
A table with columns: Category | Technology | Version (from package.json) | Purpose

Categories:
- Framework (Vue 3 + Composition API + `<script setup>`, Vite 6, TypeScript strict)
- Routing (vue-router 4, lazy loading, Suspense, createWebHistory)
- State Management (Pinia + pinia-plugin-persistedstate)
- i18n (vue-i18n@9, Spanish default, English, IP-based detection)
- HTTP Client (axios, direct calls)
- UI Icons (@iconify/vue, @fortawesome/vue-fontawesome, flag-icons)
- Auth (vue3-google-login)
- Bundler (Vite with @vitejs/plugin-vue, env-compatible, node-polyfills, PWA)
- Testing (Vitest, @vue/test-utils, jsdom)
- CLI (Commander.js)
- Linting (ESLint + eslint-plugin-vue)
- Deployment (Docker multi-stage nginx, Vercel SPA rewrites)

### 3. Project Structure
A tree representation of `src/` with all files and folders.

### 4. Component Catalog
For each component in `src/components/`:

| Component | File | Purpose | Key Props | Scoped Styling Notes |
|-----------|------|---------|-----------|---------------------|

Components to document:
- AdminPanel (Form ref pattern, password dialog)
- ClassificationView (UserCard list, computed sorting)
- UserCard (glassmorphism, gold frame, glow, color overlay, position badges)
- Collapsible (toggle visibility, CSS classes)
- CountryPicker (flag cards, checkboxes)
- Footer (copyright, Eurovision gradient)
- Form (callback ref pattern)
- Modal (message, confirm, component injection, Eurovision styling)
- Navigation (user menu, admin panel, pink gradient)
- NotFound (auto-redirect, 404)
- RoomPicker (room cards, select/edit/share/delete)
- RoomNameEditForm (inline editor, injected in Modal)

### 5. View Catalog
For each view in `src/views/`:

| View | File | Route | Purpose | Key State/API Dependencies |
|------|------|-------|---------|---------------------------|

Views to document: Home, Login, SignUp, UserDetails, CreateRoom, Room,
Archive, AdminView, CountrySelect, MissingEmail (used for /missing-email
and /confirm-email).

### 6. Styling Theme
A dedicated deep-dive section covering:

- **Color System**: CSS custom properties in `src/index.css :root`, with
  hex/rgb values and purpose of each variable.
- **Background**: The multi-layered background CSS (radial spotlights, sparkle
  dots, linear gradient), fixed attachment.
- **Glassmorphism**: The `.container` backdrop-filter blur pattern,
  semi-transparent rgba backgrounds, border treatments.
- **Navigation**: Pink gradient, gold star icon, drop-shadow.
- **Buttons**: `.btn-primary` (pink glow), `.btn-secondary` (gold glow),
  hover transitions.
- **Typography**: Pink headings (`h1-h3`), gold `h1` with text-shadow.
- **Card Patterns**: `.room-card` glass effect, gold borders, hover glow.
- **UserCard Deep-Dive**: Glassmorphism card (`backdrop-filter: blur(20px)`),
  gold rounded avatar frame, position badges (gold/silver/bronze gradient
  text), color overlay from user preference, glow shadows.
- **Form Inputs**: Gold borders, pink focus ring, dark semi-transparent
  backgrounds.
- **Modal**: Navy background, pink borders, glow shadows, slide-in animation.
- **Scrollbar**: Custom `::-webkit-scrollbar` with pink thumb.
- **Selection**: `::selection` pink highlight.
- **Responsive**: Breakpoints (600px, 768px, 1000px), mobile-first approach.
- **Active Links**: `.router-link-exact-active` gold bottom border.

### 7. State Management
Documentation of `src/stores/app.ts`:
- State fields with types
- Actions/methods
- Custom storage adapter (`appContextStorage`) with localStorage/sessionStorage logic
- Persist configuration (key, paths, excluding modal)
- Auto-fetch songs via watcher on xToken

### 8. Routing
Documentation of `src/router/index.ts`:
- Route table (path, name, component, meta flags)
- Navigation guard logic (auth, guest, admin checks)
- createWebHistory and Suspense integration

### 9. API Integration
- Direct axios calls pattern (no service layer)
- Base URL from `VITE_REACT_APP_BASEURL`
- Auth token flow: `/getAuthToken` with `Authorization` header → Bearer token
- Documented endpoints: rooms CRUD, user CRUD, countries/refresh,
  countries list, room verification, delete user

### 10. i18n
- vue-i18n@9 non-legacy mode
- `src/locales/index.ts`, `es.json`, `en.json`
- IP-based detection via `useDetectLocale` (ipapi.co → ip-api.com fallback)
- `es` as default and fallback locale

### 11. Composables
List of all 8 composables with file path, purpose, and return value.

### 12. CLI Subsystem
- Entry point: `src/cli.ts` (Commander.js)
- Commands table: name, description, arguments, options
- Domain models: `src/notes.ts` (Note, NoteData, NoteError, NoteNotFound)
- Storage: `src/storage.ts` (atomic write: temp file + rename)
- Features: `src/features.ts` (Feature, FeatureError)
- Prompts: `src/prompts.ts` (interactive prompts)
- Testing: 40 files, CLI-specific tests in `tests/cli.test.ts`,
  `tests/cli_features.test.ts`, `tests/notes.test.ts`, `tests/storage.test.ts`,
  `tests/features.test.ts`

### 13. Testing Strategy
- Framework: Vitest with node environment
- Component tests: @vue/test-utils
- 40 test files covering components, views, composables, stores, router, CLI
- Build verification test

### 14. Build & Deployment
- npm scripts table
- Docker (multi-stage: node → nginx, `Dockerfile`)
- Vercel (`vercel.json` with SPA rewrites, build → dist)
- PWA (vite-plugin-pwa, autoUpdate, manifest with star icons)

### 15. Architectural Patterns & Conventions
- Callback refs pattern in Form/AdminPanel
- Polling: admin country refresh (40s), room data refresh (60s)
- Direct API calls (no service/DAO layer)
- Known issues and limitations

## Discarded Alternatives

1. **Single large Markdown file vs. multiple smaller docs**: Chosen single
   file because the current convention in the project is a single
   `ARCHITECTURE.md`. Splitting would require changing the project convention
   and would break the existing "update ARCHITECTURE.md" acceptance criteria
   in every prior feature.

2. **Auto-generation from code comments vs. manual writing**: Manual writing
   is chosen because the project does not have code-comment extraction tools,
   and the document serves as a human-readable reference that must include
   design rationale and patterns that cannot be inferred from source alone.

## Files Modified

| File | Action |
|------|--------|
| `docs/ARCHITECTURE.md` | Rewrite entirely (replacing the current CLI-centric document) |
| `progress/current.md` | Write session progress (per AGENTS.md) |

## Files NOT Modified

- `src/` (no source code changes)
- `tests/` (no test changes)
- `feature_list.json` (status change only from `pending` to `done` after
  review approval)
