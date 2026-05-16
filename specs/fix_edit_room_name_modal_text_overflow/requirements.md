# Requirements — fix_edit_room_name_modal_text_overflow

## R1
WHEN the RoomNameEditForm modal is displayed, the system SHALL render
the room name text input with a `box-sizing: border-box` property so
that any padding is subtracted from the declared `width: 100%`.

## R2
WHEN the RoomNameEditForm modal is displayed, the text inside the room
name input SHALL NOT overflow horizontally beyond the modal boundaries
at any viewport width.

## R3
WHEN the RoomNameEditForm modal is displayed, the system SHALL render
the "Save" (`action-btn`) and "Cancel" (`action-delete-btn`) buttons
such that their text content remains fully visible without clipping or
overflowing the button boundaries.

## R4
WHEN the RoomNameEditForm modal is displayed on a viewport narrower
than 1000px (where `.modal` width equals `70%`), the system SHALL
render the action buttons with a `gap` and `font-size` that prevents
the button text from wrapping within the button or overflowing.

## R5
WHEN the RoomNameEditForm modal is displayed on a viewport 1000px or
wider (where `.modal` width equals `30%`), the system SHALL render the
action buttons with sufficient width or horizontal padding to display
their text content without overflow.

## R6
WHEN the RoomNameEditForm modal is displayed, the `modal-action-buttons`
container SHALL allow both buttons to fit side by side within the
available width without forcing them to overflow or collapse.

## R7
IF any text in the room name input or action buttons still overflows
after applying `box-sizing: border-box` and adjusting padding, THEN
the system SHALL apply `white-space: nowrap` and/or `overflow: hidden`
with `text-overflow: ellipsis` as a fallback to prevent layout breakage.

## R8
WHEN the RoomNameEditForm modal is displayed, the system SHALL apply
`word-break: break-word` or `overflow-wrap: break-word` to the input
element to ensure long room names wrap correctly within the input
boundaries.
