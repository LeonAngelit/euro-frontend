# Review — fix_classification_view_scroll

**Verdict:** CHANGES_REQUESTED

## Implementation Correctness

| Check | Result | Details |
|-------|--------|---------|
| `.classification-container` has `display: flex; flex-direction: column; height: 100%; overflow: hidden;` | ✅ | Lines 83-88 of `ClassificationView.vue` |
| `.room-title-container` has NO `background` property | ✅ | Lines 90-100, no `background` added |
| `position: sticky` and `top: 0` REMOVED from `.room-title-container` | ✅ | Not present in lines 90-100 |
| `flex-shrink: 0` present on `.room-title-container` | ✅ | Line 91 |
| `.users-container` has `flex: 1; overflow-y: auto; min-height: 0;` | ✅ | Lines 102-106 |
| All tasks T1-T4 marked `[x]` in `tasks.md` | ✅ | T1, T2, T3, T4 all checked |
| `./init.sh` passes (305 tests, 39 files, all green) | ✅ | All tests pass |

## Requirement Traceability — ❌ REJECTED

| Req | Description | Test coverage | Status |
|-----|-------------|---------------|--------|
| R1 | Flex column layout, title above users | No test verifies `.classification-container` has `display: flex; flex-direction: column; height: 100%; overflow: hidden;` | ❌ Missing |
| R2 | Scroll only `.users-container` | No test verifies `.users-container` has `flex: 1; overflow-y: auto; min-height: 0;` | ❌ Missing |
| R3 | Title stays at top, doesn't scroll away | No test verifies `position: sticky` and `top: 0` are removed from `.room-title-container` and `flex-shrink: 0` is present | ❌ Missing |
| R4 | No background added to title | No test verifies that `.room-title-container` has no `background` property | ❌ Missing |

**Existing tests only cover older requirements (R9, R23, R43) — none cover R1-R4 of this feature.**

The implementation report (`progress/impl_fix_classification_view_scroll.md`) incorrectly maps R1-R4 to tasks (T1-T3) instead of concrete tests. The verification docs require "at least one concrete test in `tests/`" per `R<n>`.

## Checkpoints

- C1: [x] Harness complete
- C2: [x] State consistent (feature #22 is `in_progress`, single active feature)
- C3: [x] Code respects architecture
- C4: [x] Tests exist per module, all green
- C5: [ ] Session not yet closed (reviewing)
- C6: [ ] **Each R<n> from requirements.md is covered by at least one concrete test** — R1, R2, R3, R4 have NO test coverage

## Required Changes

1. **Add tests in `tests/` for each requirement R1-R4.** Following the project pattern (e.g., `test_classification_view_room_title_gold_border — R9` which uses `readSource()` to verify CSS properties in source), add tests like:
   - `test_classification_view_flex_layout — R1`: Verify `.classification-container` contains `display: flex; flex-direction: column; height: 100%; overflow: hidden;`
   - `test_classification_view_scroll_container — R2`: Verify `.users-container` contains `flex: 1; overflow-y: auto; min-height: 0;`
   - `test_classification_view_title_stays_at_top — R3`: Verify `.room-title-container` does NOT contain `position: sticky` or `top: 0` but DOES contain `flex-shrink: 0`
   - `test_classification_view_title_no_background — R4`: Verify `.room-title-container` does NOT contain any `background:` property

2. **Update `progress/impl_fix_classification_view_scroll.md`** to map each `R<n>` to its concrete test name (not task ID).

3. Once tests are added and pass, run `./init.sh` to confirm everything is green.
