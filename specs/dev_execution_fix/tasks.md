# dev_execution_fix — Tasks

- [x] T1: Move `<style>` tag outside `<template>` in `src/components/Form/Form.vue` (R1)
- [x] T2: Move `<style>` tag outside `<template>` in `src/components/RoomPicker/RoomPicker.vue` (R1)
- [x] T3: Add `"node"` to `compilerOptions.types` in `tsconfig.json` (R2)
- [x] T4: Split `library.add()` and `Buffer` assignment into separate statements in `src/main.ts` (R3)
- [x] T5: Replace `props.rooms?.length > 0` with `props.rooms && props.rooms.length > 0` in `src/components/RoomPicker/RoomPicker.vue` (R4)
- [x] T6: Create `tests/build.test.ts` that verifies `vite build` exits with code 0 (R5)
- [x] T7: Run `npm run dev` and confirm no terminal errors and no browser console errors (R7)
- [x] T8: Run `npx vue-tsc --noEmit` and confirm zero type errors (R2, R3, R4)
- [x] T9: Run `vitest run` and confirm all existing tests pass plus the new build test passes (R5, R6)
- [x] T10: Update `ARCHITECTURE.md` to reflect any structural changes (acceptance criterion)