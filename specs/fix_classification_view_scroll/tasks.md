# Tasks — Fix classification view scroll

- [x] T1 — Add flex column layout and height constraint to `.classification-container`. Covers: R1.
- [x] T2 — Remove sticky positioning from `.room-title-container` and add `flex-shrink: 0`. Covers: R3, R4.
- [x] T3 — Make `.users-container` the scroll container. Covers: R2.
- [x] T4 — Verify: run `./init.sh` and confirm all tests pass. Covers: R1, R2, R3, R4.
- [x] T5 — Hide scrollbar in `.users-container`: add `scrollbar-width: none;` and non-scoped `::-webkit-scrollbar { display: none; }`.
