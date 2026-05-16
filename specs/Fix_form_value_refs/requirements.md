# Requirements — Fix Form Value Refs

## R1
WHEN the user types into any form input rendered by the `Form` component, the system SHALL make the entered value accessible to the parent component's submit handler.

## R2
WHEN the user submits a form, the system SHALL read the current input values from reactive state (not from stale DOM element references).

## R3
IF a form field is passed a Vue `ref()` to the `Form` component via the `fields` prop, the system SHALL correctly bind the input element to that ref so that `ref.value` reflects the current DOM element and its `.value` property reflects the user's input.

## R4
WHEN the `Form` component renders password fields with a visibility toggle, the system SHALL preserve the input value when switching between `type="password"` and `type="text"`.

## R5
WHERE a form uses the `Form` component with multiple fields (Login, SignUp, CreateRoom, MissingEmail, AdminView, UserDetails), the system SHALL ensure each field's value is independently accessible by its corresponding ref.

## R6
WHEN the user interacts with the room name edit form (`RoomNameEditForm.vue`), the system SHALL keep the `v-model` bound value in sync with the input element.

## R7
WHEN the user interacts with the Navigation admin panel password form, the system SHALL make the password value accessible via `passwordRef.value?.value` in the submit handler.

## R8
IF a form input value is `undefined` or `null` at the time of form submission, the system SHALL NOT send the request to the backend and SHALL display an appropriate validation error.

## R9
The system SHALL provide automated tests that verify form input values are correctly captured in refs after user interaction for each form view (Login, SignUp, CreateRoom, MissingEmail, AdminView, UserDetails, Navigation/AdminPanel, RoomNameEditForm).

## R10
WHEN the `ARCHITECTURE.md` file describes the form architecture, it SHALL accurately reflect the reactive state management approach used by the `Form` component and its consumers.
