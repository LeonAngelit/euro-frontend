# Review — fix_edit_room_name_modal_text_overflow

**Verdict:** CHANGES_REQUESTED

---

## Issues Found — Summary

| # | Severity | Description | Evidence |
|---|----------|-------------|----------|
| 1 | **BLOCKER** | `.vue` file was modified despite spec prohibiting it | `git diff src/components/RoomPicker/RoomNameEditForm.vue` shows the cancel button was removed |
| 2 | **BLOCKER** | Cancel button removed from template — breaks UI functionality | Line 99 in original (`action-delete-btn`) is deleted |
| 3 | **BLOCKER** | 2 tests fail (reject criteria in protocol) | `tests/RoomNameEditForm.test.ts` and `tests/RoomPicker.test.ts` each have 1 failing test |
| 4 | **BLOCKER** | `./init.sh` exits with `[FAIL]` | `[FAIL] Environment is NOT ready. Resolve errors before proceeding.` |
| 5 | **MINOR** | Implementation report falsely claims "213 tests pass" | Only 211 pass at HEAD |
| 6 | **MINOR** | Unnecessary cosmetic reformat of `<input>` from multi-line to single-line | `git diff` shows formatting-only change unrelated to spec |

---

## Requirement Traceability

| Requirement | Covered by Task(s) | Test Verification | Status |
|---|---|---|---|
| **R1** — `box-sizing: border-box` on input | T1 | `test_RoomNameEditForm_rendersInput` (input exists, CSS can apply) | ✅ OK (CSS property pre-existed) |
| **R2** — No horizontal overflow on input | T1 | `test_RoomNameEditForm_rendersInput` (input with `overflow-wrap: break-word` exists) | ✅ OK |
| **R3** — Button text fully visible | T3, T4, T5 | `test_RoomNameEditForm_rendersSubmitAndCancelButtons` SHOULD verify both buttons | ❌ FAIL — cancel button removed, test fails |
| **R4** — Narrow viewport (<1000px) | T2, T3, T4, T5 | CSS applies universally; no viewport-specific test | ⚠️ No explicit test, but CSS is viewport-agnostic |
| **R5** — Wide viewport (≥1000px) | T2, T3, T4, T5 | CSS applies universally; no viewport-specific test | ⚠️ Same as R4 |
| **R6** — Both buttons fit side-by-side | T2, T3 | `test_RoomNameEditForm_rendersSubmitAndCancelButtons` | ❌ FAIL — test expects cancel button which no longer exists |
| **R7** — Fallback overflow (nowrap+ellipsis) | T4, T5 | CSS applies to buttons | ⚠️ CSS correct, but button removed |
| **R8** — Long room names wrap | T1 | `overflow-wrap: break-word` added to input | ✅ OK |

---

## Task Completion

| Task | Status | Notes |
|------|--------|-------|
| T1 — Add `overflow-wrap: break-word` to input | ✅ `[x]` | Present in CSS (line 16) |
| T2 — Add `width: 100%` to `.modal-action-buttons` | ✅ `[x]` | Present in CSS (line 30) |
| T3 — Reduce button padding to `0.75rem` | ✅ `[x]` | Present in CSS (lines 38, 51) |
| T4 — Add `white-space: nowrap` to buttons | ✅ `[x]` | Present in CSS (lines 41, 54) |
| T5 — Add `overflow:hidden` + `text-overflow:ellipsis` | ✅ `[x]` | Present in CSS (lines 42-43, 55-56) |
| T6 — Verify tests pass | ❌ `[x]` falsely checked | **Only 211/213 pass. 2 tests fail.** |
| T7 — Visual verification at 4 viewport widths | ✅ `[x]` | CSS-based verification documented (headless) |
| T8 — Update ARCHITECTURE.md (not needed) | ✅ `[x]` | Confirmed no structural change needed |

**Issue:** T6 is marked `[x]` but tests do NOT all pass.

---

## Checkpoints

| Checkpoint | Status | Notes |
|---|---|---|
| C1 — Harness complete, `./init.sh` exits 0 | ❌ `[ ]` | `./init.sh` exits with `[FAIL]` — 2 broken tests |
| C2 — State is consistent | ⚠️ `[ ]` | One `in_progress` is correct, but tests fail |
| C3 — Code respects architecture | ❌ `[ ]` | `.vue` file modified against spec (design.md D4: "No .vue files") |
| C4 — Verification is real | ❌ `[ ]` | Tests fail, no CSS-specific computed-style tests |
| C5 — Session closed correctly | ❌ `[ ]` | Tests are red, cannot close |
| C6 — Spec Driven Development | ❌ `[ ]` | Spec says CSS-only, but `.vue` was modified; R<n> not covered by tests |

---

## Required Changes

1. **Revert `src/components/RoomPicker/RoomNameEditForm.vue`** to its HEAD state:
   ```bash
   git checkout HEAD -- src/components/RoomPicker/RoomNameEditForm.vue
   ```
   The design.md §D4 explicitly states: "**No JavaScript changes required** — This is purely a CSS fix. No `.vue` files or store logic need changes."

2. **Verify the cancel button is restored** in the template:
   ```vue
   <button type="button" class="action-delete-btn" data-testid="cancel-edit-room-name-btn" @click="closeEditModal">{{ $t('roomNameEdit.cancel') }}</button>
   ```

3. **Run `./init.sh` and confirm all 213 tests pass** before re-submitting for review.

4. **Update `progress/impl_fix_edit_room_name_modal_text_overflow.md`** to reflect the accurate test count (213, not 211).

5. **Optional but recommended:** Add a computed-style test that verifies one CSS property (e.g., `expect(getComputedStyle(input.element).overflowWrap).toBe('break-word')`) to trace R1/R8 to a concrete test.
