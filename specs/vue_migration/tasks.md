# Tasks — vue_migration

> Phase-ordered checklist. Each task references at least one `R<n>`.

---

## Phase 1 — Infrastructure (dependencies, config, scaffolding)

- [x] T1 — Remove React dependencies and add Vue dependencies in `package.json`. Remove: `react`, `react-dom` (if present), `@vitejs/plugin-react`, `react-router-dom`, `@react-oauth/google`, `@fortawesome/react-fontawesome`, `react-icons`, `prop-types`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, `web-vitals`. Add: `vue`, `vue-router`, `pinia`, `pinia-plugin-persistedstate`, `@vitejs/plugin-vue`, `vue3-google-login`, `@fortawesome/vue-fontawesome`, `@iconify/vue`, `@vue/test-utils`, `eslint-plugin-vue`, `vue-tsc`. Run `npm install`. **(R1, R5, R6, R24, R26)**

- [x] T2 — Update `vite.config.ts` to use `@vitejs/plugin-vue` instead of `@vitejs/plugin-react`. Keep `vite-plugin-pwa`, `vite-plugin-node-polyfills`, and `vite-plugin-env-compatible` configurations unchanged. Update the `resolve.alias` entries if needed. **(R2, R13, R25)**

- [x] T3 — Update `tsconfig.json` to include Vue: add `"vue"` to `compilerOptions.types`, add `"src/**/*.vue"` to `include`, create `src/env.d.ts` with `/// <reference types="vite/client" />` and `declare module '*.vue'` shims. **(R1, R8)**

- [x] T4 — Create `src/stores/app.ts` — Pinia store that replaces `AppContext`. Define `AppState` interface and all state fields (`userLogged`, `rememberUser`, `currentRoom`, `songs`, `updatable`, `selection`, `xToken`, `modal`). Define all actions (`setUserLogged`, `setRememberUser`, `setCurrentRoom`, `setSongs`, `setUpdatable`, `setSelection`, `setXToken`, `setModal`, `closeSession`, `fetchSongs`). Implement localStorage/sessionStorage persistence with key `"app-context"` and the same merge-on-init logic as the current `AppContext`. **(R4)**

- [x] T5 — Create `src/router/index.ts` — Vue Router instance with `createWebHistory()`. Define all 12 routes (`/app`, `/login`, `/signup`, `/profile`, `/createroom`, `/admin`, `/archive`, `/room`, `/country-select`, `/missing-email`, `/confirm-email`, `/:pathMatch(.*)*`) with lazy-loaded components. Add a `beforeEach` navigation guard that checks authentication from the Pinia store and redirects to `/login` when needed, preserving `callback_url` and `roomAuth` query params. **(R3, R19, R21)**

- [x] T6 — Create `src/main.ts` — Vue app entry point. Import `createApp` from Vue, the root `App.vue`, the Pinia store, the router, and the Google OAuth plugin. Mount to `#root`. Remove references to `reportWebVitals`. **(R1, R16, R26)**

- [x] T7 — Move and convert `src/config/config.js` to `src/config/config.ts`. Add TypeScript interfaces for the config object. All `import.meta.env.VITE_*` accesses remain the same. **(R8)**

- [x] T8 — Update `index.html`: remove `%PUBLIC_URL%` placeholders, add `<script type="module" src="/src/main.ts"></script>`, keep `<div id="root">`, keep `<link rel="manifest">`, update `<title>`. **(R16)**

---

## Phase 2 — Core (router, store, layout shell)

- [x] T9 — Create `src/App.vue` — root component that renders `<Layout>` containing `<Navigation>`, `<RouterView />`, modal slot, and `<Footer>`. This replaces the React `App.jsx` route definitions (now in the router). **(R3, R14)**

- [x] T10 — Create `src/Layout.vue` — converts `src/Layout.jsx`. Uses `useAppStore()` from Pinia, `useRouter()` for navigation, `onMounted`/`onUnmounted` for polling intervals (`40000ms` for refresh, `60000ms` for room data). Handles `roomAuth` query param in `onMounted`. Renders `<Navigation>`, `<slot>` (or `<RouterView>`), `<Modal>` conditionally, `<Footer>`. **(R14, R20)**

- [x] T11 — Create `src/components/Navigation/Navigation.vue` — converts `src/Components/Navigation/Navigation.jsx`. Uses Pinia store for user state, `useRouter` for links, replaces `useNavigate` with `router.push`, replaces `IconContext.Provider` with `@iconify/vue` or FontAwesome `<FontAwesomeIcon>`. Includes admin login modal (`AdminPanel`) and user menu dropdown. **(R6, R11)**

- [x] T12 — Create `src/components/Modal/Modal.vue` — converts `src/Components/Modal/Modal.jsx`. Renders three modal variants: plain message, confirm dialog, and custom component slot. Uses Pinia store `modal` state. Replace `PropTypes` with `defineProps<ModalProps>()` TypeScript interface. **(R9, R18)**

- [x] T13 — Create `src/components/Footer/Footer.vue` — converts `src/Components/Footer/Footer.jsx`. Simple copyright display. **(R10)**

---

## Phase 3 — Components (one by one)

- [x] T14 — Create `src/components/AdminPanel/AdminPanel.vue` — converts `src/Components/AdminPanel/AdminPanel.jsx`. Uses `defineProps`, renders `<Form>` with password field. **(R9, R11)**

- [x] T15 — Create `src/components/ClassificationView/ClassificationView.vue` — converts `src/Components/ClassificationView/Classification.jsx`. Uses Pinia store for `songs` and `currentRoom`. Renders user classification cards with animation. **(R10, R11)**

- [x] T16 — Create `src/components/Collapsible/Collapsible.vue` — converts `src/Components/Collapsible/Collapsible.jsx`. Renders expand/collapse section with `<slot />`. Uses `defineProps` and `defineEmits`. **(R9, R10)**

- [x] T17 — Create `src/components/CountryPicker/CountryPicker.vue` — converts `src/Components/CountryPicker/CountryPicker.jsx`. Uses Pinia store for `songs`, `selection`, `setSelection`, `setModal`. Renders country flag checkboxes with selection validation. Posts selected countries to API. **(R4, R11)**

- [x] T18 — Create `src/components/Form/Form.vue` — converts `src/Components/Form/Form.jsx`. `defineProps<FormProps>()` with TypeScript interface for `fields`, `action`, `error`, `submitValue`, `showPassword`, `remember`. Uses template refs via `useTemplateRef`. Emits `submit` event. Includes password visibility toggle. **(R8, R9, R11)**

- [x] T19 — Create `src/components/RoomPicker/RoomPicker.vue` — converts `src/Components/RoomPicker/RoomPicker.jsx`. Uses Pinia store and `useRouter`. Renders room cards with select, share, edit, forget, delete actions. Includes Modal interactions for confirmations. **(R4, R6, R11)**

- [x] T20 — Create `src/components/NotFound/NotFound.vue` — converts `src/Components/NotFoundComponent/NotFound.jsx`. Uses `useRouter` to redirect authenticated users to `/app` and unauthenticated to `/login`. **(R3, R19)**

---

## Phase 4 — Views (one by one)

- [x] T21 — Create `src/views/Login/Login.vue` — converts `src/Views/Login/Login.jsx`. Uses Pinia store, `vue3-google-login` `GoogleLogin` component, `<Form>` component, `useGetAuthToken`, `useRouter`. Posts credentials to `users/login` (with reversed password). **(R5, R7, R11, R12)**

- [x] T22 — Create `src/views/CreateUser/SignUp.vue` — converts `src/Views/CreateUser/SignUp.jsx`. Registration form with `bcryptjs` hashing, `GoogleLogin` component, validation via `regexUtils`. **(R5, R12)**

- [x] T23 — Create `src/views/App/Home.vue` — converts `src/Views/App/Home.jsx`. Auth validation, room selection via `<RoomPicker>`, join-room form via `<Form>` in `<Collapsible>`, callback URL handling. **(R11, R21)**

- [x] T24 — Create `src/views/CreateRoom/CreateRoom.vue` — converts `src/Views/CreateRoom/CreateRoom.jsx`. Room creation form with `bcryptjs` password hashing. **(R12)**

- [x] T25 — Create `src/views/Room/Room.vue` — converts `src/Views/Room/Room.jsx`. Displays `<ClassificationView>` for the current room. Auth guard and country-selection redirect. **(R11)**

- [x] T26 — Create `src/views/Archive/Archive.vue` — converts `src/Views/Archive/Archive.jsx`. Fetches historical rooms and displays `<ClassificationView>` for selected room. **(R11)**

- [x] T27 — Create `src/views/AdminView/AdminView.vue` — converts `src/Views/AdminView/AdminView.jsx`. Admin controls: refresh toggle, export results, password change with `bcryptjs`, AI model requests. Uses Pinia store for `updatable` and `xToken`. **(R11, R12)**

- [x] T28 — Create `src/views/UserDetails/UserDetails.vue` — converts `src/Views/UserDetails/UserDetails.jsx`. User profile with `<CountryPicker>` in `<Collapsible>`, avatar upload, password change with `bcryptjs`, account deletion. **(R11, R12)**

- [x] T29 — Create `src/views/CountrySelection/CountrySelect.vue` — converts `src/Views/CountrySelection/CountrySelect.jsx`. Auth validation, renders `<CountryPicker>`, redirects to `/app` once countries selected. **(R3, R19)**

- [x] T30 — Create `src/views/MissingEmail/MissingEmail.vue` — converts `src/Views/MissingEmail/MissingEmail.jsx`. Email confirmation flow with token validation via `useValidateEmail`. **(R7, R11)**

---

## Phase 5 — Utilities & API integration

- [x] T31 — Create `src/composables/useGetAuthToken.ts` — converts `src/utils/useGetAuthToken.js`. Takes Pinia store as parameter, uses `bcryptjs` to hash the auth password, calls `GET getAuthToken`, stores token in Pinia via `setXToken`. **(R7, R11, R12)**

- [x] T32 — Create `src/composables/useGetSongs.ts` — converts `src/utils/useGetSongs.js`. Async function that fetches songs via `GET countries`. **(R7, R11)**

- [x] T33 — Create `src/composables/useHandleCloseSession.ts` — converts `src/utils/useHandleCloseSession.js`. Calls `store.closeSession()`. **(R7)**

- [x] T34 — Create `src/composables/useUpdateUserData.ts` — converts `src/utils/useUpdateUserData.js`. Fetches `GET users/{id}`, updates Pinia store, navigates to `/app`. Takes router as parameter. **(R7, R11)**

- [x] T35 — Create `src/composables/useValidateEmail.ts` — converts `src/utils/useValidateEmail.js`. Posts `POST users/updateUserEmail/{id}` with token. Returns `{ result: boolean, data: any }`. **(R7, R11)**

- [x] T36 — Create `src/composables/useValidateToken.ts` — converts `src/utils/useValidateToken.js`. Calls `GET users/validateToken/{id}`, returns token validity boolean. **(R7, R11)**

- [x] T37 — Create `src/utils/regexUtils.ts` — converts `src/utils/regexUtils.js` to TypeScript. Export typed functions `validateRegex`, `validateEmailRegex`, `validateUserNameRegex` with same regex patterns and callback support. **(R7, R8)**

---

## Phase 6 — PWA & Deployment

- [x] T38 — Verify `vite-plugin-pwa` config in `vite.config.ts` has the same manifest, icons, theme, and `registerType: 'autoUpdate'`. Ensure `index.html` links to the generated manifest. **(R13)**

- [x] T39 — Update `Dockerfile` if needed: verify the build output directory matches Vite's output (`dist/` by default, or `build/` if overridden). Ensure `npm ci` and `npm run build` still work. **(R14, R22, R23)**

- [x] T40 — Verify `compose.yaml` still works: the `app` service, env secrets, and `nginx` port mapping remain valid. **(R14, R23)**

---

## Phase 7 — Cleanup & Testing

- [x] T41 — Delete all React source files: `src/index.jsx`, `src/App.jsx`, `src/Layout.jsx`, `src/reportWebVitals.js`, `src/Storage/AppContext.jsx`, every `*.jsx` file under `src/Components/` and `src/Views/`, and every `src/utils/*.js` file. **(R24)**

- [x] T42 — Remove all React-only dependencies from `package.json` (listed in T1). Verify `package-lock.json` is updated. **(R24)**

- [x] T43 — Run `npm run build` and verify zero errors. **(R22)**

- [x] T44 — Run `npm run dev` and verify the application starts with HMR. Navigate all routes manually. **(R22)**

- [x] T45 — Run `npm test` and verify all CLI tests pass (`tests/` directory). **(R15)**

- [x] T46 — Verify PWA: `npm run build` produces service worker manifest, `dist/` contains all assets. **(R13)**

- [x] T47 — Verify Docker: `docker compose up --build` produces a running container on port 8080. **(R23)**

- [x] T48 — Visual verification: every page (Login, SignUp, Home, Room, Archive, CountrySelect, UserDetails, CreateRoom, AdminView, MissingEmail) looks identical to the React version. **(R10)**

- [x] T49 — Verify auth flow: login (username/password), login (Google OAuth), signup, session persistence (localStorage/sessionStorage toggle), session close. **(R4, R5, R11)**

- [x] T50 — Verify callback URLs: room invitation links (`roomAuth`), `callback_url` redirects, `join-room` path all work correctly. **(R3, R21)**