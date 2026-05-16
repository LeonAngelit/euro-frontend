# Requirements — Analyze_correct_project

## R1
The ARCHITECTURE.md file SHALL reflect the correct `setRef` callback pattern used by the `Form` component's `FormField` interface, where `setRef?: (el: any) => void` replaces the previous `ref?: HTMLInputElement | null` / `ref?: Ref<HTMLInputElement | null>` approach.

## R2
The ARCHITECTURE.md file SHALL document the `AdminPanel` component's `refer` prop as a callback function `(el: any) => void` that passes a DOM element capture callback to `Form`, rather than a `Ref` object or raw `HTMLInputElement`.

## R3
The ARCHITECTURE.md file SHALL document that all views and components consuming `Form` (Home, Login, SignUp, CreateRoom, UserDetails, AdminView, Navigation) use the `setRef: (el: any) => someRef = el` callback pattern in their `fields` array to capture DOM element references.

## R4
The ARCHITECTURE.md file SHALL document the `ClassificationView` component's `isArchive` prop and its effect on user filtering logic (archive mode filters users with `countries?.length > 0` instead of `countries?.length >= targetCount`).

## R5
The ARCHITECTURE.md file SHALL document the `ClassificationView` component's use of `computed` for the `users` list rather than a reactive `ref` updated in `onMounted`/`watch`, explaining that reactivity is now derived from props and store state.

## R6
The ARCHITECTURE.md file SHALL document the `Collapsible` component's updated structure: `collapsible-wrapper` root, CSS-driven toggle via `.collapsed`/`.uncollapsed` classes and `svg.rotated`, replacing the previous `v-if` conditional and text-based `+`/`−` indicators.

## R7
The ARCHITECTURE.md file SHALL document the `Navigation` component's `passwordRef` as `Ref<HTMLInputElement | null | undefined>` and its use of the callback pattern `:refer="(el: any) => passwordRef = el"` to pass the ref capture function to AdminPanel.

## R8
The ARCHITECTURE.md file SHALL update the Architectural Concerns section to reflect that the CSS naming inconsistency concern is partially resolved (if any files were renamed) or still present (if naming remains mixed), based on actual file names in the repository.

## R9
The ARCHITECTURE.md file SHALL document the `UserDetails` view's updated layout structure, including the addition of `updateColor` function, `colorRef`, `currentCollapsed` defaulting to `true`, and the `setRef` callback pattern for all form fields.

## R10
The ARCHITECTURE.md file SHALL document the `AdminView` component's `updateLinks` button/function and the corrected archive export URL pattern (`rooms/archive/export/` instead of `archive/results/`).

## R11
WHEN a test file references component DOM structure or prop types, the test code SHALL use the callback pattern `refer: (el: any) => { passwordRef.value = el }` instead of passing a `Ref` object directly, matching the current component interfaces.

## R12
The ARCHITECTURE.md file SHALL document the `vitest.config.ts` path alias configuration (`@` → `src/`) as part of the Testing Strategy section.

## R13
The ARCHITECTURE.md file SHALL NOT contain descriptions of the old `ref`/`field.ref`/`field.ref.value` pattern in the Form component — all references SHALL describe the current `setRef` callback pattern.