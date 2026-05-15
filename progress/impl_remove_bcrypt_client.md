# Implementation Report — remove_bcrypt_client (id 4)

## Status: DONE

## Summary

Removed all `bcryptjs` usage from the frontend. Passwords and auth secrets are now sent as plaintext to the backend, which is the expected behavior — the backend should handle hashing.

## Files Modified

| File | Change |
|------|--------|
| `src/composables/useGetAuthToken.ts` | Removed `import bcrypt from 'bcryptjs'`, removed `bcrypt.genSaltSync(12)` and `bcrypt.hashSync(config.authP, salt)`, sending `config.authP` directly in `Authorization` header |
| `src/components/Navigation/Navigation.vue` | Removed `import bcrypt from 'bcryptjs'`, replaced `loginAdmin` to call `POST /updatable/verify-password` with `{ password: pass }` instead of client-side `bcrypt.compareSync`, removed fallback plaintext comparison `pass == response.data.master_password` |
| `src/views/CreateRoom/CreateRoom.vue` | Removed `import bcrypt from 'bcryptjs'`, removed `bcrypt.genSaltSync`/`bcrypt.hashSync`, sending `passwordRef.value!.value` as plaintext `password` field |
| `src/views/AdminView/AdminView.vue` | Removed `import bcrypt from 'bcryptjs'`, removed `bcrypt.genSaltSync`/`bcrypt.hashSync`, sending `passRef.value!.value` as plaintext `master_password` field |
| `src/views/UserDetails/UserDetails.vue` | Removed `import bcrypt from 'bcryptjs'`, removed `bcrypt.genSaltSync`/`bcrypt.hashSync`, sending `passRef.value!.value` as plaintext `password` field |
| `src/views/CreateUser/SignUp.vue` | Removed `import bcrypt from 'bcryptjs'`, removed `bcrypt.genSaltSync`/`bcrypt.hashSync`, sending `passwordRef.value!.value` as plaintext `password` field |
| `package.json` | Removed `"bcryptjs": "^3.0.2"` from dependencies |
| `package-lock.json` | Regenerated via `npm install` (bcryptjs removed from lock file) |

## Verification Results

- **TypeScript compilation** (`npx vue-tsc --noEmit`): Zero errors ✅
- **Test suite** (`npm test`): 6 files, 20 tests passed ✅
- **Final sweep** (`grep -r "bcrypt" src/`): Zero results ✅
- **`./init.sh`**: All checks pass ✅

## Requirement Traceability

| Requirement | How Verified |
|-------------|-------------|
| R1 — No `bcryptjs`/`bcrypt` in client source | `grep -r "bcrypt" src/` returns zero results |
| R2 — `bcryptjs` removed from `package.json` dependencies | Confirmed removed; `npm install` ran successfully |
| R3 — TypeScript compiles & tests pass | `npx vue-tsc --noEmit` = 0 errors; `npm test` = 20/20 pass |
| R4 — `useGetAuthToken.ts` sends plaintext `config.authP` | `Authorization: config.authP` replaces `Authorization: token` |
| R5 — `Navigation.vue` uses backend verify-password endpoint | `POST /updatable/verify-password` with `{ password: pass }` replaces `bcrypt.compareSync` |
| R6 — `CreateRoom.vue` sends plaintext password | `password: passwordRef.value!.value` replaces hashed value |
| R7 — `AdminView.vue` sends plaintext master_password | `master_password: passRef.value!.value` replaces hashed value |
| R8 — `UserDetails.vue` sends plaintext password | `password: passRef.value!.value` replaces hashed value |
| R9 — `SignUp.vue` sends plaintext password | `password: passwordRef.value!.value` replaces hashed value |
| R10 — `Navigation.vue` removes plaintext fallback comparison | `pass == response.data.master_password` removed |
| R11 — `useGetAuthToken.ts` removes hash logic | `bcrypt.genSaltSync` and `bcrypt.hashSync` removed; `config.authP` sent directly |
| R12 — All passwords/creds removed from client hashing | All 6 files modified; no `bcrypt` calls remain |

## Backend Coordination Required

The following backend changes are required (documented in design.md):

1. **`GET /getAuthToken`**: Accept plaintext `config.authP` in `Authorization` header (instead of hash). Compare against stored hash or verify as plaintext.
2. **`POST /updatable/verify-password`**: New endpoint — receives `{ password }`, verifies against stored hash, returns `200` with updatable data on success or `401` on failure.
3. **`POST /rooms`**: Hash the plaintext `password` field before persisting.
4. **`PUT /updatable`**: Hash the plaintext `master_password` field before persisting.
5. **`PUT /users/:id`**: Hash the plaintext `password` field before persisting.
6. **`POST /users/signup`**: Hash the plaintext `password` field before persisting.