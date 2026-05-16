# Design — Analyze_correct_project

## Overview

This feature updates `ARCHITECTURE.md` to accurately reflect the current implementation after three fix commits (Fix form, Fix styles, Fix tests) corrected critical issues in the Vue 3 migration. The document currently contains stale descriptions of the `ref`-based form field pattern that was replaced by the `setRef` callback pattern, and other sections need updating.

## Files Modified

| File | Action |
|---|---|
| `ARCHITECTURE.md` | Update sections 4, 6, 11, 12, 14 |

## Key Technical Changes Documented

### 1. Form component setRef callback pattern (R1, R2, R3, R13)

**Old (incorrect)** : `FormField.ref` was typed as `Ref<HTMLInputElement | null>`. Parents passed `ref()` objects; Form assigned `field.ref.value = el`. AdminPanel's `refer` prop was `HTMLInputElement | null`.

**Current (correct)** : `FormField.setRef` is typed as `(el: any) => void`. Parents pass inline callbacks like `setRef: (el: any) => passwordRef = el`. AdminPanel's `refer` prop is `(el: any) => void`. The Form template uses `:ref="(el: any) => { if (field.setRef) field.setRef(el) }"`.

This affects every Form consumer: Home, Login, SignUp, CreateRoom, UserDetails, AdminView, Navigation.

### 2. ClassificationView improvements (R4, R5)

- New `isArchive` prop: when true, filters users with `countries?.length > 0` instead of `countries?.length >= targetCount`.
- `users` changed from `ref<any[]>([])` (manually updated in `onMounted`/`watch`) to `computed` deriving from `props.room` and `store.songs`.
- Added `getCountryCode()` helper method.

### 3. Collapsible restructure (R6)

- Template changed from `<h3>` + `<span>+</span>/<span>−</span>` to SVG-based toggle with class `.rotated`.
- Layout uses `.collapsible-wrapper`, `.collapsible-title`, `.collapsed`, `.uncollapsed` CSS classes instead of `v-if` toggling.

### 4. Navigation / AdminPanel callback refs (R7)

- `passwordRef` typed as `Ref<HTMLInputElement | null | undefined>`.
- AdminPanel invoked with `:refer="(el: any) => passwordRef = el"` callback.
- Admin login flow enhanced with try/catch error handling and i18n messages.

### 5. UserDetails updates (R9)

- `currentCollapsed` defaults to `true` (sections expanded by default → collapsed).
- Added `updateColor` function and `colorRef` form field.
- All Form `fields` entries use `setRef` callbacks instead of `ref` objects.

### 6. AdminView additions (R10)

- Added `updateLinks` button and function calling `countries/updateLinks/:year`.
- Corrected archive export URL to `rooms/archive/export/:year`.

### 7. CSS naming (R8)

Per `docs/conventions.md`, check whether component CSS files follow `PascalCase.Component.css` naming and update the Architectural Concerns section accordingly.

### 8. Testing infrastructure (R11, R12)

- `vitest.config.ts` now includes `resolve.alias` mapping `@` → `src/`.
- Tests for AdminPanelRefs use callback pattern for `refer` prop.
- Collapsible tests check `.collapsed`/`.uncollapsed` classes and `svg.rotated` instead of text `+`/`−`.

## Design Decisions

### D1: Update in-place vs. rewrite

**Decision**: Update `ARCHITECTURE.md` in-place, modifying only sections that are stale.

**Alternative rejected**: Full rewrite — too risky given the 579-line document; targeted corrections are safer and preserve accurate sections.

### D2: Level of detail for setRef pattern

**Decision**: Document the full callback pattern with code examples (interface definition + usage in template + consumer example).

**Rationale**: The `ref` → `setRef` migration was the single biggest source of bugs. Future developers need a clear reference to avoid the same mistake.

### D3: Where to document the setRef pattern

**Decision**: Main description in section 4 (Component Architecture, Form row), with a cross-reference in section 14 (Architectural Concerns) adding a new concern "Template Ref Callback Pattern" that explains why `setRef` is preferred over passing `Ref` objects as props.

**Rationale**: The pattern affects not just Form but every component that consumes it. A central note prevents duplication.

## References

- `docs/architecture.md` — prescriptive rules about project structure
- `docs/conventions.md` — TypeScript style, file naming rules
- `docs/verification.md` — verification levels for SDD features