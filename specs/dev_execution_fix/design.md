# dev_execution_fix — Design

## Problem Summary

The project was migrated from React to Vue 3 (Feature 2). The migration
left several structural issues that crash the dev server and produce
TypeScript errors.

## Root Causes

### RC-1: `<style>` inside `<template>` (Form.vue, RoomPicker.vue)

Two Vue SFCs have their `<style>` tag placed *inside* the outer
`<template>` block. Vue 3 requires `<style>` to be a top-level SFC
block. When HMR encounters this, it crashes with:
```
Tags with side effect (<script> and <style>) are ignored in client
component templates.
```

**Files affected:**
- `src/components/Form/Form.vue` (line 122)
- `src/components/RoomPicker/RoomPicker.vue` (line 265)

**Fix:** Move each `<style>` tag to after the closing `</template>` tag
so it becomes a top-level SFC block. Also restore the template content
that was displaced after the `<style>` tag — the remaining HTML
elements (checkbox, error message, submit button in Form.vue; the
closing `</div>` in RoomPicker.vue) must stay inside `<template>`.

### RC-2: Missing `"node"` type in tsconfig

`tsconfig.json` has `"types": ["vue"]` which excludes `@types/node`.
The CLI subsystem files (`cli.ts`, `storage.ts`, `prompts.ts`,
`notes.ts`, `features.ts`) use `process`, `node:fs/promises`,
`node:path`, `node:crypto`, and the `NodeJS` namespace. This produces
~15 `vue-tsc --noEmit` errors.

**Fix:** Add `"node"` to the `types` array:
```json
"types": ["vue", "node"]
```

**Discarded alternative:** Create a separate `tsconfig.cli.json` for
the Node.js entry points and exclude them from the browser tsconfig.
Rejected because it adds configuration complexity for a project where
the CLI files are already included in the `include` path and `vite
build` already ignores them. A single tsconfig with both types is
simpler and sufficient.

### RC-3: `library.add()` void return called as function (main.ts)

Line 18 of `src/main.ts`:
```typescript
library.add(faEye, faEyeSlash, faStar)(window as any).Buffer = ...
```
`library.add()` returns `void`. The parenthesised `(window as any)`
is incorrectly part of the same expression, attempting to call `void`
as a function. This is a migration artifact where two statements were
merged into one.

**Fix:** Split into two statements:
```typescript
library.add(faEye, faEyeSlash, faStar);
(window as any).Buffer = (window as any).Buffer || Buffer;
```

### RC-4: Unsafe optional chain comparison (RoomPicker.vue)

`src/components/RoomPicker/RoomPicker.vue` template:
```html
<template v-if="props.rooms?.length > 0">
```
Under `strictNullChecks`, `props.rooms?.length` yields
`number | undefined`, and comparing `undefined > 0` is not type-safe.

**Fix:** Use a null guard:
```html
<template v-if="props.rooms && props.rooms.length > 0">
```

### RC-5: No build test

The acceptance criteria require a test verifying `vite build` succeeds. No
such test exists.

**Fix:** Add `tests/build.test.ts` that invokes `vite build` via
`spawnSync` and asserts exit code 0.

**Discarded alternative:** Use `execa` or a similar npm package.
Rejected to avoid adding a runtime dependency; `spawnSync` from
`node:child_process` is sufficient.

## Files Modified

| File | Change |
|------|--------|
| `src/components/Form/Form.vue` | Move `<style>` outside `<template>` |
| `src/components/RoomPicker/RoomPicker.vue` | Move `<style>` outside `<template>`; fix optional chain comparison |
| `src/main.ts` | Split `library.add()...` into two statements |
| `tsconfig.json` | Add `"node"` to `types` array |
| `tests/build.test.ts` | New file: build verification test |
| `ARCHITECTURE.md` | Update after fixes are verified |

## Verification Plan

1. `npm run dev` starts without crashing (R1, R7)
2. `npx vue-tsc --noEmit` exits 0 (R2, R3, R4)
3. `vite build` exits 0 (R5)
4. `vitest run` — all existing tests pass (R6)
5. Browser loads the app without console errors (R7)