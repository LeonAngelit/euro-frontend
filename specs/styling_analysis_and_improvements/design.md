# Design — Styling Analysis and Improvements

## Files to Modify

| File | Change | Covers |
|---|---|---|
| `src/views/App/Home.vue` | Single-line the `h1, h2, h3` CSS selector in scoped `<style>` | R1, R2 |
| `vercel.json` | Change `buildCommand` from `"vite build"` to `"npm run build"` | R3, R5 |
| `tests/vercel.test.ts` | Change `outputDirectory` expected value from `"build"` to `"dist"` | R4, R6, R7 |
| `ARCHITECTURE.md` | Update §16 Vercel Deployment values to match actual config | R11 |
| `src/views/App/Home.vue` | Uncomment the `watch` block and ensure it triggers redirect to `/country-select` when songs load | R8, R9 |

## Approach

### 1. Home.vue — Heading selector (R1, R2)

The test in `Eurovision_styling.test.ts` at line 668 calls
`expect(source).toContain('h1, h2, h3')`. Home.vue currently has the selector
split across three lines (`h1,\nh2,\nh3 {`). The fix is to collapse it to a
single line.

The other four views (Login, CountrySelect, AdminView, UserDetails) already
have the single-line form and will not be touched.

### 2. vercel.json — buildCommand (R3)

Change `"buildCommand": "vite build"` to `"buildCommand": "npm run build"`.
This is the standard Vercel convention for projects with an npm build script.
The `package.json` `"build"` script runs `vite build`, so the effective
behavior is unchanged — only the indirection level changes. The existing
`"outputDirectory": "dist"` remains as-is since it already matches
vite.config.js `outDir: "dist"`.

### 3. vercel.test.ts — outputDirectory expectation (R4, R6, R7)

The test `test_vercel_json_has_output_directory` asserts
`expect(config.outputDirectory).toBe("build")`. The actual value required by
vite.config.js (`outDir: "dist"`) is `"dist"`. Change the expected string
from `"build"` to `"dist"`.

The derived test `test_output_directory_matches_vite_config` already compares
`vercelConfig.outputDirectory` with `getViteOutDir()` (which returns `"dist"`)
— this test is currently passing if the `outputDirectory` test is skipped, and
will remain passing after the fix.

### 4. Home.vue — Redirect watcher (R8, R9)

The `onMounted` hook in Home.vue checks if songs are loaded and returns early
if `store.songs` is empty. A commented-out `watch` block (lines 64–88)
contains identical redirect logic. The test `test_Home_redirectsToCountrySelect`
mounts the component with songs undefined, then sets songs later via
`store.setSongs()` — but without an active watcher, the redirect never fires.

**Fix**: Uncomment the `watch` on `[targetCount, store.userLogged, store.songs, store.currentRoom]`
to reactively trigger the redirect when songs arrive after mount.

### 5. ARCHITECTURE.md — Vercel section (R11)

Update the `vercel.json` example in §16 to show the actual values
(`"buildCommand": "npm run build"`, `"outputDirectory": "dist"`). Update the
table to match.

## Files NOT Modified

| File | Reason |
|---|---|
| `vite.config.js` | `outDir: "dist"` is already correct |
| All other `.vue` files under `src/components/` | Already use Eurovision vars correctly |
| `src/index.css` | All R1-R22 CSS variable, selector, and background rules intact |
| `src/Layout.vue` | No `<style>` block needed; structure already correct |
| `tests/Eurovision_styling.test.ts` | Tests are the source of truth; code is fixed to match them |

## Alternative Discarded

**Alternative A**: Update `Eurovision_styling.test.ts` to accept multi-line CSS
selectors. Discarded because:
- The `hasCSSRule` parser in the test already handles multi-line blocks
- The string-match test (`toContain('h1, h2, h3')`) is a deliberate readability
  check — keeping selectors single-line makes the scoped CSS easier to scan
- Fixing the source code is cleaner than loosening the test

**Alternative B**: Change vite.config.js `outDir` to `"build"` and align
everything to `"build"`. Discarded because:
- `"dist"` is the Vite default and is universally expected by developers
- The test expectation was the artifact that needed correction, not the build config
- Changing `outDir` would also require updating PWA manifest and any CI references

**Alternative C**: Implement the redirect in Home.vue via a `watchEffect` or
computed side-effect instead of uncommenting the existing `watch`. Discarded
because the existing `watch` code is already correct, tested, and was only
removed during a previous migration. Reverting to a known-working pattern is
lower risk than introducing a new reactive approach.
