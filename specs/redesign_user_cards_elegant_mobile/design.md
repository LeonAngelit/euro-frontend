# Design — Redesign User Cards (Elegant Mobile-First)

## Files Modified

| File | Action | Reason |
|------|--------|--------|
| `src/components/ClassificationView/ClassificationView.vue` | **Remove** conflicting scoped styles | Lines 83-120 (.user-card-wrapper, .user-card, .user-card-position, .user-card-image, .user-card-data, .user-card-info, .user-card-total, .user-card-countries, .country-wrapper, .user-winner, .animate, @keyframes) are dead/conflicting code |
| `src/components/ClassificationView/UserCard.vue` | **Refine** existing scoped styles | Update layout for mobile-first, preserve glassmorphism, ensure all content visible |

No new files are created.

---

## What to Remove from ClassificationView.vue

The following scoped style blocks in ClassificationView.vue must be **removed entirely**:

1. `.user-card-wrapper` block (lines 83-99) — contains `clip-path`, conflicting borders/background
2. `.user-card-wrapper:hover` block (lines 101-106) — should be in UserCard.vue
3. `.user-card-wrapper:has(.pos-*)` blocks (lines 109-120) — should be in UserCard.vue
4. `.user-card` block (lines 142-147) — entirely UserCard.vue responsibility
5. `.animate` block and `@keyframes slide-in-left` (lines 149-163) — UserCard.vue already has its own
6. `.user-card-position` and `.pos-*` blocks (lines 165-195) — UserCard.vue already has `.position-badge`
7. `.user-card-image` block (lines 197-218) — UserCard.vue already has `.avatar-container`
8. `.user-card-data` block (lines 220-226) — UserCard.vue's template structure is different
9. `.user-card-info` block (lines 228-246) — not used in UserCard.vue template
10. `.user-card-total` block (lines 248-270) — UserCard.vue has its own total styling
11. `.user-card-countries` and `.country-wrapper` blocks (lines 277-300) — UserCard.vue has `.user-card-countries` and `.country-chip`
12. `.user-winner` block (lines 302-314) — UserCard.vue has its own `.user-winner`

**Retain unchanged:**
- `.room-title-container` and `.room-title-container h2` (lines 122-140)
- `.classification-container` (line 64 in template)
- `.users-container` (line 70 in template)
- `@media (min-width: 1000px)` rule for `.country-wrapper` and h2 (lines 316-325) — already removed along with `.country-wrapper`
- The `<style src="flag-icons/css/flag-icons.min.css"></style>` import

**Net effect:** After cleanup, ClassificationView.vue's `<style scoped>` will contain only `.room-title-container` and `.room-title-container h2` styles (plus the flag-icons import).

---

## Template Structure (UserCard.vue)

The existing template structure is already well-organized and only needs refinement:

```
.user-card-wrapper (root element)
  .user-card-glow (ambient backing glow)
  .user-card (glassmorphism body)
    .user-card-color-overlay (user's color preference overlay)
    .user-card-header
      .header-left
        .position-badge (rank number)
        .avatar-container (profile picture)
        .username-container (username)
      .header-right
        .user-card-total (total score badge)
    .user-card-divider (subtle separator)
    .user-card-countries
      .country-chip (repeated for each country)
        .country-flag (flag-icon)
        .country-points (points number)
```

**Changes to refine:**
1. No structural template changes needed — the current template is sound.
2. Ensure the root element `.user-card-wrapper` does NOT rely on any parent styling.

---

## CSS Grid/Flex Layout

### Mobile (< 768px) — Default
```css
.user-card-wrapper {
  position: relative;
  width: 100%;
  border-radius: 16px;
  padding: 1px;
  /* gradient border effect, no clip-path */
}
.user-card {
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  padding: 0.75rem;
}
.user-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.user-card-countries {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.country-chip {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
```

### Desktop (>= 768px)
```css
.user-card {
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}
.user-card-header {
  width: auto;
  flex: 1;
  justify-content: flex-start;
}
.user-card-countries {
  flex: 2;
}
.user-card-divider {
  display: none;
}
```

This is already implemented in UserCard.vue at lines 449-489 — it should be preserved and confirmed working after the parent styles are removed.

---

## How Flags Are Displayed Alongside Points

Each country is rendered as a `.country-chip` using flex layout:
- `.country-flag` — uses the `flag-icons` library (`fi fi-{code}` classes) for a square flag icon
- `.country-points` — the numeric points value, displayed immediately after the flag with `gap: 0.3rem`

The flag and points are siblings inside a flex row, ensuring they always appear side-by-side. The `.country-chip` is wrapped in the `.user-card-countries` flex container that wraps to new lines as needed. Winner picks are highlighted with gold background/border; tail picks with blue.

No changes needed to this structure. The key is ensuring no parent `clip-path` clips these chips.

---

## Mobile-First Approach

- **Default styles** (no media query) target mobile: single column, stacked layout, compact padding
- **`@media (min-width: 768px)`** shifts to horizontal: header and countries side-by-side
- Touch targets: `.country-chip` has adequate padding for finger taps
- Font sizes are kept readable at mobile scale (0.8rem–1rem)
- The animation `slide-in-left` is lightweight, suitable for mobile GPUs

---

## Eurovision Visual Identity Refinements

The current UserCard.vue already uses:
- Gold gradients for 1st position badge and gold border on avatar
- Pink accents for score badge
- Dark navy background (`#120e28`) with glassmorphism
- Glow effects on hover

**Refinements to apply:**
- Ensure the `.user-card-wrapper` gradient border effect is visible after parent style removal (the parent was overriding it with its own borders)
- The 1st place card should retain its gold gradient border without being overridden by the parent's gold border-top
- All `!important` overrides in UserCard.vue (e.g., `.pos-1` background) should be evaluated — some may have been added to fight parent specificity and could be simplified

---

## Alternative Considered and Discarded

### Alternative A — Keep clip-path but enlarge it
We considered keeping the clip-path polygon but expanding its vertices to 2% / 98% instead of 4% / 96% to reduce clipping. This was discarded because:
1. Even with a wider polygon, content near the top/bottom edges (flags in wrapped rows, avatar) could still be clipped.
2. The clip-path creates a diamond/parallelogram shape that is inconsistent with the elegant, refined look we want.
3. Clip-path prevents proper use of `border-radius` for a soft, modern appearance.
4. The Eurovision styling tests (from feature 16) may not test for clip-path existence, but the aesthetic goal demands clean rectangular cards with rounded corners.

### Alternative B — Refactor UserCard as a Web Component
Discarded: Overkill for a single card component. The Vue SFC pattern with scoped styles provides sufficient isolation when parent styles are removed.

### Alternative C — Deep selector overrides
Discarded: Using `:deep()` in UserCard.vue to override parent styles would be fighting the framework. The correct fix is to remove the conflicting parent styles entirely.
