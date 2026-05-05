# Homepage Colour Repalette — Design Spec
**Date:** 2026-05-05
**Scope:** `index.html` only — two parallel colour variants, no layout or content changes.

---

## Background

The current homepage uses a warm Sienna palette (deep brown `#361F1D`, coral `#FF6139`, blue-green `#A1CACC`). The client wants to explore a cooler blue-family palette. Two versions will be produced as separate HTML files so they can be compared side-by-side before any decision is made.

---

## New Colour Palette

| Name | Hex | Role |
|---|---|---|
| Midnight | `#0B1D26` | Dark section backgrounds, nav, hero, footer |
| Deep blue | `#3A5A92` | Links, sub-labels, hover states, depth |
| Periwinkle | `#7B9BD1` | Brand accent — CTAs, section labels, numbers, card highlights |
| Blue tint | `#EEF2F9` | Alternate light section surface |
| Paper | `#FAFAF7` | Main light page background |
| White | `#FFFFFF` | Cards and content surfaces |

Supporting alpha tokens (derived from Midnight):
- On-dark body copy: `rgba(255,255,255,0.82)`
- On-dark muted: `rgba(255,255,255,0.65)`
- On-dark subtle: `rgba(255,255,255,0.45)`
- On-dark divider: `rgba(255,255,255,0.08)`
- Deep footer: `#060f14` (darkened Midnight for footer base)

---

## Output Files

| File | Description |
|---|---|
| `index-v1-dark-light.html` | Version 1 — dark/light alternating rhythm |
| `index-v2-light-dominant.html` | Version 2 — light-dominant, Midnight only at hero + footer |

The original `index.html` is not modified.

---

## Version 1 — Dark/Light Alternating

Preserves the existing section rhythm. Every section currently using `#361F1D` switches to Midnight. Light sections stay on Paper/White. The high-contrast alternating beat is maintained.

### Section-by-section colour map

| Section | Background | Heading colour | Key accent changes |
|---|---|---|---|
| Nav | `#0B1D26` | — | Logo: white + Periwinkle `futures` + Periwinkle `+`; CTA button: Periwinkle |
| Hero | `#0B1D26` | `#FFFFFF` | Sub-headline: Periwinkle `#7B9BD1`; node canvas gradient fades use Midnight; vertical accent line: Periwinkle |
| Problem | `#FAFAF7` | `#0B1D26` | Card number chips: Periwinkle; card top borders: Periwinkle (full) / `rgba(123,155,209,0.3)` (dim); pullquote border: Deep blue `#3A5A92` |
| Services | `#0B1D26` | `#FFFFFF` | Service card bg: `#0d2535`; card hover: `#162f44`; service links: Periwinkle; sub-labels: `#7B9BD1` |
| SiA Framework | `#FAFAF7` | `#0B1D26` | Step numbers: Periwinkle; dividers: `#D8D0C8` unchanged; italic lead: Deep blue |
| About / Team | `#0B1D26` | `#FFFFFF` | Avatar border/ring: Periwinkle tint; name title labels: Periwinkle; bio divider line: `rgba(123,155,209,0.3)` |
| Testimonials | `#FAFAF7` | `#0B1D26` | Quote card left border: Deep blue `#3A5A92`; card shadow tinted to `rgba(11,29,38,0.06)` |
| Client logos | `#EEF2F9` | — | Logo placeholder tint: `rgba(11,29,38,0.08)` |
| CTA | `linear-gradient(135deg, #060f14, #0B1D26)` | `#FFFFFF` | Radial glow: `rgba(123,155,209,0.10)`; button: Periwinkle |
| Footer | `#060f14` | — | All existing opacity-based whites unchanged; link hover: white |

### Dropdown menu
- Background: `#0d2535`
- Border: `rgba(255,255,255,0.08)`
- Item hover bg: `rgba(255,255,255,0.07)`

---

## Version 2 — Light-Dominant

Hero and footer remain Midnight. All interior dark sections lift to light surfaces. The page is predominantly pale throughout.

### Section-by-section colour map

| Section | Background | Heading colour | Key accent changes |
|---|---|---|---|
| Nav | `#0B1D26` | — | Same as Version 1 |
| Hero | `#0B1D26` | `#FFFFFF` | Same as Version 1 |
| Problem | `#FAFAF7` | `#0B1D26` | Same as Version 1 |
| Services | `#EEF2F9` | `#0B1D26` | Service cards: `#FFFFFF`; card hover: `#f4f7fd`; card border top: Periwinkle; service links: Deep blue `#3A5A92`; sub-labels: Deep blue; large BG number: `rgba(58,90,146,0.10)` |
| SiA Framework | `#FFFFFF` | `#0B1D26` | Same as Version 1 |
| About / Team | `#FAFAF7` | `#0B1D26` | Avatar border: Deep blue tint; name title labels: Deep blue `#3A5A92`; bio: `#1A1A1A`; pullquote bg: `rgba(11,29,38,0.03)`; pullquote border: Deep blue |
| Testimonials | `#EEF2F9` | `#0B1D26` | Quote card bg: `#FFFFFF`; left border: Deep blue |
| Client logos | `#FFFFFF` | — | Placeholder tint: `rgba(11,29,38,0.06)` |
| CTA | `#3A5A92` | `#FFFFFF` | Radial glow: `rgba(123,155,209,0.15)`; button: `#FFFFFF` with Deep blue text |
| Footer | `#060f14` | — | Same as Version 1 |

### Dropdown menu
- Same as Version 1

---

## Shared Changes (both versions)

### Logo wordmark
- `resilient` → white
- `futures` → Periwinkle `#7B9BD1` (replaces brick `#743734`)
- `+` → Periwinkle `#7B9BD1`

### Buttons
- `.btn-primary`: background `#7B9BD1`, text `#0B1D26`, focus outline `#7B9BD1`
- `.btn-primary:hover`: opacity `0.88` (same mechanic)
- Section label color: `#7B9BD1` (replaces `#FF6139`)
- Section label light variant: `#7B9BD1` (replaces `#A1CACC`, same role)

### Body copy on dark
No change to opacity values — `rgba(255,255,255,0.82)` for body, `0.68` for bios, `0.65` for muted. These translate cleanly to Midnight backgrounds.

### Node canvas (hero animation)
The Three.js node graphic uses hardcoded colours internally. The gradient fade overlays that blend the canvas into the hero background must update their stop colour from `#361F1D` to `#0B1D26`.

### Shadows
Card shadow: `0 4px 24px rgba(11,29,38,0.06)` (replaces warm-brown tint `rgba(54,31,29,0.06)`).

---

## What Does Not Change

- All HTML structure and layout
- All copy and content
- Typography (Playfair Display + Inter)
- Spacing and padding
- Responsive breakpoints
- The Three.js node animation itself (only its fade gradients update)
- The SiA diagram image
- Team photos

---

## Success Criteria

1. Both files render correctly at `http://localhost:3000/index-v1-dark-light.html` and `http://localhost:3000/index-v2-light-dominant.html`.
2. No coral (`#FF6139`) or brown (`#361F1D`, `#743734`) colours remain in either file.
3. All interactive states (hover, focus, active) work on buttons, nav links, and service links.
4. The hero node canvas gradient fades are invisible (seamlessly blend into Midnight).
5. Screenshots pass a visual review — no jarring colour mismatches between adjacent sections.
