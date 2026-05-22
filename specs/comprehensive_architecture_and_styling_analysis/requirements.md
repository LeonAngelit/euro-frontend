# Requirements — Comprehensive Architecture and Styling Analysis

> All requirements below govern the content and structure of
> `docs/ARCHITECTURE.md` (the "document"). The document is the single output
> of this feature.

---

## R1 — Tech Stack Accuracy

WHEN the document is generated, the system SHALL include a Tech Stack section
that lists every runtime and dev dependency present in `package.json` as of
feature 19, including Vue 3, Vite 6, TypeScript (strict), vue-router 4, Pinia,
pinia-plugin-persistedstate, vue-i18n@9, vue3-google-login, axios,
@iconify/vue, @fortawesome/vue-fontawesome, flag-icons, vite-plugin-pwa,
vite-plugin-node-polyfills, buffer, Vitest, @vue/test-utils, jsdom,
Commander.js, ESLint, and eslint-plugin-vue.

## R2 — Project Structure

WHEN the document is generated, the system SHALL describe the complete
directory tree of `src/`, including all views (10), components (12),
composables (8), locales (3), stores (1), router, config, utils, and root
files (App.vue, Layout.vue, main.ts, index.css, cli.ts, storage.ts, notes.ts,
features.ts, prompts.ts, env.d.ts).

## R3 — Component Catalog

WHEN the document is generated, the system SHALL provide a Component Catalog
that documents every Vue component in `src/components/`, describing its
purpose, key props (if any), slots (if any), and scoped styling patterns.

## R4 — View Catalog

WHEN the document is generated, the system SHALL provide a View Catalog that
documents every Vue view in `src/views/`, describing its purpose and its
relationship to state, components, and API calls.

## R5 — Styling Theme Documentation

The document SHALL contain a dedicated "Styling Theme" section that documents
the Eurovision visual identity, including:

- Color system (CSS custom properties: --primary-color, --euro-pink,
  --euro-gold, --euro-yellow, --euro-pink-background, --primary-color-background)
- Body background (navy with radial pink spotlights, sparkle dots, linear gradient)
- Glassmorphism pattern (backdrop-filter blur on .container, semi-transparent backgrounds)
- Navigation style (pink gradient header, gold star icon, drop-shadow glow)
- Button system (.btn-primary with pink glow, .btn-secondary with gold glow)
- Typography (pink headings, gold h1 with text-shadow)
- Card patterns (.room-card glass effect, gold borders, hover glow)
- UserCard styling (glassmorphism with backdrop-filter: blur(20px), gold avatar
  frame, position badges with gold/silver/bronze gradients, color overlay, glow
  effects)
- Form inputs (gold borders, pink focus glow, dark semi-transparent backgrounds)
- Modal styling (navy background, pink borders, glow shadows, slide-in animation)
- Custom scrollbar (pink thumb)
- Text selection (pink highlight)
- Responsive breakpoints (600px, 768px, 1000px)
- Active link styling (.router-link-exact-active gold bottom border)

## R6 — State Management Documentation

WHEN the document is generated, the system SHALL document the Pinia store
(`src/stores/app.ts`), including all state fields (userLogged, rememberUser,
currentRoom, songs, updatable, selection, xToken, modal), all actions, the
custom storage adapter (localStorage + sessionStorage fallback), persist
configuration (excluding 'modal'), and auto-fetch behavior on xToken change.

## R7 — Routing Documentation

WHEN the document is generated, the system SHALL document the Vue Router
configuration in `src/router/index.ts`, including all 11 routes, lazy loading
with dynamic imports and Suspense, navigation guards (requiresAuth,
guestOnly, requiresAdmin), and createWebHistory mode.

## R8 — API Integration Documentation

WHEN the document is generated, the system SHALL document the API integration
pattern, including direct axios calls (no service layer), base URL from
VITE_REACT_APP_BASEURL env var, auth flow (getAuthToken → Bearer token),
and all documented endpoint patterns.

## R9 — i18n Documentation

WHEN the document is generated, the system SHALL document the
internationalization setup, including vue-i18n@9 with non-legacy mode,
Spanish default with English alternative, IP-based locale detection via
useDetectLocale composable (ipapi.co + ip-api.com fallback), and the three
files in src/locales/.

## R10 — Composables Documentation

WHEN the document is generated, the system SHALL list and describe all 8
composables in `src/composables/` (useGetAuthToken, useDetectLocale,
useValidateToken, useValidateEmail, useUpdateUserData,
useNavigateWithCallback, useHandleCloseSession, useGetSongs).

## R11 — CLI Subsystem Documentation

WHEN the document is generated, the system SHALL document the CLI subsystem
(Commander.js, src/cli.ts), including all commands (add, list, show, delete,
search, recent, edit, feature-add), atomic file persistence (temp + rename),
and domain models (NoteData, Feature).

## R12 — Testing Strategy Documentation

WHEN the document is generated, the system SHALL document the testing
strategy, including Vitest with node environment, @vue/test-utils for
component tests, the 40 test files in tests/, and the build verification test.

## R13 — Build & Deployment Documentation

WHEN the document is generated, the system SHALL document the build &
deployment setup, including npm scripts (dev, build, serve, lint, test),
Docker multi-stage build (node → nginx), Vercel deployment (vercel.json with
SPA rewrites), and PWA configuration (vite-plugin-pwa with autoUpdate).

## R14 — Architecture Principles

WHILE the document is generated, the system SHALL document the architectural
principles that apply to the SPA portion of the project (as distinct from the
CLI subsystem), including patterns such as callback refs for form field
access, polling for admin country refresh and room data updates, direct axios
calls without service layer, and known issues/limitations.

## R15 — Unwanted: Missing Sections

IF any of the areas enumerated in R1–R14 is missing from the generated
document, THEN the system SHALL NOT mark the feature as complete until the
gap is filled.

## R16 — Unwanted: Incorrect or Outdated Information

IF the document contains information that contradicts the current source code
(e.g., wrong dependency version, wrong component name, wrong directory),
THEN the system SHALL NOT mark the feature as complete until the
contradiction is resolved.

## R17 — Verifiability

WHEN the document is reviewed, the system SHALL ensure that every section
can be verified against the source code by a human or agent reading the
corresponding file paths listed in each section.
