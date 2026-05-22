# Requirements — Restyle Profile Picture

> Feature #21 — `restyle_profile_picture`

## EARS Notation

| Prefix | Meaning                     |
|--------|-----------------------------|
| [U]    | Ubiquitous                  |
| [E]    | Event-driven                |
| [S]    | State-driven                |
| [U]    | Unwanted (optional section) |

---

## Functional Requirements

### R1 — Remove clip-path polygon (Ubiquitous)
[U] The `.profile-button` class in `src/index.css` **shall not** use a `clip-path` or `-webkit-clip-path` property to clip the profile picture.

### R2 — Rounded square shape (Ubiquitous)
[U] The profile picture container **shall** be rendered as a square with rounded corners using `border-radius`, replacing the current clipped polygon shape.

### R3 — Glassmorphism background (Ubiquitous)
[U] The profile picture container **shall** apply a glassmorphism effect consisting of:
  - `backdrop-filter: blur(Npx)` for frosted glass blur
  - `-webkit-backdrop-filter: blur(Npx)` for Safari compatibility
  - A semi-transparent background (e.g., `rgba(18, 14, 40, opacity)`)
  - A subtle glass border (`border: 1px solid rgba(255, 255, 255, 0.1)`)

### R4 — Eurovision theme colors (Ubiquitous)
[U] The glass square **shall** use Eurovision theme accent colors:
  - A pink or gold border glow (`box-shadow` with `var(--euro-pink)` or `var(--euro-gold)`)
  - The image itself must remain visible through the glass effect without color distortion

### R5 — Responsive behavior (Ubiquitous)
[U] The profile picture container **shall** adapt its size to the available space in the Navigation bar:
  - On mobile (`< 600px`): fit within the default `profile-button-container` width (`15%`)
  - On desktop (`>= 1000px`): fit within the narrower `profile-button-container` width (`5%`)
  - The aspect ratio must remain 1:1 (square)

### R6 — Preserve hover effects (Ubiquitous)
[U] The `.profile-button:hover` state **shall** remain functional and tasteful, with a smooth transition effect (e.g., brightness increase, glow increase, or subtle lift).

### R7 — No breaking changes (Ubiquitous)
[U] The restyling of `.profile-button` **shall not** break:
  - Any other component that references `.profile-button` (including `Form.vue` which uses the same classname for the image preview)
  - The `Eurovision_styling.test.ts` test that checks for the `.profile-button` selector's existence
  - Any existing tests

### R8 — Update documentation (Event-driven)
[E] When the restyling is complete, `ARCHITECTURE.md` **shall** be updated if the changes affect documented styling patterns or component appearance.

---

## Unwanted Behaviors (R9)

[U] The following behaviors **shall not** occur:
  - R9.1 The profile picture **shall not** appear clipped or cropped by non-standard shapes
  - R9.2 The glass effect **shall not** make the image unreadable or overly dark
  - R9.3 The button **shall not** lose its clickable area or accessibility
  - R9.4 The `Form.vue` image preview (which also uses class `.profile-button`) **shall not** be affected by the Navigation style changes, since `Form.vue` uses inline styles and its own scoped context
