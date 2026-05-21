# Requirements — Styling Analysis and Improvements

## Scope

Fix 4 currently failing tests and ensure full consistency between the
Eurovision styling, Vercel deployment config, and component redirect logic.

---

## R1
Home.vue SHALL have the CSS selector `h1, h2, h3 { color: var(--euro-pink); }`
on a single line in its scoped `<style>` block.

## R2
The scoped `<style>` block in every view (Home.vue, Login.vue, CountrySelect.vue,
AdminView.vue, UserDetails.vue) SHALL contain `h1, h2, h3` with `color: var(--euro-pink)`.

## R3
vercel.json `buildCommand` SHALL be `"npm run build"`.

## R4
vercel.json `outputDirectory` SHALL match the `outDir` declared in vite.config.js.

## R5
The test `test_vercel_json_has_build_command` SHALL pass when compared to
the actual vercel.json buildCommand value.

## R6
The test `test_vercel_json_has_output_directory` SHALL pass when compared to
the actual vercel.json outputDirectory value.

## R7
The test `test_output_directory_matches_vite_config` SHALL pass, confirming
vercel.json outputDirectory matches vite.config.js outDir.

## R8
Home.vue SHALL invoke `useNavigateWithCallback` with a path containing
`'country-select'` when the user has fewer countries than `targetCount`
AND songs have been loaded.

## R9
The test `test_Home_redirectsToCountrySelect_whenUserHasInsufficientCountries`
SHALL pass by detecting the redirect call after songs are loaded.

## R10
WHILE running `./init.sh`, the system SHALL report 0 test failures.

## R11
ARCHITECTURE.md SHALL reflect the actual vercel.json and vite.config.js values
for `buildCommand` and `outputDirectory`.

## R12
No existing component styling (Navigation, Footer, Form, Modal, CountryPicker,
ClassificationView, RoomPicker, Collapsible) SHALL lose its Eurovision CSS
custom property references (--euro-pink, --euro-gold, --primary-color).

## R13
Layout.vue SHALL remain unchanged (no `<style>` block introduced, DOM structure
preserved).

## R14
No responsive media query SHALL be removed from any component or view.

## R15
IF a pre-existing styling regression is detected (e.g., color, selector, or
property removed) THEN the system SHALL restore the correct value and log it
in `progress/current.md`.

## R16
All .btn-primary, .btn-secondary, .container, .subtitle, .error-span,
.country-flag, .profile-button, .select-css, and .google-container selectors
SHALL remain in src/index.css.

## R17
The background pattern on `body` in src/index.css (radial-gradient,
linear-gradient, background-attachment: fixed) SHALL remain unchanged.

## R18
The `.container` backdrop-filter and `rgba(255, 255, 255, 0.06)` background
SHALL remain in src/index.css for content readability.

## R19
All tests in the test suite SHALL run without timeout or unhandled rejection
errors.
