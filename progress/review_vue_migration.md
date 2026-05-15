# Review — feature vue_migration

**Verdict:** CHANGES_REQUESTED

## Traceability requirements ↔ tests

- R1: [x] covered — All 18 Vue SFCs use `<script setup lang="ts">`. Entry point `src/main.ts` uses `createApp()`. Verified: App.vue, Layout.vue, all views, all components.
- R2: [x] covered — `vite.config.js` uses `@vitejs/plugin-vue` instead of `@vitejs/plugin-react`. PWA, node-polyfills, env-compatible plugins preserved.
- R3: [x] covered — `src/router/index.ts` has 13 routes with `createWebHistory()` and `() => import()` lazy loading.
- R4: [x] covered — `src/stores/app.ts` has all 8 state fields (`userLogged`, `rememberUser`, `currentRoom`, `songs`, `updatable`, `selection`, `xToken`, `modal`) and all 9 actions (`setUserLogged`, `setRememberUser`, `setCurrentRoom`, `setSongs`, `setUpdatable`, `setSelection`, `setXToken`, `setModal`, `closeSession`, `fetchSongs`). Persistence with key `"app-context"` and merge-on-init logic implemented manually via `watch()`.
- R5: [x] covered — `vue3-google-login` installed and used in Login.vue (line 4, line 163) and SignUp.vue (line 4, line 183) via `GoogleLogin` component.
- R6: [x] covered — `@fortawesome/vue-fontawesome` and `@iconify/vue` installed. FontAwesome used in Form.vue (eye icons), `Icon` from `@iconify/vue` used in Navigation.vue (star), RoomPicker.vue (play, share, delete, edit icons), CountryPicker.vue (play-circle icon).
- R7: [x] covered — All 7 utility modules converted to TypeScript composables in `src/composables/`: useGetAuthToken.ts, useGetSongs.ts, useHandleCloseSession.ts, useNavigateWithCallback.ts, useUpdateUserData.ts, useValidateEmail.ts, useValidateToken.ts. RegexUtils in `src/utils/regexUtils.ts`.
- R8: [x] covered — `src/config/config.ts` has TypeScript `Config` interface with all env var fields typed.
- R9: [x] covered — All Vue components use `defineProps<>()` with TypeScript interfaces instead of PropTypes. Verified: Form.vue (FormProps), Modal.vue (ModalProps), CountryPicker.vue (CountryPickerProps), RoomPicker.vue (RoomPickerProps), ClassificationView.vue (ClassificationProps), Collapsible.vue, AdminPanel.vue.
- R10: [ ] ← **VIOLATION** — CSS files are imported via `import` statements in `<script setup>` blocks, NOT inside `<style>` blocks as required. R10 states: "Every .css file alongside a component or view SHALL be imported inside the corresponding Vue SFC `<style>` block." Example: `Navigation.vue` line 11 does `import '../../Components/Navigation/Navigation.component.css'` instead of `<style src="../../Components/Navigation/Navigation.component.css"></style>`. This pattern is used in 13 of 22 Vue files. Functionally the CSS loads correctly, but the requirement's letter is violated.
- R11: [x] covered — Verified in Login.vue (`POST users/login`, `POST users/google-login`), SignUp.vue (`POST users/signup`, `POST users/google-login`), CreateRoom.vue (`POST rooms`), AdminView.vue (`GET updatable`, `PUT updatable`, `GET archive/results`), Home.vue (`POST rooms/join`), Room.vue, Archive.vue, UserDetails.vue, RoomPicker.vue, CountryPicker.vue, MissingEmail.vue, Layout.vue (`POST rooms/verifyRoomToken/{userId}`, `GET countries/refresh/{year}`), Navigation.vue (`GET updatable`). All endpoints, headers (Accept, Bearer), and request bodies match the originals.
- R12: [x] covered — `bcryptjs` used with `genSaltSync(12)` in SignUp.vue (line 103), CreateRoom.vue (line 60), AdminView.vue (line 77), UserDetails.vue (line 133). Login.vue reverses password on line 100. `vite-plugin-node-polyfills` and `Buffer` polyfill remain in vite.config.js and main.ts.
- R13: [x] covered — `vite-plugin-pwa` config unchanged with same manifest fields and `registerType: 'autoUpdate'`. Build output confirms PWA manifest (34 precache entries).
- R14: [x] covered — Dockerfile uses `npm run build` with `build/` output dir. compose.yaml unchanged.
- R15: [x] covered — All 19 tests pass (5 test files). CLI files untouched.
- R16: [x] covered — `index.html` has `<script type="module" src="/src/main.ts">`, `<div id="root">`, and manifest link preserved.
- R17: [ ] ← **VIOLATION** — No loading fallback implemented. R17 states: "A loading fallback ('Loading...') SHALL be shown while async components load." All routes use `() => import()` lazy loading, but there is no `<Suspense>` wrapper, no router-level `loading` state, and no `<RouterView v-slot>` with fallback. Only Archive.vue has an internal `loading` ref for data fetching, not for component loading.
- R18: [x] covered — `Modal.vue` renders three variants (plain message, confirm dialog, custom component via `<component :is>`) based on `store.modal` state. Verified in Layout.vue template (lines 205-228).
- R19: [x] covered — Vue Router `beforeEach` guard in `src/router/index.ts` lines 89-121 checks `store.userLogged`, redirects to `/login`, preserves `callback_url`, and checks `requiresAdmin` meta.
- R20: [x] covered — `Layout.vue` lines 117-157 use `watch()` + `setInterval`/`clearInterval` for admin refresh (40000ms) and room data (60000ms). `onUnmounted` clears intervals.
- R21: [x] covered — `callback_url` handled in router guard (line 98-106) and components (Home.vue, CountrySelect.vue, MissingEmail.vue). `roomAuth` handled in Layout.vue lines 76-113.
- R22: [x] covered — `npm run build` succeeds with PWA output. `npm run dev` starts Vite dev server.
- R23: [x] covered — compose.yaml and Dockerfile unchanged. Build output `build/` matches Dockerfile COPY.
- R24: [x] covered — No React dependencies in package.json. Verified: no react, react-dom, react-router-dom, @react-oauth/google, @testing-library/react, @vitejs/plugin-react, prop-types, eslint-plugin-react, web-vitals. No .jsx/.js files in src/.
- R25: [x] covered — `flag-icons`, `vite-plugin-node-polyfills`, `vite-plugin-env-compatible`, `@esbuild-plugins/node-globals-polyfill`, `buffer`, `process`, `crypto-browserify` all present in package.json.
- R26: [x] covered — No `reportWebVitals.js` file exists. `web-vitals` not in package.json.

## Complete Tasks

- T1: [x] — but note: `pinia-plugin-persistedstate` listed in T1 to add but NOT in package.json. Persistence is implemented manually.
- T2: [x]
- T3: [x]
- T4: [x]
- T5: [x]
- T6: [x]
- T7: [x]
- T8: [x]
- T9: [x]
- T10: [x]
- T11: [x]
- T12: [x]
- T13: [x]
- T14: [x]
- T15: [x]
- T16: [x]
- T17: [x]
- T18: [x]
- T19: [x]
- T20: [x]
- T21: [x]
- T22: [x]
- T23: [x]
- T24: [x]
- T25: [x]
- T26: [x]
- T27: [x]
- T28: [x]
- T29: [x]
- T30: [x]
- T31: [x]
- T32: [x]
- T33: [x]
- T34: [x]
- T35: [x]
- T36: [x]
- T37: [x]
- T38: [x]
- T39: [x]
- T40: [x]
- T41: [x]
- T42: [x]
- T43: [x]
- T44: [x]
- T45: [x]
- T46: [x]
- T47: [x]
- T48: [x]
- T49: [x]
- T50: [x]

## Checkpoints

- C1: [x] — All harness files exist, init.sh green
- C2: [x] — Feature status "done", tests pass, current.md describes session
- C3: [x] — No React deps, no console.log debug, no TODOs without context. Architecture modules expanded for Vue.
- C4: [x] — 19 tests in 5 test files, all pass. CLI modules covered. No Vue component tests but R15 explicitly scopes tests to CLI subsystem.
- C5: [x] — No suspicious files, history.md exists, status "done"
- C6: [x] — Specs exist with requirements.md, design.md, tasks.md. All tasks [x]. Requirements use EARS notation. Minor deviations noted.

## Required changes

1. **R17 — Add loading fallback for async route components.** R17 mandates "A loading fallback ('Loading...') SHALL be shown while async components load." Implement one of:
   - Wrap `<RouterView>` in `<Suspense>` with `<template #fallback>Loading...</template>` in App.vue or Layout.vue, OR
   - Add a router-level loading indicator via `<RouterView v-slot="{ Component }">` with `<Transition>` and loading state in Layout.vue.

2. **R10 — Move CSS imports into `<style>` blocks.** R10 states "Every .css file alongside a component or view SHALL be imported inside the corresponding Vue SFC `<style>` block." Change all 13 files that use `import '../../path/to/file.css'` inside `<script setup>` to use `<style src="../../path/to/file.css"></style>` blocks instead. Affected files: Navigation.vue, Modal.vue, Footer.vue, AdminPanel.vue, ClassificationView.vue, Collapsible.vue, CountryPicker.vue, Form.vue, RoomPicker.vue, NotFound.vue, AdminView.vue, Home.vue, CreateRoom.vue, Archive.vue, UserDetails.vue.

3. **(Minor) Add `pinia-plugin-persistedstate` to package.json or update task T1.** T1 explicitly lists `pinia-plugin-persistedstate` as a dependency to add, but it is absent from package.json. Either add the package and use it instead of the manual `watch()` persistence, or update T1 to reflect the manual approach.

4. **(Minor) Fix TypeScript type errors in 4 Vue components.** `vue-tsc --noEmit` reports type errors in event handlers returning `Promise<false | undefined>` instead of `Promise<void>` in: AdminView.vue (line 326), Home.vue (line 132), CreateRoom.vue (line 92), MissingEmail.vue (line 152). Change `return false` to `return` in async event handlers.

5. **(Minor) Fix `computed` import order in Home.vue and ClassificationView.vue.** In Home.vue line 24 uses `computed` before import on line 25. In ClassificationView.vue line 18 uses `computed` before import on line 20. Move the import to the top import block.

## Build & Test Results

- `npm run build`: **PASSES** — production build in `build/` directory, PWA manifest generated, 0 errors
- `./init.sh`: **PASSES** — all 19 tests green (5 test files), environment checks green
- `vue-tsc --noEmit`: **4 type errors** in Vue components (event handler return types)

## Summary

The migration is substantially complete — all React code removed, all Vue components created, all API integrations preserved, build and tests pass. However, two requirements are not met:
- **R10** (CSS must be in `<style>` blocks, not `<script>` imports)
- **R17** (loading fallback for async components must exist)

These must be addressed before the feature can be marked as done.