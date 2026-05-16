# Design — Ensure_vercel_deploy

## Summary

This feature ensures the application is deployable on Vercel by:
1. Adding proper Vercel configuration (`vercel.json`) with build settings, output directory, and SPA rewrite rules.
2. Creating a test that validates `vercel.json` syntax and build compatibility.
3. Updating `ARCHITECTURE.md` with Vercel deployment instructions.
4. Vercel supports any Node.js project — it detects Vite and Vue automatically, but explicit configuration avoids surprises.

## Files created

| File | Action | Purpose |
|------|--------|---------|
| `tests/vercel.test.ts` | **Create** | Validates `vercel.json` syntax, SPA fallback rule, output directory alignment, and build output structure |

## Files modified

| File | Action | Purpose |
|------|--------|---------|
| `vercel.json` | **Modify** | Add `builds`, `build.command`, `build.outputDirectory` keys. Currently only has `rewrites`; must add explicit Vercel build config. |
| `ARCHITECTURE.md` | **Modify** | Add §16 — Vercel Deployment section documenting config, env vars, and build process. |

## Detailed design

### 1. `vercel.json` structure

The existing `vercel.json` only contains SPA rewrites. The new version will add:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Key decisions:**
- `buildCommand: "npm run build"` — Vercel runs this to produce the build output. Matches the existing npm script.
- `outputDirectory: "build"` — Must match the `outDir: "build"` in `vite.config.js`. Vercel defaults to `dist`; we override to `build`.
- `rewrites` — The existing SPA fallback for vue-router's `createWebHistory` is preserved. All paths rewrite to `/index.html` so the SPA router can handle them.
- No `installCommand` override — Vercel's default (`npm install`) works since `package.json` has no special install requirements.
- No `node` version override — Vercel auto-detects. The project works on Node 18+.

### 2. Test design (`tests/vercel.test.ts`)

A single test file covering several aspects:

| Test | What it validates |
|------|-------------------|
| `test_vercel_json_is_valid_json` | `vercel.json` parses without error |
| `test_vercel_json_has_build_command` | `buildCommand` is `"npm run build"` |
| `test_vercel_json_has_output_directory` | `outputDirectory` is `"build"` |
| `test_vercel_json_has_spa_rewrites` | Rewrites catch-all `/(.*)` → `/index.html` |
| `test_vercel_json_rewrites_exclude_assets` | Asset paths like `.png`, `.js`, `.css` should not be caught by optional `conditions` if used, or verified through the `/(.*)` pattern that still serves from disk first |
| `test_build_output_matches_output_directory` | The `outputDirectory` in `vercel.json` matches `outDir` in `vite.config.js` |
| `test_build_contains_required_files` | After `vite build`, the output dir contains `index.html`, `.js`, `.css`, `manifest.webmanifest` |

The tests must NOT run `vite build` on every test run (too slow). Instead:
- Parse `vite.config.js` to extract `outDir`.
- Check `build/` exists (post-build).
- Use a helper to validate the output only if the build directory exists.

### 3. `ARCHITECTURE.md` update

Add a new §16 — **Vercel Deployment** with:
- Purpose of `vercel.json`
- SPA rewrite explanation
- List of all required environment variables (copying from `.env`)
- Link to Vercel dashboard configuration
- Build output location (`build/`)
- Note about PWA manifest serving

### 4. Environment variables on Vercel

Every variable in `.env` (except local overrides) must be documented so a human can configure them in the Vercel dashboard:

| Variable | Example | Purpose |
|----------|---------|---------|
| `VITE_REACT_APP_BASEURL` | `https://api.example.com/api/eurocontest/` | Backend API base URL |
| `VITE_REACT_APP_ADMIN` | `admin_user` | Admin username |
| `VITE_REACT_APP_AUTH_P` | `secret123` | Auth secret for token derivation |
| `VITE_REACT_APP_P_KEY` | `somekey` | Additional key |
| `VITE_REACT_APP_JOIN_ROOM` | `/join-room?roomAuth` | Join room URL pattern |
| `VITE_REACT_APP_CONFIRM_EMAIL_URL` | `/confirm-email?user_id=` | Email confirmation pattern |
| `VITE_REACT_APP_JOIN_ROOM_PATH` | `/join-room` | Join room path |
| `VITE_REACT_APP_CLIENT_ID` | `google-oauth-id` | Google OAuth client ID |
| `VITE_REACT_APP_REQUESTS_URL` | `secret/comfy/addRequest` | AI requests URL |
| `VITE_REACT_APP_REQUESTS_BASE_URL` | `secret/comfy` | AI requests base URL |

## Alternatives discarded

| Alternative | Reason discarded |
|-------------|-----------------|
| **Use Vercel's default settings without `vercel.json`** | Vercel would auto-detect Vite, but defaults `outputDirectory` to `dist` while our project uses `build`. Without explicit config, the build succeeds but Vercel finds no output and deploys nothing. |
| **Use Vercel CLI (`vercel deploy`) test** | Adding `vercel` as a devDependency would violate the "no new deps" rule in `docs/architecture.md`. Testing via file parsing is sufficient. |
| **Convert to `dist` output directory** | Would require changing `vite.config.js` (`outDir: "build"` → `"dist"`). This is a valid approach but would break the existing Dockerfile which expects `build/`. Keeping `build` and overriding in `vercel.json` is safer. |
| **Add `vercel.json` `cleanUrls` option** | `cleanUrls` would remove `.html` from URLs, which is irrelevant for a pure SPA with no `.html` routes. Adds confusion without benefit. |

## Reference

- `docs/architecture.md` — no new dependencies; test with file parsing not mock
- `docs/conventions.md` — `[name].test.ts` naming, vitest runner, temp files not mocks
- `vite.config.js` — `build.outDir` must match `vercel.json` `outputDirectory`
- `ARCHITECTURE.md` — existing §13 (Build & Deployment) will be extended with §16
