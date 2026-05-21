# Design — Redesign User Cards with Glassmorphism & Glamour

## Overview

This is a **fundamental redesign** of `src/components/ClassificationView/ClassificationView.vue` scoped CSS. Feature 17's incremental tweaks failed because the root causes (nested clip-paths, negative margins, missing glassmorphism) require structural CSS changes, not value adjustments.

## Root Causes (Summary)

| Problem | Location | Impact |
|---------|----------|--------|
| Nested clip-paths | `.user-card-position` + `.user-card-image` + wrapper | Content clipped at every section boundary |
| Negative margins | `margin-right: -0.4rem` (position), `-0.5rem` (image) | Adjacent sections overlap and hide content |
| No backdrop-filter | `.user-card-wrapper` only has `rgba(255,255,255,0.04)` | No glassmorphism |
| Avatar regressed | Feature 17 reverted gold rounded frame to clip-path | Profile picture looks jagged, not glamorous |
| Weak shadows | `box-shadow: 0 2px 10px rgba(0,0,0,0.2)` | No glamour |

## CSS Property Changes

### Remove

| Selector | Property to Remove | Rationale |
|----------|-------------------|-----------|
| `.user-card-position` | `clip-path: polygon(...)` | Clips position number; use flex alignment instead |
| `.user-card-position` | `margin-right: -0.4rem` | Hides content beneath; use `gap` on parent |
| `.user-card-image` | `clip-path: polygon(...)` | Replaced by gold rounded frame (R3) |
| `.user-card-image` | `margin-right: -0.5rem` | Hides content beneath; use `gap` on parent |
| `.user-card-image` | `margin-right: -1.5rem` (desktop) | Same as above |

### Modify

| Selector | Property | Old Value | New Value |
|----------|----------|-----------|-----------|
| `.user-card-wrapper` | `background` | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.08)` (more visible) |
| `.user-card-wrapper` | `backdrop-filter` | (none) | `blur(8px)` |
| `.user-card-wrapper` | `box-shadow` | `0 2px 10px rgba(0,0,0,0.2)` | `0 4px 20px rgba(255,0,135,0.15), 0 0 40px rgba(218,183,29,0.05)` |
| `.user-card-wrapper:hover` | `box-shadow` | `0 4px 20px rgba(255,0,135,0.2)` | `0 6px 30px rgba(255,0,135,0.3), 0 0 60px rgba(218,183,29,0.1)` |
| `.user-card-wrapper:hover` | `background` | `rgba(255,255,255,0.07)` | `rgba(255,255,255,0.12)` |

### Add

| Selector | Property | Value |
|----------|----------|-------|
| `.user-card-image` | `border-radius` | `50%` |
| `.user-card-image img` | `border` | `2px solid white` |
| `.user-card-image img` | `outline` | `2px solid var(--euro-gold)` |
| `.user-card-image img:hover` | `box-shadow` | `0 0 12px var(--euro-gold)` |
| `.user-card-image` | `overflow` | `hidden` |
| `.user-card-wrapper` | `border-radius` | `8px` (if clip-path removed) or keep clip-path |
| `.user-card-wrapper` | `gap` | `0.5rem` (replaces negative margins) |
| `.user-card-position` | `border-radius` | `0` (no clip-path, just solid background) |

### Preserve (no change)

| Selector | Key Properties |
|----------|---------------|
| `.user-card-wrapper` | `clip-path: polygon(0% 0%, 96% 0%, 100% 100%, 4% 100%)` — angled card shape retained |
| `.user-card-wrapper` | `border-top/bottom: 2px solid var(--euro-gold)` |
| `.user-card-total` | `border-left`, `color: var(--euro-pink)`, `content: "PTS"` |
| `.user-winner::after` | `content: " ★"` |
| `.pos-1`/`.pos-2`/`.pos-3` | Special position colors and fonts |
| `.animate` | Animation class and keyframes |
| `.room-title-container` | Gold border, sticky behavior |

## Gold Avatar Frame Design

The profile picture gets a **medal-style** frame:

```
┌────────────────────┐
│  Outer: gold        │  ← outline: 2px solid var(--euro-gold)
│  Inner: white       │  ← border: 2px solid white
│  Shape: circle      │  ← border-radius: 50%
│  Glow on hover      │  ← box-shadow: 0 0 12px var(--euro-gold)
└────────────────────┘
```

This restores what Feature 15 (Eurovision contest styling, Round 5) originally implemented, which Feature 17 accidentally regressed.

## Glassmorphism Design

Layered approach:

1. **Background**: Semi-transparent `rgba(255, 255, 255, 0.08)` — allows dark navy background to show through
2. **Blur**: `backdrop-filter: blur(8px)` — frosts the content behind the card
3. **Border**: `2px solid var(--euro-gold)` with subtle opacity — defines the card edge
4. **Shadow**: Multi-layered `box-shadow` — pink + gold glows for glamour

## Glamour Effects

| Effect | Implementation |
|--------|---------------|
| Pink glow on hover | `box-shadow: 0 6px 30px rgba(255,0,135,0.3)` |
| Gold shimmer on winner | Stronger gold border + golden box shadow |
| Points glow | `text-shadow: 0 0 8px rgba(255,0,135,0.3)` preserved |
| Position gradient | Pink gradient background (preserved from current) |
| Total score pink accent | Pink color + glow (preserved from current) |

## Negative Margin Elimination

The current layout uses negative margins to create visual overlap:
```
[position (14%)] ← -0.4rem → [image (18%)] ← -0.5rem → [data (flex:1)] [total (15%)]
```

New layout uses proper flex with `gap`:
```
[position (14%)] [gap:0.3rem] [image (18%)] [gap:0.3rem] [data (flex:1)] [total (15%)]
```

The `height: 100%` on inner sections is replaced with `align-items: center` on the flex parent, eliminating the need for sections to stretch and overlap.

## Tests to Update

### Tests that will break and need updating (in `tests/Eurovision_styling.test.ts`):

| Test Name | Line | Reason | New Assertion |
|-----------|------|--------|---------------|
| `test_position_pink_gradient_clip_path` | 842 | Asserts clip-path on position (R5 in R23 block) | Remove clip-path assertion; keep gradient + pink color assertion |
| `test_image_clip_path_widened` | 849 | Asserts clip-path on image (R6 in R23 block) | Replace with gold rounded frame assertions: `border-radius`, gold border |
| `test_position_and_image_negative_margins` | 825 | Asserts negative margin values (R3 in R23 block) | Replace with assertions that no negative margins exist for these selectors, OR assert flex gap |
| `test_wrapper_clip_path_retained` | 880 | Asserts clip-path on wrapper — **SHOULD be preserved** | No change needed if wrapper clip-path is kept |

### New tests to add:

| Test Name | R# | Assertion |
|-----------|----|-----------|
| `test_glassmorphism_backdrop_filter` | R11.2(a) | `.user-card-wrapper` has `backdrop-filter: blur(...)` |
| `test_gold_rounded_avatar_frame` | R11.2(b) | `.user-card-image` has `border-radius: 50%` and gold border |
| `test_glamour_glow_effects` | R11.2(c) | `.user-card-wrapper` has `box-shadow` with pink or gold glow |

## Alternatives Discarded

### Alternative 1: Keep all clip-paths, just enlarge them
Discarded because the fundamental problem is that overlapping clip-paths with z-index stacking create unpredictable clipping. Even with larger values, the angled edges of position/image clip-paths intersect and hide content where they overlap. The nested clip-path approach is architecturally flawed.

### Alternative 2: SVG clip-paths
Discarded because SVGs add complexity and the same z-index overlap problem persists. CSS clip-paths are being removed, not replaced with another clipping mechanism.

### Alternative 3: CSS `mask` instead of clip-path
Discarded for the same reason — any masking at the inner section level will clip content at the boundary. The correct approach is to let flex layout handle spacing and use `border-radius` for rounded shapes.

### Alternative 4: Remove wrapper clip-path entirely
Considered but discarded because the angled card shape is part of the visual identity. The wrapper clip-path doesn't cause content clipping (it clips the outer card edges, not inner content). Keeping it maintains the Eurovision contest styling.

## Files to Modify

| File | Change |
|------|--------|
| `src/components/ClassificationView/ClassificationView.vue` | Rewrite `<style scoped>` block per design above |
| `tests/Eurovision_styling.test.ts` | Update 3 tests, add 3 new tests |
| `ARCHITECTURE.md` | Update if card architecture changes materially |
