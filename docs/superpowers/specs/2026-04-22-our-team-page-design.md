# Our Team Page — Design Spec
**Date:** 2026-04-22
**Status:** Approved

---

## Overview

A new `team.html` page for the Resilient Futures website. The page serves a dual purpose: establishing firm credibility with prospective clients, and telling the firm's origin story and philosophy through the lens of its people.

Layout approach: **Story first, team below** (Option A). A dark hero and firm-story section establish context and philosophy before the four team member cards appear in a light 2×2 grid.

---

## File

- **Filename:** `team.html` in the project root (alongside `index.html`, `why.html`, etc.)
- **Stack:** Single HTML file, all styles inline, Tailwind CSS via CDN, same font stack and design tokens as existing pages.

---

## Design Tokens (match existing site)

| Token | Value |
|---|---|
| Dark background | `#361F1D` / `#2a1816` |
| Light background | `#EFEFE7` |
| Card background | `#fff` |
| Accent orange | `#FF6139` |
| Accent teal | `#A1CACC` |
| Body text dark | `#1A1A1A` |
| Muted brown | `#6B5350` |
| Display font | Playfair Display (serif) |
| Body font | Inter (sans-serif) |

---

## Sections

### 1. Navigation
Identical to all other pages. Active state on a new "Our Team" nav link (to be added to the nav). The existing nav has a "How We Work" link currently pointing to `#` — "Our Team" should slot in alongside it under an "About" group or stand alone.

### 2. Hero
- **Background:** Dark gradient (`#2a1816` → `#361F1D`), matching `strategic-fitness.html` hero
- **Breadcrumb:** Home / About / Our Team
- **Label:** "About Us" (small caps, teal `#A1CACC`)
- **H1 (display):** "The people behind the practice."
- **Italic subtitle (orange):** "25 years. Four practitioners. One consistent method."
- **Lead paragraph:** "We are a small, senior team. Every engagement is led by a principal — not handed to a junior. That is not a policy. It is how we work."
- **Accent line:** Vertical orange-to-transparent gradient bar left of the text (matching hero on other pages)
- **Right graphic:** Decorative dot-grid SVG (reuse the pattern from `strategic-fitness.html` hero)

### 3. Firm Story
- **Background:** `#361F1D` (seamless continuation of the dark section)
- **Content:**
  - Pull-quote with left orange rule: the David Platt quote already used on `index.html` — *"Our role is to work alongside your leadership team — bringing the thinking, challenging the assumptions, and transferring the tools — so your organisation builds real strategic capability over time. Not dependency."* — attributed "— David Platt, Resilient Futures"
  - Credential strip: three stat cells in a row — **25+** Years in practice · **4** Senior practitioners · **1** Consistent method

### 4. The People
- **Background:** `#EFEFE7`
- **Section label:** "The People" (orange, small caps)
- **Layout:** 2×2 CSS grid, gap 24px, responsive (single column on mobile)
- **Each card:**
  - White background (`#fff`)
  - 3px solid orange top border (`#FF6139`) — same as Explore Further cards
  - Circular placeholder image: `https://placehold.co/80x80/D5D5CF/6B5350` with `border-radius: 50%`
  - Name (Playfair Display, 20px, bold, `#361F1D`)
  - Title (Inter, 10px, small caps, orange — placeholder text)
  - Bio (Inter, 13px, `#6B5350`, line-height 1.6 — placeholder text)
  - Hover: `translateY(-2px)` + layered shadow (matching existing card hover style)
- **Team members (all placeholder titles/bios):**
  1. David Platt — Founder & Principal
  2. James Cacciottolo — placeholder title
  3. Larry Quick — placeholder title
  4. Niloo Amendra — placeholder title

### 5. CTA Section
Identical to the CTA section used on `strategic-fitness.html`: dark background, heading "Book a Strategic Fitness conversation.", orange button "Book a Strategic Fitness Conversation" linking to `mailto:james.cacciottolo@resilientfutures.com`.

### 6. Footer
Identical to all other pages. Update footer nav links to include a link to `team.html` under the "About" column.

---

## Navigation Updates

Add `team.html` to the site nav and footer on **all existing pages** (`index.html`, `why.html`, `strategy-in-action.html`, `strategic-fitness.html`):
- **Main nav:** Add "Our Team" link after the "Strategy in Action" link (before the Services dropdown)
- **Footer "About" column:** Add "Our Team" link after "How We Work"

---

## Responsive Behaviour

- **≥ 1024px:** 2×2 team grid
- **768–1023px:** 2×2 team grid (slightly reduced padding)
- **< 768px:** Single-column team grid; hero accent line hidden; hero graphic hidden

---

## Out of Scope

- Real headshots (placeholders only)
- Real bios or titles beyond "placeholder" text
- Any animation beyond existing site hover states
- Navigation restructuring beyond adding the new link
