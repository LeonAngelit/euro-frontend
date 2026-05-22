# Tasks — Restyle Profile Picture

> Feature #21 — `restyle_profile_picture`

---

## Task List

- [x] **T1** — Read `src/index.css` lines 127–155 and confirm current `.profile-button` and `.profile-button img` styles.
- [x] **T2** — Read `src/components/Navigation/Navigation.vue` scoped styles (lines 249–261 and 405–413) to understand the container and responsive context.
- [x] **T3** — In `src/index.css`, remove `clip-path`, `-webkit-mask-image`, and `mask-image` from `.profile-button` (R1).
- [x] **T4** — In `src/index.css`, replace the `.profile-button` background/border with glassmorphism:
      - `background: rgba(18, 14, 40, 0.15)` (highly transparent for visible glass effect)
      - `backdrop-filter: blur(20px)` and `-webkit-backdrop-filter: blur(20px)`
      - `border: 1.5px solid rgba(255, 255, 255, 0.15)`
      - `border-radius: 12px`
      - `overflow: hidden` (R2, R3).
- [x] **T5** — In `src/index.css`, remove `-webkit-mask-image` and `mask-image` from `.profile-button img` and add `border-radius: 10px` (R1, R2).
- [x] **T6** — In `src/index.css`, update `.profile-button:hover` to add `box-shadow: 0 0 12px rgba(255, 0, 135, 0.3)` for pink glow on hover, while keeping the existing `filter: brightness(1.15)` (R4, R6).
- [x] **T7** — In `src/components/Navigation/Navigation.vue`, remove the duplicate `.profile-button:hover` rule from scoped styles (line 259–261) — the global hover rule in `index.css` covers it.
- [x] **T8** — Run `./init.sh` to verify all tests pass (R7).
- [x] **T9** — Visually verify that the profile picture renders as a glass square with rounded borders on both mobile and desktop viewports (R5).
- [x] **T10** — Visually verify that the `Form.vue` image preview (which also uses class `.profile-button`) is unaffected (scoped styles prevent leakage) (R7).
- [x] **T11** — Update `ARCHITECTURE.md` section 6.4 if the profile picture styling warrants documentation changes (R8).
- [x] **T12** — If any test in `Eurovision_styling.test.ts` references specific CSS property values of `.profile-button`, update the test expectations to match the new glass styling.

---

## Task Dependencies

```
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → T10 → T11 → T12
```
All tasks are strictly sequential.
