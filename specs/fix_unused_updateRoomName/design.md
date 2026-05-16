# Design — fix_unused_updateRoomName

## Context

The `updateRoomName` function exists in `RoomPicker.vue` (script section,
line 145) but is never called from the template. The `roomNameRef` ref
(line 26) and `error` ref (line 25) are also unused in the template.
Currently, the pencil icon button (`mdi:pencil-outline`, line 248) is
wired to `forgetRoom` instead of room name editing — this is a bug; the
pencil icon semantically represents "edit" not "forget".

## Root Cause

The template has no UI element that triggers `updateRoomName`. The
existing pencil button was incorrectly assigned to the `forgetRoom`
action. There is no form or input bound to `roomNameRef` for capturing
a new room name.

## Files Modified

| File | Change |
|------|--------|
| `src/components/RoomPicker/RoomPicker.vue` | Template: fix pencil button to trigger edit-modal; add `RoomNameEditForm` component modal for editing. Script: add `openEditModal` handler. |

## Technical Decisions

### D1 — Use component modal for the edit form

The project's Modal component supports three modes:
- **Confirm modal** (`visible + confirm + !component`) — accept/cancel buttons only
- **Component modal** (`visible + component`) — renders a custom component inside the modal
- **Message modal** (`visible + !confirm + !component`) — plain status text

We need a text input inside the modal, which requires a **component
modal**. A new inline component `RoomNameEditForm` will be defined
within `RoomPicker.vue` using Vue's `<script setup>` pattern, containing
a form with a text input bound to `roomNameRef` and a submit handler
that calls `updateRoomName`.

**Alternative discarded**: Using a confirm modal with `onaccept`. This
cannot render a text input field, so it is insufficient for capturing
the new room name.

### D2 — Reactive state for the selected room

A new ref `editingRoomId` of type `string | null` is introduced. When the
admin clicks the pencil icon, `editingRoomId` is set to `room.id` and
the modal with the edit form is shown. When the modal is closed,
`editingRoomId` is reset to `null`.

### D3 — Pencil button wiring

The pencil icon button (`mdi:pencil-outline`) currently at line 235–251
calls `forgetRoom`. This button SHALL be changed to call `openEditModal`
instead. The `forgetRoom` action will remain available through the
existing forget button (which should use a different icon like
`mdi:link-off` or `mdi:logout` to distinguish from edit).

### D4 — RoomNameEditForm component

A small Vue component defined inside `RoomPicker.vue` (or as a separate
SFC in the same folder). It renders:
- A form with `@submit.prevent` calling `updateRoomName(event, editingRoomId)`
- An `<input>` of type `text` bound via `ref="roomNameRef"` and pre-filled
  with the current room name
- An error display conditionally shown when `error.status` is true
- Submit and cancel buttons

### D5 — Remember/forget button

The forget room button currently shares the pencil icon. After D3, the
pencil icon is exclusively for edit room name. A new button using
`mdi:link-off` or similar icon is added for the forget room action,
preserving the existing `forgetRoom` behavior with a confirm modal.

## Reference

- `src/components/Modal/Modal.vue` — Modal component with `component` prop
- `src/stores/app.ts` — `ModalState` interface with `component` field
- `src/Layout.vue` — Rendering logic for the three modal modes
- `src/components/Form/Form.vue` — Reference for form pattern with ref binding