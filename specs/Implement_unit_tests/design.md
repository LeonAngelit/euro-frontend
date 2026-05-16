# Design — Implement_unit_tests

## 1. Testing framework and environment

- **Runner**: Vitest (already configured in `vitest.config.ts`, environment: `node`).
- **Vue component testing**: `@vue/test-utils` (`mount`, `shallowMount`) with
  `@vue/vue3-test-utils` conventions.
- **File location**: All test files reside in `tests/` at project root, following
  the convention `[name].test.ts`.
- **Naming convention**: Descriptive test names using the pattern
  `test_<module>_<behavior>_<condition>`.

## 2. Mocking strategy

| Dependency | Strategy | Reason |
|---|---|---|
| `axios` | `vi.mock('axios')` with `mockResolvedValue` / `mockRejectedValue` | Composables make HTTP calls that must be isolated |
| `vue-router` | `createRouter` with `createMemoryHistory` or `vi.mock('vue-router')` | Router pushes in composables/views need isolation |
| `@/stores/app` | Use `createPinia()` with real store, mutate state directly | Pinia stores are testable; prefer real store over mocking |
| `@/config/config` | `vi.mock` to provide deterministic config values | Config reads `import.meta.env` which is Vite-specific |
| `@iconify/vue` Icon | Stub component: `{ template: '<span :data-icon="icon" />' }` | No need to render actual icons |
| `@fortawesome/vue-fontawesome` | Stub component | No need to render actual icons |
| `vue3-google-login` | `vi.mock` with stub `GoogleLogin` component | External OAuth provider |
| `window.location` | `vi.spyOn` or assign via `globalThis` | `useNavigateWithCallback` reads `window.location.href` |
| `localStorage` / `sessionStorage` | `vi.stubGlobal` or `vi.spyOn` | Store persistence reads/writes browser storage |

## 3. Test files to create

| Test file | Source module | R coverage |
|---|---|---|
| `tests/regexUtils.test.ts` | `src/utils/regexUtils.ts` | R1–R6 |
| `tests/appStore.test.ts` | `src/stores/app.ts` | R7–R16 |
| `tests/useHandleCloseSession.test.ts` | `src/composables/useHandleCloseSession.ts` | R17 |
| `tests/useNavigateWithCallback.test.ts` | `src/composables/useNavigateWithCallback.ts` | R18–R19 |
| `tests/useGetAuthToken.test.ts` | `src/composables/useGetAuthToken.ts` | R20–R21 |
| `tests/useGetSongs.test.ts` | `src/composables/useGetSongs.ts` | R22–R23 |
| `tests/useUpdateUserData.test.ts` | `src/composables/useUpdateUserData.ts` | R24–R25 |
| `tests/useValidateEmail.test.ts` | `src/composables/useValidateEmail.ts` | R26–R27 |
| `tests/useValidateToken.test.ts` | `src/composables/useValidateToken.ts` | R28–R29 |
| `tests/Collapsible.test.ts` | `src/components/Collapsible/Collapsible.vue` | R30–R31 |
| `tests/Modal.test.ts` | `src/components/Modal/Modal.vue` | R32–R33 |
| `tests/Form.test.ts` | `src/components/Form/Form.vue` | R34–R35 |
| `tests/AdminPanel.test.ts` | `src/components/AdminPanel/AdminPanel.vue` | R36 |
| `tests/CountryPicker.test.ts` | `src/components/CountryPicker/CountryPicker.vue` | R37 |
| `tests/Navigation.test.ts` | `src/components/Navigation/Navigation.vue` | R40 |
| `tests/Footer.test.ts` | `src/components/Footer/Footer.vue` | R41 |
| `tests/NotFound.test.ts` | `src/components/NotFound/NotFound.vue` | R42 |
| `tests/ClassificationView.test.ts` | `src/components/ClassificationView/ClassificationView.vue` | R43 |
| `tests/router.test.ts` | `src/router/index.ts` | R44–R46 |
| `tests/types.test.ts` | `src/config/config.ts` + `src/stores/app.ts` (interfaces) | R47–R49 |

**Existing tests remain untouched**: `notes.test.ts`, `storage.test.ts`,
`features.test.ts`, `cli.test.ts`, `cli_features.test.ts`, `RoomPicker.test.ts`.

## 4. Component testing patterns

### 4.1 Vue Test Utils mount

For components with Pinia stores, always create a fresh Pinia instance per
test using `createPinia()` and pass as a plugin:

```ts
const pinia = createPinia()
const wrapper = mount(MyComponent, { global: { plugins: [pinia] } })
```

### 4.2 Stubs for child components

When testing a parent component, stub heavy child components:

```ts
const wrapper = mount(Parent, {
  global: {
    stubs: { ChildComponent: true }
  }
})
```

### 4.3 `data-testid` selectors

Prefer `data-testid` attributes for element selection. Some components already
use this pattern (e.g., `RoomPicker.test.ts`). New tests should add
`data-testid` attributes only where absolutely necessary; prefer existing
semantic selectors (button text, input types, CSS classes).

## 5. Store testing pattern

Create Pinia instance per test, access the store directly, call actions, and
assert state:

```ts
const pinia = createPinia()
const store = useAppStore(pinia)
// Act
store.setUserLogged({ id: 1, username: 'test', ... })
// Assert
expect(store.userLogged).toEqual(...)
```

For persistence tests, spy on `localStorage` and `sessionStorage` methods.

## 6. Composable testing pattern

Since composables are plain functions (not Vue 3 composable hooks using
`ref`/`computed` inside), they can be tested as regular async functions:

1. Mock `axios` with `vi.mock('axios')`.
2. Provide a mock store object or use a real Pinia store.
3. Provide a mock router when needed (`{ push: vi.fn() }`).
4. Call the composable function directly.
5. Assert return values and mock call arguments.

## 7. Router guard testing

Use `createRouter` with `createMemoryHistory` and programmatic navigation to
test guards. Mock the store to control authentication state:

```ts
vi.mock('../stores/app', () => ({
  useAppStore: vi.fn(() => ({ userLogged: false, xToken: null }))
}))
```

Then call `router.push(targetRoute)` and inspect the final route.

## 8. Types and interfaces verification

- **R47**: Verified by the TypeScript compiler (`tsc --noEmit`). A test file
  will attempt to create a `Config` object with missing fields and confirm it
  does not compile. At runtime, the test confirms `config` exports all required
  keys.
- **R48**: Verified by importing `User` type and using it as a type annotation
  in a test variable. This is a compile-time verification.
- **R49**: Verified by testing store defaults (already covered in R7) and
  verifying that code paths handle `undefined`/`null` values correctly.

## 9. Alternatives considered

| Alternative | Why rejected |
|---|---|
| Cypress component testing | Project uses Vitest already; no need for another runner |
| Jest | Project is configured for Vitest; no reason to switch |
| Testing views (Home, Login, etc.) end-to-end | Views integrate many composables and store logic; unit testing them requires extensive mocking of API calls and `window.location`. The acceptance criteria targets unit-level tests; integration/E2E coverage is out of scope. |
| Writing tests in `src/` co-located | Project convention is `tests/` at root; follow convention |
| Mocking Pinia stores | Pinia stores are easily testable; using real instances is more reliable |

## 10. Coverage expectations

The goal is **meaningful behavioral coverage**, not line-count coverage. Each
test must verify a concrete observable behavior (return value, state change,
DOM update, navigation call). Tests that only verify "does not throw" are
insufficient (per `docs/verification.md` anti-patterns).