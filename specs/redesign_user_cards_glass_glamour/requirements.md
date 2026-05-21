# Requirements — Redesign User Cards with Glassmorphism & Glamour

> EARS notation: SHALL = mandatory, SHOULD = desirable, WILL = declarative

## R1 — Content Visibility

R1.1 The system SHALL display all user card content (position number, profile picture, username, country flags with points, total score) within the visible bounds of the card without clipping or overflow.

R1.2 The system SHALL NOT use CSS `clip-path` on `.user-card-position` or `.user-card-image` elements. (2026-05-19 entry in progress/history.md, lines 365–368: "Profile picture: Gold rounded border replacing clip-path polygon".)

## R2 — Glassmorphism

R2.1 The `.user-card-wrapper` SHALL have a `background` property using `rgba()` with alpha channel ≤ 0.15 for semi-transparency.

R2.2 The `.user-card-wrapper` SHALL use `backdrop-filter: blur(Npx)` with N ≥ 6 to create a glassmorphism effect.

R2.3 The `.user-card-wrapper` SHALL have a `border-radius` or visual border distinct from the page background.

## R3 — Gold Rounded Avatar Frame

R3.1 The `.user-card-image` SHALL have `border-radius: 50%` (or a clipped rounded shape) instead of a polygon clip-path.

R3.2 The profile picture (`img` inside `.user-card-image`) SHALL have a gold (`var(--euro-gold)`) border of at least 2px.

R3.3 On hover, the profile picture border SHALL additionally show a gold glow (`box-shadow` with `var(--euro-gold)`).

R3.4 The profile picture SHALL have a white inner border (2px solid white) inside the gold border on hover, matching the original Eurovision intent (history.md lines 365–368).

## R4 — Negative Margins Minimized

R4.1 The system SHALL NOT use negative `margin-right` on `.user-card-position` or `.user-card-image` to create overlap. (Root cause: negative margins hide content beneath adjacent sections.)

R4.2 The card layout SHALL use flex alignment (`display: flex`, `align-items: center`, `gap`) to space sections properly.

## R5 — Glamour Effects

R5.1 The `.user-card-wrapper` SHALL have a `box-shadow` with a colored glow (pink or gold, with `rgba()` and blur ≥ 10px).

R5.2 On hover, the `.user-card-wrapper` box-shadow SHALL intensify (larger blur or higher opacity).

R5.3 Points section (`.user-card-total`) SHALL have a pink glow (`text-shadow`, `box-shadow`, or `background` using `var(--euro-pink)`).

R5.4 The winner card (position 1, `.pos-1`) SHALL have a gold glow effect more prominent than other cards.

R5.5 The `.user-card-wrapper` SHALL use a subtle gold gradient or shimmer effect on the card border.

## R6 — Wrapper Clip-Path Preserved (Optional)

R6.1 The `.user-card-wrapper` SHOULD retain its `clip-path: polygon(0% 0%, 96% 0%, 100% 100%, 4% 100%)` for the angled card shape.

R6.2 IF the wrapper clip-path is removed, rounded corners (`border-radius`) SHALL be used instead, and R1.1 (no clipping) SHALL still hold.

## R7 — Winner Emphasis

R7.1 The winner (position 1) username SHALL use `var(--euro-gold)` color with visible glow (`text-shadow` with blur ≥ 8px).

R7.2 The winner SHALL display a gold star character (`★` or similar) after the username, preserved from the current `.user-winner::after` implementation.

## R8 — Hover Effects

R8.1 On hover, the `.user-card-wrapper` SHALL change border color to `var(--euro-pink)` (preserved from current behavior).

R8.2 On hover, the `.user-card-wrapper` SHALL NOT clip or hide any card content.

## R9 — Selector Preservation

R9.1 The following CSS class selectors SHALL remain present in `ClassificationView.vue`'s `<style>` block:
`.user-card-wrapper`, `.user-card`, `.user-card-position`, `.user-card-image`, `.user-card-data`, `.user-card-total`, `.user-card-countries`, `.country-wrapper`, `.user-card-info`, `.user-winner`, `.room-title-container`.

## R10 — Responsive Behavior

R10.1 The card layout SHALL be responsive: on screens ≥ 1000px wide, spacing between sections SHALL increase to fill available width.

R10.2 The card SHALL NOT overflow horizontally on any screen width.

## R11 — Test Updates

R11.1 Tests in `tests/Eurovision_styling.test.ts` that assert removed CSS properties (clip-path on position/image, negative margin values) SHALL be updated to match the new design.

R11.2 At least 3 new tests SHALL be added to cover: (a) glassmorphism (`backdrop-filter` on wrapper), (b) gold rounded avatar frame (`border-radius` + gold border on image), (c) glamour glow (`box-shadow` with pink/gold on wrapper).

## R12 — All Existing Tests Preserved

R12.1 All 64 existing tests in `tests/Eurovision_styling.test.ts` SHALL pass after the redesign, with the exception of tests that are explicitly updated in R11.1.

R12.2 The total test count in `Eurovision_styling.test.ts` SHALL be ≥ 64 after updates and additions.

## R13 — ARCHITECTURE.md

R13.1 If the card layout architecture changes significantly (e.g., removing clip-paths, changing flex model), `ARCHITECTURE.md` SHALL be updated to reflect the new approach.
