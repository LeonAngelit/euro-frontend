# Requirements — Fix modal refresh issue

## R1
WHEN the page is loaded and the persisted `modal.visible` property is `true`, the system SHALL reset the `modal` state to an empty object (`{}`) during the store initialization, before any component renders.

## R2
IF the `modal` state contains functions or component references (e.g., `onclick`, `onaccept`, `component`) that were lost during JSON serialization/deserialization, THEN the system SHALL NOT leave `modal.visible` as `true`.

## R3
WHEN the user refreshes the page while the room name edit modal is open, the system SHALL render no visible modal overlay.

## R4
WHERE the user opens any modal and refreshes the page, the system SHALL keep the modal hidden (not visible) on the restored page, regardless of which modal type (confirm, component, plain message) was open.

## R5
WHEN the store is persisted to `localStorage`/`sessionStorage`, the system SHALL exclude the `modal` state from serialization so that ephemeral UI state is never written to storage.

## R6
IF a persisted store state is restored from storage, the system SHALL NOT display stale `modal` state (visible=true) that was saved before the refresh.

## R7
WHEN `store.setModal({})` is called, the system SHALL set `modal` to `{}`, which makes `modal.visible` falsy and hides all modal overlays.

## R8
All existing tests SHALL pass after the implementation.
