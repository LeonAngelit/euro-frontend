# Implement_i18n — Requirements (EARS)

## R1
The system SHALL install `vue-i18n` as a runtime dependency and register it as a Vue plugin via `app.use(i18n)` in `src/main.ts`.

## R2
The system SHALL create locale files under `src/locales/` with one JSON file per supported language (`es.json` for Spanish, `en.json` for English), following a flat or shallow-nested key structure that mirrors the component hierarchy.

## R3
Every hardcoded user-facing text string in Vue templates and script logic SHALL be replaced by an `i18n` translation call (`$t('key')` in templates or `t('key')` in `<script setup>`) so that no Spanish or English literal remains directly in component code.

## R4
WHEN the application loads, the system SHALL detect the user's preferred language by calling an IP-based geolocation service and SHALL set the `vue-i18n` locale accordingly.

## R5
WHEN the IP geolocation service fails or returns an unrecognized country, the system SHALL fall back to Spanish (`es`) as the default locale.

## R6
The system SHALL expose a reactive `locale` property so that all active components re-render automatically when the locale changes.

## R7
The system SHALL provide correct English translations for every Spanish key, producing locale files where `es.json` and `en.json` contain the same key set with semantically equivalent values.

## R8
WHEN a validation error or modal message is displayed, the system SHALL use the `i18n` translation key for that message so that the text matches the active locale.

## R9
The system SHALL create a composable `src/composables/useDetectLocale.ts` that encapsulates the IP-geolocation lookup and locale resolution logic, returning the detected locale code.

## R10
The system SHALL update `ARCHITECTURE.md` to document the i18n setup, locale file structure, and the locale detection strategy.

## R11
The system SHALL update or add unit tests for: (a) the `useDetectLocale` composable, (b) the i18n plugin setup, and (c) key translation coverage in `es.json` and `en.json`.

## R12
The system SHALL NOT include any language-specific hardcoded string in component templates or `<script setup>` logic after i18n is implemented; all such strings SHALL reside exclusively in locale files under `src/locales/`.