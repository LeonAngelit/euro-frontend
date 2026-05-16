# Design — fix_edit_room_name_modal_text_overflow

## Context

The RoomNameEditForm renders inside a Modal component. On viewports
narrower than 1000px, `.modal` has `width: 70%`; on wider viewports it
has `width: 30%`. The `.modal.modal-component` also has `right: 16%`
which shifts the modal left, further reducing the effective content area.

The action buttons are in a flex container with `justify-content:
space-between` and `gap: 0.5rem`. Each button has `padding: 0.5rem 1rem`
and `font-size: 0.875rem`. The button container has `width: 80%` in the
base `modal-action-buttons` rule from `Modal.component.css`.

On narrow viewports (70% width) the effective container is small enough
that `1rem` horizontal padding on buttons plus the 0.5rem gap can cause
text to overflow — especially when i18n translations produce long strings.

## Files Modified

| File | Change |
|------|--------|
| `src/Components/RoomPicker/RoomNameEditForm.Component.css` | Override button padding, add white-space/overflow rules, ensure input box-sizing and word-break. Remove the conflicting inherited `width` constraint on button container. |

## Root Cause

1. The button container inherits `width: 80%` from `Modal.component.css`
   `.modal-action-buttons` rule, but the `RoomNameEditForm` uses its own
   `.modal-action-buttons` rule (without `width`). The inherited 80% may
   be too narrow when combined with padding.
2. Button horizontal padding (`0.5rem 1rem`) consumes 2rem of horizontal
   space per button, which on a 70%-width viewport can exceed the
   available container width.
3. The input has `box-sizing: border-box` already, but long room names
   lack `overflow-wrap: break-word` or `word-break`, so they can
   overflow the input bounds.

## Technical Decisions

### D1 — Narrow button padding and container width fix

Reduce button horizontal padding from `1rem` to `0.75rem` (or smaller)
and ensure the form's `.modal-action-buttons` explicitly sets `width:
100%` to override the inherited `80%` from `Modal.component.css`.

The `RoomNameEditForm.Component.css` already scopes its rules under
`.edit-room-name-form`, so specificity is sufficient to win over the
base modal styles.

**Alternative discarded**: Changing `Modal.component.css` base rules.
This would affect all modals (confirm, success, error) which already
work correctly. The overflow is specific to the component modal form,
so the fix belongs in the form's CSS file.

### D2 — Text overflow safety net

Add `white-space: nowrap` to action buttons to prevent text wrapping
mid-word inside the button, combined with `overflow: hidden` and
`text-overflow: ellipsis` as a fallback for extreme cases.

**Alternative discarded**: Increasing modal width globally. This would
break other modals that rely on the current 70%/30% sizing.

### D3 — Input word-break

Add `overflow-wrap: break-word` (or `word-break: break-word`) to the
`.edit-room-name-form .input-container input` rule so that long room
names wrap within the input instead of overflowing.

This is already partially handled by `box-sizing: border-box` but
`word-break` covers the wrapping of long unbroken strings.

### D4 — No JavaScript changes required

This is purely a CSS fix. No `.vue` files or store logic need changes.
The only file modified is `RoomNameEditForm.Component.css`.

## Reference

- `src/Components/RoomPicker/RoomNameEditForm.Component.css` — Target file
- `src/Components/Modal/Modal.component.css` — Base modal styles (not modified)
- `src/components/Modal/Modal.vue` — Modal rendering (not modified)
- `src/components/RoomPicker/RoomNameEditForm.vue` — Form template (not modified)
