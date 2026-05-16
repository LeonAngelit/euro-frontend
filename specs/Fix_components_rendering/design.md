# Design — Fix Components Rendering

## Problem Analysis

After login, the user sees only the header with their profile picture. The main content area is blank. Two root causes are identified:

### Cause 1: Race condition in Home.vue redirect logic

`Home.vue` has a `watch` on `[targetCount, () => store.userLogged]` that redirects to `/country-select` when the user hasn't selected enough countries. However:

- `targetCount` is a computed property that depends on `store.songs?.length > 5 ? 6 : 5`
- `store.songs` is fetched asynchronously via `fetchSongs()` triggered by a watch on `xToken`
- When the user logs in, `userLogged` is set before `songs` is populated
- The watch fires with `songs` still empty, computing `targetCount = 5` (since `0 > 5` is false)
- If the user's `countries` array is also empty (`undefined` or `[]`), the condition `countries?.length < targetCount` evaluates to `0 < 5` which is true — the redirect should fire
- However, the `watch` callback also checks `window.location.pathname` and uses `useNavigateWithCallback`, which may not trigger properly if the router is still resolving the initial navigation

Additionally, the Home.vue template condition:
```vue
<template v-if="(store.userLogged as any)?.countries?.length >= targetCount && !store.currentRoom?.current">
```
Shows nothing when the user has fewer countries than required, creating the blank page during the race window.

### Cause 2: UserDetails.vue missing profile update sections

`UserDetails.vue` has the handler functions (`updateUserName`, `updateEmail`, `updatePassword`, `updateImage`, `onImageChange`) and the refs (`userNameRef`, `emailRef`, `passRef`, `pass2Ref`, `imageRef`, `colorRef`) defined in the script, but the template only renders:
- A `Collapsible` with `CountryPicker`
- A delete account button

The forms for updating username, email, password, and profile image are missing from the template.

## Files to Modify

### 1. `src/views/App/Home.vue`

**Changes:**
- Add `store.songs` to the watch dependency array: `watch([targetCount, () => store.userLogged, () => store.songs], ...)`
- Add a guard: only evaluate the redirect logic when `store.songs` is populated (length > 0)
- This ensures the redirect fires reliably once both `userLogged` and `songs` are available

### 2. `src/views/UserDetails/UserDetails.vue`

**Changes:**
- Add collapsible sections to the template for:
  - **Username update**: Form with username field and submit button
  - **Email update**: Form with email field and submit button
  - **Password update**: Form with two password fields (confirm) and submit button
  - **Profile image update**: File input with preview and submit button
- Each section uses the existing handler functions already defined in the script
- Follow the same pattern as the existing `CountryPicker` collapsible section

### 3. `ARCHITECTURE.md`

**Changes:**
- No changes expected. The fix does not alter the architecture, only corrects existing behavior.

### 4. Tests

**New test file: `tests/Home.test.ts`**
- Test that logged-in user with no countries is redirected to `/country-select`
- Test that logged-in user with enough countries sees the room picker
- Test that redirect waits for songs to be loaded

**New test file: `tests/UserDetails.test.ts`** (update existing)
- Test that profile view renders username update section
- Test that profile view renders email update section
- Test that profile view renders password update section
- Test that profile view renders profile image update section

## Technical Decisions

### Decision 1: Add `songs` to watch dependencies vs. use a separate watch

**Chosen**: Add `songs` to the existing watch dependency array.

**Rationale**: The redirect logic depends on both `targetCount` (derived from `songs`) and `userLogged`. Adding `songs` directly ensures the watch re-evaluates when songs load. A separate watch would duplicate the redirect logic.

**Discarded alternative**: Create a separate `watch(() => store.songs, ...)` that re-checks the redirect condition. This would duplicate code and create two sources of truth for the redirect logic.

### Decision 2: Profile sections as separate Collapsibles vs. single form

**Chosen**: Each profile update (username, email, password, image) gets its own `Collapsible` section, matching the existing pattern used for `CountryPicker`.

**Rationale**: Consistency with existing UI patterns. The `Collapsible` component is already used in this view and throughout the app. Users expect expandable sections for different settings categories.

**Discarded alternative**: Single large form with all fields. This would be harder to maintain and inconsistent with the rest of the app's UX.

## Alternatives Considered

### Alternative A: Move redirect logic to router guard

Instead of handling the country-selection redirect in `Home.vue`, move it to a `beforeEach` router guard.

**Why discarded**: The router guard doesn't have access to `store.songs` at the right time (songs are fetched asynchronously after login). The guard runs synchronously before the route resolves. Keeping the logic in the component where `songs` is reactively available is more reliable.

### Alternative B: Use a computed property for redirect destination

Create a computed `redirectDestination` that returns the appropriate route based on user state, then use a single `watch` on that computed to navigate.

**Why discarded**: Adds indirection without solving the core race condition. The watch still needs to react to `songs` loading. The current approach with explicit conditions is clearer.

## Risk Assessment

- **Low risk**: The changes are additive (adding watch dependency, adding template sections). No existing logic is removed.
- **Test coverage**: New tests verify the redirect timing and profile section rendering.

## Additional Issue: Form Ref Binding (Feature #8 Regression)

### Problem

Feature #8 (`Fix_form_value_refs`) is marked `done`, but `userNameRef.value` still prints `null` in `Login.vue` at line 80. This means the login form cannot capture user input, so **no login request is ever performed**, which directly causes the blank page after login (the user never actually logs in).

### Root Cause Analysis

In `Form.vue`, the template ref binding (lines 94 and 118):
```vue
:ref="(el: any) => { if (field.ref && el) field.ref.value = el }"
```

The `fields` prop is a plain array passed inline from parent components (e.g., `Login.vue`):
```vue
:fields="[
  { name: 'username', ref: userNameRef, ... },
  { name: 'password', ref: passwordRef, ... },
]"
```

The `userNameRef` is a Vue `ref<HTMLInputElement | null>(null)`. When `Form.vue` does `field.ref.value = el`, it accesses `field.ref` through the **reactive proxy** of the `fields` prop. Assigning to `.value` on a Ref that was accessed through a reactive proxy may not propagate correctly back to the original ref in the parent component.

### Affected Components (all use Form.vue with ref pattern)

| Component | Refs | Impact |
|---|---|---|
| `Login.vue` | `userNameRef`, `passwordRef` | Login fails — username is `null` |
| `SignUp.vue` | `userNameRef`, `emailRef`, `passwordRef`, `passwordTwodRef` | Registration fails |
| `CreateRoom.vue` | `roomNameRef`, `passwordRef`, `passwordTwodRef` | Room creation fails |
| `MissingEmail.vue` | `emailRef` | Email submission fails |
| `UserDetails.vue` | `userNameRef`, `emailRef`, `passRef`, `pass2Ref`, `imageRef`, `colorRef` | Profile updates fail |

### Fix Strategy

**Option A (preferred): Use `toRaw()` to unwrap the ref before assignment**
```vue
:ref="(el: any) => { if (field.ref && el) toRaw(field.ref).value = el }"
```
Import `toRaw` from Vue. This ensures we assign to the actual Ref object, not the proxy.

**Option B: Use a callback-based approach**
Emit the element from Form.vue and let the parent assign it directly:
```vue
<!-- Form.vue -->
@ref-ready="(field, el) => $emit('ref-ready', field, el)"
```

**Option C: Replace ref pattern with v-model in Form.vue**
Add `modelValue` to `FormField` and use `:value` + `@input` for two-way binding, eliminating the need for template refs entirely.

### Recommendation

Apply **Option A** as the minimal fix (one-line change, imports `toRaw`). This directly addresses the proxy issue without changing the public API of Form.vue or requiring changes to all parent components.

### Files to Modify (additional)

| File | Change |
|---|---|
| `src/components/Form/Form.vue` | Import `toRaw`, use `toRaw(field.ref).value = el` in both ref bindings |
| `tests/Form.test.ts` | Test that ref values are correctly captured after user input |
