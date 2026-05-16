# Implementation Report — Fix_modal_refresh_issue (ID 13)

## Summary

- **Feature**: Fix_modal_refresh_issue — When the user refreshes the page with a modal open, the modal should not persist as stale visible state.
- **Root cause**: The Pinia `app` store persisted the `modal` ref to storage. On refresh, `modal.visible` was restored as `true` but component references and callbacks were lost, leaving an unclosable empty modal overlay.
- **Fix**: Added a `paths` include list to the store's `persist` config, explicitly listing every top-level key **except** `modal`. This excludes the ephemeral `modal` state from serialization.

## Files modified

| File | Change |
|---|---|
| `src/stores/app.ts` | Added `paths: ['userLogged', 'rememberUser', 'currentRoom', 'songs', 'updatable', 'selection', 'xToken']` to the persist config |
| `tests/appStore.test.ts` | Added 3 new tests: `test_appStore_modal_notPersisted`, `test_appStore_modal_resetOnRestore`, `test_appStore_setModal_emptyClearsVisibility` |
| `ARCHITECTURE.md` | Updated State Fields table (added Persisted column, noted modal is excluded); updated Persistence section to document the `paths` approach |

## Tasks completed

- [x] T1 — Add `paths` include list to persist config
- [x] T2 — Add `test_appStore_modal_notPersisted` (R5)
- [x] T3 — Add `test_appStore_modal_resetOnRestore` (R1, R3, R6)
- [x] T4 — Add `test_appStore_setModal_emptyClearsVisibility` (R7)
- [x] T5 — `./init.sh` all 216 tests pass
- [x] T6 — Update ARCHITECTURE.md

## Test results

- **Before**: 37 test files, 213 tests passed
- **After**: 37 test files, **216 tests passed** (3 new, 0 failures)

## Requirement traceability

| Req | Text | Covered by | Status |
|---|---|---|---|
| R1 | WHEN the page is loaded and the persisted `modal.visible` is `true`, the system SHALL reset the `modal` state to `{}` during initialization | T1 (paths excludes modal), T3 (test: `test_appStore_modal_resetOnRestore`) | ✅ |
| R2 | IF modal contains lost functions/references, system SHALL NOT leave `modal.visible` as `true` | T1 (paths excludes modal, so modal always starts as `{}`) | ✅ |
| R3 | WHEN user refreshes with room name edit modal open, system SHALL render no visible modal overlay | T3 (test: `test_appStore_modal_resetOnRestore` asserts `store.modal.visible` is falsy on hydration from stale state) | ✅ |
| R4 | WHERE user opens any modal and refreshes, system SHALL keep modal hidden regardless of modal type | T1 (paths approach applies to all modals, not just room name edit) | ✅ |
| R5 | WHEN store is persisted, system SHALL exclude `modal` from serialization | T1 (paths excludes modal), T2 (test: `test_appStore_modal_notPersisted` verifies no modal in persisted data) | ✅ |
| R6 | IF persisted state is restored from storage, system SHALL NOT display stale `modal.visible=true` | T1 (paths ensures modal is never in storage), T3 (test: `test_appStore_modal_resetOnRestore`) | ✅ |
| R7 | WHEN `store.setModal({})` is called, system SHALL set `modal` to `{}` making `modal.visible` falsy | T4 (test: `test_appStore_setModal_emptyClearsVisibility`), existing test `test_appStore_setModal_clearsModal` | ✅ |
| R8 | All existing tests SHALL pass | T5 (`./init.sh` passes all 216 tests) | ✅ |

## Decision record

The `paths` approach was chosen over the discarded `omit` approach because pinia-plugin-persistedstate v3.2.3 does not support `omit`. The `paths` list acts as a whitelist — only the listed keys are serialized. By intentionally omitting `modal`, it always initializes as `{}` on page load.
