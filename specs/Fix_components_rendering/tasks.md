# Tasks — Fix Components Rendering

- [x] T1 — Fix form ref binding in `src/components/Form/Form.vue`: import `toRaw` from Vue and change both ref bindings from `field.ref.value = el` to `toRaw(field.ref).value = el` to ensure the assignment propagates through the reactive proxy. Covers: R8, R9.
- [x] T2 — Add `() => store.songs` to the watch dependency array in `src/views/App/Home.vue` and guard the redirect logic to only run when `store.songs.length > 0`. Covers: R1, R4.
- [x] T3 — Add username update section to `src/views/UserDetails/UserDetails.vue` template: a `Collapsible` containing a `Form` with username field using `userNameRef` and `updateUserName` handler. Covers: R3, R5.
- [x] T4 — Add email update section to `src/views/UserDetails/UserDetails.vue` template: a `Collapsible` containing a `Form` with email field using `emailRef` and `updateEmail` handler. Covers: R3, R5.
- [x] T5 — Add password update section to `src/views/UserDetails/UserDetails.vue` template: a `Collapsible` containing a `Form` with two password fields using `passRef`/`pass2Ref` and `updatePassword` handler. Covers: R3, R5.
- [x] T6 — Add profile image update section to `src/views/UserDetails/UserDetails.vue` template: a `Collapsible` containing a file input using `imageRef` with preview and `updateImage` handler. Covers: R3, R5.
- [x] T7 — Create `tests/Form.test.ts` verifying that ref values are correctly captured after user input (type text, submit, verify `ref.value?.value` is not null). Covers: R8, R9.
- [x] T8 — Create `tests/Home.test.ts` with test verifying logged-in user with insufficient countries is redirected to `/country-select` after songs load. Covers: R1, R4.
- [x] T9 — Create `tests/Home.test.ts` test verifying logged-in user with sufficient countries sees room picker content. Covers: R2.
- [x] T10 — Add test to `tests/UserDetails.test.ts` verifying profile view renders username, email, password, and image update sections. Covers: R3, R5.
- [x] T11 — Run `./init.sh` and verify all tests pass green. Covers: R1-R9.
- [x] T12 — Review `ARCHITECTURE.md` for any needed updates (expected: no changes). Covers: R1-R9.
