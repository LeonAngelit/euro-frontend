# Requirements — Eurovision_contest_styling

## Color Schema

### R1
The system SHALL define CSS custom properties in `src/index.css` for the Eurovision palette: `--euro-pink` (`rgb(255, 0, 135)`), `--euro-pink-background` (`rgb(255, 0, 135, 0.5)`), `--euro-yellow` (`rgb(255, 248, 0)`), `--euro-gold` (`rgb(218, 183, 29)`), `--primary-color` (dark navy `rgb(2, 2, 94)`), and `--primary-color-background` (`rgb(0, 67, 255, 0.4)`).

### R2
WHERE a component uses a background or border accent, the system SHALL use `--euro-pink` or `--euro-gold` as the primary accent color instead of `--primary-color`.

### R3
WHILE the application is in its normal operating state, the system SHALL apply `--primary-color` (dark navy) as the background of the Navigation header and Footer components.

### R4
WHILE the application is in its normal operating state, the system SHALL render text inside Navigation and Footer components in white (`rgb(255, 255, 255)` or `#ffffff`).

### R5
WHEN a button with class `btn-primary` is rendered, the system SHALL apply `--euro-pink` as its background color and white text.

### R6
WHEN a button with class `btn-secondary` is rendered, the system SHALL apply `--euro-gold` as its background color and dark navy (`--primary-color`) text.

### R7
WHEN a button is hovered, the system SHALL apply a brightness or opacity transition to indicate interactivity.

## Component Theming

### R8
WHILE the Modal component is visible, the system SHALL display a backdrop overlay using `--primary-color-background` and a modal body with a `--euro-pink` border accent.

### R9
WHERE a card container (e.g., ClassificationView cards, CountryPicker cards) is rendered, the system SHALL apply a subtle border using `--euro-gold` and a background that contrasts with the page background.

### R10
WHERE an input field is rendered inside a Form component, the system SHALL apply a border color of `--euro-gold` when focused and `--primary-color` when unfocused.

### R11
WHEN the application renders a success message, the system SHALL use `--success-color` as the text and `--euro-gold` as the background accent.

### R12
WHEN the application renders an error message, the system SHALL use `--error-color` as the text and `--error-background` as the background.

## Layout Preservation

### R13
The system SHALL NOT alter the DOM structure or component hierarchy defined in `src/Layout.vue`.

### R14
The system SHALL NOT alter the responsive behavior (grid, flex, media queries) of the existing layout components.

### R15
The system SHALL NOT remove, rename, or modify any existing CSS class or attribute selectors used in unit tests.

## Typography

### R16
WHERE a heading element (`h1`, `h2`, `h3`) is rendered inside a view, the system SHALL apply `--euro-pink` as the text color.

### R17
WHERE a heading element is rendered inside the Navigation component, the system SHALL retain white text color.

## Test Compatibility

### R18
WHEN the test suite is executed via `npm test`, the system SHALL produce the same pass/fail results as before the styling changes.

### R19
WHEN all tests pass, the system SHALL produce no visible regression in component rendering (same selectors, same DOM structure, same component hierarchy).

## Background & Page Styling

### R20
WHILE the application is in its normal operating state, the system SHALL apply a Eurovision-inspired background pattern to the page body, using a gradient or repeating pattern that incorporates `--euro-pink`, `--primary-color` (dark navy), and `--euro-gold`.

### R21
WHEN the background pattern is applied, the system SHALL ensure that all text and interactive elements remain readable against the background by using appropriate contrast and background containers.

## Documentation

### R22
IF the `ARCHITECTURE.md` file references specific color values or styling decisions that are changed by this feature, THEN the system SHALL update `ARCHITECTURE.md` to reflect the new styling.
