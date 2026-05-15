# dev_execution_fix — Requirements

## R1
Each Vue SFC file SHALL place `<style>` blocks as top-level blocks
outside `<template>`, not nested inside `<template>`.

## R2
The `tsconfig.json` `compilerOptions.types` SHALL include `"node"`
alongside `"vue"` so that Node.js ambient types (`process`, `NodeJS`,
`node:fs/promises`, etc.) are available during type-checking.

## R3
In `src/main.ts`, the `library.add()` call and the `Buffer` polyfill
assignment SHALL be separate statements; the system SHALL NOT call
the `void` return value of `library.add()` as a function.

## R4
WHEN a Vue template expression references a possibly undefined prop
value, the system SHALL use a type-safe guard (e.g. `props.rooms &&
props.rooms.length > 0`) instead of direct numeric comparison on an
optional chain (e.g. `props.rooms?.length > 0`).

## R5
The system SHALL include an automated test that verifies `vite build`
completes with exit code 0.

## R6
All existing tests SHALL pass after all fixes are applied.

## R7
WHEN `npm run dev` is executed, the dev server SHALL start without
errors and the application SHALL render in the browser without
console errors.