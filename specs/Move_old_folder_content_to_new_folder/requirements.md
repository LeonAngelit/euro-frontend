# Requirements — Move old folder content to new folder

## R1
WHEN a CSS file exists under `src/Components/<Subdir>/`, the system SHALL read its full content and embed it into a `<style scoped>` block inside the corresponding `.vue` component under `src/components/<Subdir>/`.

## R2
WHEN a CSS file exists under `src/Views/<Subdir>/`, the system SHALL read its full content and embed it into a `<style scoped>` block inside the corresponding `.vue` component under `src/views/<Subdir>/`.

## R3
WHEN embedding CSS from `src/Components/NotFoundComponent/App.css`, the system SHALL embed it into a `<style scoped>` block in `src/components/NotFound/NotFound.vue`.

## R4
WHEN embedding CSS from `src/Components/NotFoundComponent/logo.svg`, the system SHALL move the SVG file to `src/components/NotFound/logo.svg`.

## R5
WHEN a `.vue` file has its CSS embedded into a `<style scoped>` block, the system SHALL remove the existing `<style src="...">` import line from that component.

## R6
WHEN `src/views/Archive/Archive.vue` and `src/views/App/Home.vue` both reference `src/Views/App/Home.Component.css`, the system SHALL embed the CSS content into `<style scoped>` blocks in BOTH components (content is duplicated, not shared).

## R7
WHEN all CSS content has been inlined into `<style scoped>` blocks, the system SHALL delete the `src/Components/` directory tree entirely.

## R8
WHEN all CSS content has been inlined into `<style scoped>` blocks, the system SHALL delete the `src/Views/` directory tree entirely.

## R9
WHEN the implementer runs `npm run build` after all changes, the build SHALL complete without errors.

## R10
WHEN the implementer runs `npm test` after all changes, the test suite SHALL pass without failures.

## R11
WHERE a `.css` file contains class selectors that may conflict with other components, the system SHALL prefix or scope them appropriately within the `<style scoped>` block (Vue's `scoped` attribute handles this automatically).

## R12
WHEN `src/Views/AdminView/AdminView.componen.css` (note the typo in filename) is inlined, the system SHALL embed its content into `src/views/AdminView/AdminView.vue` as a `<style scoped>` block, same as all others.
