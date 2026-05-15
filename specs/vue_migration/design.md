# Design — vue_migration

> Technical decisions for migrating from React 18 (JSX/JS) to Vue 3
> (TypeScript + Composition API + Vite).

---

## D1 — Big-bang migration (not incremental)

**Decision:** Replace the entire React UI layer in one coordinated migration.
All React components, views, context, and utilities are rewritten as Vue SFCs
in a single branch. The old React files are deleted only after their Vue
equivalents are verified.

**Rationale:** The React → Vue boundary is the app entry point. Running both
frameworks simultaneously would require a shared DOM mount point and a bridge
layer, adding far more complexity than a clean cut-over. Since the app is
medium-sized (10 views, 10 components, 8 utilities), a big-bang approach is
feasible.

**Discarded alternative:** Incremental migration via `@vea/react-vue` bridge.
Rejected because: (a) the bridge library is not well-maintained, (b) the app
is small enough for a clean cut, (c) two framework runtimes in production
would bloat the bundle.

---

## D2 — Vue 3 Composition API with `<script setup lang="ts">`

**Decision:** All Vue components SHALL use `<script setup lang="ts">` syntax.
No Options API.

**Rationale:** `<script setup>` is the recommended Vue 3 style, provides
better TypeScript inference, and yields more concise code than Options API.
This aligns with the project's convention that new code uses TypeScript.

---

## D3 — File structure and naming convention

| Current (React)                                      | New (Vue)                                            |
|-------------------------------------------------------|-------------------------------------------------------|
| `src/index.jsx`                                      | `src/main.ts`                                        |
| `src/App.jsx`                                        | `src/App.vue`                                        |
| `src/Layout.jsx`                                     | `src/Layout.vue`                                     |
| `src/Storage/AppContext.jsx`                         | `src/stores/app.ts` (Pinia store)                   |
| `src/config/config.js`                               | `src/config/config.ts`                               |
| `src/utils/*.js`                                     | `src/utils/*.ts` (plain TS functions / composables)  |
| `src/Components/X/X.jsx`                             | `src/components/X/X.vue`                             |
| `src/Components/X/X.Component.css`                    | `<style>` block inside X.vue or imported in `<style>`|
| `src/Views/X/X.jsx`                                  | `src/views/X/X.vue`                                  |
| `src/Views/X/X.Component.css`                         | `<style>` block inside X.vue or imported in `<style>`|
| `src/reportWebVitals.js`                             | Deleted (R26)                                        |

**Note:** Component folder names change from `Components` (PascalCase) to
`components` (camelCase) and `Views` to `views` to follow Vue convention.

---

## D4 — State management: Pinia store design

The Pinia store (`src/stores/app.ts`) SHALL define the following state,
getters, and actions based on the current `AppContext`:

### State
```typescript
interface AppState {
  userLogged: User | false;
  rememberUser: boolean;
  currentRoom: RoomState | undefined;
  songs: Song[];
  updatable: Updatable | undefined;
  selection: { current: number[] };
  xToken: string;
  modal: ModalState;
}
```

### Actions (replacing context setters)
- `setUserLogged(user)` — replaces `context.setUserLogged`
- `setRememberUser(remember)` — replaces `context.setRememberUser`, clears localStorage on false
- `setCurrentRoom(room)` — replaces `context.setCurrentRoom`
- `setSongs(songs)` — replaces `context.setSongs`
- `setUpdatable(updatable)` — replaces `context.setUpdatable`
- `setSelection(selection)` — replaces `context.setSelection`
- `setXToken(xToken)` — replaces `context.setXtoken`
- `setModal(modal)` — replaces `context.setModal`
- `closeSession()` — resets all state, clears localStorage/sessionStorage
- `fetchSongs()` — replaces `useEffect` that fetches songs when xToken is set

### Persistence
The store SHALL use `pinia-plugin-persistedstate` (or a manual
`watch`/`subscribe`) to persist to `localStorage` when `rememberUser` is true
and to `sessionStorage` otherwise (matching current behavior). The storage
key SHALL remain `"app-context"` for backward compatibility with existing
user sessions.

**Discarded alternative:** Vuex 4. Rejected because Pinia is the official
Vue 3 recommended state management library, has better TypeScript support,
and is lighter than Vuex.

---

## D5 — Routing: Vue Router 4

**Decision:** Use Vue Router 4 with `createWebHistory()`.

### Route table (mirrors current `App.jsx` routes)

| Path                  | Component           | Meta                    |
|-----------------------|---------------------|-------------------------|
| `/app`                | Home                | requiresAuth            |
| `/login`              | Login               | guestOnly              |
| `/signup`             | SignUp              | guestOnly              |
| `/profile`            | UserDetails          | requiresAuth            |
| `/createroom`          | CreateRoom          | requiresAuth            |
| `/admin`              | AdminView           | requiresAuth, requiresAdmin |
| `/archive`            | Archive             | requiresAuth            |
| `/room`               | Room                | requiresAuth            |
| `/country-select`     | CountrySelect       | requiresAuth            |
| `/missing-email`      | MissingEmail        | requiresAuth            |
| `/confirm-email`      | MissingEmail        | requiresAuth            |
| `/join-room`          | Home (redirect)     | requiresAuth            |
| `/:pathMatch(.*)*`    | NotFound            | —                       |

All route components SHALL be lazy-loaded via `() => import()`.

### Navigation guards

A `beforeEach` guard SHALL check the Pinia store for authentication state
and redirect unauthenticated users to `/login`. Admin routes SHALL additionally
check `user.username === config.appAdmin`. The `callback_url` and `roomAuth`
query parameters SHALL be preserved through redirects.

---

## D6 — Google OAuth: vue3-google-login

**Decision:** Use `vue3-google-login` package which provides a
`GoogleLogin` component with `onSuccess` and `onError` callbacks, compatible
with the same Google OAuth credential flow used currently.

**Discarded alternative:** Manual Google Identity Services (GIS) script
integration. Rejected because `vue3-google-login` provides the same
component-based API as `@react-oauth/google` with less boilerplate.

---

## D7 — Icons migration

| Current (react-icons / @fortawesome) | Replacement                                     |
|---------------------------------------|------------------------------------------------|
| `react-icons/hi` → `HiStar`          | `@fortawesome/free-solid-svg-icons` → `faStar`  |
| `react-icons/vsc` → `VscChevronRight`| Direct SVG or `vsc-chevron-right` via `@iconify/vue` |
| `react-icons/gi` → `GiPlayButton`    | Direct SVG or via `@iconify/vue`                 |
| `react-icons/fi` → `FiShare2`        | Direct SVG or via `@iconify/vue`                 |
| `react-icons/ai` → `AiOutlineEdit`   | Direct SVG or via `@iconify/vue`                 |
| `react-icons/md` → `MdDeleteForever` | Direct SVG or via `@iconify/vue`                 |
| `IconContext.Provider`                | Removed (not needed in Vue)                      |

**Decision:** Use `@iconify/vue` as a universal icon resolver for the
`react-icons` icons, plus `@fortawesome/vue-fontawesome` for the existing
FontAwesome icons. This avoids manual SVG inlining while keeping the bundle
reasonable.

**Alternative discarded:** Copy-paste every icon as an inline Vue component.
Rejected because it duplicates icon data and makes future icon additions harder.

---

## D8 — Form component redesign

The React `Form` component accepts an `action`, `fields` array, `error`,
`showPassword`, `submitValue`, and `remember` prop. It renders `<form>`,
`<input>` elements, and handles password visibility toggle.

In Vue, this SHALL become a reusable `<Form>` component with:
- `defineProps<FormProps>()` with a TypeScript interface
- `defineEmits(['submit'])` instead of the `action` callback prop
- `v-model` for form fields
- Template refs (`useTemplateRef`) instead of `useRef`

---

## D9 — Modal component redesign

The React `Modal` component is rendered conditionally in `Layout.jsx` with
three render paths:
1. Plain message (`visible + message + status`)
2. Confirm dialog (`visible + confirm + message`)
3. Custom component slot (`visible + component`)

In Vue, the `Modal` SHALL be a global component shown/hidden via Pinia state.
Three render paths:
1. `<p>{{ modal.message }}</p>` for plain
2. `<div class="modal-action-buttons">` for confirm
3. `<component :is="modal.component">` for custom component

The `onaccept` and `onclick` callbacks stored in Pinia SHALL be invoked
directly (no React component tree needed).

---

## D10 — Dependency changes

### Remove (React dependencies)
- `react`, `react-dom` (implicit, not in package.json but required)
- `@vitejs/plugin-react`
- `react-router-dom`
- `@react-oauth/google`
- `@fortawesome/react-fontawesome`
- `react-icons`
- `prop-types`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `eslint-plugin-react`
- `eslint-plugin-jsx-a11y`
- `web-vitals`

### Add (Vue dependencies)
- `vue` (^3.5)
- `vue-router` (^4.4)
- `pinia` (^2.2)
- `pinia-plugin-persistedstate` (^4.1)
- `@vitejs/plugin-vue` (^5.2)
- `vue3-google-login` (^2.2) or equivalent Vue 3 Google OAuth library
- `@fortawesome/vue-fontawesome` (^3.1)
- `@iconify/vue` (^4.3)
- `@vue/test-utils` (^2.4) (devDep)
- `eslint-plugin-vue` (^9.28) (devDep)
- `vue-tsc` (^2.1) (devDep)
- `@vue/compiler-sfc` (implicit, via plugin-vue)

### Keep (unchanged)
- `axios` — HTTP client
- `bcryptjs` — password hashing
- `flag-icons` — country flag CSS
- `vite` — build tool
- `vite-plugin-pwa` — PWA support
- `vite-plugin-node-polyfills` — browser polyfills
- `vite-plugin-env-compatible` — env vars
- `@esbuild-plugins/node-globals-polyfill` — Buffer/process polyfill
- `buffer` — Buffer polyfill
- `process` — process polyfill
- `crypto-browserify` — crypto polyfill
- `dotenv` — env loading
- `vitest` — test runner (devDep)
- `typescript` — already a devDep
- `commander` — CLI framework (devDep)
- `tsx` — CLI runner (devDep)

### TypeScript config updates
- `tsconfig.json`: Add `"vue"` to `compilerOptions.types` or include
  `vue-tsc` for type checking. Add `src/**/*.vue` to `include`.
- New `env.d.ts` file with `/// <reference types="vite/client" />` and
  Vue `declare module '*.vue'` shims.

---

## D11 — Utility functions → TypeScript modules and composables

| Current                              | Vue replacement                              |
|--------------------------------------|----------------------------------------------|
| `useGetAuthToken.js`                 | `composables/useGetAuthToken.ts` — plain async function, takes Pinia store |
| `useGetSongs.js`                     | `composables/useGetSongs.ts` — plain async function |
| `useHandleCloseSession.js`           | `composables/useHandleCloseSession.ts` — calls `store.closeSession()` |
| `useNavigateWithCallback.js`         | Inlined into router guard / uses `useRoute().query` |
| `useUpdateUserData.js`              | `composables/useUpdateUserData.ts` — async function, uses router |
| `useValidateEmail.js`               | `composables/useValidateEmail.ts` — async function |
| `useValidateToken.js`                | `composables/useValidateToken.ts` — async function |
| `regexUtils.js`                      | `utils/regexUtils.ts` — plain exports, unchanged logic |

Functions that currently receive the React context object SHALL receive the
Pinia store instance instead. Functions that call `useNavigate()` SHALL receive
the router instance (via `useRouter()` composable) or the router as a parameter.

---

## D12 — `index.html` modifications

Current `index.html` has `%PUBLIC_URL%` placeholders (CRA style). The Vue
version SHALL:
- Remove all `%PUBLIC_URL%` references (Vite uses `/` base)
- Add `<script type="module" src="/src/main.ts"></script>` inside `<body>`
- Keep `<div id="root">` as the Vue mount point
- Keep `<link rel="manifest" ...>` for PWA
- Update `<title>` to "Eurocontest App"

---

## D13 — CSS migration strategy

- All component-level `.css` files SHALL be imported inside the corresponding
  Vue SFC `<style>` block via `@import` or by moving the CSS directly into
  `<style scoped>`.
- The global `src/index.css` SHALL remain and be imported in `main.ts`.
- `flag-icons` CSS imports (`/node_modules/flag-icons/css/flag-icons.min.css`)
  SHALL be imported in the components that need them (CountryPicker,
  ClassificationView) or globally in `main.ts`.

**Decision:** Use unscoped `<style>` blocks for component CSS (matching the
current non-scoped behavior) to avoid breaking existing CSS selectors.
Scoped styles SHALL be adopted incrementally in future iterations.

---

## D14 — Entry point and app bootstrap

Current `src/index.jsx`:
```
ReactDOM.createRoot → <GoogleOAuthProvider> → <AppContextProvider> → <BrowserRouter> → <Layout><App/></Layout>
```

New `src/main.ts`:
```typescript
const app = createApp(App)
app.use(pinia)
app.use(router)
// Google OAuth initialization (plugin or provider)
app.mount('#root')
```

The `Layout` component wrapping SHALL be handled via Vue Router's
`<RouterView>` inside `Layout.vue`, which renders `<Navigation>`,
`<RouterView />`, modal, and `<Footer>`.

---

## D15 — `reportWebVitals` removal

**Decision:** Remove `src/reportWebVitals.js` entirely. It depends on
`web-vitals` and the React render pipeline. Vue 3 has its own performance
monitoring APIs if needed later. The `package.json` dependency on
`web-vitals` SHALL be removed.

---

## D16 — PWA manifest adjustment

The `vite.config.ts` PWA plugin configuration SHALL remain as-is, with
the same manifest fields. The only change: `index.html` must NOT have
`%PUBLIC_URL%` but rather `/` or Vite's base path variable.

---

## Reference

- Current tech stack: ARCHITECTURE.md §2
- Current routing: ARCHITECTURE.md §5
- Current state management: ARCHITECTURE.md §6
- Current API integration: ARCHITECTURE.md §8
- Current utilities: ARCHITECTURE.md §10
- Current layout: ARCHITECTURE.md §11
- Conventions: `docs/conventions.md`