# Review Fix Report — vue_migration

## Issue 1 — R17: Loading fallback for async route components

**File:** `src/Layout.vue`

Changed `<RouterView />` to use the `v-slot` pattern with `<Suspense>` to display a "Loading..." fallback while lazy-loaded route components are being fetched:

```vue
<RouterView v-slot="{ Component }">
  <Suspense>
    <template #default>
      <component :is="Component" />
    </template>
    <template #fallback>
      <p>Loading...</p>
    </template>
  </Suspense>
</RouterView>
```

## Issue 2 — R10: Move CSS imports into `<style>` blocks

Moved all CSS imports from `<script setup>` blocks to dedicated `<style src="...">` tags at the bottom of each SFC. Affected 15 files:

| File | CSS import removed from `<script setup>` | `<style src>` added |
|---|---|---|
| `Navigation.vue` | `../../Components/Navigation/Navigation.component.css` | ✅ |
| `Modal.vue` | `../../Components/Modal/Modal.component.css` | ✅ |
| `Footer.vue` | `../../Components/Footer/Footer.component.css` | ✅ |
| `AdminPanel.vue` | `../../Components/AdminPanel/AdminPanel.component.css` | ✅ |
| `ClassificationView.vue` | `../../Components/ClassificationView/Classification.Component.css` + `flag-icons/css/flag-icons.min.css` | ✅ (two style tags) |
| `Collapsible.vue` | `../../Components/Collapsible/Collapsible.component.css` | ✅ |
| `CountryPicker.vue` | `../../Components/CountryPicker/CountryPicker.Component.css` + `flag-icons/css/flag-icons.min.css` | ✅ (two style tags) |
| `Form.vue` | `../../Components/Form/Form.Component.css` | ✅ |
| `RoomPicker.vue` | `../../Components/RoomPicker/RoomPicker.Component.css` | ✅ |
| `NotFound.vue` | `../../Components/NotFoundComponent/App.css` | ✅ |
| `Home.vue` | `../../Views/App/Home.Component.css` | ✅ |
| `AdminView.vue` | `../../Views/AdminView/AdminView.componen.css` | ✅ |
| `CreateRoom.vue` | `../../Views/CreateRoom/CreateRoom.Component.css` | ✅ |
| `Archive.vue` | `../../Views/App/Home.Component.css` | ✅ |
| `UserDetails.vue` | `../../Views/UserDetails/UserDetails.Component.css` | ✅ |

## Issue 3 — pinia-plugin-persistedstate

**Package:** Installed `pinia-plugin-persistedstate@3.2.3` (compatible with Pinia v2).

**`src/main.ts`:** Added `import { createPersistedState } from 'pinia-plugin-persistedstate'` and registered via `pinia.use(createPersistedState())`.

**`src/stores/app.ts`:** Refactored to use the plugin instead of manual `watch()`:
- Removed the `loadInitialState()` function (the plugin handles hydration)
- Removed the `persistToStorage()` function and the corresponding `watch()` call
- Added `persist` option as the third argument to `defineStore` with:
  - `key: 'app-context'` (matching the original storage key)
  - Custom `storage` implementation that reads from localStorage first then sessionStorage, and writes to localStorage when `remember_user` is true or sessionStorage otherwise — preserving the original behavior
- Removed `watch` from the Vue import since manual persistence watch is no longer needed
- Kept the `watch(xToken, ...)` for the fetch-songs-on-token-set behavior

## Issue 4 — Fix TypeScript type errors (`return false` → `return`)

Changed `return false` to `return` in async event handler functions where the return type should be `Promise<void>` instead of `Promise<false | undefined>`:

| File | Lines changed |
|---|---|
| `AdminView.vue` | `setUpdatable` event handler: `return false` → `return` |
| `Home.vue` | `joinRoom` event handler: `return false` → `return` |
| `CreateRoom.vue` | `crearSala` event handler: 2× `return false` → `return` |
| `MissingEmail.vue` | `requestEmail` event handler: `return false` → `return` |
| `UserDetails.vue` | `updateUserName`, `updateEmail`, `updatePassword`: 3× `return false` → `return` |

## Issue 5 — Fix `computed` import order

**`Home.vue`:** Moved `computed` from a standalone import after its usage to the existing `import { ref, onMounted, watch } from 'vue'` line, now `import { ref, computed, onMounted, watch } from 'vue'`. Removed the dangling `import { computed } from 'vue'` on line 25.

**`ClassificationView.vue`:** Moved `computed` from a standalone import after its usage to the existing `import { ref, watch, onMounted } from 'vue'` line, now `import { ref, watch, onMounted, computed } from 'vue'`. Removed the dangling `import { computed } from 'vue'` on line 20.

## Verification

- `./init.sh` — all tests pass (19/19)
- `npm run build` — builds successfully with no errors
- `vue-tsc --noEmit` — no new type errors introduced (pre-existing errors in cli.ts, prompts.ts, storage.ts, RoomPicker.vue template, and FontAwesome library.add remain unchanged)