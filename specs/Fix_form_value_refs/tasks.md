# Tasks — Fix Form Value Refs

- [x] T1: Fix `Form.vue` template ref binding — change `field.ref = el` to `field.ref.value = el` in both password and non-password input refs. Covers: R1, R2, R3, R5.
- [x] T2: Fix `FormField` interface in `Form.vue` — change `ref?: HTMLInputElement | null` to `ref?: Ref<HTMLInputElement | null>` and import `Ref` from 'vue'. Covers: R3.
- [x] T3: Fix `AdminPanel.vue` prop type — change `refer: HTMLInputElement | null` to `refer: Ref<HTMLInputElement | null>` and import `Ref` from 'vue'. Covers: R7.
- [x] T4: Add Form unit test — verify that after setting input value via `setValue()`, the passed `ref.value?.value` equals the entered text. Covers: R1, R3, R9.
- [x] T5: Add Form unit test — verify multiple fields each capture their values independently in their respective refs. Covers: R5, R9.
- [x] T6: Add Form unit test — verify password toggle preserves input value when switching between password/text types. Covers: R4, R9.
- [x] T7: Add Login view test — mount Login, type username and password, submit, verify refs contain entered values before API call. Covers: R1, R2, R8, R9.
- [x] T8: Add SignUp view test — mount SignUp, type all 4 fields, submit, verify all refs contain entered values. Covers: R1, R2, R5, R9.
- [x] T9: Add CreateRoom view test — mount CreateRoom, type all 3 fields, submit, verify refs contain entered values. Covers: R1, R2, R5, R9.
- [x] T10: Add MissingEmail view test — mount MissingEmail, type email, submit, verify ref contains entered value. Covers: R1, R2, R9.
- [x] T11: Add AdminPanel test — mount AdminPanel via Navigation, type password, submit, verify ref contains entered value. Covers: R7, R9.
- [x] T12: Add RoomNameEditForm test — mount component, type room name, verify v-model and ref are in sync. Covers: R6, R9.
- [x] T13: Run `./init.sh` and verify all existing tests pass (no regressions). Covers: R9.
- [x] T14: Review `ARCHITECTURE.md` section 4 (Component Architecture) and section 6 (State Management) — update if the form ref binding approach is described. Covers: R10.
