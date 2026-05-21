# Tasks — Restyle User Cards

## Order of Execution

1. Remove fixed height on `.user-card-wrapper`
2. Adjust wrapper padding and clip-path
3. Fix negative margins on position and image sections
4. Widen image clip-path
5. Increase position section width
6. Fix country list overflow
7. Verify desktop responsive overrides
8. Run tests to confirm no regressions
9. Update ARCHITECTURE.md if needed

---

- [x] T1 — Remove `height: 82px` from `.user-card-wrapper`; replace with
      `min-height: 82px`. Increase `padding-top` and `padding-bottom` from
      `0.15rem` to `0.5rem`. Covers: R1, R7, R12, R16.

- [x] T2 — Adjust `.user-card-wrapper` `clip-path` from
      `polygon(0% 0%, 97% 0%, 100% 100%, 3% 100%)` to
      `polygon(0% 0%, 96% 0%, 100% 100%, 4% 100%)` to give more
      horizontal safe space. Covers: R12.

- [x] T3 — Reduce `.user-card-position` `margin-right` from `-1rem` to
      `-0.4rem` (mobile) and from `-3rem` to `-1rem` (desktop `@media`
      block). Covers: R3, R4, R11.

- [x] T4 — Reduce `.user-card-image` `margin-right` from `-1.2rem` to
      `-0.5rem` (mobile) and from `-3rem` to `-1.5rem` (desktop `@media`
      block). Covers: R3, R6, R11.

- [x] T5 — Widen `.user-card-image` `clip-path` from
      `polygon(0% 0%, 70% 0%, 100% 100%, 23% 100%)` to
      `polygon(0% 0%, 85% 0%, 100% 100%, 15% 100%)` to show more of
      the profile image. Covers: R6.

- [x] T6 — Increase `.user-card-position` `width` from `13%` to `14%`
      and add `min-width: 38px` to guarantee space for 3-digit position
      numbers. Covers: R4, R5.

- [x] T7 — Ensure `.user-card-countries` has `overflow: visible` and
      add `padding: 0.25rem 0.5rem` for breathing room. Verify wrapped
      rows are fully visible without crop. Covers: R7, R16.

- [x] T8 — Run `npx vitest run tests/Eurovision_styling.test.ts` and
      confirm all 51 tests pass with 0 failures. Pay special attention
      to R9 (gold borders), R14 (media queries), R15 (selectors present).
      Covers: R2, R8, R9, R10, R11, R13, R14.

- [x] T9 — Run `npx vitest run` (full suite) and confirm 0 new failures
      attributable to card restyling. Covers: R14, R15.

- [x] T10 — Run `./init.sh` and confirm `[OK] Environment ready` with
       0 test failures. Covers: R15, R18.

- [x] T11 — Update ARCHITECTURE.md if the layout approach changed
      significantly (e.g., if `height` → `min-height` is documented).
      Otherwise note that no update was needed. Covers: R15.

- [x] T12 — Add `test_user_card_wrapper_no_fixed_height` to verify R1 (no height, min-height present). Covers: R1.
- [x] T13 — Add `test_position_and_image_negative_margins` to verify R3 (negative margins, mobile + desktop). Covers: R3, R11.
- [x] T14 — Add `test_position_section_width` to verify R4 (14% width, 38px min-width). Covers: R4.
- [x] T15 — Add `test_position_pink_gradient_clip_path` to verify R5 (gradient + clip-path). Covers: R5.
- [x] T16 — Add `test_image_clip_path_widened` to verify R6 (85%/15% clip-path). Covers: R6.
- [x] T17 — Add `test_countries_overflow_visible` to verify R7 (overflow: visible). Covers: R7.
- [x] T18 — Add `test_total_section_styling` to verify R8 (border-left, pink, ::before "PTS"). Covers: R8.
- [x] T19 — Add `test_wrapper_hover_effect` to verify R9 (hover border-top-color pink). Covers: R9.
- [x] T20 — Add `test_top3_position_badges` to verify R10 (pos-1/2/3 selectors exist, euro-gold). Covers: R10.
- [x] T21 — Add `test_wrapper_clip_path_retained` to verify R12 (96%/4% clip-path). Covers: R12.
- [x] T22 — Add `test_all_11_selectors_exist` to verify R13 (all 11 selectors present). Covers: R13.
- [x] T23 — Add `test_six_plus_countries_visible` to verify R16 (min-height + overflow). Covers: R16.
- [x] T24 — Add `test_animation_class_and_keyframes` to verify R18 (animate + keyframes). Covers: R18.
- [x] T25 — Run full test suite: confirm 288 tests pass, `./init.sh` green. Covers: R14, R15.
