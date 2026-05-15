# Requirements — remove_bcrypt_client

## R1

The project SHALL NOT import or depend on `bcryptjs` or `bcrypt` in any
client-side source file.

## R2

The `bcryptjs` entry SHALL be removed from `package.json` dependencies.

## R3

The project SHALL compile without TypeScript errors after removing
`bcryptjs`.

## R4

WHEN the client requests an auth token from `GET /getAuthToken`, the system
SHALL send the plaintext value of `VITE_REACT_APP_AUTH_P` in the
`Authorization` header instead of a bcrypt hash.

## R5

WHEN the admin login form submits a password, the system SHALL send the
plaintext password to a backend verification endpoint instead of comparing it
client-side with `bcrypt.compareSync`.

## R6

WHEN a new room is created via `POST /rooms`, the system SHALL send the
plaintext room password in the request body instead of a bcrypt hash.

## R7

WHEN the admin updates the master password via `PUT /updatable`, the system
SHALL send the plaintext password in the request body instead of a bcrypt
hash.

## R8

WHEN a user updates their password via `PUT /users/:id`, the system SHALL
send the plaintext password in the request body instead of a bcrypt hash.

## R9

WHEN a new user signs up via `POST /users/signup`, the system SHALL send the
plaintext password in the request body instead of a bcrypt hash.

## R10

WHEN the backend receives a plaintext password that it must persist, the
backend SHALL hash the password with bcrypt before storing it. This requirement
applies to the `euroncontest-api` project and is documented here for
coordination purposes.

## R11

WHEN the backend receives a plaintext auth credential in the `Authorization`
header of `GET /getAuthToken`, the backend SHALL compare it directly against
the configured secret instead of using `bcrypt.compareSync`. This requirement
applies to the `euroncontest-api` project and is documented here for
coordination purposes.

## R12

WHEN the admin submits a password for verification, the backend SHALL provide
an endpoint that compares the plaintext password against the stored bcrypt
hash using `bcrypt.compareSync` and returns a success or failure response.
This requirement applies to the `euroncontest-api` project and is documented
here for coordination purposes.