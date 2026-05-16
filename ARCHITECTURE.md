# ARCHITECTURE.md

> Descriptive reference of the current project architecture.
> For prescriptive rules, see [`docs/architecture.md`](docs/architecture.md).
> For style rules, see [`docs/conventions.md`](docs/conventions.md).

---

## 1. Project Overview

**Eurocontest App** is a Vue 3 single-page application (SPA) for the Eurovision Song Contest voting and room system. It is a client-side application that communicates with a separate REST API backend. The project also includes a CLI subsystem (written in TypeScript) for notes and feature management.

The SPA allows users to:
- Register and log in (username/password or Google OAuth)
- Select countries for each year's Eurovision contest
- Create, join, and participate in voting rooms
- View live classifications and historical results
- Manage profiles (including email confirmation)

The CLI subsystem provides commands for managing notes and features via the terminal, using atomic JSON file persistence.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| UI Framework | Vue 3 (Composition API, `<script setup>`) | Single-file components with TypeScript |
| Build Tool | Vite | `vite.config.js` |
| CLI & Data Layer | TypeScript | `src/cli.ts`, `src/notes.ts`, `src/storage.ts`, `src/features.ts`, `src/prompts.ts` |
| UI Layer | TypeScript + Vue SFCs | All `.vue` and `.ts` files under `src/` |
| Routing | vue-router | `createRouter` in `src/router/index.ts` |
| State Management | Pinia | `src/stores/app.ts` with persisted state plugin |
| Internationalization | vue-i18n@9 | `src/locales/` with IP-based locale detection |
| Authentication | vue3-google-login | Google OAuth provider wrapping the app |
| HTTP Client | axios | Used for all backend API calls |
| Password Hashing | bcryptjs | Client-side salted hashing for auth flow |
| CLI Framework | Commander.js | `program.command()` pattern in `cli.ts` |
| Testing | Vitest | Configured in `vitest.config.ts` with node environment |
| PWA Support | vite-plugin-pwa | Service worker + manifest in `vite.config.js` |
| Icons | @iconify/vue, @fortawesome/vue-fontawesome, flag-icons | Visual elements |
| Polyfills | vite-plugin-node-polyfills, buffer | Buffer polyfill for browser |

---

## 3. Project Structure

```
euro-frontend/
├── src/
│   ├── App.vue                    # Root component
│   ├── main.ts                    # App bootstrap, Pinia, router, i18n, FontAwesome, Google OAuth, Buffer polyfill
│   ├── router/
│   │   └── index.ts                # Route definitions (vue-router)
│   ├── stores/
│   │   └── app.ts                 # Pinia store (global state with persisted state plugin)
│   ├── locales/
│   │   ├── index.ts               # vue-i18n instance creation and export
│   │   ├── es.json                # Spanish translations (default locale)
│   │   └── en.json                # English translations
│   ├── composables/
│   │   ├── useUpdateUserData.ts    # Refreshes user data from API
│   │   ├── useHandleCloseSession.ts # Clears session state
│   │   ├── useNavigateWithCallback.ts # Navigate with optional callback URL
│   │   ├── useValidateEmail.ts     # Validates email confirmation token
│   │   ├── useValidateToken.ts     # Validates current auth token
│   │   └── useDetectLocale.ts      # IP-based geolocation locale detection
│   ├── index.css                  # Global styles
│   ├── cli.ts                     # CLI entry point (Commander.js program)
│   ├── notes.ts                   # Note domain model (NoteData, Note, NoteError, NoteNotFound)
│   ├── storage.ts                 # Atomic JSON file read/write for notes & features
│   ├── features.ts                # Feature data model and management logic
│   ├── prompts.ts                 # Interactive CLI prompting (readline)
│   ├── components/
│   │   ├── AdminPanel/            # Password dialog for admin access
│   │   ├── ClassificationView/    # Room classification/ranking display
│   │   ├── Collapsible/           # Expandable/collapsible section wrapper
│   │   ├── CountryPicker/         # Country selection checkboxes with flags
│   │   ├── Footer/                # App footer (copyright + year)
│   │   ├── Form/                  # Reusable form component with field rendering
│   │   ├── Modal/                 # Generic modal (message, confirm, or custom component)
│   │   ├── Navigation/           # Top navigation bar with user menu
│   │   ├── NotFound/              # 404 page with auto-redirect
│   │   └── RoomPicker/            # Room selection, editing, and management cards
│   ├── views/
│   │   ├── App/                   # Home — main room selection view
│   │   ├── AdminView/             # Admin panel — updatable settings, export, AI requests
│   │   ├── Archive/               # Historical room results browser
│   │   ├── CountrySelection/      # Country voting view (CountrySelect component)
│   │   ├── CreateRoom/            # Room creation form
│   │   ├── CreateUser/            # User registration (SignUp)
│   │   ├── Login/                 # Login form with Google OAuth
│   │   ├── MissingEmail/          # Email confirmation flow
│   │   ├── Room/                  # Active room classification view
│   │   └── UserDetails/           # User profile and country selection management
│   ├── config/
│   │   └── config.ts              # Runtime configuration from env vars
│   ├── Layout.vue                 # Layout shell: Navigation → content → Modal → Footer
│   └── utils/
│       ├── useGetAuthToken.ts      # Fetches auth token via bcrypt hash + /getAuthToken
│       ├── useGetSongs.ts          # Fetches songs (countries) from API
│       └── regexUtils.ts           # Regex patterns and validators for username, password, email
├── tests/
│   ├── build.test.ts              # Build verification test (vite build exit code 0)
│   ├── cli.test.ts                # Integration tests for CLI commands
│   ├── cli_features.test.ts       # Tests for the feature-add CLI command
│   ├── features.test.ts           # Unit tests for features.ts
│   ├── notes.test.ts              # Unit tests for notes.ts
│   └── storage.test.ts            # Unit tests for storage.ts (atomic file operations)
├── docs/
│   ├── architecture.md            # Prescriptive architecture rules
│   ├── conventions.md             # Style and naming conventions
│   ├── specs.md                   # Spec Driven Development process
│   └── verification.md            # Verification and testing guidelines
├── specs/                         # Per-feature spec directories (SDD)
│   └── project_architecture_analysis/
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
├── progress/                      # Session tracking
│   ├── current.md
│   └── history.md
├── public/
│   ├── favicon.ico
│   ├── index.html                 # PWA manifest link
│   ├── robots.txt
│   ├── star_icon_128.png          # PWA icon 128×128
│   └── star_icon_512.png          # PWA icon 512×512
├── .env                           # VITE_ environment variables
├── Dockerfile                     # Multi-stage: node build → nginx serve
├── compose.yaml                   # Docker Compose with secrets
├── vite.config.js                 # Vite + PWA plugin config
├── vitest.config.ts               # Vitest test runner config
├── tsconfig.json                  # TypeScript config (strict, nodenext)
└── package.json                   # Dependencies and scripts
```

---

## 4. Component Architecture

### Components (`src/components/`)

| Component | File | Responsibility |
|---|---|---|
| **AdminPanel** | `AdminPanel/AdminPanel.vue` | Password dialog overlay for admin access. Wraps the `Form` component with a password field and close button. Accepts a `refer: (el: any) => void` callback prop that is passed as `setRef` to the Form's password field, enabling the parent (Navigation) to capture the DOM element reference via a callback. |
| **ClassificationView** | `ClassificationView/ClassificationView.vue` | Displays a ranked list of room participants with their country selections, scores, and animated card layout. Supports winner/last-place highlighting and auto-refresh. Accepts an `isArchive` prop: when true, filters users with `countries?.length > 0` instead of `countries?.length >= targetCount`. The `users` list is a `computed` property deriving from `props.room` and `store.songs`, replacing the previous `ref` + `onMounted`/`watch` pattern. Includes a `getCountryCode()` helper method for flag icon CSS class generation. |
| **Collapsible** | `Collapsible/Collapsible.vue` | Wrapper component that toggles visibility of its children. Uses an SVG toggle button with a `.rotated` CSS class and `.collapsible-wrapper`/`.collapsible-title`/`.collapsed`/`.uncollapsed` CSS classes (instead of `v-if` toggling). Used for collapsible sections (e.g., "Join room" in Home, "Change password" in AdminView). |
| **CountryPicker** | `CountryPicker/CountryPicker.vue` | Renders country selection cards with flag icons, checkboxes, and a "Continue" button. Validates that the user selects the required number of countries (5 or 6). |
| **Footer** | `Footer/Footer.vue` | Simple footer displaying copyright and current year. |
| **Form** | `Form/Form.vue` | Reusable form component. Accepts field definitions (each with a `setRef?: (el: any) => void` callback), submit handler, error state, password visibility toggle, and "remember me" checkbox. The Form template uses `:ref="(el: any) => { if (field.setRef) field.setRef(el) }"` to capture DOM element references. Parent components pass inline callbacks like `setRef: (el: any) => someRef = el` in their `fields` arrays, enabling direct access to input values via `someRef?.value` in submit handlers. |
| **Modal** | `Modal/Modal.vue` | Generic modal component supporting three modes: plain message, confirm dialog (accept/cancel), and custom component injection. |
| **Navigation** | `Navigation/Navigation.vue` | Top navigation bar. Shows the app logo, user avatar/menu (profile, admin, leave room, archive, logout), and conditionally renders the AdminPanel for admin authentication. Uses `passwordRef` typed as `Ref<HTMLInputElement | null | undefined>` and passes it to AdminPanel via the callback `:refer="(el: any) => passwordRef = el"`. The `loginAdmin` function includes try/catch error handling with i18n translation messages (`$t('nav.wrongPassword')`). |
| **NotFound** | `NotFound/NotFound.vue` | 404 page that displays an error message and auto-redirects based on authentication state. |
| **RoomPicker** | `RoomPicker/RoomPicker.vue` | Lists the user's rooms as cards with actions: select room, edit room name, share room link, delete room. Includes room creation via password dialog. |

> **Note on Form Consumers:** All components consuming `Form` (Home, Login, SignUp, CreateRoom, UserDetails, AdminView, Navigation) use the `setRef: (el: any) => someRef = el` callback pattern in their `fields` array to capture DOM element references. This replaces the previous pattern where `Ref` objects were passed as props.

### Views (`src/views/`)

| View | File | Responsibility |
|---|---|---|
| **Home** | `App/Home.vue` | Main landing view after login. Shows room picker and join-room form if the user has selected countries; redirects to country selection otherwise. |
| **Login** | `Login/Login.vue` | Login form with username/password and Google OAuth. Validates credentials against the backend, stores user/token in Pinia store. |
| **SignUp** | `CreateUser/SignUp.vue` | Registration form with username, email, password, and Google OAuth. Hashes the password with bcryptjs before sending. |
| **UserDetails** | `UserDetails/UserDetails.vue` | User profile view. Displays avatar and allows country selection via `CountryPicker` inside a `Collapsible`. `currentCollapsed` defaults to `true` (country selection section collapsed by default). Includes an `updateColor` function with a `colorRef` form field using `type: 'color'`. All form fields use the `setRef: (el: any) => someRef = el` callback pattern. Includes account deletion button. |
| **CreateRoom** | `CreateRoom/CreateRoom.vue` | Room creation form (name + password). Hashes the room password with bcryptjs before sending to the API. |
| **Room** | `Room/Room.vue` | Active room view. Displays the `ClassificationView` for the current room. Redirects to country selection or email confirmation if needed. |
| **Archive** | `Archive/Archive.vue` | Historical results browser. Fetches past rooms for the user and displays classifications using `ClassificationView`. |
| **AdminView** | `AdminView/AdminView.vue` | Admin dashboard. Allows toggling the "refresh_enabled" flag, exporting results, changing the admin password, creating AI model requests via an external API, and updating links via the `updateLinks` button (calls `countries/updateLinks/:year`). The archive export URL is `rooms/archive/export/:year`. |
| **CountrySelect** | `CountrySelection/CountrySelect.vue` | Country voting view. Validates the user's token and renders `CountryPicker`. Redirects back to home once enough countries are selected. |
| **MissingEmail** | `MissingEmail/MissingEmail.vue` | Email confirmation flow. Displays a form to enter an email, sends a confirmation token via the API, and validates the email token on callback. |

---

## 5. Routing

Routes are defined in `src/router/index.ts` using vue-router's `createRouter` with `createWebHistory`. All views are lazy-loaded with dynamic `import()` and wrapped in `<Suspense>`.

| Route Path | View Component | Description |
|---|---|---|
| `/app` | `Home` | Main room selection view |
| `/login` | `Login` | User login (username/password or Google OAuth) |
| `/signup` | `SignUp` | New user registration |
| `/profile` | `UserDetails` | User profile and country selection |
| `/createroom` | `CreateRoom` | Create a new voting room |
| `/admin` | `AdminView` | Admin panel (protected by password) |
| `/archive` | `Archive` | Historical results |
| `/room` | `Room` | Active room classification |
| `/missing-email` | `MissingEmail` | Email confirmation and entry |
| `/country-select` | `CountrySelect` | Country voting |
| `/confirm-email` | `MissingEmail` | Email confirmation callback |
| `*` | `NotFound` | 404 fallback with auto-redirect |

---

## 6. State Management

The application uses Pinia for state management, defined in `src/stores/app.ts`. The store is persisted to `localStorage`/`sessionStorage` via `pinia-plugin-persistedstate`.

### State Fields

| Field | Type | Description |
|---|---|---|
| `user_logged` | `object \| false` | Current logged-in user data (id, username, email, countries, rooms, image, token) |
| `x_token` | `string` | Bearer token for API authentication |
| `songs` | `array` | List of countries/songs for the current year (fetched from `/countries`) |
| `current_room` | `object \| undefined` | Active room data (`{ current: roomData }` or `undefined`) |
| `selection` | `object` | Country selection state (`{ current: [countryIds] }`) |
| `remember_user` | `boolean` | Whether to persist session in localStorage (vs. sessionStorage only) |
| `modal` | `object` | Modal state (`{ visible, message, status, confirm, component, onclick, onaccept, onaccept_data }`) |
| `updatable` | `object` | Admin updatable settings (refresh_enabled, master_password, etc.) |

### Context Setters

Each state field has a corresponding setter function exposed on the context: `setUserLogged`, `setXtoken`, `setSongs`, `setCurrentRoom`, `setSelection`, `setRememberUser`, `setModal`, `setUpdatable`, and the special `closeSession` handler that resets all state and clears localStorage.

### Persistence

- When `remember_user` is `true`: the Pinia store is serialized to both `localStorage` and `sessionStorage` under the key `"app-context"`.
- When `remember_user` is `false`: the Pinia store is serialized only to `sessionStorage`.
- On app load, `localStorage` is checked first; if empty, `sessionStorage` is used as fallback.
- Songs are auto-fetched via `useGetSongs` when `x_token` exists and `songs` is empty.

### Provider Wrapping

In `src/main.ts`, the app is wrapped as:

```
Pinia (with persisted state plugin) → Vue App → Router → i18n plugin → Google OAuth plugin
```

---

## 6b. Internationalization (i18n)

The application uses `vue-i18n@9` for internationalization support with automatic locale detection based on the user's IP geolocation.

### Locale Files

Translation files live under `src/locales/`:

| File | Purpose |
|---|---|
| `src/locales/index.ts` | Creates and exports the `i18n` instance with `legacy: false` (Composition API mode) |
| `src/locales/es.json` | Spanish translations (default locale) |
| `src/locales/en.json` | English translations |

### Key Naming Convention

Keys use a flat dot-namespace structure grouped by component/view:

| Prefix | Scope |
|---|---|
| `nav.*` | Navigation component |
| `login.*` / `signup.*` | Auth views |
| `home.*` / `room.*` / `archive.*` | Main views |
| `modal.*` / `form.*` | Shared components |
| `validation.*` / `error.*` / `common.*` | Shared messages |

### Locale Detection Strategy

The `useDetectLocale` composable (`src/composables/useDetectLocale.ts`) resolves the user's locale on app mount:

1. **localStorage check**: If `user-locale` key exists with a valid value (`es` or `en`), use it.
2. **IP geolocation**: Call `https://ipapi.co/json/` (primary) or `https://ip-api.com/json/` (fallback) to get the country code.
3. **Country-to-locale mapping**: Spanish-speaking countries (ES, MX, AR, CO, PE, VE, CL, EC, GT, CU, BO, DO, HN, PY, SV, NI, CR, PA, UY, GQ) map to `es`; all others map to `en`.
4. **Fallback**: On any failure, default to `es` (Spanish).

The detected locale is persisted to `localStorage` under the key `user-locale` for subsequent visits.

### Usage in Components

- **Templates**: Use `$t('key')` for translation calls.
- **Script setup**: Destructure `t` from `useI18n()` and call `t('key')`.
- **Reactive switching**: The `locale` ref from `useI18n()` is reactive; changing `locale.value` re-renders all active components.

---

## 7. CLI Subsystem

The CLI subsystem (TypeScript) provides terminal-based tools for managing notes and features.

### Commands

| Command | Description |
|---|---|
| `add <title> [--body <body>]` | Add a new note with auto-incrementing ID |
| `list` | List all notes (id, created_at, title) |
| `show <id>` | Show a note's full details by ID |
| `delete <id>` | Delete a note by ID |
| `search <query>` | Search notes by keyword (matches title or body) |
| `recent [--limit N]` | List the N most recent notes (default: 5) |
| `edit <id> [--title] [--body]` | Edit an existing note's fields |
| `feature-add <name> [--title] [--description] [--acceptance] [--sdd]` | Add a new feature to `feature_list.json` |

### Data Models

**NoteData** (in `src/notes.ts`):
```typescript
interface NoteData {
  id: number;
  title: string;
  body: string;
  created_at: string;  // ISO 8601 without milliseconds
}
```

- `NoteError` — base error class for note operations
- `NoteNotFound` — thrown when a note is not found

**Feature** (in `src/features.ts`):
```typescript
interface Feature {
  id: number;
  name: string;
  title: string;
  description: string;
  acceptance: string[];
  sdd?: boolean;
  status: "pending" | "spec_ready" | "in_progress" | "done" | "blocked";
}
```

- `FeatureError` — base error class for feature operations
- `DuplicateFeatureError` — thrown when a feature with the same name already exists

### Storage Layer (`src/storage.ts`)

- Uses atomic file writes: data is written to a temporary file (`.notes_<uuid>.json`) and then renamed to the target path.
- `load()` reads from `.notes.json` (or `NOTES_FILE` env var) and returns `[]` if the file doesn't exist.
- `save()` serializes to JSON with 2-space indentation, writes atomically via `writeFile` → `rename`.
- Feature operations reuse `load()`/`save()` targeting `feature_list.json`.

### Interactive Prompting (`src/prompts.ts`)

- `prompt(question, defaultValue?)` — prompts for a single string value via `readline`.
- `promptRequired(question)` — loops until a non-empty answer is provided.
- `promptList(question)` — prompts for a comma-separated list of strings.

---

## 8. API Integration

### Base URL

The backend API base URL is sourced from the `VITE_REACT_APP_BASEURL` environment variable, accessed at runtime as `import.meta.env.VITE_REACT_APP_BASEURL` and exported through `src/config/config.js`.

### Authentication Flow

1. Client generates a salted bcrypt hash of the `VITE_REACT_APP_AUTH_P` secret.
2. Client sends a `GET` request to `/getAuthToken` with the hash in the `Authorization` header.
3. The backend validates the hash and returns a bearer token.
4. The token is stored in AppContext as `x_token` and sent in subsequent requests as the `Bearer` header.
5. For user login, the password is reversed client-side before being sent to `/users/login`.

### Known API Endpoint Patterns

| Endpoint Pattern | Method | Used In |
|---|---|---|
| `/users/login` | POST | Login view |
| `/users/google-login` | POST | Login & SignUp views |
| `/users/signup` | POST | SignUp view |
| `/users/:id` | GET, PUT | useUpdateUserData, MissingEmail, UserDetails, RoomPicker |
| `/users/validateToken/:userId` | GET | useValidateToken |
| `/users/updateUserEmail/:userId` | POST | useValidateEmail |
| `/users/validateEmailSent/:userId` | GET | MissingEmail |
| `/countries` | GET | useGetSongs (songs/countries list) |
| `/countries/refresh/:year` | GET | Layout (point refresh for admin) |
| `/rooms/:roomId/:userId` | GET, PUT | Layout, RoomPicker (room data) |
| `/rooms/login` | POST | Home view (join room) |
| `/rooms/verifyRoomToken/:userId` | POST | Layout (join room via token) |
| `/archive/users/:userId` | GET | Archive view |
| `/archive/room/:roomId/:userId` | GET | Archive view |
| `/rooms/archive/export/:year` | GET | AdminView |
| `/getAuthToken` | GET | useGetAuthToken |
| `/updatable` | GET | Navigation (admin auth) |
| `{requestsUrl}` (config-defined) | POST, DELETE | AdminView (AI model requests) |

---

## 9. Configuration

### Environment Variables (`.env`)

| Variable | Purpose |
|---|---|
| `VITE_REACT_APP_BASEURL` | Backend API base URL |
| `VITE_REACT_APP_ADMIN` | Admin username for admin panel access |
| `VITE_REACT_APP_AUTH_P` | Auth secret used to derive the bcrypt hash for `/getAuthToken` |
| `VITE_REACT_APP_P_KEY` | Additional key (currently not used in source) |
| `VITE_REACT_APP_JOIN_ROOM` | Join room URL pattern (`/join-room?roomAuth`) |
| `VITE_REACT_APP_CONFIRM_EMAIL_URL` | Email confirmation URL pattern (`/confirm-email?user_id=`) |
| `VITE_REACT_APP_JOIN_ROOM_PATH` | Join room path (`/join-room`) |
| `VITE_REACT_APP_CLIENT_ID` | Google OAuth client ID |
| `VITE_REACT_APP_REQUESTS_URL` | URL path for AI model requests |
| `VITE_REACT_APP_REQUESTS_BASE_URL` | URL path for AI model request deletion |

### Runtime Config Object (`src/config/config.ts`)

```typescript
{
  env: import.meta.env.NODE_ENV || 'dev',
  isProd: import.meta.env.NODE_ENV === 'production',
  baseUrl: import.meta.env.VITE_REACT_APP_BASEURL,
  appAdmin: import.meta.env.VITE_REACT_APP_ADMIN,
  authP: import.meta.env.VITE_REACT_APP_AUTH_P,
  key: import.meta.env.VITE_REACT_APP_P_KEY,
  defProfilePicUrl: 'https://ui-avatars.com/api/',
  joinRoomLink: import.meta.env.VITE_REACT_APP_JOIN_ROOM,
  confirmemailLink: import.meta.env.VITE_REACT_APP_CONFIRM_EMAIL_URL,
  joinRoomPath: import.meta.env.VITE_REACT_APP_JOIN_ROOM_PATH,
  clientID: import.meta.env.VITE_REACT_APP_CLIENT_ID,
  requestsUrl: import.meta.env.VITE_REACT_APP_REQUESTS_URL,
  requestsBaseUrl: import.meta.env.VITE_REACT_APP_REQUESTS_BASE_URL
}
```

### PWA Manifest

Defined inline in `vite.config.js` via `vite-plugin-pwa`:

- **name**: EuroContest
- **short_name**: EuroContest
- **start_url**: `/`
- **display**: `fullscreen`
- **theme_color**: `#02025e`
- **background_color**: `#ff0088`
- **icons**: 128×128 and 512×512 PNGs in `public/`

---

## 10. Utilities

All utility and composable modules are in `src/utils/` and `src/composables/`. The `use` prefix follows the Vue composable convention.

| Module | Export | Description |
|---|---|---|
| `composables/useGetAuthToken.ts` | `default` | Generates a bcrypt-salted hash from the auth secret and calls `/getAuthToken`. Stores the returned token in the Pinia store. |
| `composables/useGetSongs.ts` | `default` (exported as composable) | Fetches the countries/songs list from `/countries` using the current bearer token. |
| `composables/useUpdateUserData.ts` | `default` | Refreshes user data from `/users/:id` and navigates to `/app`. |
| `composables/useHandleCloseSession.ts` | `default` | Calls the Pinia store's `closeSession()` to clear all state and localStorage. |
| `composables/useNavigateWithCallback.ts` | `default` | Navigates to a destination, appending the current `callback_url` query parameter if present. |
| `composables/useValidateEmail.ts` | `default` | Posts an email confirmation token to `/users/updateUserEmail/:userId`. Returns `{ result, data }`. |
| `composables/useValidateToken.ts` | `default` | Validates the current auth token via `/users/validateToken/:userId`. Returns `isValidToken` boolean. |
| `utils/regexUtils.ts` | `validateRegex`, `validateEmailRegex`, `validateUserNameRegex`, `default` | Regex patterns and validation functions for passwords (8+ chars, digit, uppercase), emails, and usernames (5–25 chars, alphanumeric + underscore). |

---

## 11. Layout Shell

`src/Layout.vue` wraps the entire application with a consistent structure:

```
┌──────────────────────────────────┐
│  Navigation                      │
├──────────────────────────────────┤
│                                  │
│  {children}  (Route content)    │
│                                  │
├──────────────────────────────────┤
│  Modal (conditional)             │
├──────────────────────────────────┤
│  Footer                          │
└──────────────────────────────────┘
```

### Polling Intervals

| Interval | Condition | Action |
|---|---|---|
| 60 seconds | `x_token` present and `current_room.current` is defined | Calls `GET /rooms/:roomId/:userId` to refresh room data |
| 40 seconds | `x_token` present, `user_logged.username === appAdmin`, and `updatable.refresh_enabled` | Calls `GET /countries/refresh/:year` to update point data (admin only) |

### Auth Guard

Layout checks `context.user_logged` on mount. If the user is not logged in, it navigates to `/login` (or `/login?callback_url=...` if the current URL contains `callback_url` or the confirm-email link).

### Modal Rendering

Three modal modes are rendered conditionally:
1. **Confirm modal**: `modal.visible && modal.confirm && !modal.component` — shows accept/cancel buttons
2. **Component modal**: `modal.visible && modal.component` — renders a custom React component
3. **Message modal**: `modal.visible && !modal.confirm && !modal.component` — shows a simple status message

---

## 12. Testing Strategy

| Aspect | Detail |
|---|---|
| **Test runner** | Vitest (configured in `vitest.config.ts`, environment: `node`) |
| **Test location** | All tests live in the `tests/` directory at the project root |
| **Path alias** | `vitest.config.ts` configures `resolve.alias` mapping `@` → `src/`, allowing tests to import source modules using `@/components/...` or `@/views/...` |
| **Convention** | One test file per source module: `notes.test.ts`, `storage.test.ts`, `features.test.ts`, `cli.test.ts`, `cli_features.test.ts`, `build.test.ts` |
| **Test isolation** | Tests use real temporary files (no mocks for file system). Each test creates a temp file and cleans up after itself |
| **CLI integration tests** | `cli.test.ts` and `cli_features.test.ts` use `child_process.spawnSync` to invoke the CLI as a subprocess for end-to-end verification |
| **Build verification** | `build.test.ts` uses `spawnSync` to invoke `vite build` and asserts exit code 0, ensuring the production build always succeeds |
| **Form component tests** | Tests for components using `Form` (e.g., `AdminPanelRefs.test.ts`, `UserDetails.test.ts`, `AdminView.test.ts`) use the callback pattern `setRef: (el: any) => someRef.value = el` or `refer: (el: any) => { passwordRef.value = el }` in their stubs/props, matching the current component interfaces |
| **Run command** | `npm test` (maps to `vitest run`) |
| **TypeScript** | Tests are written in TypeScript (`tsconfig.json` with `strict: true`, `types: ["vue", "node"]`) |

---

## 13. Build & Deployment

### npm Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `vite` | Start development server with HMR |
| `build` | `vite build` | Production build (output to `build/`) |
| `serve` | `vite preview` | Preview the production build locally |
| `lint` | `eslint src --ext .js` | Lint JavaScript source files |
| `lint:fix` | `eslint src --ext .js -- --fix` | Lint and auto-fix |
| `test` | `vitest run` | Run test suite |

### Docker Setup

**Dockerfile** (multi-stage):

1. **base** — `node:18.15.0-alpine`, sets `WORKDIR /usr/src/app`
2. **deps** — Installs production dependencies only (`npm ci --omit=dev`)
3. **build** — Installs all dependencies, copies source, injects secrets via `--mount=type=secret,id=my_env`, runs `npm run build`, removes `.env.local`
4. **serve** — `nginx:1.19.0`, copies the build output to `/usr/share/nginx/html`

**compose.yaml**:

- Defines a single `app` service built from the Dockerfile
- Mounts `.env` as a Docker secret (`my_env`)
- Sets `NODE_ENV=production`
- Exposes port `8080:80`

### PWA Build Configuration

Configured in `vite.config.js` via `vite-plugin-pwa`:

- **registerType**: `autoUpdate` (service worker auto-updates)
- **devOptions**: PWA enabled in dev mode
- **manifest**: Defined inline (name, icons, theme colors, display mode)

The PWA manifest is linked from `index.html` as `/manifest.webmanifest`, and the plugin generates the service worker at build time.

---

## 14. Architectural Concerns

The following issues are observable in the current codebase:

### Inconsistent CSS Naming

Component CSS files use three different naming conventions, and the inconsistency persists (no consolidation toward a single convention has occurred):

- PascalCase with `.Component.css` suffix (8 files):
  `Classification.Component.css`, `CountryPicker.Component.css`, `Form.Component.css`,
  `Home.Component.css`, `CreateRoom.Component.css`, `UserDetails.Component.css`,
  `RoomPicker.Component.css`, `RoomNameEditForm.Component.css`
- camelCase with `.component.css` suffix (5 files):
  `AdminPanel.component.css`, `Collapsible.component.css`, `Footer.component.css`,
  `Navigation.component.css`, `Modal.component.css`
- Truncated/typo naming (1 file):
  `AdminView.componen.css` (missing `t` in `component`)
- Special case (1 file):
  `App.css` (NotFoundComponent, no convention applied)

Additionally, the CSS import paths reference `../../Components/` (capital C) while the source code lives under `src/components/` (lowercase c). Both resolve correctly on case-insensitive filesystems but may cause issues on case-sensitive systems.

### Composables Named with `use` Prefix

Composables in `src/composables/` and utility modules in `src/utils/` use the `use` prefix (e.g., `useUpdateUserData`, `useHandleCloseSession`, `useValidateToken`) following the Vue composable convention. Most are plain async functions rather than true Vue composables (they don't call Vue APIs like `ref()` or `reactive()` internally).

### API Calls in Layout and Components Instead of a Service Layer

Backend API calls are made directly from:
- `Layout.vue` (room data polling, point refresh, room token verification)
- `Navigation.vue` (admin authentication via `/updatable`)
- `Home.vue` (room login)
- `Login.vue` (user authentication, Google OAuth)
- `SignUp.vue` (user registration, Google OAuth)
- `AdminView.vue` (updatable settings, archive export, AI model requests)
- `MissingEmail.vue` (email update and confirmation)
- `RoomPicker.vue` (room data updates, room operations)

There is no centralized API service layer; each component imports `axios` directly and constructs API calls inline.

### Template Ref Callback Pattern

The `Form` component uses the `setRef?: (el: any) => void` callback pattern to capture DOM element references from its `fields` array, rather than the traditional `Ref<HTMLElement>` pattern. The Form template applies `:ref="(el: any) => { if (field.setRef) field.setRef(el) }"` on each field's `<input>` element, and parent components pass inline callbacks like `setRef: (el: any) => passwordRef = el`.

**Rationale**: Passing `Ref` objects as props creates tight coupling between parent and child component APIs and makes testing harder. The callback pattern allows each parent to own its ref variable, keeps the Form component agnostic of how refs are stored, and aligns with Vue 3's recommendation for function refs.

**Scope**: Every component consuming Form (see §4 — Component Architecture) follows this pattern, including Home, Login, SignUp, CreateRoom, UserDetails, AdminView, and Navigation. The `AdminPanel` component also exposes a `refer: (el: any) => void` prop that follows the same callback convention.

---

## 15. Relationship to `docs/architecture.md`

This `ARCHITECTURE.md` is a **descriptive reference** — it documents what the codebase **currently is**. It is located at the project root for quick discovery.

`docs/architecture.md` is a **prescriptive policy** — it defines the rules the project **should follow** (atomic persistence, no mocks, no new deps, stateless CLI, etc.).

Both files coexist and serve complementary purposes. Updating one does not require updating the other, though they should remain consistent over time.