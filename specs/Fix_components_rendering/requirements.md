# Requirements — Fix Components Rendering

## R1
WHEN the user has logged in and has not yet selected the required number of countries, the system SHALL redirect the user to the country selection view (`/country-select`).

## R2
WHEN the user has logged in and has selected the required number of countries but has not joined a room, the system SHALL display the room picker and join-room form on the home view (`/app`).

## R3
WHILE the user is on the profile view (`/profile`), the system SHALL display collapsible sections for updating username, email, password, and profile image.

## R4
WHEN the `songs` (countries) list has not yet been fetched from the API, the system SHALL NOT evaluate the country-count redirect logic in the home view until `songs` is available.

## R5
WHEN the user clicks the profile link in the navigation menu, the system SHALL navigate to the profile view and render the profile update sections without requiring additional navigation.

## R6
WHEN the user has selected the required number of countries and is on the country selection view, the system SHALL redirect the user to the home view (`/app`).

## R7
IF the user's token is invalid or the user is not logged in, the system SHALL close the session and redirect to the login view.

## R8
WHEN the user types into any form input rendered by the `Form` component and submits the form, the system SHALL make the entered value accessible via the parent component's ref (e.g., `userNameRef.value?.value` SHALL NOT be `null` or `undefined`).

## R9
WHEN a Vue `ref()` object is passed to the `Form` component via the `fields` prop, the system SHALL correctly bind the DOM input element to that ref so that the parent component can read `ref.value` after mount.
