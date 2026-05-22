# Design — Fix classification view scroll

## Problem

`.room-title-container` uses `position: sticky; top: 0;` to stay at the top
while the parent `.container` scrolls. Because the title has no background
color (transparent), content that scrolls under it remains visible, creating
a visually broken effect. Adding a background to the title is prohibited
by the user (R4).

## Solution

Move the scroll responsibility from the parent `.container` (global CSS) to
the `.users-container` within each `ClassificationView`. The structure
becomes:

```
.classification-container  ← flex column, height 100%, overflow hidden
├── .room-title-container  ← flex-shrink: 0, no sticky, always at top
└── .users-container       ← flex: 1, overflow-y: auto, min-height: 0
```

Because `.room-title-container` is **outside** the scrollable area, content
never passes behind it. No background is needed.

## Files modified

| File | Change |
|------|--------|
| `src/components/ClassificationView/ClassificationView.vue` | CSS changes in `<style scoped>` block |

No files are created.

## CSS changes

### `.classification-container` (add)

```css
display: flex;
flex-direction: column;
height: 100%;
overflow: hidden;
```

Makes the container fill the parent `.container` and participate in flex
column layout. `overflow: hidden` prevents the whole thing from scrolling
when the parent `.container` has `overflow: scroll`.

### `.room-title-container` (remove sticky, add flex-shrink)

Remove:
- `position: sticky`
- `top: 0`

Add:
- `flex-shrink: 0`

Keep all other existing styles (width, height, margin-bottom, z-index,
border-bottom, padding, display, align-items).

`flex-shrink: 0` prevents the title bar from being compressed when `.users-container`
needs space.

### `.users-container` (add: scroll ownership)

Add:
```css
flex: 1;
overflow-y: auto;
min-height: 0;
```

- `flex: 1` — fills the remaining vertical space after the title.
- `overflow-y: auto` — enables vertical scrolling for the users list.
- `min-height: 0` — required for Firefox to allow flex child to shrink below
  its content height and enable scrolling.

## Alternative discarded

**Add a background to `.room-title-container`** — This would fix the
transparency issue in one line (`background: rgba(2, 2, 94, 1)` matching the
page background), but the user explicitly prohibited it (R4). It would also
not match the glassmorphism design where containers have semi-transparent
backgrounds.
