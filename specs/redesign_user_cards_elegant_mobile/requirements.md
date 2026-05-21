# Requirements — Redesign User Cards (Elegant Mobile-First)

> EARS notation: Ubiquitous, Event, State, Optional, Unwanted.
> Every `SHALL` is verifiable by at least one concrete test.

---

## R1 — Remove clip-path from parent styles

The system SHALL NOT apply CSS `clip-path` to the `.user-card-wrapper` element from any parent component (ClassificationView.vue).

**Verification:** Inspect the computed styles of `.user-card-wrapper` elements; `clip-path` must be `none`.

---

## R2 — Remove conflicting parent card styles

WHILE displaying user cards inside ClassificationView, the system SHALL NOT define styles for `.user-card-wrapper`, `.user-card`, `.user-card-total`, `.user-card-countries`, or any `.user-card-*` class inside ClassificationView.vue's scoped `<style>` block.

**Verification:** ClassificationView.vue scoped styles contain no selectors matching `.user-card-*`.

---

## R3 — Self-contained card styling in UserCard.vue

The system SHALL define all visual styling for user cards exclusively within UserCard.vue's scoped `<style>` block.

**Verification:** UserCard renders correctly with all styles applied when ClassificationView.vue contains no user-card-related styles.

---

## R4 — Country flags displayed with points

WHEN rendering a user's country selections, the system SHALL display each country's flag immediately adjacent to its corresponding points value inside a shared container.

**Verification:** Each country container shows a flag image/element next to a numeric points value with no intervening elements.

---

## R5 — Mobile-first responsive layout

WHEN viewed on a screen width less than 768px, the system SHALL display the card in a vertical stacked layout with the header (position, avatar, username, total score) on top, followed by the country flags section below.

**Verification:** At viewport width < 768px, the header row and country flags section are arranged vertically (not side-by-side).

---

## R6 — Desktop adaptive layout

WHEN viewed on a screen width of 768px or greater, the system SHALL adapt the card layout to use a horizontal arrangement with the header and country flags side-by-side in a single row.

**Verification:** At viewport width >= 768px, the card header and country flags section appear in a single horizontal row.

---

## R7 — Elegant visual identity with Eurovision theme

The system SHALL style user cards using Eurovision visual identity elements: gold (`#d4af37` / `var(--euro-gold)`), pink (`#ff0087` / `var(--euro-pink)`), and navy/dark background (`#120e28` / `var(--euro-navy)`).

**Verification:** Card styles reference `var(--euro-gold)`, `var(--euro-pink)`, and dark navy backgrounds with measurable contrast.

---

## R8 — Glassmorphism card surface

The system SHALL apply a glassmorphism effect to the card surface: semi-transparent background with `backdrop-filter: blur()`.

**Verification:** The `.user-card` element has `background: rgba(...)` with opacity < 1 and `backdrop-filter: blur(...)`.

---

## R9 — Position badge visible

WHILE displaying a user's rank, the system SHALL render the position number in a dedicated badge element. The top 3 positions (1st, 2nd, 3rd) SHALL have distinct gold, silver, and bronze styling respectively.

**Verification:** Each card displays a `position-badge` element. Position 1 has gold colors, position 2 has silver colors, position 3 has bronze colors.

---

## R10 — Avatar/profile picture with frame

WHILE displaying a user's profile picture, the system SHALL render it inside a circular container with a gold-accented border and no polygon clipping.

**Verification:** The avatar image loads inside an `avatar-container` with `border-radius: 50%` and a visible gold outline/border.

---

## R11 — Username visible with truncation

The system SHALL display the username in the card with a font weight of at least 600. IF the username text overflows the available width, THEN the system SHALL truncate it with an ellipsis.

**Verification:** Username element has `font-weight >= 600`, `overflow: hidden`, and `text-overflow: ellipsis`.

---

## R12 — Total score displayed as badge

WHILE displaying a user's total points, the system SHALL render the score inside a distinct badge element styled with pink accent colors.

**Verification:** The `.user-card-total` or equivalent element shows the user's `points` value with pink (`var(--euro-pink)`) text/background styling.

---

## R13 — Touch-friendly tap targets

WHEN the application is accessed on a touchscreen device, the system SHALL provide interactive elements (country chips, hover effects) with a minimum tap target size of 36x36px or adequate padding for touch interaction.

**Verification:** Interactive card elements have `min-height: 36px` or `padding` sufficient for comfortable touch interaction.

---

## R14 — Animated entrance

WHEN the card first appears in the view (with `animActive` prop true), the system SHALL play a slide-in animation with a staggered delay based on card index.

**Verification:** Cards with `animActive = true` animate from off-screen left to their final position with `animation-delay` increasing by index.

---

## R15 — No clipping or overflow of card content

The system SHALL NOT clip or hide any card content elements (position badge, avatar, username, country flags, country points, total score) within the card boundaries.

**Verification:** All child elements of `.user-card` are fully visible and not cut off at the card edges at any viewport width >= 320px.

---

## R16 — Preserve existing interactions and tests

WHEN the redesign is applied, the system SHALL preserve all existing component interactions: hover effects on cards, winner/tail pick highlighting on country chips, and hover glow effects on avatar.

**Verification:** All currently passing tests continue to pass after the redesign without modification.

---

## R17 — Backward-compatible prop interface

The system SHALL accept the same `UserCardProps` interface (`user`, `index`, `animActive`) without changes to prop names, types, or behavior.

**Verification:** The `<UserCard>` component in ClassificationView.vue template requires no prop interface changes.

---

## R18 — Country winner/tail pick indicator preserved

WHEN a country chip has the `winner-pick` or `tail-pick` class, the system SHALL continue to visually distinguish it with gold (winner) or blue (tail) highlighting.

**Verification:** Country chips with `winner-pick` class show gold accents; chips with `tail-pick` class show blue accents.

---

## R19 — Glow effect for 1st place card

WHILE displaying the first-place user (index 0), the system SHALL render a subtle gold glow/shadow effect around the card border.

**Verification:** The card wrapper or card element for position 1 has a gold-colored box-shadow or gradient border.

---

## R20 — Room title unaffected

WHEN modifying styles in ClassificationView.vue, the system SHALL NOT alter the `.room-title-container` or `.classification-container` styling in any way.

**Verification:** The `.room-title-container` styles remain unchanged after the implementation.
