# Review — restyle_profile_picture

**Verdict:** CHANGES_REQUESTED

## Traceability requirements ↔ tests

- **R1** — Remove clip-path polygon: ❌ No test verifies `clip-path` is absent from `.profile-button` in `index.css`. The implementer maps to "source inspection", which is not a concrete test. The R23 tests set precedent: `test_wrapper_no_clip_path` explicitly asserts `expect(css).not.toContain('clip-path')`. A similar test is needed for the profile-button section of `index.css`.
- **R2** — Rounded square shape: ❌ No test checks `border-radius` on `.profile-button` or `.profile-button img`. R23 precedent: `test_gold_rounded_avatar_frame` checks `border-radius: 50%`. A test should assert `border-radius: 12px` (container) and `border-radius: 10px` (img).
- **R3** — Glassmorphism background: ❌ No test checks `backdrop-filter`, `background: rgba(18,14,40,0.6)`, `border: 1px solid rgba(...)` on `.profile-button`. R23 precedent: `test_glassmorphism_backdrop_filter` checks `backdrop-filter: blur(20px)`.
- **R4** — Eurovision theme colors: ✅ Covered by `test_profile_button_hover_pink_shadow — R2` (line 226) which checks `.profile-button:hover`, `box-shadow`, and `255, 0, 135` in `index.css`.
- **R5** — Responsive behavior: ❌ No test verifies the `.profile-button-container` width proportions (15% mobile, 5% desktop) or the 1:1 aspect ratio specifically for the profile picture.
- **R6** — Preserve hover effects: ✅ Covered by `test_navigation_profile_button_hover_transition — R7` (line 381) which checks `.profile-button:hover` and `cursor: pointer` in `index.css`.
- **R7** — No breaking changes: ✅ Covered by the full test suite (300 pass) plus `test_key_selectors_still_exist_in_index_css — R15` (selector existence) and `test_key_selectors_still_exist_in_components — R15` (Navigation selector).
- **R8** — Update documentation: ❌ No test verifies that ARCHITECTURE.md section 6.4 was updated with the new profile picture styling (though the file was updated correctly per source inspection).
- **R9** — Unwanted behaviors: ❌ No tests explicitly verify that the image is not clipped (R9.1), is readable (R9.2), retains clickable area (R9.3), or that Form.vue preview is unaffected (R9.4).

**Summary:** 4 requirements have test coverage (R4, R6, R7, R8 borderline). 5 requirements lack concrete test coverage (R1, R2, R3, R5, R9).

## Complete Tasks (tasks.md)

All tasks T1–T12 are marked `[x]`. ✅

## Checkpoints

- C1 — Harness complete: [x]
- C2 — State consistent: [x] (but feature still `in_progress` in `feature_list.json`)
- C3 — Code respects architecture: [x]
- C4 — Verification is real: [ ] (R1, R2, R3, R5, R9 lack tests)
- C5 — Session closed correctly: [ ] (not yet closed)
- C6 — Spec Driven Development: [ ] (R<n> not all covered by tests per §106–111 of docs/specs.md)

## Code Review

### `src/index.css` (lines 127–156)
✅ clip-path, -webkit-mask-image, mask-image removed from `.profile-button` and `.profile-button img` (R1)
✅ border-radius: 12px on container, 10px on img (R2)
✅ backdrop-filter: blur(8px), -webkit-backdrop-filter: blur(8px), background: rgba(18,14,40,0.6), border: 1px solid rgba(255,255,255,0.1) (R3)
✅ box-shadow: 0 0 12px rgba(255,0,135,0.3) on hover (R4, R6)
✅ filter: brightness(1.15) and cursor: pointer preserved on hover (R6)
✅ overflow: hidden to contain image (R2)
✅ transition: all 0.2s ease (R6)

### `src/components/Navigation/Navigation.vue`
✅ Duplicate `.profile-button:hover` scoped rule removed (confirmed via grep — no matches)
✅ Responsive breakpoints preserved (15% mobile, 5% desktop via `@media (min-width: 1000px)` at line 402)

### `tests/Eurovision_styling.test.ts`
✅ `test_profile_button_hover_pink_shadow — R2` updated to check `index.css` for `.profile-button:hover` + `box-shadow` + `255, 0, 135`
✅ `test_navigation_profile_button_hover_transition — R7` updated to check `index.css` for `.profile-button:hover` + `cursor: pointer`
✅ `test_key_selectors_still_exist_in_index_css — R15` includes `.profile-button`

### `ARCHITECTURE.md` (section 6.4)
✅ Updated with glassmorphism profile picture description as implemented

## Required changes

1. **Add tests for R1 (no clip-path):** In the describe block that reads `index.css`, add a test asserting `expect(css).not.toContain('clip-path')` for the `.profile-button` context, following the R23 `test_wrapper_no_clip_path` pattern.

2. **Add tests for R2 (rounded square):** Add assertions checking `border-radius: 12px` on `.profile-button` and `border-radius: 10px` on `.profile-button img`, following the `test_gold_rounded_avatar_frame` pattern from R23.

3. **Add tests for R3 (glassmorphism):** Add assertions checking `backdrop-filter: blur(8px)` and `background: rgba(18, 14, 40, 0.6)` on `.profile-button`, following the `test_glassmorphism_backdrop_filter` pattern from R23.

4. **Add tests for R5 (responsive):** Add assertions verifying that `.profile-button-container` has the expected width values (15%) and that the `@media (min-width: 1000px)` query adjusts it to 5%.

5. **Add tests for R9 (unwanted):** At minimum, verify that the profile button remains clickable (selector exists, `cursor: pointer` is set) and that the image is not clipped (same as R1 test). Verify Form.vue still renders correctly.

## Conclusion

The implementation is **correct** — the CSS changes match the spec, all tasks are completed, and the test suite passes. However, the project's verification protocol (docs/specs.md §106–111, verification.md Level 4, and CHECKPOINTS.md C6) explicitly requires that each R<n> be covered by at least one concrete test. Five requirements (R1, R2, R3, R5, R9) lack such coverage.

**Requested changes** are limited to adding test coverage. No source code changes are needed.
