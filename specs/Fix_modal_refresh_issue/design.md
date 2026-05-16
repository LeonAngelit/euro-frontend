# Design — Fix modal refresh issue

## Root Cause

The Pinia `app` store persists its entire state (including the `modal` ref) to
`localStorage`/`sessionStorage` via `pinia-plugin-persistedstate` under key
`app-context`. When the modal is opened, `setModal()` stores `visible: true`
along with the `RoomNameEditForm` component reference and function callbacks.
On page refresh, the persisted state is deserialized with `JSON.parse()`:
- `modal.visible` is correctly restored as `true`
- `modal.component` (a Vue component object) becomes `undefined`
- Function callbacks `onclick` / `onaccept` become `undefined`

As a result, the modal `v-if` in `Layout.vue` evaluates to a stale state:
the modal is rendered as a plain-message modal (third variant) with no content,
and the user cannot close it reliably.

## Solution

**Exclude `modal` from persistence** by using the `paths` include list in
the `persist` configuration of the `app` store. The installed version of
`pinia-plugin-persistedstate` (v3.2.3) does not support an `omit` option;
it only supports `paths` as an **include list**. By explicitly listing every
top-level state key **except** `modal`, the ephemeral UI state is excluded
from serialization and never survives a page reload.

### Files to modify

| File | Change |
|---|---|
| `src/stores/app.ts` | Add `paths: [...]` to the `persist` config, listing all keys except `modal` |

### Detailed change

In the persist config at lines 170–174, change from:

```typescript
persist: {
    key: STORAGE_KEY,
    storage: appContextStorage,
}
```

to:

```typescript
persist: {
    key: STORAGE_KEY,
    storage: appContextStorage,
    paths: ['userLogged', 'rememberUser', 'currentRoom', 'songs', 'updatable', 'selection', 'xToken'],
}
```

The `paths` option acts as a **whitelist**: only the listed top-level keys
are serialized. Since `modal` is intentionally omitted, it will always
initialize as `{}` on page load, effectively resetting any stale modal
visibility state.

### Verification

1. Open the room name edit modal.
2. Refresh the page.
3. Observe that no modal overlay is shown.
4. All existing unit tests pass.

### Discarded alternatives

**Alternative 1: Reset modal on store initialization**
Add a `resetModal()` call inside the store setup function or use a plugin
`afterHydrate` hook. This approach is fragile because it depends on the
ordering of hydration vs. component mounting and requires additional code
to run after every hydration (including tests). The `paths` approach is
declarative, runs at the framework level, and requires no new code.

**Alternative 2: Manually clear storage before restoring modal**
Detect the stale state in `Layout.vue` and clear it in a lifecycle hook.
This couples the view layer to a storage concern and is hard to test.
The `paths` approach keeps persistence logic inside the store definition.

**Alternative 3 (discarded): Use `omit` property**
The plugin was originally believed to support `omit: ['modal']`. However,
the installed version (v3.2.3) does not implement `omit`. Switching to
the `paths` include list achieves the same result with the available API.
