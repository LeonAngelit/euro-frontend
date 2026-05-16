# Tasks — Fix modal refresh issue

- [x] T1 — Add `paths: ['userLogged', 'rememberUser', 'currentRoom', 'songs', 'updatable', 'selection', 'xToken']` to the persist config in `src/stores/app.ts`, explicitly listing every top-level key except `modal`. Covers: R1, R2, R4, R5, R6.
- [x] T2 — Add test `test_appStore_modal_notPersisted` in `tests/appStore.test.ts` that verifies the `modal` key is not written to storage after any state mutation. Covers: R5.
- [x] T3 — Add test `test_appStore_modal_resetOnRestore` in `tests/appStore.test.ts` that simulates a persisted state with `modal.visible = true`, hydrates the store, and asserts `store.modal.visible` is falsy. Covers: R1, R3, R6.
- [x] T4 — Add test `test_appStore_setModal_emptyClearsVisibility` in `tests/appStore.test.ts` that calls `store.setModal({})` and asserts `store.modal.visible` is falsy and `store.modal` is `{}`. Covers: R7.
- [x] T5 — Run `./init.sh` and verify all tests pass. Covers: R8.
- [x] T6 — Update `ARCHITECTURE.md` if needed to document that modal state is non-persistent by design. Covers: R3 (acceptance criteria).
