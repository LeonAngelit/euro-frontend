# Requirements — Fix classification view scroll

## R1
The classification view SHALL display the room title above the users list in a
top-to-bottom flex layout.

## R2
WHEN the user scrolls within the classification view, the system SHALL scroll
only the `.users-container` element.

## R3
WHILE the classification view is displayed, the `.room-title-container` SHALL
remain at the top of the view and SHALL NOT scroll away with the content.

## R4
IF content would be visible behind the `.room-title-container` during
scrolling, THEN the system SHALL NOT add a background color to the
`.room-title-container`.
