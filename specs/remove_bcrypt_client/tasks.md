# Tasks — remove_bcrypt_client

- [x] T1 — Remove `bcryptjs` import and usage from `src/composables/useGetAuthToken.ts`. Replace the hash with a direct `config.authP` value in the `Authorization` header. Covers: R4.
- [x] T2 — Remove `bcryptjs` import and client-side `bcrypt.compareSync` from `src/components/Navigation/Navigation.vue`. Replace the `loginAdmin` function with a call to `POST /updatable/verify-password` that sends the plaintext password and checks the response. Remove the fallback `pass == response.data.master_password` plain-text comparison. Covers: R5.
- [x] T3 — Remove `bcryptjs` import and client-side `bcrypt.hashSync` from `src/views/CreateRoom/CreateRoom.vue`. Send `passwordRef.value!.value` directly as the `password` field in the `POST /rooms` body instead of the hashed value. Covers: R6.
- [x] T4 — Remove `bcryptjs` import and client-side `bcrypt.hashSync` from `src/views/AdminView/AdminView.vue`. Send `passRef.value!.value` directly as the `master_password` field in the `PUT /updatable` body instead of the hashed value. Covers: R7.
- [x] T5 — Remove `bcryptjs` import and client-side `bcrypt.hashSync` from `src/views/UserDetails/UserDetails.vue`. Send `passRef.value!.value` directly as the `password` field in the `PUT /users/:id` body instead of the hashed value. Covers: R8.
- [x] T6 — Remove `bcryptjs` import and client-side `bcrypt.hashSync` from `src/views/CreateUser/SignUp.vue`. Send `passwordRef.value!.value` directly as the `password` field in the `POST /users/signup` body instead of the hashed value. Covers: R9.
- [x] T7 — Remove `"bcryptjs": "^3.0.2"` from the `dependencies` section of `package.json`. Run `npm install` to regenerate the lock file. Covers: R1, R2.
- [x] T8 — Run TypeScript compilation (`npx vue-tsc --noEmit` or equivalent) and confirm zero errors. Fix any type errors introduced by the `bcryptjs` removal. Covers: R3.
- [x] T9 — Run the existing test suite and confirm all tests pass. Covers: R3.
- [x] T10 — Search the entire `src/` directory for any remaining references to `bcrypt` or `bcryptjs` (imports, usages, type declarations) and remove them. Covers: R1.