# Requirements — fix_unused_updateRoomName

## R1
WHEN an admin user (where `room.adminId` equals the logged-in user's id)
clicks the edit button on a room card in the RoomPicker component,
the system SHALL open a modal containing a text input pre-filled with
the current room name and a submit button.

## R2
WHERE a non-admin user views a room card in the RoomPicker component,
the system SHALL NOT display the edit room name button.

## R3
WHEN the admin user submits the modal form with a new room name,
the system SHALL call `updateRoomName` with the form event and the
room id, sending a PUT request to `rooms/{roomId}/{userId}` with the
payload `{ name: <newName> }`.

## R4
WHEN the admin user submits the modal form with a room name that fails
the `validateUserNameRegex` check, the system SHALL display the error
message "Nombre de sala no válido" inside the modal and SHALL NOT send
the PUT request.

## R5
WHEN the PUT request succeeds (HTTP 200), the system SHALL display a
success modal with the message "Actualización correcta" and update the
user data via `store.setUserLogged`.

## R6
WHEN the PUT request fails, the system SHALL display an error modal
with the error message from the API response.

## R7
WHEN the admin user clicks the cancel button on the edit room name
modal, the system SHALL close the modal without making any API request.

## R8
The "forget room" action SHALL remain accessible to the room admin via
a separate button distinct from the edit room name button.