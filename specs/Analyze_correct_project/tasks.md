# Tasks — Analyze_correct_project

- [x] T1 — Update the Form component description in section 4 of `ARCHITECTURE.md` to document `FormField.setRef` as `(el: any) => void` callback, replacing the old `ref?: Ref<HTMLInputElement | null>` description. Include code example of `:ref="(el: any) => { if (field.setRef) field.setRef(el) }"`. Covers: R1, R13.

- [x] T2 — Update the AdminPanel component description in section 4 of `ARCHITECTURE.md` to document `refer` prop as `(el: any) => void` callback function. Covers: R2.

- [x] T3 — Add a note in section 4 (Component Architecture) or section 6 (State Management) documenting that all Form consumers (Home, Login, SignUp, CreateRoom, UserDetails, AdminView, Navigation) use the `setRef: (el: any) => someRef = el` callback pattern in their `fields` array. Covers: R3.

- [x] T4 — Update the ClassificationView description in section 4 of `ARCHITECTURE.md` to document the `isArchive` prop and its filtering behavior (`countries?.length > 0` for archive vs. `countries?.length >= targetCount` for live). Covers: R4.

- [x] T5 — Update the ClassificationView description in section 4 of `ARCHITECTURE.md` to document `users` as a `computed` property derived from `props.room` and `store.songs`, replacing the previous `ref` + `onMounted`/`watch` pattern. Add `getCountryCode` helper. Covers: R5.

- [x] T6 — Update the Collapsible description in section 4 of `ARCHITECTURE.md` to document the SVG-based toggle (`svg.rotated` class), `.collapsible-wrapper`/`.collapsible-title`/`.collapsed`/`.uncollapsed` CSS classes, replacing the previous `v-if` + `<span>+</span>/<span>−</span>` description. Covers: R6.

- [x] T7 — Update the Navigation description in section 4 or section 11 of `ARCHITECTURE.md` to document `passwordRef` as `Ref<HTMLInputElement | null | undefined>` and the callback pattern `:refer="(el: any) => passwordRef = el"`. Document the enhanced `loginAdmin` error handling with try/catch and i18n messages. Covers: R7.

- [x] T8 — Review current CSS file naming in `src/` and update section 14 (Architectural Concerns) of `ARCHITECTURE.md` to reflect whether CSS naming inconsistencies persist or are resolved. List current naming conventions with actual file names. Covers: R8.

- [x] T9 — Update the UserDetails view description in section 4 of `ARCHITECTURE.md` to document: `currentCollapsed` defaulting to `true`, `updateColor` function, `colorRef` field, and `setRef` callback pattern for all form fields. Covers: R9.

- [x] T10 — Update the AdminView description in section 4 of `ARCHITECTURE.md` to document `updateLinks` button/function (calls `countries/updateLinks/:year`) and the corrected archive export URL (`rooms/archive/export/:year`). Covers: R10.

- [x] T11 — Add a subsection under section 14 (Architectural Concerns) of `ARCHITECTURE.md` titled "Template Ref Callback Pattern" explaining that `setRef` callbacks are the established pattern for capturing DOM element references in Form fields, and passing `Ref` objects as props SHALL be avoided. Cross-reference section 4 Form description. Covers: R13.

- [x] T12 — Update section 12 (Testing Strategy) of `ARCHITECTURE.md` to document the `vitest.config.ts` path alias `@` → `src/` and note that tests for components using Form must use the callback pattern for `refer`/`setRef` props. Covers: R11, R12.

- [x] T13 — Verify `ARCHITECTURE.md` no longer contains any reference to the old `field.ref` / `field.ref.value` / `Ref<HTMLInputElement>` pattern in the Form component context (section 4 Form row and any other mentions). Use grep to confirm. Covers: R13.

- [x] T14 — Run `./init.sh` and confirm all tests pass. If any test needs updating to match the documented patterns, update it. Covers: R1–R13.
