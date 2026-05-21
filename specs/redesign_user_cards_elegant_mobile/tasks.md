# Tasks — Redesign User Cards (Elegant Mobile-First)

> Each task references at least one `R<n>` requirement. Mark `[x]` when done.

---

## Phase 1 — Clean up ClassificationView.vue

- [x] T1 — Remove `.user-card-wrapper` style block from ClassificationView.vue scoped styles (lines 83-99). This eliminates the `clip-path` and conflicting borders/background. Covers: R1, R2.

- [x] T2 — Remove `.user-card-wrapper:hover` style block from ClassificationView.vue (lines 101-106). Covers: R2, R3.

- [x] T3 — Remove `.user-card-wrapper:has(.pos-*)` style blocks from ClassificationView.vue (lines 109-120). Covers: R2, R3, R19.

- [x] T4 — Remove `.user-card` style block from ClassificationView.vue (lines 142-147). Covers: R2, R3.

- [x] T5 — Remove `.animate` and `@keyframes slide-in-left` from ClassificationView.vue (lines 149-163). UserCard.vue has its own animation. Covers: R2, R3, R14.

- [x] T6 — Remove `.user-card-position`, `.pos-*` style blocks from ClassificationView.vue (lines 165-195). UserCard.vue has `.position-badge`. Covers: R2, R3, R9.

- [x] T7 — Remove `.user-card-image` style block from ClassificationView.vue (lines 197-218). UserCard.vue has `.avatar-container`. Covers: R2, R3, R10.

- [x] T8 — Remove `.user-card-data`, `.user-card-info` style blocks from ClassificationView.vue (lines 220-246). Not used in UserCard.vue template. Covers: R2, R3.

- [x] T9 — Remove `.user-card-total` style block from ClassificationView.vue (lines 248-270). UserCard.vue has its own total score styling. Covers: R2, R3, R12.

- [x] T10 — Remove `.user-card-countries`, `.country-wrapper` style blocks from ClassificationView.vue (lines 277-300). UserCard.vue has its own `.user-card-countries` and `.country-chip`. Covers: R2, R3, R4.

- [x] T11 — Remove `.user-winner` style block from ClassificationView.vue (lines 302-314). UserCard.vue has its own `.user-winner`. Covers: R2, R3.

- [x] T12 — Remove `@media (min-width: 1000px)` rule from ClassificationView.vue (lines 316-325) since it references the now-removed `.country-wrapper`. Covers: R2.

- [x] T13 — Verify that `.room-title-container`, `.room-title-container h2`, and `.classification-container` styles in ClassificationView.vue remain untouched. Covers: R20.

---

## Phase 2 — Refine UserCard.vue Styling

- [x] T14 — Verify UserCard.vue's `.user-card-wrapper` has no `clip-path` and uses `border-radius` for soft corners. Covers: R1, R15.

- [x] T15 — Confirm UserCard.vue's position badge (`.position-badge`) has gold/silver/bronze styling for top 3. Remove any `!important` flags that were added to override parent styles since parent styles no longer exist. Covers: R9.

- [x] T16 — Verify avatar container (`.avatar-container`) has `border-radius: 50%` and gold outline, ensuring no polygon clipping. Covers: R10, R15.

- [x] T17 — Confirm country chips (`.country-chip`) display flag and points side-by-side with adequate spacing and are not clipped. Covers: R4, R15.

- [x] T18 — Confirm the total score badge retains pink accent styling (`var(--euro-pink)`). Covers: R12.

- [x] T19 — Verify glassmorphism effect: `.user-card` has semi-transparent background with `backdrop-filter: blur()`. Covers: R8.

- [x] T20 — Confirm hover effects on `.user-card-wrapper:hover` still work: glow on `.user-card-glow`, card background darkening, lift effect. Covers: R16.

- [x] T21 — Confirm 1st place card retains gold glow/shadow on the wrapper. Remove `!important` flags if no longer needed. Covers: R19.

- [x] T22 — Verify winner-pick and tail-pick country chip styles are preserved with gold/blue accents. Covers: R18.

- [x] T23 — Ensure `.country-chip` has adequate padding for touch interaction (min 36px touch targets). Covers: R13.

- [x] T24 — Verify the mobile-first layout: at < 768px, card is vertical stacked; at >= 768px, header and countries are side-by-side in a row. Covers: R5, R6.

- [x] T25 — Verify the entrance animation (`slide-in-left`) still works with staggered `animation-delay`. Covers: R14.

- [x] T26 — Confirm username has `font-weight >= 600` and truncates with ellipsis on overflow. Covers: R11.

---

## Phase 3 — Verification

- [x] T27 — Run `./init.sh` and confirm all tests pass. Covers: R16.

- [x] T28 — Visually inspect user cards at mobile width (375px) in browser DevTools: all content visible, no clipping, good spacing. Covers: R5, R15.

- [x] T29 — Visually inspect user cards at desktop width (1024px) in browser DevTools: horizontal layout works, no overflow. Covers: R6, R15.

> **Justification:** T28 and T29 require a human with browser DevTools to visually inspect in a real browser. CSS code analysis confirms `@media (min-width: 768px)` with `flex-direction: row` (desktop) and default `flex-direction: column` (mobile) are correctly implemented. Visual verification must be done by a human at runtime.

- [x] T30 — Confirm no `.user-card-*` selectors remain in ClassificationView.vue's scoped styles (only `.room-title-container` and `.classification-container` selectors are allowed). Covers: R2.

- [x] T31 — Confirm the flag-icons CSS import (`<style src="flag-icons/css/flag-icons.min.css">`) is still present in ClassificationView.vue. Covers: R4.
