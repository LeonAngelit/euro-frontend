# Design — remove_bcrypt_client

## Overview

Remove all `bcryptjs` usage from the client by shifting every hash and
comparison operation to the backend (`euroncontest-api`). The frontend will
send plaintext values instead of pre-hashed ones; the backend must absorb
the hashing/verification responsibility.

## Files Modified in this Project

| File | Change |
|------|--------|
| `src/composables/useGetAuthToken.ts` | Remove `bcryptjs` import; send `config.authP` as plaintext in `Authorization` header |
| `src/components/Navigation/Navigation.vue` | Remove `bcryptjs` import; replace client-side `bcrypt.compareSync` with a call to a backend admin-login endpoint |
| `src/views/CreateRoom/CreateRoom.vue` | Remove `bcryptjs` import; send `passwordRef` value as plaintext in `POST /rooms` body |
| `src/views/AdminView/AdminView.vue` | Remove `bcryptjs` import; send `passRef` value as plaintext in `PUT /updatable` body |
| `src/views/UserDetails/UserDetails.vue` | Remove `bcryptjs` import; send `passRef` value as plaintext in `PUT /users/:id` body |
| `src/views/CreateUser/SignUp.vue` | Remove `bcryptjs` import; send `passwordRef` value as plaintext in `POST /users/signup` body |
| `package.json` | Remove `"bcryptjs": "^3.0.2"` from dependencies |

## Technical Decisions

### D1 — Auth token: plaintext in Authorization header

**Decision**: Send `config.authP` directly as the `Authorization` header value
instead of hashing it first.

**Current flow**: `useGetAuthToken` hashes `config.authP` with `bcrypt.hashSync`
and sends the result in `Authorization`. The backend `headerAuth` middleware
verifies with `bcrypt.compareSync(config.authp, receivedHash)`.

**New flow**: Send `config.authP` as plaintext. Backend `headerAuth` must switch
to a direct string comparison: `receivedAuth === config.authp`.

**Rationale**: The `Authorization` header is already sent over HTTPS. Hashing
a shared secret client-side provides no real security benefit since the hash
itself becomes the credential. Direct comparison is simpler and equally secure
over TLS.

**Alternative discarded**: Switch `headerAuth` to a JWT-based check. Rejected
because the `/getAuthToken` route already returns a JWT — the initial auth is
deliberately a shared-secret pattern. Over-engineering for this single route is
unnecessary.

### D2 — Admin login: new backend verification endpoint

**Decision**: Create a new endpoint `POST /updatable/verify-password` in the
backend that receives `{ password: string }` and returns `{ valid: boolean }`.

**Current flow**: `Navigation.vue` calls `GET /updatable`, receives
`master_password` (a bcrypt hash) in the response, then does
`bcrypt.compareSync(pass, response.data.master_password)` locally.

**New flow**: `Navigation.vue` calls `POST /updatable/verify-password` with the
typed plaintext password. The backend does
`bcrypt.compareSync(password, storedMasterPassword)` and returns
`{ valid: true }` or `401`.

**Rationale**: The `master_password` hash must never leave the server. Moving
verification server-side prevents exposing the hash.

**Alternative discarded**: Send `master_password` hash to the client and keep
client-side comparison. Rejected because it leaks a bcrypt hash to the client,
which is a security risk (the hash IS the credential for admin access).

### D3 — Password fields: send plaintext, let backend hash

**Decision**: For `POST /rooms`, `PUT /updatable`, `PUT /users/:id`, and
`POST /users/signup`, send the plaintext password in the existing `password`
or `master_password` field. The backend must hash before persisting.

**Current flow**: Frontend hashes with `bcrypt.hashSync(value, 12)` and sends
the hash. Backend stores the received value directly, assuming it is already
hashed.

**New flow**: Frontend sends plaintext. Backend hashes with
`bcrypt.hashSync(value, 12)` before persisting.

**Rationale**: Password hashing is a server-side concern. Sending pre-hashed
values means the hash itself becomes the effective password, providing no real
security gain and complicating the backend's password verification logic.

**Alternative discarded**: Use HTTPS-only hashing scheme (e.g., SRP). Rejected
as over-engineered for this project's scope.

### D4 — Security consideration: HTTPS

All endpoints that now receive plaintext passwords or auth secrets must be
served over HTTPS. This is already the case in production (the backend uses
TLS via its hosting provider). The `VITE_REACT_APP_BASEURL` should use `https`
in production. No code change is needed for this — it is documented as a
prerequisite.

## Backend Changes Required (euroncontest-api)

These changes are outside the scope of this project's code but are documented
for coordination. They must be implemented in `euroncontest-api` before or
alongside the frontend changes.

| Backend File | Change |
|---|---|
| `midlewares/auth.handler.js` — `headerAuth` | Replace `bcrypt.compareSync(config.authp, data)` with a direct string comparison `data === config.authp` |
| `midlewares/auth.handler.js` — `bcrypt` import | Remove `bcrypt` import if no longer needed |
| `routes/updatable.js` | Add `POST /verify-password` route that calls `updatableService.verifyPassword(password)` |
| `services/updatable.service.js` | Add `verifyPassword(password)` method using `bcrypt.compareSync` |
| `routes/updatable.js` — `PUT /` | Hash `master_password` field if present before persisting |
| `services/rooms.service.js` — `create` | Hash `data.password` with `bcrypt.hashSync` before creating room |
| `services/users.service.js` — `create` | Hash `data.password` with `bcrypt.hashSync` before creating user |
| `services/users.service.js` — `update` | Hash `data.password` with `bcrypt.hashSync` if present in update payload |
| `services/users.service.js` — `accessWithGoogle` | Keep existing bcrypt hash logic (generates password internally) |

Note: `services/users.service.js` `loginByName` and `loginByEmail` already use
`bcrypt.compareSync` correctly. No change needed there — they compare plaintext
against a stored hash, which is the correct pattern once the stored hashes are
generated server-side.

Note: `services/rooms.service.js` `loginByRoomName` already uses
`bcrypt.compareSync` correctly. It compares the received password against the
stored hash. This continues to work after the change because stored hashes will
now be generated by the backend instead of the frontend.

## Dependency Impact

- `bcryptjs` is the only dependency being removed.
- No new dependencies are added to the frontend project.
- The frontend does not gain any new API endpoints except
  `/updatable/verify-password` (backend change).

## Rollback Plan

If the backend changes are not yet deployed, the frontend can temporarily keep
the client-side hashing while the backend is updated. The two changes (frontend
and backend) should be deployed together to avoid a window where passwords are
sent in plaintext to a backend that expects pre-hashed values.