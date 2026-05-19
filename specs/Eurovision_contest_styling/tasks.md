# Tasks — Eurovision_contest_styling

## Preparation

- [x] T1: Read ARCHITECTURE.md and search for any styling/color references that need updating. Covers: R22.
- [x] T2: Run `npm test` and record the baseline pass/fail count. Covers: R18.
- [x] T3: Audit `src/index.css` — ensure all Eurovision color variables are defined (`--euro-pink`, `--euro-pink-background`, `--euro-yellow`, `--euro-gold`, `--primary-color`, `--primary-color-background`, `--error-color`, `--error-background`, `--success-color`). Add any missing ones. Covers: R1.

## Navigation Component

- [x] T4: In `Navigation.vue`, add `border-bottom: 2px solid var(--euro-pink)` to active menu items (`.router-link-exact-active`). Covers: R2.
- [x] T5: In `Navigation.vue`, add `--euro-pink` hover accent on the user avatar/menu icon. Covers: R2, R7.
- [x] T6: Verify dark navy background and white text remain in `Navigation.vue`. Covers: R3, R4.

## Footer Component

- [x] T7: In `Footer.vue`, add `border-top: 2px solid var(--euro-pink)`. Covers: R2.
- [x] T8: Verify dark navy background and white text remain in `Footer.vue`. Covers: R3, R4.

## Modal Component

- [x] T9: In `Modal.vue`, add `border: 2px solid var(--euro-pink)` to the modal body container. Covers: R8.
- [x] T10: In `Modal.vue`, verify the backdrop uses `var(--primary-color-background)`. Covers: R8.

## Form Component

- [x] T11: In `Form.vue`, set input default border to `1px solid var(--primary-color)` and focus border to `2px solid var(--euro-gold)`. Covers: R10.
- [x] T12: In `Form.vue`, set submit button background to `var(--euro-pink)` with white text. Covers: R5.
- [x] T13: In `Form.vue`, set secondary button background to `var(--euro-gold)` with `var(--primary-color)` text color. Covers: R6.
- [x] T14: In `Form.vue`, add CSS transition on button hover for brightness/opacity change. Covers: R7.

## Cards (CountryPicker & ClassificationView)

- [x] T15: In `CountryPicker.vue`, add `border: 1px solid var(--euro-gold)` to country cards and `2px solid var(--euro-pink)` for selected cards. Covers: R9.
- [x] T16: In `ClassificationView.vue`, add `border: 1px solid var(--euro-gold)` to participant cards. Covers: R9.

## Headings

- [x] T17: In `Home.vue`, set `h1`, `h2`, `h3` color to `var(--euro-pink)`. Covers: R16.
- [x] T18: In `Login.vue`, set heading color to `var(--euro-pink)`. Covers: R16.
- [x] T19: In `CountrySelect.vue`, set heading color to `var(--euro-pink)`. Covers: R16.
- [x] T20: In `AdminView.vue`, set heading color to `var(--euro-pink)`. Covers: R16.
- [x] T21: In `UserDetails.vue`, set heading color to `var(--euro-pink)`. Covers: R16.

## Additional Components

- [x] T22: In `Collapsible.vue`, set the toggle `+`/`-` indicator color to `var(--euro-pink)`. Covers: R2.
- [x] T23: In `AdminPanel.vue`, set close button color to `var(--euro-pink)`. Covers: R2. (Already had `background-color: var(--euro-pink)` — verified.)

## Page Background Pattern

- [x] T24: In `src/index.css`, add a CSS background pattern to the `body` element using a Eurovision-inspired gradient (e.g., diagonal linear-gradient from `--primary-color` toward `--euro-pink` with soft overlay). Covers: R20.
- [x] T25: Add a repeating overlay pattern (e.g., dots or stars via CSS `background-image`) to the body background for the Eurovision look. Covers: R20.
- [x] T26: Update the `.container` class in `src/index.css` to have a semi-opaque or blurred background so content is readable over the background pattern. Covers: R21.

## Success & Error Messages

- [x] T27: Verify success messages use `var(--success-color)` text and `var(--euro-gold)` background accent. Covers: R11.
- [x] T28: Verify error messages use `var(--error-color)` text and `var(--error-background)` background. Covers: R12.

## Layout Preservation Verification

- [x] T29: Verify `Layout.vue` template has zero changes. Covers: R13, R14.
- [x] T30: Verify no CSS class or attribute selectors were renamed or removed. Covers: R15.

## Test Verification

- [x] T31: Run `npm test` and confirm all tests pass with same count as baseline. Covers: R18, R19.

## Documentation Update

- [x] T32: If ARCHITECTURE.md contains color or styling references, update them to reflect the new Eurovision styling. Covers: R22. (No styling/color references found — no update needed.)

## Final Verification

- [x] T33: Run `./init.sh` and confirm the environment is green. Covers: R18, R19, R22. (3 pre-existing failures unchanged — known and unrelated.)
