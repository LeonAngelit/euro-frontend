# Tasks — fix_unused_updateRoomName

- [x] T1 — Add `editingRoomId` ref (`ref<string | null>(null)`) and `currentRoomName` computed in `RoomPicker.vue` script section. Covers: R1, R7.
- [x] T2 — Add `openEditModal(room: Room)` function that sets `editingRoomId`, `currentRoomName`, clears `error`, and calls `store.setModal({ visible: true, component: RoomNameEditForm, onaccept: undefined, onclick: () => { editingRoomId = null; store.setModal({}) } })`. Covers: R1, R7.
- [x] T3 — Fix the pencil icon button in the template: change `@click` handler from `forgetRoom` to `openEditModal(room)`. This button keeps `v-if="room.adminId == (store.userLogged as any)?.id"`. Covers: R1, R2, R8.
- [x] T4 — Add a separate forget-room button with `mdi:link-off` icon, `v-if="room.adminId == (store.userLogged as any)?.id"`, and `@click` that opens a confirm modal calling `forgetRoom`. Covers: R8.
- [x] T5 — Create `RoomNameEditForm` component (inline or SFC) with: a `<form @submit.prevent>` calling `updateRoomName(event, editingRoomId)`, a text `<input>` bound via `ref="roomNameRef"` with default value from `currentRoomName`, an error display for `error.status`, and a submit button. Covers: R1, R3, R4.
- [x] T6 — Verify `updateRoomName` function works correctly when receiving the event from `RoomNameEditForm`: it validates via `validateUserNameRegex`, sends PUT to `rooms/{roomId}/{userId}`, shows success/error modal, and refreshes user data. Covers: R3, R4, R5, R6.
- [x] T7 — Write unit test: clicking the pencil button on a room where user is admin opens the edit modal (verify `editingRoomId` is set and `store.modal.visible` is true). Covers: R1.
- [x] T8 — Write unit test: the pencil button is not rendered for rooms where the user is not admin. Covers: R2.
- [x] T9 — Write unit test: submitting the form with an invalid name shows error and does not call the API. Covers: R4.
- [x] T10 — Write unit test: submitting the form with a valid name calls `updateRoomName` and sends the correct PUT request. Covers: R3.
- [x] T11 — Write unit test: successful PUT response shows success modal and refreshes user data. Covers: R5.
- [x] T12 — Write unit test: failed PUT response shows error modal with API error message. Covers: R6.
- [x] T13 — Write unit test: clicking cancel/exit on the edit modal closes it without API calls and resets `editingRoomId`. Covers: R7.
- [x] T14 — Write unit test: the forget-room button opens a confirm modal and the forget action works. Covers: R8.