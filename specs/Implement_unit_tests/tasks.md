# Tasks — Implement_unit_tests

## Validators & Utils

- [x] T1: Create `tests/regexUtils.test.ts` — test `validateRegex` with valid and invalid passwords (R1, R2)
- [x] T2: Add tests for `validateEmailRegex` with valid and invalid emails (R3, R4)
- [x] T3: Add tests for `validateUserNameRegex` with valid and invalid usernames (R5, R6)
- [x] T4: Add tests for `validateRegex`/`validateEmailRegex`/`validateUserNameRegex` with and without callback parameter (R2, R4, R6)
- [x] T5: Add tests for default export regex patterns matching expected structures (R1, R3, R5)

## Store

- [x] T6: Create `tests/appStore.test.ts` — verify initial state defaults (`userLogged`, `rememberUser`, `songs`, `selection`, `currentRoom`) (R7)
- [x] T7: Add tests for `setUserLogged` action (R8)
- [x] T8: Add tests for `closeSession` action resetting state (R9)
- [x] T9: Add tests for `setXToken` action (R10)
- [x] T10: Add tests for `setModal` action (R11)
- [x] T11: Add tests for `setRememberUser` action (R12)
- [x] T12: Add tests for `setCurrentRoom` action (R13)
- [x] T13: Add tests for `setSelection` action (R14)
- [x] T14: Add tests for `setUpdatable` action (R15)
- [x] T15: Add tests for persistence behavior — `localStorage` when `rememberUser=true`, `sessionStorage` when `false` (R16)

## Composables

- [x] T16: Create `tests/useHandleCloseSession.test.ts` — verify it calls `store.closeSession()` (R17)
- [x] T17: Create `tests/useNavigateWithCallback.test.ts` — verify navigation with `callback_url` in URL (R18)
- [x] T18: Add tests for navigation without `callback_url` in URL (R19)
- [x] T19: Create `tests/useGetAuthToken.test.ts` — verify success path stores token and returns it (R20)
- [x] T20: Add tests for error path returning `null` (R21)
- [x] T21: Create `tests/useGetSongs.test.ts` — verify success path returns data array (R22)
- [x] T22: Add tests for error path returning empty array (R23)
- [x] T23: Create `tests/useUpdateUserData.test.ts` — verify success calls `setUserLogged` and navigates to `/app` (R24)
- [x] T24: Add tests for error path returning error message (R25)
- [x] T25: Create `tests/useValidateEmail.test.ts` — verify success returns `{ result: true }` (R26)
- [x] T26: Add tests for empty token returning `{ result: false, data: null }` (R27)
- [x] T27: Create `tests/useValidateToken.test.ts` — verify success returns `true` (R28)
- [x] T28: Add tests for error path returning `false` (R29)

## Components

- [x] T29: Create `tests/Collapsible.test.ts` — verify collapsed default state and `+` indicator (R30)
- [x] T30: Add tests for toggle behavior and `toggle` emit (R31)
- [x] T31: Create `tests/Modal.test.ts` — verify CSS class application for `success` and `error` status (R32)
- [x] T32: Add tests for confirm buttons calling `onaccept`/`onclick` (R33)
- [x] T33: Create `tests/Form.test.ts` — verify password visibility toggle (R34)
- [x] T34: Add tests for "remember me" checkbox calling `store.setRememberUser` (R35)
- [x] T35: Create `tests/AdminPanel.test.ts` — verify close button calls `close` callback (R36)
- [x] T36: Create `tests/CountryPicker.test.ts` — verify checkbox selection updates store and enforces max (R37)
- [x] T37: Verify existing `tests/RoomPicker.test.ts` covers R38 (pencil button opens edit modal); add if missing (R38)
- [x] T38: Verify existing `tests/RoomPicker.test.ts` covers R39 (RoomNameEditForm submit); add if missing (R39)
- [x] T39: Create `tests/Navigation.test.ts` — verify user-menu toggle and admin panel open (R40)
- [x] T40: Create `tests/Footer.test.ts` — verify author name and year render (R41)
- [x] T41: Create `tests/NotFound.test.ts` — verify not-found message renders (R42)
- [x] T42: Create `tests/ClassificationView.test.ts` — verify user list filtered by minimum country count (R43)

## Router guards

- [x] T43: Create `tests/router.test.ts` — verify unauthenticated user redirected from `requiresAuth` route (R44)
- [x] T44: Add tests for authenticated user redirected from `guestOnly` route (R45)
- [x] T45: Add tests for non-admin user redirected from `requiresAdmin` route (R46)

## Types and interfaces

- [x] T46: Create `tests/types.test.ts` — verify `config` export contains all required keys at runtime (R47)
- [x] T47: Add runtime tests for `User` interface shape enforcement and default handling (R48, R49)
- [x] T48: Verify store defaults handle missing/undefined data gracefully (R49, already covered by T6)

## Verification

- [x] T49: Run `npm test` and verify all new and existing tests pass
- [x] T50: Run `./init.sh` and verify environment is green