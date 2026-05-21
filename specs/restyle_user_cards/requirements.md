# Requirements — Restyle User Cards

## Scope

Re-style the user cards in `ClassificationView.vue` to fix content overflow,
clipping, and layout issues while preserving the Eurovision visual identity
and all existing passing tests.

---

## R1
The `.user-card-wrapper` SHALL NOT have a fixed `height` value; the card
height SHALL adapt to its content.

## R2
The `.user-card-wrapper` SHALL retain `border-top` and `border-bottom`
with value `2px solid var(--euro-gold)`.

## R3
The `.user-card` flex container SHALL have `align-items: stretch` and its
children SHALL NOT use negative `margin-right` values that cause content
to be hidden or clipped.

## R4
The `.user-card-position` section SHALL be wide enough to display up to
3-digit position numbers without clipping or overflow.

## R5
The `.user-card-position` SHALL retain its pink gradient background and
clip-path angled edge.

## R6
The `.user-card-image` SHALL NOT clip the profile image in a way that
hides meaningful content (face, avatar). The clip-path on the image
section SHALL either be widened or removed.

## R7
The `.user-card-countries` flex-wrap container SHALL have sufficient
vertical space to display all country entries without being cropped
by the card boundaries.

## R8
The `.user-card-total` SHALL retain its `border-left`, `var(--euro-pink)`
color, `"PTS"` label via `::before`, and gold-adjacent background.

## R9
WHEN the user hovers over a `.user-card-wrapper`, the system SHALL
retain the hover effect (`border-top-color` and `border-bottom-color`
change to `var(--euro-pink)` with enhanced shadow).

## R10
The top-3 position badges (`.pos-1`, `.pos-2`, `.pos-3`) SHALL retain
their special gold/silver/bronze styling.

## R11
WHILE the viewport width is at or above 1000px, the system SHALL apply
responsive overrides consistent with the original layout intent (wider
negative margins may be adjusted proportionally, but the `@media
(min-width: 1000px)` block SHALL NOT be removed).

## R12
The `.user-card-wrapper` SHALL retain its `clip-path` for angled edges,
but the clip region SHALL NOT cut off card content (padding or margin
adjustments SHALL ensure content stays within the visible polygon).

## R13
The CSS selectors `.user-card-wrapper`, `.user-card`, `.user-card-position`,
`.user-card-image`, `.user-card-data`, `.user-card-total`, `.user-card-countries`,
`.country-wrapper`, `.user-card-info`, `.user-winner`, and `.room-title-container`
SHALL all remain present in the scoped `<style>` block.

## R14
No existing test in `tests/Eurovision_styling.test.ts` SHALL fail as a
result of the card restyling changes.

## R15
WHILE running `./init.sh`, the system SHALL report 0 test failures
attributable to card restyling changes.

## R16
IF a user has 6 or more countries assigned, THEN all country entries
SHALL be visible within the card without overflow or scroll.

## R17
The `.room-title-container` SHALL retain its sticky positioning, gold
bottom border, and styling.

## R18
The animation (`.animate` class, `slide-in-left` keyframes) SHALL continue
to function after restyling.
