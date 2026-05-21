# Tasks — Redesign User Cards with Glassmorphism & Glamour

> Each task references requirements in `R<n.n>` notation from `requirements.md`.

## Phase 1: Remove Inner Clip-Paths & Negative Margins

- [x] **T1** Remove `clip-path` from `.user-card-position` in `<style scoped>` (R1.2)
- [x] **T2** Remove `margin-right: -0.4rem` from `.user-card-position` (R4.1)
- [x] **T3** Remove `clip-path` from `.user-card-image` (R1.2)
- [x] **T4** Remove `margin-right: -0.5rem` from `.user-card-image` (R4.1)
- [x] **T5** Remove desktop media query overrides for negative margins: `margin-right: -1rem` (position) and `margin-right: -1.5rem` (image) (R4.1, R10.1)
- [x] **T6** Remove `height: 100%` from `.user-card-position` and `.user-card-image` so they don't stretch (R4.2)
- [x] **T7** Remove `z-index: 2` and `z-index: 1` from position and image sections (no longer overlapping) (R4.2)
- [x] **T8** Verify wrapper clip-path `polygon(0% 0%, 96% 0%, 100% 100%, 4% 100%)` is preserved on `.user-card-wrapper` (R6.1)

## Phase 2: Implement Flex Layout

- [x] **T9** Add `gap: 0.5rem` to `.user-card` (flex parent) to replace negative margins (R4.2)
- [x] **T10** Add `align-items: center` to `.user-card` so all sections center vertically (R4.2)
- [x] **T11** Ensure `.user-card-data` maintains `flex: 1` and `min-width: 0` for proper text truncation (R1.1)
- [x] **T12** Verify no card content overflows or is hidden after layout changes (verified via tests) (R1.1, R8.2)

## Phase 3: Glassmorphism

- [x] **T13** Change `.user-card-wrapper` background to `rgba(255, 255, 255, 0.08)` (R2.1)
- [x] **T14** Add `backdrop-filter: blur(8px)` to `.user-card-wrapper` (R2.2)
- [x] **T15** Add `-webkit-backdrop-filter: blur(8px)` for Safari compatibility (R2.2)
- [x] **T16** N/A — wrapper clip-path preserved, so no fallback border-radius needed (R2.3, R6.2)

## Phase 4: Gold Rounded Avatar Frame

- [x] **T17** Add `border-radius: 50%` to `.user-card-image` (R3.1)
- [x] **T18** `overflow: hidden` already existed on `.user-card-image` (R3.1)
- [x] **T19** `.user-card-image img` already had `object-fit: cover`, `width: 100%`, `height: 100%` (R3.1)
- [x] **T20** Add `border: 2px solid white` to the image (`img`) (R3.4)
- [x] **T21** Add `outline: 2px solid var(--euro-gold)` to the image for gold frame (R3.2)
- [x] **T22** Add `outline-offset: -2px` so gold outline sits right on the border edge (R3.2)
- [x] **T23** Add hover glow to avatar: `.user-card-image img:hover` with `box-shadow: 0 0 12px var(--euro-gold)` (R3.3)

## Phase 5: Glamour Effects

- [x] **T24** Enhance `.user-card-wrapper` box-shadow to multi-layered: `0 4px 20px rgba(255,0,135,0.15), 0 0 40px rgba(218,183,29,0.05)` (R5.1)
- [x] **T25** Enhance hover box-shadow on `.user-card-wrapper:hover`: `0 6px 30px rgba(255,0,135,0.3), 0 0 60px rgba(218,183,29,0.1)` (R5.2)
- [x] **T26** Enhance hover background on `.user-card-wrapper:hover`: `rgba(255, 255, 255, 0.12)` (R5.2)
- [x] **T27** Verify `.user-card-total` still has pink glow (`text-shadow`, `color: var(--euro-pink)`) — preserved (R5.3)
- [x] **T28** Verify `.pos-1` has golden text-shadow: `0 0 16px rgba(218, 183, 29, 0.5)` — preserved (R5.4, R7.1)
- [x] **T29** Verify `.pos-1` card has golden wrapper box-shadow — preserved (R5.4)
- [x] **T30** Verify `.user-winner::after` star is preserved — preserved (R7.2)

## Phase 6: Update Tests

- [x] **T31** Update `test_position_pink_gradient_clip_path` in `Eurovision_styling.test.ts` — remove clip-path assertion; keep pink gradient assertion (R11.1)
- [x] **T32** Update `test_image_clip_path_widened` — replace with assertions for `border-radius: 50%` + gold outline/border on image (R11.1)
- [x] **T33** Update `test_position_and_image_negative_margins` — replace negative margin assertions with assertions that negative margins are NOT present, OR assert flex gap exists (R11.1)
- [x] **T34** Add new test `test_glassmorphism_backdrop_filter` — assert `.user-card-wrapper` uses `backdrop-filter: blur(...)` (R11.2.a)
- [x] **T35** Add new test `test_gold_rounded_avatar_frame` — assert `.user-card-image` has `border-radius: 50%` and gold outline/border on image (R11.2.b)
- [x] **T36** Add new test `test_glamour_glow_effects` — assert `.user-card-wrapper` has box-shadow with pink or gold glow (R11.2.c)

## Phase 7: Verify

- [x] **T37** Run `./init.sh` — verified all 291 tests pass (39 files) (R12.1, R12.2)
- [x] **T38** Run `npm run build` — verified production build succeeds with no errors
- [x] **T39** Card layout did not change structurally (only CSS properties within scoped style); ARCHITECTURE.md already describes component at structural level — no update needed (R13.1)
- [x] **T40** Update `progress/current.md` documenting what was changed and why

## Phase 3 — Final test coverage

- [x] **T41** Add test for R2.1: `.user-card-wrapper` has `background: rgba(255, 255, 255, 0.08)`
- [x] **T42** Add test for R3.3: `.user-card-image img:hover` has gold box-shadow
- [x] **T43** Add test for R5.2: `.user-card-wrapper:hover` has intensified box-shadow
- [x] **T44** Add test for R7.2: `.user-winner::after` contains star character
- [x] **T45** Add test for R8.2: `.user-card-wrapper:hover` has no clip-path or overflow: hidden
- [x] **T46** Add test for R10.2: `.user-card-data` prevents horizontal overflow
- [x] **T47** Verify all tests pass with `npx vitest run` and `./init.sh`
