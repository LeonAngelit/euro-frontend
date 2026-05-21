# Tasks — Styling Analysis and Improvements

## Order of Execution

1. Home.vue heading selector
2. vercel.json buildCommand
3. vercel.test.ts outputDirectory expectation
4. ARCHITECTURE.md update
5. Home.vue redirect watch

Each task below MUST be completed and verified before moving to the next.

---

- [x] T1 — Collapse `h1, h2, h3` CSS selector to a single line in
      `src/views/App/Home.vue`. Covers: R1, R2.

- [x] T2 — Change `"buildCommand": "vite build"` to `"buildCommand": "npm run build"`
      in `vercel.json`. Covers: R3, R5.

- [x] T3 — Change the expected value in `test_vercel_json_has_output_directory`
      from `"build"` to `"dist"` in `tests/vercel.test.ts`. Covers: R4, R6, R7.

- [x] T4 — Update ARCHITECTURE.md §16 Vercel Deployment section to reflect
      `"buildCommand": "npm run build"` and `"outputDirectory": "dist"`.
      Update the table rows and the prose description. Covers: R11.

- [x] T5 — Uncomment the commented-out `watch` block in `src/views/App/Home.vue`
      (lines 64–88) to reactively trigger redirect when songs load after mount.
      Covers: R8, R9.

- [x] T6 — Run `npx vitest run tests/Eurovision_styling.test.ts` and confirm
      all 22 requirement blocks (R1-R22) pass. Covers: R2, R12, R13, R14, R16,
      R17, R18.

- [x] T7 — Run `npx vitest run tests/vercel.test.ts` and confirm all tests pass.
      Covers: R5, R6, R7.

- [x] T8 — Run `npx vitest run tests/Home.test.ts` and confirm all tests pass.
      Covers: R9.

- [x] T9 — Run `./init.sh` and confirm zero test failures. Covers: R10, R19.

- [x] T10 — Run full test suite with `npx vitest run` and confirm no timeouts
      or unhandled rejections. Covers: R19.

- [x] T11 — (No blockage — all tests pass)
      `progress/current.md` with the failure details and mark the feature as
      `blocked` in `feature_list.json`. Covers: R15.
