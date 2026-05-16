# Tasks — Ensure_vercel_deploy

- [x] T1 — Update `vercel.json` with build command (`npm run build`) and output directory (`build`), preserving existing SPA rewrites. Covers: R1, R2, R3, R4.
- [x] T2 — Write `tests/vercel.test.ts` with the following tests:
  - `test_vercel_json_is_valid_json` — parses `vercel.json` without error
  - `test_vercel_json_has_build_command` — `buildCommand` equals `"npm run build"`
  - `test_vercel_json_has_output_directory` — `outputDirectory` equals `"build"`
  - `test_vercel_json_has_spa_rewrites` — catch-all rewrite `/(.*)` → `/index.html` exists
  - `test_output_directory_matches_vite_config` — reads `vite.config.js` `outDir` and asserts it matches `vercel.json` `outputDirectory`
  - `test_build_contains_required_files` — if `build/` exists, checks it contains `index.html`, at least one `.js` file, at least one `.css` file, and `manifest.webmanifest`
  - `test_architecture_md_has_vercel_deployment_section` — reads `ARCHITECTURE.md` and checks it contains the Vercel Deployment section heading
  - `test_architecture_md_lists_env_vars` — reads `ARCHITECTURE.md` and checks it contains all 10 required environment variable names
  Covers: R1, R2, R3, R4, R5, R7, R8, R9, R10, R12, R13.
- [x] T3 — Update `ARCHITECTURE.md` with a new §16 **Vercel Deployment** section documenting:
  - The `vercel.json` configuration
  - SPA rewrite explanation
  - All required environment variables with descriptions
  - Build output location and process
  Covers: R8, R9.
- [x] T4 — Run `npm test` to verify all existing and new tests pass. Covers: R6, R11.
- [x] T5 — Run `./init.sh` to confirm the environment is fully green. Covers: R6, R11.
