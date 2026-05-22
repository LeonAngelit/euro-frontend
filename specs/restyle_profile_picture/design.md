# Design — Restyle Profile Picture

> Feature #21 — `restyle_profile_picture`

## Overview

Replace the polygon-clipped profile picture in the Navigation component with a glassmorphism square with rounded borders, matching the Eurovision visual identity pattern already established in `UserCard.vue`.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/index.css` (lines 127–155) | Remove `clip-path` and `mask-image` from `.profile-button`; replace with glassmorphism styles |
| `src/components/Navigation/Navigation.vue` (scoped styles) | Adjust `.profile-button` hover and `.profile-button-container` if needed for the new visual |
| `ARCHITECTURE.md` (if needed) | Update section 6.4 (Navigation) to reflect the new profile picture styling |

---

## CSS Changes

### 1. Remove clip-path and mask-image from `.profile-button` in `src/index.css`

**Current (lines 127–141):**
```css
.profile-button {
  display: flex;
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 20% 100%);
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  transition: filter 0.2s ease;
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 100%);
  mask-image: radial-gradient(circle, black 60%, transparent 100%);
}
```

**Proposed:**
```css
.profile-button {
  display: flex;
  width: 100%;
  height: 100%;
  background: rgba(18, 14, 40, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  transition: all 0.2s ease;
  overflow: hidden;
}
```

### 2. Remove mask-image from `.profile-button img` in `src/index.css`

**Current (lines 148–155):**
```css
.profile-button img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  display: block;
  -webkit-mask-image: radial-gradient(circle, black 50%, transparent 100%);
  mask-image: radial-gradient(circle, black 60%, transparent 100%);
}
```

**Proposed:**
```css
.profile-button img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  display: block;
  border-radius: 10px;
}
```

The `border-radius: 10px` on the `<img>` ensures the image respects the container's rounded corners without overflowing.

### 3. Update `.profile-button:hover` in `src/index.css`

**Current (lines 143–146):**
```css
.profile-button:hover {
  filter: brightness(1.15);
  cursor: pointer;
}
```

**Proposed (preserve brightness filter, add subtle glow):**
```css
.profile-button:hover {
  filter: brightness(1.15);
  cursor: pointer;
  box-shadow: 0 0 12px rgba(255, 0, 135, 0.3);
}
```

### 4. Remove duplicate hover in `Navigation.vue` scoped styles (lines 259–261)

The scoped hover rule in `Navigation.vue` only sets `cursor: pointer`. Since the global `index.css` hover rule already handles this, the scoped version can be removed to avoid duplication.

---

## Glassmorphism Pattern Reference

The existing `UserCard.vue` glassmorphism pattern (`.user-card`, lines 120–133) serves as the template:

```css
.user-card {
  border-radius: 15px;
  background: rgba(18, 14, 40, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
```

The profile picture uses a **subtler version** with `backdrop-filter: blur(8px)` (less blur on such a small element) and slightly less opaque background `rgba(18, 14, 40, 0.6)`.

---

## Dimensions

- The button is `100%` of its container (`.profile-button-container`)
- Container is `15%` of header width on mobile + desktop by default, `5%` on `>= 1000px`
- Minimum width: `48px` (already set on `.profile-button-container`)
- The glass square inherits these dimensions and remains a 1:1 square via `aspect-ratio: 1 / 1` or the container's implicit height constraints

---

## Hover Effect Design

| State  | Effect                                    |
|--------|-------------------------------------------|
| Normal | Glass square with border-radius, semi-transparent bg, subtle border |
| Hover  | Brightness `1.15` + pink glow `box-shadow: 0 0 12px rgba(255,0,135,0.3)` |
| Active | (No change needed — button behavior unaffected) |

---

## Traceability

| Requirement | Implementation File             | CSS Properties Changed                |
|-------------|---------------------------------|---------------------------------------|
| R1          | `src/index.css`                 | Remove `clip-path`, `mask-image`      |
| R2          | `src/index.css`                 | Add `border-radius: 12px` on button, `border-radius: 10px` on img |
| R3          | `src/index.css`                 | Add `backdrop-filter`, `background`, `border` with glass values |
| R4          | `src/index.css`                 | Pink glow `box-shadow` on hover using `var(--euro-pink)` |
| R5          | `src/index.css` + `Navigation.vue` | Container width changes via existing responsive breakpoints |
| R6          | `src/index.css`                 | Preserve `filter: brightness(1.15)`, add `box-shadow` on hover |
| R7          | —                               | No changes to other components; scoped styles prevent leaks |
| R8          | `ARCHITECTURE.md`               | Update section 6.4 if needed          |
