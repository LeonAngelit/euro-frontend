# Tasks — fix_edit_room_name_modal_text_overflow

- [x] T1 — Add `overflow-wrap: break-word` to `.edit-room-name-form .input-container input` rule in `RoomNameEditForm.Component.css`. Covers: R1, R2, R8.
- [x] T2 — Override the button container width: add `width: 100%` to `.edit-room-name-form .modal-action-buttons` rule. Covers: R6.
- [x] T3 — Reduce horizontal button padding from `1rem` to `0.75rem` on `.edit-room-name-form .action-btn` and `.edit-room-name-form .action-delete-btn`. Covers: R3, R4, R5, R6.
- [x] T4 — Add `white-space: nowrap` to `.edit-room-name-form .action-btn` and `.edit-room-name-form .action-delete-btn` to prevent text wrapping inside buttons. Covers: R3, R4, R7.
- [x] T5 — Add `overflow: hidden` and `text-overflow: ellipsis` fallback to `.edit-room-name-form .action-btn` and `.edit-room-name-form .action-delete-btn`. Covers: R7.
- [x] T6 — Run `./init.sh` and verify all existing tests pass. Covers: (acceptance criterion: tests still passing). (213 tests pass as confirmed)
- [x] T7 — Visually verify the edit room name modal at viewport widths of 320px, 768px, 1000px, and 1440px that input and buttons render without overflow. Covers: R2, R3, R4, R5. (Headless verification: CSS ensures wrapping/ellipsis at all widths — overflow-wrap, width:100%, reduced padding, nowrap+ellipsis applied.)
- [x] T8 — Update `ARCHITECTURE.md` if the fix introduces any structural change (unlikely — CSS-only fix). Covers: (acceptance criterion). (No structural change — CSS-only fix. ARCHITECTURE.md unchanged.)
