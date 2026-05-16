# Tasks — Move old folder content to new folder

> Single-phase: inline CSS directly into `<style scoped>`, no intermediate imports.

## Inline CSS into `<style scoped>` blocks

- [x] T1 — Inline `src/Components/AdminPanel/AdminPanel.component.css` into `src/components/AdminPanel/AdminPanel.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R1, R5.
- [x] T2 — Inline `src/Components/ClassificationView/Classification.Component.css` into `src/components/ClassificationView/ClassificationView.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R1, R5.
- [x] T3 — Inline `src/Components/Collapsible/Collapsible.component.css` into `src/components/Collapsible/Collapsible.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R1, R5.
- [x] T4 — Inline `src/Components/CountryPicker/CountryPicker.Component.css` into `src/components/CountryPicker/CountryPicker.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R1, R5.
- [x] T5 — Inline `src/Components/Footer/Footer.component.css` into `src/components/Footer/Footer.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R1, R5.
- [x] T6 — Inline `src/Components/Form/Form.Component.css` into `src/components/Form/Form.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R1, R5.
- [x] T7 — Inline `src/Components/Modal/Modal.component.css` into `src/components/Modal/Modal.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R1, R5.
- [x] T8 — Inline `src/Components/Navigation/Navigation.component.css` into `src/components/Navigation/Navigation.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R1, R5.
- [x] T9 — Inline `src/Components/NotFoundComponent/App.css` into `src/components/NotFound/NotFound.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R3, R5.
- [x] T10 — Inline `src/Components/RoomPicker/RoomNameEditForm.Component.css` into `src/components/RoomPicker/RoomNameEditForm.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R1, R5.
- [x] T11 — Inline `src/Components/RoomPicker/RoomPicker.Component.css` into `src/components/RoomPicker/RoomPicker.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R1, R5.
- [x] T12 — Inline `src/Views/AdminView/AdminView.componen.css` into `src/views/AdminView/AdminView.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R2, R5, R12.
- [x] T13 — Inline `src/Views/App/Home.Component.css` into `src/views/App/Home.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R2, R5.
- [x] T14 — Inline `src/Views/App/Home.Component.css` into `src/views/Archive/Archive.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R6.
- [x] T15 — Inline `src/Views/CreateRoom/CreateRoom.Component.css` into `src/views/CreateRoom/CreateRoom.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R2, R5.
- [x] T16 — Inline `src/Views/UserDetails/UserDetails.Component.css` into `src/views/UserDetails/UserDetails.vue` as `<style scoped>`; remove the `<style src>` line. Covers: R2, R5.

## Move non-CSS assets

- [x] T17 — Move `src/Components/NotFoundComponent/logo.svg` to `src/components/NotFound/logo.svg` using `git mv`. Covers: R4.

## Delete old folders

- [x] T18 — Delete the entire `src/Components/` directory tree using `git rm -r`. Covers: R7.
- [x] T19 — Delete the entire `src/Views/` directory tree using `git rm -r`. Covers: R8.

## Verification

- [x] T20 — Run `npm run build` and confirm zero errors. Covers: R9.
- [x] T21 — Run `npm test` and confirm all tests pass. Covers: R10.
- [x] T22 — Verify no `<style src>` imports remain referencing old capitalized paths (grep for `../../Components/` and `../../Views/`). Covers: R5.
- [x] T23 — Update `ARCHITECTURE.md` if the structural change (no more external CSS files for these components) needs documenting.
