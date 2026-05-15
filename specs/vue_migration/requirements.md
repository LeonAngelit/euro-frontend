# Requirements — vue_migration

> Migrate the project from React 18 (JSX) to Vue 3 (TypeScript + Composition API) with Vite.

---

## R1 — Vue 3 and TypeScript as UI framework

The system SHALL use Vue 3 with the Composition API (`<script setup lang="ts">`)
for all UI components, replacing every React component, view, and entry point.

---

## R2 — Vite remains the build tool

The system SHALL continue to use Vite as the build tool. The `vite.config`
SHALL be updated to use `@vitejs/plugin-vue` instead of `@vitejs/plugin-react`.

---

## R3 — Vue Router replaces react-router-dom

The system SHALL use Vue Router 4 for client-side routing. Every route currently
defined in `App.jsx` (`/app`, `/login`, `/signup`, `/profile`, `/createroom`,
`/admin`, `/archive`, `/room`, `/country-select`, `/missing-email`, `/confirm-email`)
SHALL have an equivalent Vue Router route entry. Lazy loading of route components
SHALL be preserved.

---

## R4 — Pinia replaces React Context for global state

The system SHALL use Pinia as the global state management store, replacing the
`AppContext` React Context. All state fields (`user_logged`, `remember_user`,
`current_room`, `songs`, `updatable`, `selection`, `x_token`, `modal`) and all
setters (`setUserLogged`, `setRememberUser`, `setCurrentRoom`, `setSongs`,
`setUpdatable`, `setSelection`, `setXtoken`, `setModal`, `closeSession`) SHALL
be available as Pinia store properties and actions. LocalStorage/sessionStorage
persistence of the store SHALL be preserved with the same keys and merge logic.

---

## R5 — Google OAuth replaces @react-oauth/google

The system SHALL use a Vue-compatible Google OAuth library (`vue3-google-oauth`
or equivalent) to replace `@react-oauth/google`. The `GoogleLogin` button
component in Login and SignUp views SHALL render a Vue Google login button that
produces the same credential response format consumed by the backend.

---

## R6 — FontAwesome and react-icons migration

The system SHALL replace `@fortawesome/react-fontawesome` with
`@fortawesome/vue-fontawesome` (Vue 3 compatible). The system SHALL replace
`react-icons` with direct SVG imports or a Vue-compatible icon solution. All
icons currently rendered (`HiStar`, `VscChevronRight`, `GiPlayButton`,
`FiShare2`, `AiOutlineEdit`, `MdDeleteForever`) SHALL appear identically in the
migrated UI.

---

## R7 — Utility functions become composable functions or plain TS modules

Every utility module in `src/utils/` (`useGetAuthToken.js`,
`useGetSongs.js`, `useHandleCloseSession.js`,
`useNavigateWithCallback.js`, `useUpdateUserData.js`,
`useValidateEmail.js`, `useValidateToken.js`, `regexUtils.js`) SHALL be
rewritten in TypeScript. Functions that currently receive the React context
object SHALL receive the Pinia store instance instead. Functions that currently
call `useNavigate()` SHALL use Vue Router's `useRouter()` or `useRoute()`
composables. The exported signatures SHALL remain functionally equivalent.

---

## R8 — Configuration module converts to TypeScript

`src/config/config.js` SHALL be rewritten as `src/config/config.ts`. All
`import.meta.env.VITE_*` variables SHALL be accessed the same way. The config
object SHALL be strongly typed.

---

## R9 — PropType validation replaced by TypeScript interfaces

All `PropTypes` usage in React components SHALL be replaced by TypeScript
`defineProps<>()` with explicit interfaces. No `prop-types` package SHALL
remain in `package.json`.

---

## R10 — CSS styles preserved with Vue SFC scoping

Every `.css` file alongside a component or view SHALL be imported inside the
corresponding Vue SFC `<style>` block. Existing global styles in `src/index.css`
SHALL remain in a global stylesheet. The visual appearance of every page and
component SHALL not change after migration.

---

## R11 — Backend API integration unchanged

All axios HTTP calls, endpoints, headers (`Accept`, `Bearer`), request bodies,
and response handling SHALL remain identical. No backend API SHALL be modified
as part of this migration. The authentication flow (token acquisition via
`getAuthToken`, session token in `Bearer` header, Google OAuth credential
posting to `users/google-login`) SHALL work identically.

---

## R12 — bcryptjs password hashing preserved

Client-side password hashing with `bcryptjs` (`hashSync`, `compareSync`)
in SignUp, CreateRoom, AdminView, and Navigation SHALL continue to work with
the same salt rounds (12) and the same reversed-password obfuscation in
Login. `vite-plugin-node-polyfills` and `Buffer` polyfill SHALL remain to
support `bcryptjs` in the browser.

---

## R13 — PWA support preserved

`vite-plugin-pwa` SHALL remain in the project. The PWA manifest configuration
(name, short_name, icons, display, theme_color, background_color) SHALL be
identical to the current setup. Service worker auto-update behavior
(`registerType: 'autoUpdate'`) SHALL be preserved.

---

## R14 — Docker deployment unchanged

The `Dockerfile` multi-stage build and `compose.yaml` SHALL continue to work
with only minor adjustments (build output directory). The production deployment
SHALL produce a static assets directory served by nginx.

---

## R15 — Existing CLI tests pass unchanged

All Vitest tests in `tests/` (`cli.test.ts`, `cli_features.test.ts`,
`notes.test.ts`, `storage.test.ts`, `features.test.ts`) SHALL pass without
modification. These tests exercise the CLI subsystem which is already
TypeScript and not part of the UI layer.

---

## R16 — `index.html` entry point updated for Vue

The `index.html` file SHALL load the Vue application via `<script type="module">`
referencing `src/main.ts`. The `<div id="root">` mount point SHALL remain. The
PWA manifest link SHALL be preserved.

---

## R17 — Lazy loading and Suspense equivalent

The system SHALL use Vue `defineAsyncComponent()` or Vue Router's lazy route
loading to replicate the React `Suspense` + `lazy()` pattern. A loading
fallback ("Loading...") SHALL be shown while async components load.

---

## R18 — Modal system works via Pinia store

The modal system currently driven by `context.setModal({ visible, message,
status, confirm, onaccept, onclick, component })` SHALL be reimplemented using
the Pinia `modal` state and Vue's dynamic `<component :is="...">`. All three
modal render paths (plain message, confirm dialog, custom component) SHALL
function identically.

---

## R19 — Navigation auth guard implemented as Vue Router middleware

The auth/redirection logic currently scattered across React `useEffect` hooks
(login redirect, email validation check, country-selection redirect,
admin-only guard) SHALL be consolidated into Vue Router navigation guards
(`beforeEach`). Unauthenticated users SHALL be redirected to `/login`.

---

## R20 — Polling intervals preserved in Layout

The Layout component SHALL continue to poll `countries/refresh/{year}` every
40 seconds (when admin and refresh_enabled) and room data every 60 seconds
(when a room is active). These intervals SHALL be managed with Vue
`onMounted`/`onUnmounted` lifecycle hooks and `setInterval`/`clearInterval`
using `ref()` for interval IDs.

---

## R21 — Callback URL and room auth link handling preserved

The `callback_url` query parameter and `roomAuth` link handling currently
implemented across Home, Login, CountrySelection, and Layout SHALL continue
to work. When a user clicks a room invitation link, the system SHALL validate
the token via `POST rooms/verifyRoomToken/{userId}` and redirect accordingly.
Vue Router's `useRoute().query` SHALL be used instead of
`window.location.href.split(...)`.

---

## R22 — The project SHALL build and run locally

After migration, `npm run dev` SHALL start the Vite dev server with HMR and
`npm run build` SHALL produce a production build without errors.

---

## R23 — The project SHALL be deployable to production

After migration, `docker compose up --build` SHALL produce a running container
exposing the app on port 8080.

---

## R24 — No React dependencies remain

After migration, `package.json` SHALL NOT contain any `react`,
`react-dom`, `react-router-dom`, `@react-oauth/google`,
`@testing-library/react`, `@vitejs/plugin-react`, `prop-types`, or
`eslint-plugin-react` dependencies. All Vue equivalents SHALL be present.

---

## R25 — Flag-icons and polyfill dependencies preserved

`flag-icons` SHALL remain in `package.json` and its CSS SHALL be imported in
the relevant Vue components. `vite-plugin-node-polyfills`,
`vite-plugin-env-compatible`, and `@esbuild-plugins/node-globals-polyfill`
SHALL remain to support `bcryptjs`, `Buffer`, and `process` in the browser.

---

## R26 — ReportWebVitals removed or replaced

The `reportWebVitals.js` file SHALL be removed. Vue 3 does not use
`web-vitals` via `reportWebVitals`. If performance monitoring is desired in
the future, it SHALL be added via a separate Vue plugin, not as part of this
migration.