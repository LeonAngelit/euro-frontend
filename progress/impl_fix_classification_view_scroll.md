# Implementation Traceability — fix_classification_view_scroll

## Requirement Coverage

| Req | Description | Covered by | Test | Status |
|-----|-------------|-----------|------|--------|
| R1 | Flex column layout, title above users | T1 — `.classification-container` CSS | `test_classification_view_flex_layout — R1` | ✅ |
| R2 | Scroll only `.users-container` | T3 — `.users-container` CSS | `test_classification_view_scroll_container — R2` | ✅ |
| R3 | Title stays at top, doesn't scroll away | T2 — removed sticky, added flex-shrink: 0 | `test_classification_view_title_stays_at_top — R3` | ✅ |
| R4 | No background added to title | T2 — no `background` property added | `test_classification_view_title_no_background — R4` | ✅ |

## Test Results

`./init.sh`: All 39 test files passed, all 305 tests passed.

## Files Modified

- `src/components/ClassificationView/ClassificationView.vue` — CSS changes only in `<style scoped>` block.

## Summary of Changes

1. **`.classification-container`** (new rule): `display: flex; flex-direction: column; height: 100%; overflow: hidden;`
2. **`.room-title-container`** (modified): Removed `position: sticky` and `top: 0`, added `flex-shrink: 0`, kept all other styles.
3. **`.users-container`** (new rule): `flex: 1; overflow-y: auto; min-height: 0; scrollbar-width: none;`
4. **Scrollbar hidden** (non-scoped style block): `.users-container::-webkit-scrollbar { display: none; }`
