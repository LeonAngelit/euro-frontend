# Implement_i18n — Tasks

## Setup

 - [x] T1: Install `vue-i18n` as a dependency (`npm install vue-i18n@9`) — R1
 - [x] T2: Create `src/locales/es.json` with all Spanish translations extracted from components — R2, R3, R12
 - [x] T3: Create `src/locales/en.json` with all English translations matching the key set in `es.json` — R7
 - [x] T4: Create `src/locales/index.ts` that initializes and exports the `i18n` instance with `legacy: false`, `locale: 'es'`, `fallbackLocale: 'es'`, and imports both locale JSONs — R1
 - [x] T5: Register the i18n plugin in `src/main.ts` by importing and calling `app.use(i18n)` — R1

## Locale detection

 - [x] T6: Create `src/composables/useDetectLocale.ts` implementing IP-geolocation lookup (ipapi.co primary, ip-api.com fallback), country-to-locale mapping (Spanish-speaking countries → `es`, all others → `en`), localStorage persistence under key `user-locale`, and fallback to `es` on failure — R4, R5, R9
 - [x] T7: Call `useDetectLocale()` on app mount and set `locale.value` in `src/App.vue` or `src/Layout.vue` — R4, R6

## Component extraction — Navigation

 - [x] T8: Replace all hardcoded strings in `src/components/Navigation/Navigation.vue` with `$t()` calls (Perfil, Admin, Salir de la sala, Histórico de resultados, Cerrar sesión, Contraseña incorrecta, EuroContest, imagen de usuario) — R3, R12

## Component extraction — Modal

 - [x] T9: Replace "Aceptar" and "Cancelar" in `src/components/Modal/Modal.vue` with `$t()` calls — R3, R12

## Component extraction — Form

 - [x] T10: Replace "Mantener sesión", "Submit", and "Profile Preview" in `src/components/Form/Form.vue` with `$t()` calls — R3, R12

## Component extraction — RoomPicker & RoomNameEditForm

 - [x] T11: Replace all hardcoded strings in `src/components/RoomPicker/RoomPicker.vue` (Link copiado al portapapeles, modal confirmation messages, share text) with `$t()` calls — R3, R12
 - [x] T12: Replace all hardcoded strings in `src/components/RoomPicker/RoomNameEditForm.vue` (Nombre de sala no válido, Guardar, Cancelar) with `$t()` calls — R3, R12

## Component extraction — AdminPanel

 - [x] T13: Replace "Entrar" and "Contraseña" placeholder in `src/components/AdminPanel/AdminPanel.vue` with `$t()` calls — R3, R12

## Component extraction — CountryPicker

 - [x] T14: Replace all hardcoded strings in `src/components/CountryPicker/CountryPicker.vue` (instructions, Países seleccionados, Continuar, validation messages) with `$t()` calls — R3, R12

## Component extraction — NotFound & Footer

 - [x] T15: Replace "404" and "Página no encontrada" in `src/components/NotFound/NotFound.vue` with `$t()` calls — R3, R12

## View extraction — Login

 - [x] T16: Replace all hardcoded strings in `src/views/Login/Login.vue` (error messages, field labels, placeholders, link text) with `t()` calls — R3, R8, R12

## View extraction — SignUp

 - [x] T17: Replace all hardcoded strings in `src/views/CreateUser/SignUp.vue` (validation errors, field placeholders, button text) with `t()` calls — R3, R8, R12

## View extraction — CreateRoom

 - [x] T18: Replace all hardcoded strings in `src/views/CreateRoom/CreateRoom.vue` (validation errors, placeholders) with `t()` calls — R3, R8, R12

## View extraction — MissingEmail

 - [x] T19: Replace all hardcoded strings in `src/views/MissingEmail/MissingEmail.vue` (all paragraphs, error messages, button labels) with `t()` calls — R3, R8, R12

## View extraction — AdminView

 - [x] T20: Replace all hardcoded strings in `src/views/AdminView/AdminView.vue` (button labels, form fields, select options, validation errors) with `t()` calls — R3, R8, R12

## View extraction — UserDetails

 - [x] T21: Replace all hardcoded strings in `src/views/UserDetails/UserDetails.vue` (Collapsible title, button text, error messages) with `t()` calls — R3, R8, R12

## View extraction — Home

 - [x] T22: Replace all hardcoded strings in `src/views/App/Home.vue` (instructions, placeholders, error messages) with `t()` calls — R3, R8, R12

## View extraction — Archive

 - [x] T23: Replace all hardcoded strings in `src/views/Archive/Archive.vue` (Loading text, placeholders, no-results message) with `t()` calls — R3, R8, R12

## View extraction — Layout

 - [x] T24: Replace "Loading..." fallback text and modal messages in `src/Layout.vue` with `t()` calls — R3, R12

## Documentation

 - [x] T25: Update `ARCHITECTURE.md` to document: i18n setup (vue-i18n), locale file structure, IP-based locale detection composable, fallback strategy, and the key naming convention — R10

## Tests

 - [x] T26: Add `tests/useDetectLocale.test.ts` — test that the composable returns `'es'` on geolocation failure, maps known Spanish-speaking country codes to `'es'`, maps other country codes to `'en'`, and persists to localStorage — R4, R5, R9, R11
 - [x] T27: Add `tests/i18n.test.ts` — test that `es.json` and `en.json` have identical key sets, and that i18n instance initializes correctly with fallback — R2, R7, R11
 - [x] T28: Update existing component tests (`Navigation.test.ts`, `Modal.test.ts`, `Form.test.ts`, `RoomPicker.test.ts`, etc.) to wrap components in the i18n plugin so `$t()` works in test mounts — R11

## Verification

 - [x] T29: Run `./init.sh` and verify all tests pass — R11
 - [x] T30: Grep all `.vue` and `.ts` files under `src/` for remaining Spanish accented characters (á, é, í, ó, ú, ñ, ¿, ¡) outside of locale JSON files to confirm no hardcoded text remains — R12