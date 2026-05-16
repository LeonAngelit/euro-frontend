# Design — Move old folder content to new folder

## Overview

Single-phase migration: read CSS content from old capitalized folders → embed directly into `<style scoped>` blocks in the corresponding `.vue` components → remove `<style src>` import lines → delete old capitalized folders.

No intermediate `<style src>` import phase. The final state is that all CSS is inline in `<style scoped>` blocks — no external CSS files are imported at all.

## Files modified (`.vue` components — 16 total)

Each component gets its CSS from `src/Components/<Subdir>/` or `src/Views/<Subdir>/` inlined into a `<style scoped>` block. The existing `<style src="...">` line is removed and replaced with the actual CSS content.

| `.vue` component | CSS source file |
|---|---|
| `src/components/AdminPanel/AdminPanel.vue` | `src/Components/AdminPanel/AdminPanel.component.css` |
| `src/components/ClassificationView/ClassificationView.vue` | `src/Components/ClassificationView/Classification.Component.css` |
| `src/components/Collapsible/Collapsible.vue` | `src/Components/Collapsible/Collapsible.component.css` |
| `src/components/CountryPicker/CountryPicker.vue` | `src/Components/CountryPicker/CountryPicker.Component.css` |
| `src/components/Footer/Footer.vue` | `src/Components/Footer/Footer.component.css` |
| `src/components/Form/Form.vue` | `src/Components/Form/Form.Component.css` |
| `src/components/Modal/Modal.vue` | `src/Components/Modal/Modal.component.css` |
| `src/components/Navigation/Navigation.vue` | `src/Components/Navigation/Navigation.component.css` |
| `src/components/NotFound/NotFound.vue` | `src/Components/NotFoundComponent/App.css` |
| `src/components/RoomPicker/RoomNameEditForm.vue` | `src/Components/RoomPicker/RoomNameEditForm.Component.css` |
| `src/components/RoomPicker/RoomPicker.vue` | `src/Components/RoomPicker/RoomPicker.Component.css` |
| `src/views/AdminView/AdminView.vue` | `src/Views/AdminView/AdminView.componen.css` |
| `src/views/App/Home.vue` | `src/Views/App/Home.Component.css` |
| `src/views/Archive/Archive.vue` | `src/Views/App/Home.Component.css` |
| `src/views/CreateRoom/CreateRoom.vue` | `src/Views/CreateRoom/CreateRoom.Component.css` |
| `src/views/UserDetails/UserDetails.vue` | `src/Views/UserDetails/UserDetails.Component.css` |

## Additional file move — logo.svg

`src/Components/NotFoundComponent/logo.svg` → `src/components/NotFound/logo.svg` (just a file move, not inlined)

## Files deleted

- Entire `src/Components/` directory tree (11 subdirectories, 12 CSS files + 1 SVG that gets moved first)
- Entire `src/Views/` directory tree (4 subdirectories, 4 CSS files)

## Important details

1. **scoped handling**: Vue's `scoped` attribute on `<style>` will automatically scope all CSS selectors to the component. No manual prefixing needed.

2. **Shared CSS**: `src/Views/App/Home.Component.css` is used by both `Home.vue` and `Archive.vue`. The CSS content must be inlined in both components separately (duplicated, not shared).

3. **Filename typo**: `src/Views/AdminView/AdminView.componen.css` has a typo (missing "t" in "component"). This is just the source filename — the content gets inlined normally.

4. **No CSS files remain**: After inlining, all `.css` files and the old folder structures are deleted. The `logo.svg` is moved to the new `Notfound` component directory.

## Discarded alternative

**Two-phase with intermediate import paths (Phase 1: move + import, Phase 2: inline).** This approach would move CSS files to lowercase directories, update `<style src>` import paths, and only then inline. It was discarded because:
- The acceptance criteria explicitly require final state to be `<style scoped>` without external imports.
- An intermediate import phase adds risk and complexity without value.
- There are only 16 components — the inlining is straightforward and verifiable in one pass.
