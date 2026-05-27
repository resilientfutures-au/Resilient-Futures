# Design Spec: "Why Resilient Futures is Different" Section

**Date:** 2026-05-12
**Status:** Approved
**Page:** `index.html` (Homepage)

---

## Overview

A new section to be inserted between the **Problem** section (`#problem`) and the **Services** section (`#services`) on the homepage. Its purpose is to bridge the problem framing and the offer — answering the implicit question "so why Resilient Futures?" before presenting the three service pathways.

---

## Placement

- **After:** `</section>` closing tag of `#problem` (currently line ~516)
- **Before:** `<!-- SERVICES -->` comment and `<section id="services">` (currently line ~518)

---

## Layout

**Split two-column grid** (matching the existing two-column rhythm used in the SiA and team sections):

- **Left column:** Section label + heading + integrating statement (prose)
- **Right column:** Four differentiator items as a vertical checklist with title + descriptor

Grid specs:
- `grid-template-columns: 1fr 1fr`
- `gap: 64px`
- `align-items: start` on the grid; `align-self: center` applied to the right column element so the checklist centres against the prose

---

## Background & Spacing

- **Background:** `#FFFFFF` (white) — creates contrast between `#FAFAF7` (Problem above) and `#EEF2F9` (Services below)
- **Padding:** `96px 48px` (consistent with other full-width sections)
- **Max-width inner container:** `1080px`, centred

---

## Content

### Section label
```
Why Resilient Futures is Different
```
Style: same `.section-label` class used throughout — `13px`, `700` weight, `0.12em` tracking, uppercase, `#7B9BD1`.

### Sub-heading (left column)
```
Built on science. Proven in practice. Designed for what's next.
```
Style: `font-display`, `43px`, `700`, `#0B1D26`, `line-height: 1.1`, `letter-spacing: -0.02em`.

### Integrating statement (left column, below heading)
Two paragraphs:

> We bring a non-traditional, whole-systems approach — grounded in complex adaptive systems thinking, resilience science, and cognitive science — that integrates strategic foresight, capability development, and governance into a single, practical framework.

> Our methodology, Strategy in Action (SiA), is not a consulting template. It is a living decision-making system that organisations adopt, internalise, and use continuously — connecting all three ways of working with Resilient Futures.

Style: `17px`, `line-height: 1.7`, `color: #4a6080` (consistent with body copy in other sections).

### Differentiator checklist (right column)
Four items, each with a circular check icon (filled `#EEF2F9` background, blue SVG tick), a bold title, and a one-line descriptor:

| # | Title | Descriptor |
|---|-------|------------|
| 1 | Grounded in rigorous science | Complex adaptive systems thinking, resilience science, and cognitive science — not consulting convention. |
| 2 | A proven framework for strategy development and execution | Strategy in Action (SiA) is a structured, field-tested decision-making system — not a methodology built in a boardroom. |
| 3 | Genuine capability uplift — Strategic Fitness | We build internal strategic capability so your organisation can lead through change without ongoing external dependency. |
| 4 | A legacy of tools for ongoing, active strategic change | Practices and tools developed over 25 years that support continuous strategy — not one-off planning events. |

Item style:
- Separated by `border-bottom: 1px solid rgba(11,29,38,0.08)`; top border on first item
- Padding: `20px 24px`
- Title: `16px`, `700`, `#0B1D26`
- Descriptor: `14px`, `line-height: 1.55`, `#4a6080`
- Check icon: `24px` circle, `background: #EEF2F9`, SVG path `stroke: #3A5A92`

---

## Responsive behaviour

On mobile (below ~768px), the two-column grid collapses to a single column: left prose first, then the checklist below. This matches the existing responsive pattern in `#approach` and other two-column sections.

---

## Consistency notes

- Font, colour, and spacing tokens are identical to the existing design system — no new values introduced.
- The section label follows the same pattern as every other section on the page.
- The white background has precedent in the `#approach` (SiA) section, so this is not a new surface colour.
