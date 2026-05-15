# Requirements — project_architecture_analysis

## R1

The `ARCHITECTURE.md` file SHALL exist at the project root and contain a
complete description of the project's architecture.

## R2

The `ARCHITECTURE.md` file SHALL include a **Project Overview** section that
describes: the application name ("Eurocontest App"), its purpose (a React SPA
for the Eurovision Song Contest voting/room system), the fact that it is a
client-side application backed by a separate REST API, and that it includes a
CLI subsystem for notes and feature management.

## R3

The `ARCHITECTURE.md` file SHALL include a **Tech Stack** section documenting:
React 18 with JSX, Vite as the build tool, TypeScript for the CLI/data layer,
JavaScript for the React layer, Vitest for testing, Commander.js for the CLI,
react-router-dom for routing, react-oauth/google for authentication, axios for
HTTP, bcryptjs for client-side hashing, and vite-plugin-pwa for PWA support.

## R4

The `ARCHITECTURE.md` file SHALL include a **Project Structure** section with
an annotated directory tree covering every top-level and second-level directory
(`src/`, `src/Components/`, `src/Views/`, `src/Storage/`, `src/utils/`,
`src/config/`, `tests/`, `docs/`, `specs/`, `progress/`, `public/`) and every
top-level source file (`App.jsx`, `Layout.jsx`, `index.jsx`, `index.css`,
`notes.ts`, `storage.ts`, `features.ts`, `prompts.ts`, `cli.ts`,
`reportWebVitals.js`).

## R5

The `ARCHITECTURE.md` file SHALL include a **Component Architecture** section
that documents every React component in `src/Components/` (AdminPanel,
ClassificationView, Collapsible, CountryPicker, Footer, Form, Modal,
Navigation, NotFoundComponent, RoomPicker) and every View in `src/Views/`
(Home, Login, SignUp, UserDetails, CreateRoom, Room, Archive, AdminView,
CountrySelect, MissingEmail), describing each one's responsibility.

## R6

The `ARCHITECTURE.md` file SHALL include a **Routing** section that maps every
route path to its View component, matching the route definitions in `App.jsx`
(` /app`, `/login`, `/signup`, `/profile`, `/createroom`, `/admin`, `/archive`,
`/room`, `/missing-email`, `/country-select`, `/confirm-email`, `*`).

## R7

The `ARCHITECTURE.md` file SHALL include a **State Management** section
documenting the `AppContext` (React Context API): what data it holds
(`user_logged`, `x_token`, `songs`, `current_room`, `selection`,
`remember_user`, `modal`, `updatable`), how it is persisted (localStorage and
sessionStorage), and the provider wrapping in `index.jsx`.

## R8

The `ARCHITECTURE.md` file SHALL include a **CLI Subsystem** section that
documents every CLI command (`add`, `list`, `show`, `delete`, `search`,
`recent`, `edit`, `feature-add`), the data model (`NoteData`, `Feature`), the
storage layer (atomic file write in `storage.ts`), and the interactive prompting
in `prompts.ts`.

## R9

The `ARCHITECTURE.md` file SHALL include an **API Integration** section
documenting the backend API base URL (sourced from `VITE_REACT_APP_BASEURL`),
the authentication flow (bcryptjs-salted hash → `/getAuthToken` → Bearer
token), and the list of known API endpoint patterns used in the codebase
(`/users/login`, `/users/google-login`, `/users/:id`, `/countries`,
`/countries/refresh/:year`, `/rooms/:roomId/:userId`,
`/rooms/verifyRoomToken/:userId`, `/getAuthToken`, `/updatable`,
`/users/updateUserEmail/:userId`, `/users/validateToken/:userId`).

## R10

The `ARCHITECTURE.md` file SHALL include a **Configuration** section
documenting all VITE_ environment variables (from `.env`), the runtime config
object exported from `src/config/config.js`, and the PWA manifest.

## R11

The `ARCHITECTURE.md` file SHALL include a **Utilities** section documenting
every utility function in `src/utils/` (useGetAuthToken, useGetSongs,
useUpdateUserData, useHandleCloseSession, useNavigateWithCallback,
useValidateEmail, useValidateToken, regexUtils) with a one-line description
of each.

## R12

The `ARCHITECTURE.md` file SHALL include a **Layout Shell** section describing
how `Layout.jsx` wraps the application: `Navigation` → page content → `Modal`
→ `Footer`, plus the polling intervals for room data (60 s) and point refresh
(40 s admin-only).

## R13

The `ARCHITECTURE.md` file SHALL include a **Testing Strategy** section
documenting that Vitest is the test runner, tests live in `tests/`, there is
one test file per source module, tests use real temporary files (no mocks), and
CLI tests use `child_process.spawnSync` for integration verification.

## R14

The `ARCHITECTURE.md` file SHALL include a **Build & Deployment** section
documenting the Docker setup (`Dockerfile`, `compose.yaml`), the npm scripts
(`dev`, `build`, `serve`, `lint`, `lint:fix`, `test`), and the PWA build
configuration (vite-plugin-pwa, manifest.webmanifest).

## R15

The `ARCHITECTURE.md` file SHALL include an **Architectural Concerns** section
that lists known issues observable in the current code: mixed TypeScript/JS
in `src/`, co-location of component CSS using inconsistent naming (both
`.Component.css` and `.component.css` and `.componen.css`), utility modules
named as hooks but not using the React hooks API, and API calls in Layout
and components instead of a service layer.

## R16

WHEN the `ARCHITECTURE.md` file is updated, it SHALL NOT remove any existing
content from `docs/architecture.md` — the two files serve different purposes:
`docs/architecture.md` is the prescriptive policy (rules), while
`ARCHITECTURE.md` is the descriptive reference (current state).