# Requirements — Implement_unit_tests

## Validators (`src/utils/regexUtils.ts`)

### R1
WHEN `validateRegex` is called with a string matching the password policy
(at least one digit, one lowercase, one uppercase, minimum 8 characters),
the system SHALL return `true`.

### R2
WHEN `validateRegex` is called with a string that does NOT match the password
policy, the system SHALL return `false` and invoke the optional callback.

### R3
WHEN `validateEmailRegex` is called with a valid email string, the system
SHALL return `true`.

### R4
WHEN `validateEmailRegex` is called with an invalid email string, the system
SHALL return `false` and invoke the optional callback.

### R5
WHEN `validateUserNameRegex` is called with a valid username (5–25 chars,
alphanumeric + underscore, no consecutive underscores), the system SHALL
return `true`.

### R6
WHEN `validateUserNameRegex` is called with an invalid username, the system
SHALL return `false` and invoke the optional callback.

---

## Store (`src/stores/app.ts`)

### R7
WHEN `useAppStore` is created, the system SHALL initialize `userLogged` to
`false`, `rememberUser` to `false`, `currentRoom` to `undefined`, `songs` to
an empty array, and `selection.current` to an empty array.

### R8
WHEN `setUserLogged` is called with a user object, the system SHALL update
`userLogged` to that object.

### R9
WHEN `closeSession` is called, the system SHALL reset `userLogged` to `false`,
`xToken` to `undefined`, and `currentRoom` to `undefined`.

### R10
WHEN `setXToken` is called, the system SHALL update `xToken` to the provided
value.

### R11
WHEN `setModal` is called with modal data, the system SHALL update the
`modal` ref to those values.

### R12
WHEN `setRememberUser` is called with `true`, the system SHALL set
`rememberUser` to `true`; WHEN called with `false`, the system SHALL set
`rememberUser` to `false`.

### R13
WHEN `setCurrentRoom` is called, the system SHALL update `currentRoom` to the
provided value.

### R14
WHEN `setSelection` is called, the system SHALL update `selection.current` to
the provided array.

### R15
WHEN `setUpdatable` is called, the system SHALL update `updatable` to the
provided value.

### R16
WHEN the store is persisted, the system SHALL store state in `localStorage`
when `rememberUser` is `true` and in `sessionStorage` when `rememberUser` is
`false`.

---

## Composables

### R17
WHEN `useHandleCloseSession` is called with a store instance, the system SHALL
invoke `store.closeSession()`.

### R18
WHEN `useNavigateWithCallback` is called and the current URL contains
`callback_url`, the system SHALL navigate to the destination with the
`callback_url` query parameter preserved.

### R19
WHEN `useNavigateWithCallback` is called and the current URL does NOT contain
`callback_url`, the system SHALL navigate to the destination without appending
any query parameter.

### R20
WHEN `useGetAuthToken` receives an HTTP 200 response, the system SHALL store
the token in `store.xToken` and return the token string.

### R21
WHEN `useGetAuthToken` encounters a network error, the system SHALL return
`null` and SHALL NOT modify `store.xToken`.

### R22
WHEN `useGetSongs` receives an HTTP 200 response, the system SHALL return the
response data array.

### R23
WHEN `useGetSongs` encounters an error, the system SHALL return an empty array.

### R24
WHEN `useUpdateUserData` receives an HTTP 200 response, the system SHALL call
`store.setUserLogged` with the response data and navigate to `/app`.

### R25
WHEN `useUpdateUserData` encounters an error, the system SHALL return the error
message from the API response.

### R26
WHEN `useValidateEmail` receives an HTTP 200 response, the system SHALL return
`{ result: true, data: <response data> }`.

### R27
WHEN `useValidateEmail` is called with an empty token, the system SHALL return
`{ result: false, data: null }` without making an HTTP request.

### R28
WHEN `useValidateToken` receives an HTTP 200 response with `isValidToken: true`,
the system SHALL return `true`.

### R29
WHEN `useValidateToken` encounters an error or receives a non-200 response, the
system SHALL return `false`.

---

## Components

### R30
WHEN the `Collapsible` component is rendered with `collapsed` unset, the system
SHALL display the title and a `+` indicator, with content hidden.

### R31
WHEN the `Collapsible` header button is clicked, the system SHALL toggle
visibility of the content and emit a `toggle` event.

### R32
WHEN the `Modal` component is rendered with `status="success"`, the system SHALL
apply the `success-modal` CSS class; WHEN `status="error"`, the system SHALL
apply the `error-modal` CSS class.

### R33
WHEN the `Modal` component is rendered with `confirm=true`, the system SHALL
display "Aceptar" and "Cancelar" buttons that call `onaccept` and `onclick`
respectively.

### R34
WHEN the `Form` component password toggle is clicked, the system SHALL toggle
the password field visibility between `password` and `text` input types.

### R35
WHEN the `Form` component "remember me" checkbox is toggled, the system SHALL
call `store.setRememberUser` with the checked state.

### R36
WHEN the `AdminPanel` component close button is clicked, the system SHALL call
the `close` prop callback.

### R37
WHEN the `CountryPicker` component checkbox is changed, the system SHALL update
the store selection and enforce the maximum selection count.

### R38
WHEN the `RoomPicker` component admin-pencil button is clicked, the system
SHALL open the edit modal for that room.

### R39
WHEN the `RoomNameEditForm` form is submitted with a valid room name, the
system SHALL call `axios.put` with the updated room data.

### R40
WHEN the `Navigation` component user-menu button is clicked, the system SHALL
toggle the user dropdown visibility.

### R41
WHEN the `Footer` component is rendered, the system SHALL display the author
name and current year.

### R42
WHEN the `NotFound` component is rendered, the system SHALL display a
not-found message.

### R43
WHEN the `ClassificationView` component receives room data, the system SHALL
render users filtered by minimum country count.

---

## Router guards (`src/router/index.ts`)

### R44
WHEN an unauthenticated user navigates to a route with `requiresAuth` meta, the
system SHALL redirect to `/login`.

### R45
WHEN an authenticated user navigates to a route with `guestOnly` meta, the
system SHALL redirect to `/app`.

### R46
WHEN a non-admin user navigates to a route with `requiresAdmin` meta, the
system SHALL redirect to `/app`.

---

## Types and interfaces

### R47
WHEN the `Config` interface is instantiated, the system SHALL accept only
objects containing all required fields (`env`, `isProd`, `baseUrl`,
`appAdmin`, `authP`, `key`, `defProfilePicUrl`, `joinRoomLink`,
`confirmemailLink`, `joinRoomPath`, `clientID`, `requestsUrl`,
`requestsBaseUrl`); missing fields SHALL cause a TypeScript compilation error.

### R48
WHEN the `User` interface is used, the system SHALL require `id`, `username`,
`email`, `image`, `countries`, and `rooms` fields; the type system SHALL
enforce these at compile time.

### R49
WHEN runtime data does not conform to the expected interface shape, the system
SHALL handle it gracefully (e.g., `userLogged` defaults to `false` when no
user is authenticated; `songs` defaults to `[]`).