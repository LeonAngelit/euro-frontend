# Design — Restyle User Cards

## Files to Modify

| File | Change | Covers |
|---|---|---|
| `src/components/ClassificationView/ClassificationView.vue` | Adjust `.user-card-wrapper` height, padding; fix negative margins; adjust clip-paths; ensure content fits | R1–R18 |
| `ARCHITECTURE.md` | Update if layout or styling architecture changes significantly | R15 |

## Files NOT Modified

| File | Reason |
|---|---|
| `src/index.css` | No global CSS changes needed; all fixes are scoped |
| `src/components/RoomPicker/RoomPicker.vue` | Room cards use different layout; not in scope |
| `tests/Eurovision_styling.test.ts` | Tests are the source of truth; code is fixed to match them |

## Approach

### 1. Card container height (R1, R7, R16)

**Problem**: `.user-card-wrapper` has `height: 82px`. When a user has 5–6
countries with flags, the wrapping flex items overflow the fixed height.

**Fix**: Remove `height: 82px` and replace with `min-height: 82px`. Add
`padding-top: 0.5rem` and `padding-bottom: 0.5rem` to give breathing room.
The card grows naturally to accommodate wrapped country entries.

**Impact on tests**: R9 checks `border-top` and `border-bottom` on
`.user-card-wrapper` — those selectors and properties remain unchanged.
R13 checks the `.user-card-wrapper` selector — still present. Tests pass
because height is not tested by any existing assertion.

### 2. Negative margins (R3)

**Problem**: `.user-card-position` has `margin-right: -1rem` (desktop: `-3rem`)
and `.user-card-image` has `margin-right: -1.2rem` (desktop: `-3rem`). These
cause overlapping sections where content can be hidden behind adjacent sections,
especially on mobile.

**Fix**: Reduce negative margins significantly:
- `.user-card-position`: change `margin-right: -1rem` to `margin-right: -0.4rem`
  (desktop: from `-3rem` to `-1rem`)
- `.user-card-image`: change `margin-right: -1.2rem` to `margin-right: -0.5rem`
  (desktop: from `-3rem` to `-1.5rem`)

The intent is to keep the subtle overlap effect (angled edges visually
interlocking) but reduce it so content is not hidden.

**Impact on tests**: No existing test asserts specific `margin-right` values
on these selectors. R14 (no test failure) passes.

### 3. Clip-path on image (R6)

**Problem**: `.user-card-image` uses `clip-path: polygon(0% 0%, 70% 0%, 100% 100%, 23% 100%)`
which cuts off the top-right and bottom-left of profile images at a steep angle.

**Fix**: Widen the clip-path to be less aggressive:
`clip-path: polygon(0% 0%, 85% 0%, 100% 100%, 15% 100%)`. This preserves the
angled Eurovision aesthetic but shows more of the image.

**Alternative discarded** (see below): Using `object-fit: contain` with no
clip-path — discarded because the angled edge is part of the card's visual
identity.

**Impact on tests**: No existing test checks the specific clip-path value
on `.user-card-image`. R5/R6 tests verify the selector exists (R13) and
retains a clip-path.

### 4. Wrapper clip-path and content padding (R12)

**Problem**: `.user-card-wrapper` uses `clip-path: polygon(0% 0%, 97% 0%, 100% 100%, 3% 100%)`.
The top/bottom clipping at the angled edges, combined with `padding-top: 0.15rem`
and `padding-bottom: 0.15rem`, doesn't leave enough safe space.

**Fix**: Change wrapper padding to `padding: 0.5rem 0` (up from 0.15rem) to
ensure content stays within the visible polygon. Increase the clip-path
angles slightly if needed: `polygon(0% 0%, 96% 0%, 100% 100%, 4% 100%)`
to give more horizontal space.

**Impact on tests**: R9 checks `border-top` and `border-bottom` values on
`.user-card-wrapper` — unchanged. R12 requires the clip-path to remain.

### 5. Position section width (R4)

**Problem**: `.user-card-position` is `width: 13%`. On small cards this can be
~30–40px, which may clip "100" (3 digits) or "1st" text.

**Fix**: Increase width to `width: 14%` and set `min-width: 38px` to guarantee
space for 3-digit numbers. The font-size stays at `1.1rem` (slightly larger
for position 1 at `1.3rem`).

**Impact on tests**: R15 tests check that `.user-card-position` selector exists
— still present. No test checks the specific width percentage.

### 6. Country list spacing (R7, R16)

**Problem**: `.user-card-countries` uses `flex-wrap: wrap` with `gap: 0.2rem`
but is constrained by the fixed-height parent. Without fixed height, wrapping
works naturally.

**Fix**: Add `overflow: visible` to the countries container (removing any
potential hidden overflow) and allow it to grow into the card's natural height.
Add `padding: 0.25rem 0.5rem` for visual breathing room.

**Impact on tests**: No existing test checks overflow or padding on this
selector. All tests pass.

### 7. Responsive media query (R11)

**Problem**: The `@media (min-width: 1000px)` block currently increases
negative margins to `-3rem` which worsens overlap on desktop.

**Fix**: Adjust the desktop negative margins to smaller values as described
in #2. Preserve the media query block structure. Ensure `.country-wrapper`
margins are comfortable.

**Impact on tests**: R14 checks that `@media (min-width: 1000px)` is present
in the source file. The block is preserved.

## Test Preservation

The following existing tests are critical and MUST remain passing:

| Test | What it checks | Guarded by |
|---|---|---|
| `test_classification_view_cards_gold_border — R9` | `.user-card-wrapper` border-top/bottom with `var(--euro-gold)` | R2 |
| `test_classification_view_room_title_gold_border — R9` | `.room-title-container` border-bottom with `var(--euro-gold)` | R17 |
| `test_component_media_queries_preserved — R14` | `@media (min-width: 1000px)` in ClassificationView | R11 |
| `test_key_selectors_still_exist_in_components — R15` | `.user-card-wrapper`, `.user-card` selectors exist | R13 |
| `test_navigation_active_link_gold_border — R2` | (not ClassificationView, but no regressions) | R14 |

## Alternative Discarded

**Alternative A**: Convert the card layout to CSS Grid with explicit rows
and columns. Discarded because:
- The existing flex-based layout works well structurally and is tested
- A grid rewrite would require more extensive DOM changes, increasing risk
  of breaking R13 (selector preservation) and existing component tests
- Flex with `flex-wrap` already handles the country list correctly once
  the fixed height constraint is removed

**Alternative B**: Remove the clip-path from the wrapper entirely and use
rounded corners instead. Discarded because:
- The angled-edge clip-path is a distinctive part of the Eurovision card
  aesthetic established in the previous styling work (feature 15, 16)
- R12 explicitly requires the clip-path to remain
- The clip-path is visually referenced in R5 (position badge) and R6 (image)
  as part of the identity

**Alternative C**: Use `overflow-y: auto` on the card to scroll countries
instead of growing the card. Discarded because:
- Scrolling within a card is poor UX, especially for a leaderboard display
- The fixed-height scroll approach contradicts R1 (cards SHOULD adapt)
- The card-style competition leaderboard should show all content at a glance
