# Implement_i18n — Design

## 1. Library choice: vue-i18n (v9+)

**Selected:** `vue-i18n@9` — the official i18n library for Vue 3, with Composition API support (`useI18n()`), reactive locale switching, and built-in message fallback.

**Discarded alternative:** A custom reactive translation object powered by a Pinia store. Rejected because: (a) it would require hand-rolling interpolation, pluralization, and fallback logic that vue-i18n already provides; (b) no existing pattern in the codebase justifies a hand-rolled solution; (c) vue-i18n is the community standard and matches the conventions requirement to prefer well-maintained libraries.

## 2. Locale file structure

```
src/locales/
├── index.ts       # Creates and exports the i18n instance
├── es.json        # Spanish translations (default)
└── en.json        # English translations
```

Keys are organized by component/view with a flat namespace separated by dots:

```json
{
  "nav.profile": "Perfil",
  "nav.admin": "Admin",
  "nav.leaveRoom": "Salir de la sala",
  "nav.archive": "Histórico de resultados",
  "nav.logout": "Cerrar sesión",
  "login.usernamePlaceholder": "Nombre de usuario o email",
  "login.password": "Contraseña",
  "error.wrongCredentials": "Usuario o contraseña incorrectos",
  ...
}
```

This avoids deep nesting while keeping keys discoverable and grouped logically.

## 3. i18n plugin setup — `src/locales/index.ts`

```typescript
import { createI18n } from 'vue-i18n'
import es from './es.json'
import en from './en.json'

export const i18n = createI18n({
  legacy: false,               // Composition API mode
  locale: 'es',                // Default — overridden by detection
  fallbackLocale: 'es',
  messages: { es, en },
})
```

Integration in `src/main.ts`:

```typescript
import { i18n } from './locales'
app.use(i18n)
```

## 4. IP-based locale detection — `src/composables/useDetectLocale.ts`

```typescript
export async function useDetectLocale(): Promise<string> {
  // 1. Check localStorage for a previously saved preference
  // 2. If not found, call a free IP-geolocation API (e.g. ipapi.co)
  // 3. Map the country code to a locale:
  //    - Countries where Spanish is primary → 'es'
  //    - All others → 'en'
  // 4. On any failure, return 'es' as fallback
}
```

Called on app mount in `src/main.ts` or `src/App.vue`:

```typescript
const { locale } = useI18n()
useDetectLocale().then(detected => { locale.value = detected })
```

### Geolocation service

Primary: `https://ipapi.co/json/` (free, no API key, returns country code).
Fallback: `https://ip-api.com/json/` as a secondary free service.

Both return a `country_code` field. A mapping table converts country codes to locale codes (`es`, `en`).

### User preference persistence

The detected locale is stored in `localStorage` under key `user-locale`. On subsequent visits the stored preference is used, skipping the geolocation call.

## 5. Files to create

| File | Purpose |
|---|---|
| `src/locales/index.ts` | i18n instance creation and export |
| `src/locales/es.json` | Spanish translations |
| `src/locales/en.json` | English translations |
| `src/composables/useDetectLocale.ts` | IP geolocation + locale resolution |

## 6. Files to modify

| File | Change |
|---|---|
| `src/main.ts` | Import and install i18n plugin; call locale detection on mount |
| `src/App.vue` or `src/Layout.vue` | Optionally trigger locale detection |
| `src/components/Navigation/Navigation.vue` | Replace all Spanish literals with `$t()` calls |
| `src/components/Modal/Modal.vue` | Replace "Aceptar", "Cancelar" with `$t()` calls |
| `src/components/Form/Form.vue` | Replace "Mantener sesión", "Submit", "Profile Preview" with `$t()` calls |
| `src/components/RoomPicker/RoomPicker.vue` | Replace "Link copiado al portapapeles", modal messages with `$t()` calls |
| `src/components/RoomPicker/RoomNameEditForm.vue` | Replace error messages and button labels with `$t()` calls |
| `src/components/AdminPanel/AdminPanel.vue` | Replace "Entrar", "Contraseña" with `$t()` calls |
| `src/components/CountryPicker/CountryPicker.vue` | Replace selection messages, country instructions, "Continuar" with `$t()` calls |
| `src/components/Collapsible/Collapsible.vue` | No text — no changes needed |
| `src/components/ClassificationView/ClassificationView.vue` | No user-facing literals — no changes needed |
| `src/components/NotFound/NotFound.vue` | Replace "404", "Página no encontrada" with `$t()` calls |
| `src/components/Footer/Footer.vue` | Replace author name literal if i18n-eligible |
| `src/views/Login/Login.vue` | Replace all error messages, field labels, link text |
| `src/views/CreateUser/SignUp.vue` | Replace all error messages, field labels, link text |
| `src/views/CreateRoom/CreateRoom.vue` | Replace all error messages, field labels |
| `src/views/MissingEmail/MissingEmail.vue` | Replace informational paragraphs, error messages, button labels |
| `src/views/AdminView/AdminView.vue` | Replace button labels, form fields, status messages |
| `src/views/UserDetails/UserDetails.vue` | Replace labels, error messages, button text |
| `src/views/CountrySelection/CountrySelect.vue` | No user-facing literals to translate |
| `src/views/Room/Room.vue` | No user-facing literals to translate |
| `src/views/Archive/Archive.vue` | Replace loading text, dropdown placeholder, no-results message |
| `src/views/App/Home.vue` | Replace "Selecciona una sala", "Unirme", "Únete o", "Crea una sala", error messages |
| `src/Layout.vue` | Replace "Loading...", "Sala no encontrada", "Actualización correcta" modal messages |
| `package.json` | Add `vue-i18n` dependency |
| `ARCHITECTURE.md` | Document i18n setup and locale detection |

## 7. Complete list of hardcoded strings to extract

### Navigation
- "EuroContest", "Perfil", "Admin", "Salir de la sala", "Histórico de resultados", "Cerrar sesión", "Contraseña incorrecta", "imagen de usuario"

### Modal
- "Aceptar", "Cancelar"

### Form
- "Mantener sesión", "Submit", "Profile Preview"

### RoomPicker
- "Link copiado al portapapeles"
- "¿Deseas eliminar la sala? Esta acción es irreversible"
- "¿Deseas olvidar la sala? Podrás volver a unirte introduciendo id y contraseña en el formulario"
- "Participa conmigo en la sala {roomName}!" (share text)

### RoomNameEditForm
- "Nombre de sala no válido", "Guardar", "Cancelar", "Actualización correcta"

### AdminPanel
- "Entrar", "Contraseña"

### CountryPicker
- "Selecciona {count} países de los siguientes, es importante que el primer país seleccionado sea el que creas que será el ganador, {sixthText} podrás comprobarlo porque {highlightText}."
- "Países seleccionados:"
- "Continuar"
- "Tienes que elegir {count} países"
- "No puedes elegir más de {count} países"
- "Actualización correcta"

### NotFound
- "404", "Página no encontrada"

### Footer
- "Leonardo Angelit" (author attribution — may remain as-is)

### Login
- "Usuario o contraseña incorrectos", "Usuario no encontrado", "Error de servidor", "Token inválido", "Nombre de usuario o email no válido", "Contraseña no válida, debe contener al menos 8 caracteres, incluyendo números y mayúscula", "Inicia sesión o", "Crea una cuenta", "Login"
- "Nombre de usuario o email" (label/placeholder), "Contraseña" (placeholder)

### SignUp / CreateUser
- "Error al crear el usuario", "Nombre de usuario no válido, debe contener 5 a 25 caracteres, evita caracteres especiales", "Correo electrónico no válido", "Las contraseñas no coinciden", "Registrarse", "Login Failed"
- Placeholders: "Nombre de usuario", "Correo electrónico", "Contraseña", "Repetir contraseña"

### CreateRoom
- "Crear Sala", "Nombre de sala" (placeholder)
- Error messages shared with SignUp

### MissingEmail
- "Tras la última actualización de la aplicación, se requiere que todos los usuarios registrados tengan una dirección de correo electrónico asociada"
- "Por lo que deberás introducir un email válido en el formulario más abajo para seguir usando la app 👇 Muchas gracias"
- "Revisa tu bandeja de entrada para confirmar tu correo."
- "Si no lo encuentras, revisa la bandeja de correo no deseado."
- "Actualización correcta, serás redirigido a la app automáticamente"
- "Si no eres redirigido automáticamente, recarga la página"
- "Email confirmado", "Correo electrónico no válido", "Email de confirmación enviado", "Enviar"
- Placeholder: "Correo electrónico"

### AdminView
- "Votación OK/NO", "Registro OK/NO", "Puntos OK/NO", "Exportar resultados"
- "Cambiar contraseña:", "Enviar", "Contraseña", "Repetir contraseña"
- "Las contraseñas no coinciden"
- Select options: "Clean request", "img2video request", etc.
- "prompt goes here" placeholder

### UserDetails
- "Países seleccionados", "Eliminar cuenta"
- Error messages: same validation messages as SignUp

### Home
- "Selecciona una sala de tu lista:", "Unirte a una sala: ", "Unirme"
- "ID de la sala", "Contraseña" (placeholders)
- "Únete o", "Crea una sala"
- "Sala no encontrada, prueba con otro ID"
- "Nombre de sala no válido, debe contener 5 a 25 caracteres, evita caracteres especiales"

### Archive
- "Obteniendo datos...", "Selecciona una sala", "No se han encontrado resultados históricos para el usuario", "No se han encontrado datos"

### Layout
- "Loading...", "Sala no encontrada", "Actualización correcta"

## 8. Reference to project conventions

Per `docs/architecture.md`: "Do not add dependencies without justification." Vue-i18n is justified as the standard i18n solution for Vue 3 (acceptance criteria require i18n). Per `docs/conventions.md`: TypeScript strict mode, `vitest` for tests, one test file per source module.

## 9. Translation approach

All Spanish strings are the **source of truth** and are placed in `es.json` with their original values. English equivalents are placed in `en.json`. Shared validation messages are factored into a `validation.*` namespace to avoid duplication across components.

### Namespaces within the flat key structure

| Prefix | Scope |
|---|---|
| `nav.*` | Navigation component |
| `login.*` | Login view |
| `signup.*` | Signup view |
| `createRoom.*` | CreateRoom view |
| `home.*` | Home view |
| `room.*` | Room views |
| `archive.*` | Archive view |
| `missingEmail.*` | MissingEmail view |
| `admin.*` | Admin view |
| `userDetails.*` | UserDetails view |
| `modal.*` | Modal component |
| `form.*` | Form component |
| `countryPicker.*` | CountryPicker component |
| `roomPicker.*` | RoomPicker component |
| `roomNameEdit.*` | RoomNameEditForm |
| `validation.*` | Shared validation error messages |
| `error.*` | Shared error messages |
| `common.*` | Shared common labels (password, etc.) |

This design avoids an `es.json` that is a single flat list of 100+ keys without grouping.