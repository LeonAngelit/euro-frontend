# ARCHITECTURE.md

> Descriptive reference of the current project architecture.
> For prescriptive rules, see [`docs/architecture.md`](docs/architecture.md).
> For style rules, see [`docs/conventions.md`](docs/conventions.md).

---

## 1. Project Overview

**EuroContest App** is a Vue 3 single-page application (SPA) for the Eurovision Song Contest voting and room system. It is a client-side application that communicates with a separate REST API backend. The project also includes a CLI subsystem (written in TypeScript) for notes and feature management.

### SPA

The SPA allows users to:
- Register and log in (username/password or Google OAuth)
- Select countries for each year's Eurovision contest
- Create, join, and participate in voting rooms
- View live classifications and historical results
- Manage profiles (including email confirmation)

Architectural principles:
- **Direct API calls**: All HTTP requests use `axios` directly from components/views — there is no centralized service layer or DAO layer.
- **Callback refs**: Form field DOM access uses callback function refs instead of `Ref<HTMLElement>` props.
- **Polling**: Room data (60s) and admin point refresh (40s) use `setInterval` watchers in `Layout.vue`.

### CLI Subsystem

The CLI subsystem provides commands for managing notes and features via the terminal, using atomic JSON file persistence (temp file + rename). It is a separate, standalone set of modules (`src/cli.ts`, `src/notes.ts`, `src/storage.ts`, `src/features.ts`, `src/prompts.ts`) that share no code with the SPA.

---

## 2. Tech Stack

| Category              | Technology                        | Version       | Purpose                                                                |
|-----------------------|-----------------------------------|---------------|------------------------------------------------------------------------|
| **Framework**         | Vue 3 (Composition API + `<script setup>`) | ^3.5    | UI framework with Composition API and single-file components           |
|                       | Vite                              | ^6.2.0        | Development server and production build tool                           |
|                       | TypeScript (strict)               | ^6.0.3        | Type-safe JavaScript, strict mode enabled                              |
| **Routing**           | vue-router                        | ^4.4          | Client-side routing with lazy-loaded views, `createWebHistory` mode    |
| **State Management**  | Pinia                             | ^2.2          | Global state management store                                          |
|                       | pinia-plugin-persistedstate       | ^3.2.3        | Automatic persistence of store state to localStorage/sessionStorage    |
| **i18n**              | vue-i18n                          | ^9.14.5       | Internationalization with `legacy: false` (Composition API mode)       |
| **HTTP Client**       | axios                             | ^1.7.9        | HTTP requests to backend API                                           |
| **UI / Icons**        | @iconify/vue                      | ^4.3          | Iconify icon component (star icon, etc.)                               |
|                       | @fortawesome/vue-fontawesome      | ^3.1          | FontAwesome icon component (eye/eye-slash for password toggle)         |
|                       | @fortawesome/fontawesome-svg-core | ^6.7.2        | FontAwesome core library                                               |
|                       | @fortawesome/free-solid-svg-icons | ^6.7.2        | Free solid icon set                                                    |
|                       | flag-icons                        | ^7.3.2        | Country flag CSS classes (`fi fi-xx`)                                  |
| **Auth**              | vue3-google-login                 | ^2.1          | Google OAuth login integration                                         |
| **Bundler / Build**   | @vitejs/plugin-vue                | ^5.2          | Vite plugin for Vue 3 SFC compilation                                  |
|                       | vite-plugin-env-compatible        | ^2.0.1        | Ensures `process.env` compatibility in Vite                            |
|                       | vite-plugin-node-polyfills        | ^0.23.0       | Polyfills Node.js globals (Buffer, process) for browser                |
|                       | buffer                            | ^6.0.3        | Buffer polyfill for browser environment                                |
|                       | vite-plugin-pwa                   | ^0.21.1       | PWA support (service worker, manifest)                                 |
| **Testing**           | Vitest                            | ^4.1.6        | Test runner with `node` environment                                    |
|                       | @vue/test-utils                   | ^2.4          | Vue component testing utilities                                        |
|                       | jsdom                             | ^29.1.1       | DOM environment for component tests                                    |
| **CLI**               | commander                         | ^14.0.3       | Command-line argument parsing for CLI subsystem                        |
| **Linting**           | ESLint                            | ^9.21.0       | Code linting                                                           |
|                       | eslint-plugin-vue                 | ^9.28         | ESLint rules for Vue 3 SFCs                                            |
| **Dev Tooling**       | tsx                               | ^4.22.0       | TypeScript execution for CLI scripts                                   |
|                       | vue-tsc                           | ^2.1          | Vue TypeScript type-checking                                           |
|                       | @types/node                       | ^25.8.0       | Node.js type definitions                                               |

---

## 3. Project Structure

```
euro-frontend/
├── src/
│   ├── App.vue                        # Root component: renders Layout
│   ├── main.ts                        # App bootstrap: Pinia → Router → i18n → Google OAuth → mount
│   ├── Layout.vue                     # Shell: Navigation → RouterView (Suspense) → Modal → Footer
│   ├── index.css                      # Global styles (Eurovision theme, CSS custom properties)
│   ├── env.d.ts                       # TypeScript declarations for .vue modules and vue3-google-login
│   ├── config/
│   │   └── config.ts                  # Runtime configuration from import.meta.env
│   ├── router/
│   │   └── index.ts                   # Vue Router with 13 route entries, navigation guards
│   ├── stores/
│   │   └── app.ts                     # Pinia store: user, rooms, songs, modal, selection state
│   ├── locales/
│   │   ├── index.ts                   # vue-i18n@9 instance (legacy: false, default: es)
│   │   ├── es.json                    # Spanish translations (default locale)
│   │   └── en.json                    # English translations
│   ├── composables/
│   │   ├── useGetAuthToken.ts         # Fetches auth token from /getAuthToken
│   │   ├── useDetectLocale.ts         # IP-based locale detection (ipapi.co → ip-api.com)
│   │   ├── useValidateToken.ts        # Validates auth token via /users/validateToken
│   │   ├── useValidateEmail.ts        # Validates email confirmation token
│   │   ├── useUpdateUserData.ts       # Refreshes user data from API and navigates to /app
│   │   ├── useNavigateWithCallback.ts # Navigates preserving callback_url query param
│   │   ├── useHandleCloseSession.ts   # Clears all state and session storage
│   │   └── useGetSongs.ts             # Fetches countries/songs list from /countries
│   ├── components/                    # 12 reusable Vue components
│   │   ├── AdminPanel/AdminPanel.vue       # Password dialog for admin access
│   │   ├── ClassificationView/
│   │   │   ├── ClassificationView.vue      # Ranked classification list
│   │   │   └── UserCard.vue                # Individual user card with glassmorphism
│   │   ├── Collapsible/Collapsible.vue     # Expandable/collapsible section
│   │   ├── CountryPicker/CountryPicker.vue # Country selection with flags + checkboxes
│   │   ├── Footer/Footer.vue               # Copyright footer with Eurovision gradient
│   │   ├── Form/Form.vue                   # Reusable form with callback ref pattern
│   │   ├── Modal/Modal.vue                 # Generic modal (message, confirm, component)
│   │   ├── Navigation/Navigation.vue       # Top nav bar with user menu and admin panel
│   │   ├── NotFound/NotFound.vue           # 404 page with auto-redirect
│   │   ├── RoomPicker/
│   │   │   ├── RoomPicker.vue              # Room cards with CRUD actions
│   │   │   └── RoomNameEditForm.vue        # Inline edit form injected into Modal
│   │   └── (component directories each contain a .vue file and no external CSS)
│   ├── views/                         # 10 page-level view components
│   │   ├── App/Home.vue                     # Main room selection view
│   │   ├── Login/Login.vue                  # Login form with Google OAuth
│   │   ├── CreateUser/SignUp.vue            # Registration form
│   │   ├── UserDetails/UserDetails.vue      # Profile management
│   │   ├── CreateRoom/CreateRoom.vue        # Room creation form
│   │   ├── Room/Room.vue                    # Active room classification view
│   │   ├── Archive/Archive.vue              # Historical room results browser
│   │   ├── AdminView/AdminView.vue          # Admin dashboard
│   │   ├── CountrySelection/CountrySelect.vue # Country voting view
│   │   └── MissingEmail/MissingEmail.vue    # Email confirmation flow
│   ├── utils/
│   │   └── regexUtils.ts              # Validation regex patterns (password, email, username)
│   ├── cli.ts                         # CLI entry point (Commander.js)
│   ├── notes.ts                       # Note domain model (Note, NoteData, NoteError)
│   ├── storage.ts                     # Atomic JSON file persistence (temp + rename)
│   ├── features.ts                    # Feature data model and management
│   └── prompts.ts                     # Interactive CLI prompting (readline)
├── tests/                            # 40 files (39 test specs + 1 helper)
│   ├── AdminPanel.test.ts
│   ├── AdminPanelRefs.test.ts
│   ├── AdminView.test.ts
│   ├── appStore.test.ts
│   ├── build.test.ts                    # Build verification test
│   ├── ClassificationView.test.ts
│   ├── cli.test.ts                      # CLI integration tests
│   ├── cli_features.test.ts
│   ├── Collapsible.test.ts
│   ├── CountryPicker.test.ts
│   ├── CreateRoom.test.ts
│   ├── Eurovision_styling.test.ts       # Styling conformance tests
│   ├── features.test.ts
│   ├── Footer.test.ts
│   ├── Form.test.ts
│   ├── Home.test.ts
│   ├── i18n.test.ts
│   ├── i18nPlugin.ts                    # Test helper plugin
│   ├── Login.test.ts
│   ├── MissingEmail.test.ts
│   ├── Modal.test.ts
│   ├── Navigation.test.ts
│   ├── NotFound.test.ts
│   ├── notes.test.ts
│   ├── regexUtils.test.ts
│   ├── RoomNameEditForm.test.ts
│   ├── RoomPicker.test.ts
│   ├── router.test.ts
│   ├── SignUp.test.ts
│   ├── storage.test.ts
│   ├── types.test.ts
│   ├── useDetectLocale.test.ts
│   ├── useGetAuthToken.test.ts
│   ├── useGetSongs.test.ts
│   ├── useHandleCloseSession.test.ts
│   ├── useNavigateWithCallback.test.ts
│   ├── useUpdateUserData.test.ts
│   ├── useValidateEmail.test.ts
│   ├── useValidateToken.test.ts
│   ├── UserDetails.test.ts
│   └── vercel.test.ts
├── docs/
│   ├── architecture.md               # Prescriptive architecture rules
│   ├── conventions.md                # Style and naming conventions
│   ├── specs.md                      # Spec Driven Development process
│   └── verification.md               # Verification and testing guidelines
├── specs/                            # Per-feature spec directories (SDD)
│   └── comprehensive_architecture_and_styling_analysis/
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
├── progress/                         # Session tracking
│   ├── current.md
│   └── history.md
├── public/
│   ├── favicon.ico
│   ├── index.html                    # HTML entry point
│   ├── robots.txt
│   ├── star_icon_128.png             # PWA icon 128×128
│   └── star_icon_512.png             # PWA icon 512×512
├── .env                              # VITE_ environment variables
├── Dockerfile                        # Multi-stage: node build → nginx serve
├── compose.yaml                      # Docker Compose with secrets
├── feature_list.json                 # Feature tracking (SDD workflow)
├── vite.config.js                    # Vite + Vue + PWA + polyfills
├── vitest.config.ts                  # Vitest config (node environment, @ alias)
├── tsconfig.json                     # TypeScript (strict, bundler resolution, @ alias)
├── vercel.json                       # Vercel deployment config (SPA rewrites)
├── package.json                      # Dependencies and scripts
├── package-lock.json
├── AGENTS.md                         # Navigation map for AI agents
├── ARCHITECTURE.md                   # This file
├── CHECKPOINTS.md
└── .gitignore
```

---

## 4. Component Catalog

All components live in `src/components/` and use Vue 3 `<script setup lang="ts">` with scoped CSS (no external CSS files). All component-specific CSS has been inlined into `<style scoped>` blocks.

| Component | File | Purpose | Key Props | Scoped Styling Notes |
|-----------|------|---------|-----------|---------------------|
| **AdminPanel** | `AdminPanel/AdminPanel.vue` | Password dialog overlay for admin access. Wraps `Form` with a single password field and close button. | `action: (Event) => void`, `refer: (el: any) => void` (callback ref), `error: any`, `close: () => void` | Positioned absolutely with `backdrop-filter: blur(10px)` background overlay; close button is pink circle (`border-radius: 50%`). |
| **ClassificationView** | `ClassificationView/ClassificationView.vue` | Displays a ranked list of room participants with country selections, scores, and animated card layout. | `room: any`, `animate?: boolean`, `isArchive?: boolean` | Sticky title bar with gold bottom border; `users` is a computed property that filters by `countries.length >= targetCount` (or `> 0` for archive). Flag icons imported via `<style src="flag-icons/css/flag-icons.min.css">`. |
| **UserCard** | `ClassificationView/UserCard.vue` | Individual user display card with position badge, avatar, username, country flags, and total score. | `user: any`, `index: number \| string`, `animActive: boolean` | Glassmorphism: `backdrop-filter: blur(20px)` on `.user-card`, `rgba(18, 14, 40, 0.7)` background. Gold rounded avatar frame (`outline: 1.5px solid var(--euro-gold)`). Position badges with gold/silver/bronze gradients (`pos-1`: `#ffe066→#d4af37`, `pos-2`: silver gradient, `pos-3`: bronze gradient). Color overlay layer from `user.color`. Hover glow box-shadow. Slide-in animation on mount. |
| **Collapsible** | `Collapsible/Collapsible.vue` | Expandable/collapsible section wrapper. Uses CSS `max-height` toggle (not `v-if`). | `title: string`, `collapsed?: boolean` (default: false). Emits: `toggle`. | Gold bottom border, semi-transparent background (`rgba(255,255,255,0.04)`), rounded corners. SVG chevron rotates 90° when collapsed. Uses `.collapsed` (max-height: 0) / `.uncollapsed` (max-height: max-content) classes. |
| **CountryPicker** | `CountryPicker/CountryPicker.vue` | Country selection grid with flag icons, checkboxes, and continue button. | `modal?: boolean`, `additionalAction?: () => void` | Country cards with gold border, pink hover glow. Selected cards have pink border + `rgba(255,0,135,0.15)` background. Continue button: pink gradient (`linear-gradient(135deg, var(--euro-pink) 0%, rgb(200, 0, 105) 100%)`). |
| **Footer** | `Footer/Footer.vue` | Copyright footer displaying name and current year. | None | Pink gradient background (`linear-gradient(135deg, var(--euro-pink) 0%, rgb(200, 0, 105) 100%)`), gold top border, sticky bottom, 2.5vh height. |
| **Form** | `Form/Form.vue` | Reusable form component with configurable fields, password visibility toggle, remember-me checkbox, and callback ref pattern. | `action: (Event) => void \| Promise<void>`, `error?: any`, `submitValue?: string`, `showPassword?: boolean`, `remember?: boolean`, `fields: FormField[]`, `preview?: string \| null`, `onImageChange?: (Event) => void` | Gold borders on inputs, pink focus ring (`box-shadow: 0 0 12px rgba(255,0,135,0.3)`), dark semi-transparent backgrounds (`rgba(255,255,255,0.1)`). Pink submit button. File input: dashed pink border. Responsive: 90% width on mobile, max 500px on desktop. Password visibility toggle via FontAwesome eye/eye-slash icons. |
| **Modal** | `Modal/Modal.vue` | Generic modal with three modes: plain message, confirm dialog (accept/cancel), custom component injection. | `message?: string`, `status?: string`, `onclick?: () => void`, `onaccept?: () => void`, `confirm?: boolean`, `component?: any` | Navy background (`rgba(2,2,94,0.85)`) with `backdrop-filter: blur(4px)`. Pink borders with glow shadow (`box-shadow: 0 0 30px rgba(255,0,135,0.2)`). Slide-in animation (`slideIn` keyframes). Success variant: gold gradient; Error variant: red gradient. Accept button: pink with glow; Cancel: red. |
| **Navigation** | `Navigation/Navigation.vue` | Top navigation bar with app logo (star icon + title), user avatar/menu, and admin panel integration. | None (uses store directly) | Pink gradient header (`linear-gradient(135deg, var(--euro-pink) 0%, rgb(200, 0, 105) 100%)`) with drop-shadow glow. Gold star icon with drop-shadow filter. User menu: navy background, pink border, hidden by default (`top: -100%`), slides down when toggled. `.router-link-exact-active`: gold bottom border (`border-bottom: 2px solid var(--euro-gold)`). Responsive breakpoints at 600px and 1000px. |
| **NotFound** | `NotFound/NotFound.vue` | 404 page that displays an error message and auto-redirects to `/app` or `/login` based on auth state. | None (uses store + router directly) | Minimal styling; relies on global styles. Contains app-logo keyframes (legacy). |
| **RoomPicker** | `RoomPicker/RoomPicker.vue` | Lists user rooms as cards with select, edit, share, forget, and delete actions. | `rooms?: Room[]` | Room cards: semi-transparent background with gold border (`rgba(218,183,29,0.3)`), hover gold border + pink glow. Actions row with forget (red), edit (pink icon), share, delete (red) buttons. Icon buttons with hover glow effects. |
| **RoomNameEditForm** | `RoomPicker/RoomNameEditForm.vue` | Inline room name editor injected into Modal component. Uses `v-model` on input and validates with `validateUserNameRegex`. | None (reads/writes store.modal) | Minimal form styling with text input and action buttons (save/cancel). Reads `editingRoomId` and `currentRoomName` from `store.modal`. |

### Callback Ref Pattern Details

All components consuming `Form` (Home, Login, SignUp, CreateRoom, UserDetails, AdminView, Navigation) use the `setRef: (el: any) => someRef = el` callback pattern in their `fields` array. The `AdminPanel` component uses the same pattern via its `refer` prop. This replaces the previous approach of passing `Ref` objects as props, reducing coupling and aligning with Vue 3's functional refs recommendation.

---

## 5. View Catalog

| View | File | Route | Purpose | Key State / API Dependencies |
|------|------|-------|---------|---------------------------|
| **Home** | `App/Home.vue` | `/app` | Main landing view after login. Shows `RoomPicker` and `Collapsible` join-room form. Redirects to country selection if user hasn't selected countries, or to room if a current room is set. | `store.userLogged`, `store.songs`, `store.currentRoom`, `targetCount` computed. API: `POST /rooms/join` (join room), `useValidateToken`. |
| **Login** | `Login/Login.vue` | `/login` | Login form with username/password + Google OAuth. Validates credentials, stores user/token in Pinia store. | `store.userLogged`, `store.setUserLogged`, `store.setXToken`. API: `POST /users/login`, `POST /users/google-login`, `useGetAuthToken`. |
| **SignUp** | `CreateUser/SignUp.vue` | `/signup` | Registration form with username, email, password, and Google OAuth. | `store.userLogged`, `store.setUserLogged`, `store.setXToken`. API: `POST /users/signup`, `POST /users/google-login`, `useGetAuthToken`. |
| **UserDetails** | `UserDetails/UserDetails.vue` | `/profile` | User profile management: update username, email, password, avatar image, color preference; manage country selections via `CountryPicker` inside `Collapsible`. | `store.userLogged`, `store.modal`, `useValidateToken`. API: `PUT /users/:id` (with various data payloads). |
| **CreateRoom** | `CreateRoom/CreateRoom.vue` | `/createroom` | Room creation form (name + password). Password reversed and hashed before sending. | `store.userLogged`, `useUpdateUserData`. API: `POST /rooms`. |
| **Room** | `Room/Room.vue` | `/room` | Active room classification view. Shows `ClassificationView` for `store.currentRoom.current`. Redirects if no current room or insufficient country selections. | `store.currentRoom`, `store.userLogged`, `store.songs`. Uses `useValidateToken`. |
| **Archive** | `Archive/Archive.vue` | `/archive` | Historical room results browser. Custom dropdown to select a past room, then displays `ClassificationView` with `isArchive={true}`. | `store.userLogged`, `historicalRooms` (local ref). API: `GET /archive/users/:userId` (list rooms), `GET /archive/room/:roomId/:userId` (room data). |
| **AdminView** | `AdminView/AdminView.vue` | `/admin` | Admin dashboard: toggle voting/registration/refresh flags, change master password, update country links, export archive results, send AI model requests. | `store.updatable`, `store.userLogged`, `store.modal`, `config.appAdmin`. API: `GET /updatable`, `PUT /updatable`, `GET /countries/updateLinks/:year`, `GET /rooms/archive/export/:year`, `POST {requestsUrl}` (AI requests), `DELETE {requestsBaseUrl}`. |
| **CountrySelect** | `CountrySelection/CountrySelect.vue` | `/country-select` | Country voting view. Validates user token, renders `CountryPicker`, watches for sufficient selections, then redirects to home or join-room callback. | `store.userLogged`, `store.songs`, `targetCount` computed. Uses `useValidateToken`. |
| **MissingEmail** | `MissingEmail/MissingEmail.vue` | `/missing-email`, `/confirm-email` | Email confirmation flow: enter email → receive confirmation link → validate token. Used for both `/missing-email` (enter email) and `/confirm-email` (validate token from URL). | `store.userLogged`, `store.modal`, `emailSent` (local ref), `useValidateEmail`. API: `PUT /users/:id` (set email), `GET /users/validateEmailSent/:userId`, `POST /users/updateUserEmail/:userId`. |

---

## 6. Styling Theme

The application uses a dramatic Eurovision contest visual identity defined in `src/index.css` with CSS custom properties, glassmorphism effects, and glamorous glow accents.

### 6.1 Color System

CSS custom properties defined in `:root` (`src/index.css` lines 7–17):

| Variable | Value | Purpose |
|----------|-------|---------|
| `--primary-color` | `rgb(2, 2, 94)` | Deep navy — page background, modal backgrounds |
| `--primary-color-background` | `rgb(0, 67, 255, 0.4)` | Semi-transparent blue overlay |
| `--error-color` | `rgb(164, 8, 8)` | Error state backgrounds |
| `--error-background` | `rgb(164, 8, 8, 0.3)` | Error message backgrounds |
| `--success-color` | `rgb(154 229 148)` | Success state backgrounds |
| `--euro-pink` | `rgb(255, 0, 135)` | Primary accent — headings, buttons, active elements, scrollbar |
| `--euro-pink-background` | `rgb(255, 0, 135, 0.5)` | Semi-transparent pink overlay |
| `--euro-yellow` | `rgb(255, 248, 0)` | Subtle highlights (last country selection, some icons) |
| `--euro-gold` | `rgb(218, 183, 29)` | Secondary accent — h1 headings, borders, active links, success modals |

### 6.2 Body Background

The body uses a multi-layered dark navy background with dramatic pink spotlights and sparkle dots (defined in `src/index.css` lines 208–229):

```css
body {
  background-color: var(--primary-color);
  background-image:
    /* Pink radial spotlights */
    radial-gradient(ellipse at 50% 40%, rgba(255, 0, 135, 0.25) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(255, 0, 135, 0.10) 0%, transparent 40%),
    /* Sparkle dot pattern (8 dot layers) */
    radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.3) ...),
    /* Gold sparkle dots */
    radial-gradient(3px 3px at 50% 90%, rgba(218, 183, 29, 0.3) ...),
    /* Base gradient */
    linear-gradient(180deg, var(--primary-color) 0%, rgb(1, 1, 60) 100%);
  background-attachment: fixed;
  background-size: 100% 100%, 100% 100%, 200px 200px, ..., 100% 100%;
}
```

This creates a dynamic, festive night-sky effect with pink center lighting, scattered sparkle dots, and a deep navy gradient.

### 6.3 Glassmorphism

The `.container` class applies glassmorphism:
- `background: rgba(255, 255, 255, 0.06)` — very translucent white
- `backdrop-filter: blur(6px)` — frosted glass blur
- `border: 1px solid rgba(255, 255, 255, 0.08)` — subtle border
- `border-radius: 12px` — rounded corners

This pattern is used across all views as the main content wrapper.

### 6.4 Navigation

- **Background**: Pink gradient `linear-gradient(135deg, var(--euro-pink) 0%, rgb(200, 0, 105) 100%)`
- **Shadow**: `box-shadow: 0 2px 16px rgba(255, 0, 135, 0.3)` — pink drop-shadow glow
- **Star icon**: Gold (`var(--euro-gold)`), 40px, with drop-shadow filter for glow
- **User menu**: Navy background (`var(--primary-color)`), pink border, hidden until toggled
- **Active links**: `.router-link-exact-active` has gold bottom border and gold text color
- **Profile picture** (`.profile-button`): Glassmorphism square with `border-radius: 12px`, semi-transparent navy background (`rgba(18, 14, 40, 0.6)`), `backdrop-filter: blur(8px)` for frosted glass effect, and a subtle white border. The `<img>` inside has `border-radius: 10px` and `object-fit: cover`. On hover, brightness increases and a pink glow (`box-shadow: 0 0 12px rgba(255, 0, 135, 0.3)`) appears. Container is 15% width (min 48px) on mobile, 5% on desktop (`>= 1000px`).

### 6.5 Button System

- **`.btn-primary`**: Pink background (`var(--euro-pink)`), white text, pink glow (`box-shadow: 0 0 12px rgba(255,0,135,0.3)`), hover increases brightness and glow.
- **`.btn-secondary`**: Gold background (`var(--euro-gold)`), navy text, gold glow, hover increases brightness and glow.
- Both buttons: `border-radius: 6px`, `font-weight: bold`, `transition: all 0.2s ease`.

### 6.6 Typography

- **Global headings** (`h1`, `h2`, `h3`): Pink color (`var(--euro-pink)`)
- **`h1` specifically**: Gold color (`var(--euro-gold)`) with text-shadow glow (`0 0 20px rgba(218,183,29,0.3)`)
- **Body text**: White (`color: white`)
- **Links**: Pink default, gold on hover

### 6.7 Card Patterns

**.room-card** (RoomPicker):
- Semi-transparent background with gold-tinted border
- Glass effect with hover border color change to gold
- Hover pink glow (`box-shadow: 0 0 20px rgba(255,0,135,0.15)`)
- Gold bottom border on actions row

### 6.8 UserCard Deep-Dive

The UserCard component (`src/components/ClassificationView/UserCard.vue`) features extensive Eurovision styling:

- **Glassmorphism**: `backdrop-filter: blur(20px)` on `.user-card` with `rgba(18, 14, 40, 0.7)` background
- **Dynamic ambient glow**: `.user-card-glow` with 60px blur, matching user's custom color (or pink by default), invisible until hover
- **Color overlay**: Translucent colored layer at 12% opacity from user's `color` preference
- **Gold avatar frame**: White border + gold outline (`outline: 1.5px solid var(--euro-gold)`) with glow on hover
- **Position badges**: Circular rank badges — gold gradient for #1 (`#ffe066→#d4af37`), silver for #2, bronze for #3
- **Winner indicator**: Gold username text with crown emoji, gold card border/shadow
- **Country chips**: Glass chips (blur 4px) with flag icons and point values; winner picks have gold borders, tail picks have blue borders
- **Points display**: Pink-background score badge with `PTS` suffix
- **Hover effects**: Card lifts (`translateY(-2px)`), glow increases, background darkens
- **Responsive**: At 768px+, cards become horizontal layout with hidden divider

### 6.9 Form Inputs

- **Default**: Gold border (`1px solid var(--euro-gold)`), dark semi-transparent background (`rgba(255,255,255,0.1)`)
- **Focus**: Pink bottom border (`border-bottom: 2px solid var(--euro-pink)`), pink glow box-shadow
- **Placeholder**: White at 50% opacity
- **Password wrapper**: Relative-positioned div with eye-toggle button in pink
- **Checkbox**: Pink accent color (`accent-color: var(--euro-pink)`)
- **File input**: Dashed pink border, pink file-selector button with hover glow

### 6.10 Modal Styling

- **Backdrop**: Navy `rgba(2,2,94,0.85)` with `backdrop-filter: blur(4px)`
- **Modal pane**: Navy background (`var(--primary-color)`), pink border, glow shadow (`0 0 30px rgba(255,0,135,0.2)`)
- **Animation**: `slideIn` keyframes — slides from right (120% → 0) with opacity fade
- **Success variant**: Gold gradient background
- **Error variant**: Red gradient background
- **Accept button**: Pink with glow; Cancel button: red
- **Desktop**: 30% width (vs 70% on mobile)

### 6.11 Custom Scrollbar

Defined for WebKit browsers (`::-webkit-scrollbar`):
- Width: 6px
- Track: transparent
- Thumb: `var(--euro-pink)` with 3px border-radius

### 6.12 Text Selection

`::selection` uses pink background with white text.

### 6.13 Responsive Breakpoints

| Breakpoint | Rules |
|------------|-------|
| `420px` | UserDetails: full-width inputs |
| `600px` | Navigation: mobile nav replaces desktop nav |
| `700px` | Form: 90% width on mobile |
| `768px` | UserCard: horizontal layout, hidden divider. Desktop sizing optimizations. |
| `1000px` | Container: 50% width centered. Navigation: profile button at 5%. Form: max 500px width. Modal: 30% width. |

Uses a **mobile-first** approach: default styles are mobile-optimized, with `@media (min-width: ...)` for larger screens.

### 6.14 Active Links

`.router-link-exact-active` (applied by vue-router) gets:
- Gold bottom border (`border-bottom: 2px solid var(--euro-gold)`)
- Gold text color (`color: var(--euro-gold) !important`)

---

## 7. State Management

The application uses **Pinia** for global state management, defined in `src/stores/app.ts` with the composition API (`defineStore` + `ref` pattern). The store is persisted to `localStorage`/`sessionStorage` via `pinia-plugin-persistedstate`.

### 7.1 State Fields

| Field | Type | Persisted | Description |
|-------|------|-----------|-------------|
| `userLogged` | `User \| false` | Yes | Current logged-in user data (id, username, email, image, countries, rooms) |
| `rememberUser` | `boolean` | Yes | Whether to persist session in localStorage (vs. sessionStorage only) |
| `currentRoom` | `RoomState \| undefined` | Yes | Active room data (`{ current: roomData }` or `undefined`) |
| `songs` | `any[]` | Yes | List of countries/songs fetched from `/countries` |
| `updatable` | `Updatable \| undefined` | Yes | Admin updatable settings (`refresh_enabled`, `updatable`, `updatable_user`, `master_password`) |
| `selection` | `SelectionState` | Yes | Country selection state (`{ current: number[] }` — array of country IDs) |
| `xToken` | `string` | Yes | Bearer token for API authentication |
| `modal` | `ModalState` | **No** | Modal state (`visible`, `message`, `status`, `confirm`, `component`, `onaccept`, `onclick`). Excluded from persistence to prevent stale UI after refresh. |

### 7.2 Actions and Setters

Each state field has a corresponding setter: `setUserLogged`, `setRememberUser`, `setCurrentRoom`, `setSongs`, `setUpdatable`, `setSelection`, `setXToken`, `setModal`. Additionally:

- **`closeSession()`**: Resets all state to defaults, clears localStorage and sessionStorage for the `app-context` key. Called on logout.
- **`fetchSongs()`**: Fetches countries list via `useGetSongs` when `xToken` exists and `songs` is empty.
- **Auto-fetch watcher**: A `watch(xToken, ...)` triggers `fetchSongs()` when token is set and songs are empty.

### 7.3 Custom Storage Adapter

The store uses a custom `appContextStorage` adapter that implements the `Storage` interface:

- **`getItem`**: Reads from `localStorage` first, falls back to `sessionStorage`
- **`setItem`**: If `remember_user` is true, writes to both `localStorage` and `sessionStorage`. Otherwise, writes only to `sessionStorage` and removes from `localStorage`.
- **`removeItem`**: Removes from both stores.

### 7.4 Persist Configuration

```typescript
persist: {
  key: 'app-context',  // STORAGE_KEY
  storage: appContextStorage,
  paths: ['userLogged', 'rememberUser', 'currentRoom', 'songs', 'updatable', 'selection', 'xToken'],
}
```

The `paths` array explicitly excludes `modal`, ensuring ephemeral UI state is never serialized.

### 7.5 Provider Wrapping (in `src/main.ts`)

```
Pinia (with createPersistedState) → Vue App → Router → i18n → vue3GoogleLogin
```

---

## 8. Routing

Routes are defined in `src/router/index.ts` using vue-router's `createRouter` with `createWebHistory`. All route components are lazy-loaded with dynamic `import()` and wrapped in `<Suspense>` in `Layout.vue`.

### 8.1 Route Table

| Path | Name | Component | Meta Flags |
|------|------|-----------|------------|
| `/app` | `Home` | `views/App/Home.vue` | `requiresAuth: true` |
| `/login` | `Login` | `views/Login/Login.vue` | `guestOnly: true` |
| `/signup` | `SignUp` | `views/CreateUser/SignUp.vue` | `guestOnly: true` |
| `/profile` | `UserDetails` | `views/UserDetails/UserDetails.vue` | `requiresAuth: true` |
| `/createroom` | `CreateRoom` | `views/CreateRoom/CreateRoom.vue` | `requiresAuth: true` |
| `/admin` | `AdminView` | `views/AdminView/AdminView.vue` | `requiresAuth: true`, `requiresAdmin: true` |
| `/archive` | `Archive` | `views/Archive/Archive.vue` | `requiresAuth: true` |
| `/room` | `Room` | `views/Room/Room.vue` | `requiresAuth: true` |
| `/country-select` | `CountrySelect` | `views/CountrySelection/CountrySelect.vue` | `requiresAuth: true` |
| `/missing-email` | `MissingEmail` | `views/MissingEmail/MissingEmail.vue` | `requiresAuth: true` |
| `/confirm-email` | `ConfirmEmail` | `views/MissingEmail/MissingEmail.vue` (same component) | `requiresAuth: true` |
| `/join-room` | — | Redirect to `/app` | `requiresAuth: true` |
| `/:pathMatch(.*)*` | `NotFound` | `components/NotFound/NotFound.vue` | None |

Total: **13 route entries**, **11 distinct route paths**, **10 unique view components** (MissingEmail serves two routes).

### 8.2 Navigation Guards

`router.beforeEach` implements three guard types:

1. **`requiresAuth`**: If user is not logged in (`!store.userLogged`), redirect to `/login`. Preserves `callback_url` query parameter for `/join-room` and confirm-email routes.
2. **`guestOnly`**: If user is logged in, redirect to `/app`. Used for Login and SignUp.
3. **`requiresAdmin`**: If logged-in user's username does not match `config.appAdmin`, redirect to `/app`.

### 8.3 Suspense Integration

`Layout.vue` wraps `<RouterView>` in `<Suspense>` with a loading fallback (`$t('layout.loading')`), leveraging Vue 3's built-in async component handling.

---

## 9. API Integration

### 9.1 Pattern: Direct axios Calls

The application does **not** use a centralized API service layer. Instead, each component or view imports `axios` directly and constructs calls inline using the configured base URL. This is a deliberate architectural choice (not a missing abstraction).

### 9.2 Base URL

The backend API base URL is sourced from the `VITE_REACT_APP_BASEURL` environment variable, accessed via `import.meta.env.VITE_REACT_APP_BASEURL` and exported through `src/config/config.ts` as `config.baseUrl`.

### 9.3 Authentication Flow

1. **Token acquisition**: `useGetAuthToken` composable sends a `GET` request to `/getAuthToken` with `Authorization: config.authP` header. The returned token is stored as `store.xToken`.
2. **Authenticated requests**: All subsequent API calls include `Bearer: store.xToken` and `Accept: application/json` headers.
3. **Login**: User password is reversed client-side (`password.split('').reverse().join('')`) before being sent to `/users/login`.
4. **Google OAuth**: The `vue3-google-login` component returns credential data; this is forwarded to `/users/google-login` with the auth token.

### 9.4 Endpoint Patterns

| Endpoint Pattern | Method | Used In |
|---|---|---|
| `/getAuthToken` | GET | `useGetAuthToken` |
| `/users/login` | POST | Login view |
| `/users/google-login` | POST | Login, SignUp |
| `/users/signup` | POST | SignUp |
| `/users/:id` | GET, PUT | `useUpdateUserData`, `useValidateEmail`, UserDetails, MissingEmail, RoomPicker |
| `/users/bulk/add-country/` | POST | CountryPicker (save country selection) |
| `/users/validateToken/:userId` | GET | `useValidateToken` |
| `/users/updateUserEmail/:userId` | POST | `useValidateEmail` (confirm email token) |
| `/users/validateEmailSent/:userId` | GET | MissingEmail (check if email was sent) |
| `/countries` | GET | `useGetSongs` (fetch country/song list) |
| `/countries/refresh/:year` | GET | Layout (admin point refresh polling) |
| `/countries/updateLinks/:year` | GET | AdminView (update song links) |
| `/rooms` | POST | CreateRoom |
| `/rooms/:roomId/:userId` | GET, PUT | Layout (room data polling), RoomPicker (select/update room), RoomNameEditForm |
| `/rooms/join` | POST | Home (join room) |
| `/rooms/remove-user` | POST | RoomPicker (forget room) |
| `/rooms/generateRoomToken/:roomId/:userId` | GET | RoomPicker (share room) |
| `/rooms/verifyRoomToken/:userId` | POST | Layout (join via room token) |
| `/archive/users/:userId` | GET | Archive (list historical rooms) |
| `/archive/room/:roomId/:userId` | GET | Archive (historical room data) |
| `/rooms/archive/export/:year` | GET | AdminView (export archive) |
| `/updatable` | GET, PUT | Navigation (admin auth), AdminView (update settings) |
| `{config.requestsUrl}` | POST | AdminView (send AI model request) |
| `{config.requestsBaseUrl}` | DELETE | AdminView (delete AI requests) |

---

## 10. Internationalization (i18n)

### 10.1 Setup

The application uses **vue-i18n@9** with non-legacy mode (Composition API). The i18n instance is created in `src/locales/index.ts`:

```typescript
const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'es',
  messages: { es, en },
})
```

- **Default locale**: `es` (Spanish)
- **Fallback locale**: `es` (Spanish — any missing key falls back to Spanish)
- **Mode**: `legacy: false` (Composition API, no `$t` in Options API)

### 10.2 Locale Files

| File | Contents |
|------|----------|
| `src/locales/index.ts` | Creates and exports the i18n instance |
| `src/locales/es.json` | Spanish translations (default) |
| `src/locales/en.json` | English translations |

### 10.3 Key Naming Convention

Keys use a flat dot-namespace structure grouped by component/view:

| Prefix | Scope |
|--------|-------|
| `nav.*` | Navigation component |
| `login.*` / `signup.*` | Auth views |
| `home.*` / `room.*` / `archive.*` | Main views |
| `modal.*` / `form.*` | Shared components |
| `admin.*` / `adminPanel.*` | Admin views |
| `validation.*` / `error.*` / `common.*` | Shared messages |
| `countryPicker.*` | Country selection |
| `userDetails.*` | User profile |
| `createRoom.*` | Room creation |
| `missingEmail.*` / `roomNameEdit.*` / `roomPicker.*` / `notFound.*` | Other components |

### 10.4 Locale Detection Strategy

The `useDetectLocale` composable (`src/composables/useDetectLocale.ts`) resolves the user's locale on app mount:

1. **localStorage check**: If `user-locale` key exists with a valid value (`es` or `en`), use it immediately.
2. **IP geolocation**: Fetch country code from `https://ipapi.co/json/` (primary) or `http://ip-api.com/json/` (fallback).
3. **Country-to-locale mapping**: 20 Spanish-speaking countries (ES, MX, AR, CO, PE, VE, CL, EC, GT, CU, BO, DO, HN, PY, SV, NI, CR, PA, UY, GQ) map to `es`; all others map to `en`.
4. **Persistence**: The detected locale is saved to `localStorage` under `user-locale` for subsequent visits.
5. **Fallback**: On any failure, defaults to `es` (Spanish).

Detection is triggered in `Layout.vue`'s `onMounted`: `useDetectLocale().then(detected => { locale.value = detected })`.

### 10.5 Usage in Components

- **Templates**: Use `$t('key')` for translation calls.
- **Script setup**: Destructure `t` from `useI18n()` and call `t('key')`.
- **Reactive switching**: The `locale` ref from `useI18n()` is reactive; changing `locale.value` re-renders all active components.

---

## 11. Composables

All composables live in `src/composables/` and follow the `use` prefix convention. Most are plain async functions rather than true Vue composables (they don't call Vue APIs like `ref()` or `reactive()` internally).

| Composable | File | Purpose | Return Value |
|-----------|------|---------|-------------|
| `useGetAuthToken` | `src/composables/useGetAuthToken.ts` | Fetches an auth token from `/getAuthToken` by sending `config.authP` in the `Authorization` header. Stores the returned token in the Pinia store. | `Promise<string \| null>` — the token string, or `null` on failure |
| `useDetectLocale` | `src/composables/useDetectLocale.ts` | Detects user locale via IP geolocation (ipapi.co → ip-api.com fallback). Checks localStorage first for a previously saved preference. | `Promise<string>` — `'es'` or `'en'` |
| `useValidateToken` | `src/composables/useValidateToken.ts` | Validates the current auth token against `/users/validateToken/:userId`. | `Promise<boolean>` — `true` if token is valid |
| `useValidateEmail` | `src/composables/useValidateEmail.ts` | Posts an email confirmation token to `/users/updateUserEmail/:userId`. | `Promise<{ result: boolean, data: any }>` |
| `useUpdateUserData` | `src/composables/useUpdateUserData.ts` | Fetches current user data from `/users/:id` and updates the store, then navigates to `/app`. | `Promise<void>` |
| `useNavigateWithCallback` | `src/composables/useNavigateWithCallback.ts` | Navigates to a destination while preserving any existing `callback_url` query parameter from the current URL. | `void` |
| `useHandleCloseSession` | `src/composables/useHandleCloseSession.ts` | Calls the Pinia store's `closeSession()` to clear all state and storage. | `void` |
| `useGetSongs` | `src/composables/useGetSongs.ts` | Fetches the countries/songs list from `/countries` using the provided `xToken`. | `Promise<any[]>` — array of country/song objects |

---

## 12. CLI Subsystem

The CLI subsystem is a separate, independent set of modules. It shares no code with the SPA portion and uses Node.js built-in modules (`fs/promises`, `path`, `crypto`, `readline`).

### 12.1 Entry Point: `src/cli.ts`

Uses Commander.js (`Command` class) to define commands. Executable via `tsx src/cli.ts <command>`.

### 12.2 Commands

| Command | Description | Arguments | Options |
|---------|-------------|-----------|---------|
| `add` | Add a new note with auto-incrementing ID | `<title>` | `--body <body>` (default: `""`) |
| `list` | List all notes (id, created_at, title) | None | None |
| `show` | Show a note's full details by ID | `<id>` (parsed as integer) | None |
| `delete` | Delete a note by ID | `<id>` (parsed as integer) | None |
| `search` | Search notes by keyword (matches title or body) | `<query>` | None |
| `recent` | List the N most recent notes | None | `--limit <number>` (default: 5) |
| `edit` | Edit an existing note's fields | `<id>` (parsed as integer) | `--title <string>`, `--body <string>` |
| `feature-add` | Add a new feature to `feature_list.json` | `<name>` (snake_case) | `--title`, `--description`, `--acceptance` (comma-separated), `--sdd` (boolean, default: `true`) |

### 12.3 Domain Models

**Note** (`src/notes.ts`):
```typescript
interface NoteData { id: number; title: string; body: string; created_at: string; }
class Note implements NoteData { static new(title, body, existing): Note; toDict(): NoteData; }
class NoteError extends Error { }
class NoteNotFound extends NoteError { }
```

**Feature** (`src/features.ts`):
```typescript
interface Feature { id: number; name: string; title: string; description: string; acceptance: string[]; sdd?: boolean; status: "pending" | "spec_ready" | "in_progress" | "done" | "blocked"; }
class FeatureError extends Error { }
class DuplicateFeatureError extends FeatureError { }
```

### 12.4 Storage Layer (`src/storage.ts`)

- Uses **atomic file writes**: data is written to a temporary file (`.notes_<uuid>.json`) and then renamed to the target path via `fs.rename`.
- `load()` reads from `.notes.json` (or `NOTES_FILE` env var) and returns `[]` if the file doesn't exist.
- `save()` serializes to JSON with 2-space indentation, writes atomically.
- Feature operations reuse `load()`/`save()` targeting `feature_list.json`.

### 12.5 Interactive Prompting (`src/prompts.ts`)

- `prompt(question, defaultValue?)` — prompts for a single string value via `readline.createInterface`.
- `promptRequired(question)` — loops until a non-empty answer is provided.
- `promptList(question)` — prompts for a comma-separated list of strings.

### 12.6 Feature-add Flow

The `feature-add` command takes a name argument with optional `--title`, `--description`, `--acceptance`, and `--sdd` options. If options are missing, it falls back to interactive prompting via `prompts.ts`. The new feature is written to `feature_list.json` with an auto-incremented ID, `sdd: true` by default, and `status: "pending"`.

---

## 13. Testing Strategy

| Aspect | Detail |
|--------|--------|
| **Test runner** | Vitest (configured in `vitest.config.ts`, default environment: `node`) |
| **Test location** | All tests live in the `tests/` directory at the project root |
| **Path alias** | `vitest.config.ts` configures `resolve.alias` mapping `@` → `src/`, allowing imports using `@/components/...` |
| **Test files** | 40 files in `tests/` (39 test specs + 1 helper plugin `i18nPlugin.ts`) |
| **Component tests** | Tests for all 12 components using `@vue/test-utils` with `jsdom` environment when needed |
| **Composable tests** | Tests for all 8 composables (`useGetAuthToken`, `useDetectLocale`, etc.) |
| **Store tests** | `appStore.test.ts` — tests for the Pinia store |
| **Router tests** | `router.test.ts` — tests for route guards |
| **CLI tests** | `cli.test.ts`, `cli_features.test.ts`, `notes.test.ts`, `storage.test.ts`, `features.test.ts` — use real temporary files and `child_process.spawnSync` for integration testing |
| **Styling tests** | `Eurovision_styling.test.ts` — conformance tests for Eurovision visual identity |
| **Build verification** | `build.test.ts` — runs `vite build` via `spawnSync` and asserts exit code 0 |
| **i18n tests** | `i18n.test.ts` — tests for translation files and locale detection |
| **Types tests** | `types.test.ts` — tests for type definitions |
| **Run command** | `npm test` (maps to `vitest run`) |
| **Test isolation** | CLI tests use real temporary files (no mocks for file system), clean up after themselves |
| **TypeScript** | Tests are written in TypeScript |

---

## 14. Build & Deployment

### 14.1 npm Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Start development server with HMR |
| `build` | `vite build` | Production build (output to `dist/`) |
| `serve` | `vite preview` | Preview the production build locally |
| `lint` | `eslint src --ext .ts,.vue` | Lint TypeScript and Vue source files |
| `lint:fix` | `npm run lint -- --fix` | Lint and auto-fix |
| `test` | `vitest run` | Run test suite |

### 14.2 Docker Setup

**Dockerfile** (multi-stage build):

1. **base** — `node:18.15.0-alpine`, sets `WORKDIR /usr/src/app`
2. **deps** — Installs production dependencies only (`npm ci --omit=dev`) with cache mounts
3. **build** — Installs all dependencies, copies source, injects `.env` via Docker secret (`--mount=type=secret,id=my_env`), runs `npm run build`, removes `.env.local`
4. **serve** — `nginx:1.19.0`, copies the build output from `/usr/src/app/build` to `/usr/share/nginx/html`

> **Note**: The Dockerfile references `/usr/src/app/build` but the current Vite config (vite.config.js) outputs to `dist/`. This is a known inconsistency — the Dockerfile may need updating to `COPY --from=build /usr/src/app/dist .` for the build to work correctly.

**compose.yaml**:
- Defines a single `app` service built from the Dockerfile
- Mounts `.env` as a Docker secret (`my_env`)
- Sets `NODE_ENV=production`
- Exposes port `8080:80`

### 14.3 Vercel Deployment

**vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- **buildCommand**: `npm run build` — runs `vite build`
- **outputDirectory**: `dist` — matches `outDir: "dist"` in `vite.config.js`
- **SPA rewrites**: Catch-all fallback ensures vue-router's `createWebHistory` works on all routes

Required environment variables (configured in Vercel dashboard):
`VITE_REACT_APP_BASEURL`, `VITE_REACT_APP_ADMIN`, `VITE_REACT_APP_AUTH_P`, `VITE_REACT_APP_P_KEY`, `VITE_REACT_APP_JOIN_ROOM`, `VITE_REACT_APP_CONFIRM_EMAIL_URL`, `VITE_REACT_APP_JOIN_ROOM_PATH`, `VITE_REACT_APP_CLIENT_ID`, `VITE_REACT_APP_REQUESTS_URL`, `VITE_REACT_APP_REQUESTS_BASE_URL`.

### 14.4 PWA Configuration

Configured in `vite.config.js` via `vite-plugin-pwa`:

- **registerType**: `autoUpdate` (service worker auto-updates)
- **devOptions**: PWA enabled in dev mode (`enabled: true`)
- **Manifest** (defined inline):
  - **name**: EuroContest
  - **short_name**: EuroContest
  - **start_url**: `/`
  - **display**: `fullscreen`
  - **theme_color**: `#02025e` (navy)
  - **background_color**: `#ff0088` (pink)
  - **icons**: 128×128 and 512×512 PNGs from `public/`
- The manifest is served as `/manifest.webmanifest` and the plugin generates the service worker at build time (`sw.js`, `workbox-*.js`).

---

## 15. Architectural Patterns & Conventions

### 15.1 Callback Ref Pattern

The `Form` component uses a **callback function ref pattern** instead of passing Vue `Ref` objects as props:

- The `FormField` interface includes `setRef?: (el: any) => void`
- The Form template applies `:ref="(el: any) => { if (field.setRef) field.setRef(el) }"` on each `<input>`
- Parent components pass inline callbacks: `setRef: (el: any) => passwordRef = el` in their `fields` array

**Rationale**: This reduces coupling between parent and child components, makes testing easier, and aligns with Vue 3's recommendation for functional refs.

**Scope**: All components consuming Form (Home, Login, SignUp, CreateRoom, UserDetails, AdminView, Navigation) and AdminPanel (via the `refer` prop) use this pattern.

### 15.2 Polling

The `Layout.vue` component manages two `setInterval` polling loops via Vue watchers:

1. **Room data refresh (60s)**: When `store.xToken` is present and `store.currentRoom.current` is defined, polls `GET /rooms/:roomId/:userId` every 60 seconds to refresh room data, user countries, and classification.
2. **Admin point refresh (40s)**: When `store.xToken` is present, the logged-in user is the admin (`config.appAdmin`), and `store.updatable.refresh_enabled` is true, polls `GET /countries/refresh/:year` every 40 seconds.

Both intervals are cleared on unmount (`onUnmounted`) and when their conditions become false.

### 15.3 Direct API Calls (No Service Layer)

Backend API calls are made directly from components and views — there is no centralized API service layer, DAO layer, or repository pattern. Each component imports `axios` and constructs calls inline with the base URL from `config.ts`. This pattern is used consistently across:

- `Layout.vue` (room data polling, point refresh, room token verification)
- `Navigation.vue` (admin authentication via `/updatable`)
- `Home.vue` (room login)
- `Login.vue` (user authentication, Google OAuth)
- `SignUp.vue` (user registration, Google OAuth)
- `AdminView.vue` (updatable settings, archive export, AI model requests)
- `MissingEmail.vue` (email update and confirmation)
- `RoomPicker.vue` (room data updates, room operations)
- `CountryPicker.vue` (country selection bulk save)
- `CreateRoom.vue` (room creation)
- `UserDetails.vue` (profile updates)
- `RoomNameEditForm.vue` (room name update)

### 15.4 Composables as Utilities

Despite the `use` prefix (Vue composable convention), most composables are plain async functions that do not use Vue's reactivity system (`ref()`, `reactive()`, `computed()`). They are more accurately described as utility functions that happen to interact with the Pinia store. The exception is `useGetSongs`, which is called from the store's `fetchSongs` method, and `useDetectLocale`, which is pure async logic.

### 15.5 Known Issues and Limitations

1. **Dockerfile build path mismatch**: The Dockerfile copies from `/usr/src/app/build`, but `vite.config.js` outputs to `dist/`. The Docker build will likely fail or produce an empty nginx serve directory until this is corrected.
2. **Inline CSS in `<style scoped>`**: All component styles are inlined in `<style scoped>` blocks (feature #12 migration). This eliminated external CSS files but can lead to some duplication of styling patterns across components.
3. **MissingEmail view uses `ref` instead of `setRef`**: The `MissingEmail.vue` form passes `ref: emailRef` directly instead of using the callback pattern (`setRef: (el: any) => emailRef = el`), which is inconsistent with the rest of the codebase.
4. **No loading/error boundary abstraction**: Each view handles its own loading states and error display manually, with some inconsistency in patterns.
5. **Store types are loosely defined**: The store uses `any` extensively in interfaces (e.g., `RoomState`, `ModalState`, `Updatable`) because the API response shapes are not strictly typed.
6. **CLI uses `tsx` for execution**: The CLI requires `tsx` (TypeScript executor) to run; it is not compiled to JavaScript as part of the build process.

---

## 16. Vercel Deployment

The application is configured for deployment on **Vercel** via `vercel.json` at the project root. Vercel auto-detects Vite/Vue projects, but explicit configuration ensures the build output directory and SPA routing work correctly.

### `vercel.json` Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

| Key | Value | Purpose |
|-----|-------|---------|
| `buildCommand` | `npm run build` | Tells Vercel to run the Vite production build |
| `outputDirectory` | `dist` | Must match `outDir: "dist"` in `vite.config.js` |
| `rewrites` | `{ "source": "/(.*)", "destination": "/index.html" }` | SPA fallback — all routes serve `index.html` so vue-router's `createWebHistory` can handle client-side routing |

### SPA Rewrite Explanation

The `rewrites` block implements a catch-all SPA fallback: any request to a non-root path (e.g., `/login`, `/room`, `/archive`) is served `index.html` instead of returning a 404. This is required because Vercel, like all static hosting platforms, would otherwise try to serve a file at the requested path (e.g., `/login.html`), which does not exist in a single-page application.

Vercel's platform serves static assets (images, fonts, scripts, manifests) **before** applying rewrite rules, so the catch-all rewrite does not interfere with asset loading.

### Build Process on Vercel

1. **Install**: Vercel runs `npm install` (default install command — no override needed).
2. **Build**: Vercel runs `npm run build` (via `buildCommand`), which executes `vite build` and outputs to `dist/`.
3. **Output**: The `dist/` directory contains:
   - `index.html` — SPA entry point
   - `assets/` — JavaScript bundles, CSS bundles, SVG flags, and other compiled assets
   - `manifest.webmanifest` — PWA manifest (generated by `vite-plugin-pwa`)
   - `sw.js` / `workbox-*.js` — Service worker (generated by `vite-plugin-pwa`)
   - `favicon.ico`, `robots.txt`, `star_icon_*.png` — Static assets from `public/`
4. **Serve**: Vercel serves the contents of `dist/` with the SPA rewrite fallback.

### Environment Variables

The following environment variables must be configured in the **Vercel project dashboard** (Settings → Environment Variables). They are read via `import.meta.env` at build/runtime.

| Variable | Example | Purpose |
|----------|---------|---------|
| `VITE_REACT_APP_BASEURL` | `https://api.example.com/api/eurocontest/` | Backend API base URL |
| `VITE_REACT_APP_ADMIN` | `admin_user` | Admin username for admin panel access |
| `VITE_REACT_APP_AUTH_P` | `secret123` | Auth secret used to derive the bcrypt hash for `/getAuthToken` |
| `VITE_REACT_APP_P_KEY` | `somekey` | Additional key (currently not used in source) |
| `VITE_REACT_APP_JOIN_ROOM` | `/join-room?roomAuth` | Join room URL pattern |
| `VITE_REACT_APP_CONFIRM_EMAIL_URL` | `/confirm-email?user_id=` | Email confirmation URL pattern |
| `VITE_REACT_APP_JOIN_ROOM_PATH` | `/join-room` | Join room path |
| `VITE_REACT_APP_CLIENT_ID` | `google-oauth-id` | Google OAuth client ID |
| `VITE_REACT_APP_REQUESTS_URL` | `secret/comfy/addRequest` | URL path for AI model requests |
| `VITE_REACT_APP_REQUESTS_BASE_URL` | `secret/comfy` | URL path for AI model request deletion |

### Note on PWA Manifest

The `manifest.webmanifest` file is generated by `vite-plugin-pwa` at build time and placed in the output root. Vercel serves it as a static asset. The catch-all rewrite does not intercept it because Vercel resolves static files before applying rewrites. The manifest is linked from `index.html` as `/manifest.webmanifest`.

---

## Relationship to `docs/architecture.md`

This `ARCHITECTURE.md` is a **descriptive reference** — it documents what the codebase **currently is**. It is located at the project root for quick discovery.

`docs/architecture.md` is a **prescriptive policy** — it defines the rules the project **should follow** (atomic persistence, no mocks, no new deps, stateless CLI, etc.).

Both files coexist and serve complementary purposes. Updating one does not require updating the other, though they should remain consistent over time.
