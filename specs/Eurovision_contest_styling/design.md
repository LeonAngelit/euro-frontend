# Design — Eurovision_contest_styling

## 1. Overview

This feature updates the application's visual identity to match the Eurovision contest branding while preserving the existing layout and component hierarchy. Changes are strictly CSS-level — no JavaScript logic, no DOM restructuring, no route changes.

## 2. CSS Variables Strategy

### 2.1 Variables to add to `src/index.css`

All relevant Eurovision colors already exist in `src/index.css` but are underused. No new variables are needed. The implementation will shift component styles to reference the existing Eurovision variables.

Current relevant variables:
```css
--euro-pink: rgb(255, 0, 135);
--euro-pink-background: rgb(255, 0, 135, 0.5);
--euro-yellow: rgb(255, 248, 0);
--euro-gold: rgb(218, 183, 29);
--primary-color: rgb(2, 2, 94);
--primary-color-background: rgb(0, 67, 255, 0.4);
--error-color: rgb(164, 8, 8);
--error-background: rgb(164, 8, 8, 0.3);
--success-color: rgb(154 229 148);
```

### 2.2 Variables to modify in `src/index.css`

None. The existing variables are correct; only component scoped styles will change to reference them.

## 3. Files Modified

| File | Change | R Coverage |
|---|---|---|
| `src/index.css` | Add any missing color token definitions; ensure all Eurovision colors are defined at root | R1 |
| `src/components/Navigation/Navigation.vue` | Add Eurovision accent colors to active/selected menu items; keep dark navy bg + white text; add `--euro-pink` border or underline on active links | R2, R3, R4, R17 |
| `src/components/Footer/Footer.vue` | Keep dark navy bg + white text; add `--euro-pink` top border accent | R2, R3, R4 |
| `src/components/Modal/Modal.vue` | Add `--euro-pink` border accent to modal body; keep `--primary-color-background` backdrop | R8 |
| `src/components/Form/Form.vue` | Update input focus border to `--euro-gold`; update submit button to `--euro-pink` background | R5, R10 |
| `src/components/CountryPicker/CountryPicker.vue` | Update card borders to `--euro-gold`; update Continue button to `--euro-pink` | R5, R9 |
| `src/components/ClassificationView/ClassificationView.vue` | Update card styling with `--euro-gold` borders and `--euro-pink` headings | R9, R16 |
| `src/views/App/Home.vue` | Update heading colors to `--euro-pink` | R16 |
| `src/views/Login/Login.vue` | Update heading colors to `--euro-pink` | R16 |
| `src/views/CountrySelection/CountrySelect.vue` | Update heading colors to `--euro-pink`; update any buttons | R5, R16 |
| `src/views/AdminView/AdminView.vue` | Update heading colors to `--euro-pink` | R16 |
| `src/views/UserDetails/UserDetails.vue` | Update heading colors to `--euro-pink` | R16 |
| `src/components/Collapsible/Collapsible.vue` | Update toggle indicator color to `--euro-pink` | R2 |
| `src/components/AdminPanel/AdminPanel.vue` | Update close button and heading to `--euro-pink` | R2 |
| `src/index.css` (body) | Add Eurovision background pattern (gradient + overlay) to body | R20, R21 |
| View container wrappers (`.container` global style) | Add semi-opaque background to ensure content readability over the background pattern | R20, R21 |

## 4. Layout Preservation Strategy

- **No DOM changes**: All modifications are CSS-only (`<style scoped>` block changes or class additions).
- **No class renames**: Existing CSS class and attribute selectors are not renamed or removed — unit tests relying on selectors continue to work.
- **No responsive breakpoint changes**: Media queries and flex/grid values remain untouched.
- **No component reordering**: The `Layout.vue` template is not modified.

## 5. Test Compatibility Strategy

| Concern | Mitigation |
|---|---|
| Tests relying on specific CSS class names | No CSS classes are renamed or removed; only new styles are added |
| Tests checking computed styles (e.g., color) | If tests assert specific color values, they may need updating; check each test before modifying |
| Snapshot tests | If snapshots include inline styles, they will need regeneration (`--update` flag); however, this project uses behavior-based tests (no snapshots) |
| Logic tests | Styling changes never touch `<script setup>` blocks — zero impact on logic |

### 5.1 Verification procedure

1. Run `npm test` before changes — record pass/fail baseline.
2. Make styling changes.
3. Run `npm test` — all existing tests must pass.
4. Update any test that asserts a specific color value if that color intentionally changed (rare — most tests check behavior, not visual style).

## 6. Detailed Component Styling Plan

### 6.1 Navigation (`Navigation.vue`)
- Keep `<nav>` background: `var(--primary-color)` (dark navy)
- Keep text: white
- Add `--euro-pink` bottom border to active menu item (`.router-link-exact-active` or active class)
- Add `--euro-pink` accent to user avatar/menu icon on hover
- Star icons (already present via mdi:star): no change needed

### 6.2 Footer (`Footer.vue`)
- Keep `<footer>` background: `var(--primary-color)` (dark navy)
- Keep text: white
- Add `2px solid var(--euro-pink)` border-top

### 6.3 Modal (`Modal.vue`)
- `.modal-backdrop`: keep `var(--primary-color-background)`
- `.modal-body` or equivalent: add `2px solid var(--euro-pink)` border; add `var(--euro-pink)` subtle glow on confirm button if present
- `.modal-close-button` or equivalent: color `var(--euro-pink)`

### 6.4 Form inputs (`Form.vue`)
- Input default border: `1px solid var(--primary-color)`
- Input focus border: `2px solid var(--euro-gold)`
- Submit button: background `var(--euro-pink)`, white text, hover dim/brighten effect
- Secondary buttons: background `var(--euro-gold)`, dark navy text

### 6.5 Cards (`CountryPicker.vue`, `ClassificationView.vue`)
- Card container: `1px solid var(--euro-gold)`, slight border-radius, background slightly lighter than page
- Selected/highlighted card: `2px solid var(--euro-pink)`

### 6.6 Headings (all views)
- View-level `h1`, `h2`, `h3`: color `var(--euro-pink)`
- Exception: headings inside Navigation remain white

### 6.7 Page Background Pattern
- Add a CSS `background` property to `body` (via `src/index.css`) using a linear-gradient or repeating-conic-gradient pattern that evokes the Eurovision brand
- Recommended approach: a subtle diagonal linear-gradient from `--primary-color` (dark navy) toward `--euro-pink` with a soft fade, overlaid with a repeating star or dot pattern using CSS `background-image` layers
- Alternative acceptable approach: a more subtle dark navy body background with `--euro-pink` and `--euro-gold` decorative accents (e.g., a soft radial gradient glow in one corner)
- Ensure `.container` and other content wrappers have opaque or semi-opaque backgrounds so text remains readable (use `backdrop-filter: blur()` or `background: rgba(255,255,255,0.9)` as needed)
- The pattern MUST NOT interfere with the Navigation header or Footer — they keep their solid `--primary-color` background

### 6.8 Buttons globally
- `.btn-primary` background: `var(--euro-pink)`, white text
- `.btn-secondary` background: `var(--euro-gold)`, `var(--primary-color)` text
- Apply a hover transition (opacity or filter brightness)

## 7. Alternative Designs Considered

| Alternative | Why Rejected |
|---|---|
| Full visual redesign (new layout, new fonts, animated backgrounds) | Out of scope — acceptance criteria explicitly require keeping the current layout. Risk of breaking tests and overwhelming scope. |
| Replace dark navy entirely with pink/gold | Would make header/footer text hard to read and lose brand contrast. Dark navy as background + pink as accent is the correct Eurovision brand application. |
| Replace icon library with custom Eurovision-themed SVGs | Unnecessary complexity. Existing icon libraries (Font Awesome, Material Design Icons) suffice. |
| Add gradient backgrounds or animated star fields | Would increase bundle size and render cost. Tests would need visual regression infrastructure. Keep changes minimal. |
| Use CSS modules or CSS-in-JS to isolate styles | Project uses `<style scoped>` consistently; introducing a new CSS paradigm would be disproportionate. |
| New color variables (e.g., `--euro-star-glow`) | Existing variables are sufficient. Adding more creates maintenance debt. |
| Subtle solid background color (e.g., light pink or light navy) instead of a patterned background | A solid color does not convey the "Eurovision identity" sufficiently. A gradient or pattern makes the branding more distinctive while keeping the layout unchanged. |
| Animated/canvas-based background (e.g., falling stars, particle effects) | Would increase bundle size, degrade performance, and risk test instability. CSS-only background patterns are lightweight and deterministic. |

## 8. ARCHITECTURE.md Update

The `ARCHITECTURE.md` file in section 11 (Layout Shell) may reference the styling approach. If it does, update the relevant section to note the Eurovision color scheme. If it does not mention specific colors, no update is needed — verify before closing.
