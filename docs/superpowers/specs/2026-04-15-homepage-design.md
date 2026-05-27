# Resilient Futures Homepage — Design Spec

**Version:** 1.0  
**Date:** 15 April 2026  
**Status:** Approved

---

## Overview

A single-page, fully responsive landing page for Resilient Futures — a boutique strategy and leadership consultancy serving Australian Boards and Executives. The page is designed to educate visitors on the firm's approach and convert them to a "Get in touch" action.

**Primary goal:** Generate qualified enquiries via a "Get in touch" CTA.  
**Primary audience:** CEOs, Board Directors, Senior Executives — intelligent, time-poor, sceptical of generic consulting language.  
**Output:** Single `index.html` file, all styles inline, Tailwind CSS via CDN.

---

## Visual Identity

All visual decisions must strictly follow the Resilient Futures Brand Guidelines (Version 1.0, April 2026), located in `brand_assets/resilient-futures-brand-guidelines.docx`.

### Colour Palette

| Role | Name | Hex |
|------|------|-----|
| Primary (dark backgrounds, headings) | Primary | `#361F1D` |
| Secondary dark tone (H3, hover, accents) | Accent | `#743734` |
| CTA, bullets, accent marks, logo `+` | Highlight | `#FF6139` |
| Trust signal, secondary labels | Secondary | `#A1CACC` |
| Alternating section background | Background | `#F5F5ED` |
| Card/container backgrounds | White | `#FFFFFF` |
| Body copy | Body Text | `#1A1A1A` |
| Captions, secondary text | Mid Grey | `#6B5350` |
| Borders, dividers | Light Grey | `#D8D0C8` |

**Never** use default Tailwind blue/indigo. **Never** approximate these values.

### Typography

| Style | Typeface | Weight | Size | Colour |
|-------|----------|--------|------|--------|
| Display / Hero | Playfair Display | Bold (700) | 48–56px | `#FFFFFF` |
| H1 (Page title) | Playfair Display | Bold (700) | 36–42px | `#361F1D` or `#FFFFFF` |
| H2 (Section) | Playfair Display | Bold (700) | 28–38px | `#361F1D` or `#FFFFFF` |
| H3 (Sub-section) | Playfair Display | Bold (700) | 20–22px | `#743734` |
| Section label | Inter | Semi-Bold (600) | 9–10px | `#FF6139`, ALL CAPS, +0.18em tracking |
| Body copy | Inter | Regular (400) | 14–15px | `#1A1A1A`, 1.7 line-height |
| Lead / intro | Inter | Regular (400) | 15px | `#1A1A1A` |
| Caption / label | Inter | Light (300) | 9–11px | `#6B5350` |
| Button / CTA | Inter | Semi-Bold (600) | 11–13px | `#FFFFFF` on Primary or Highlight bg |

Fonts loaded via Google Fonts CDN: `Playfair Display` (700 + italic 400) and `Inter` (300, 400, 500, 600).

**No em dashes anywhere on the page.** Replace with commas, full stops, or restructured sentences.

### Visual Mood: Bold & Dramatic

- Hero: dark gradient background (`#2a1816` → `#361F1D` → `#4a2826`) with layered radial glows (coral and blue-green) for depth and texture
- Sections alternate: dark (`#361F1D`) and warm off-white (`#F5F5ED`) / white
- Shadows: low-opacity, colour-tinted (`rgba(54,31,29,0.06)`), never flat `shadow-md`
- No `transition-all`; animate only `transform` and `opacity`
- Every interactive element must have hover, focus-visible, and active states

---

## Page Architecture

**Layout:** Structured Executive — left-aligned, scannable, module-based. Serves time-poor senior executives who scan before committing to read.

**Output:** Single `index.html`, all styles inline via Tailwind CDN + custom `<style>` block. Mobile-first responsive.

**Logo:** Use the real logo image from `brand_assets/Resilient Futures LOGO.png`. Do not recreate as text except in the nav (where the wordmark text treatment is acceptable at small sizes). At favicon scale, use `+` only.

---

## Sections

### Navigation

- Position: sticky, top-0, z-index 100
- Background: `#361F1D`
- Left: logo wordmark (text treatment — `resilient` in white, `futures` in `#743734`, `+` in `#FF6139`, Playfair Display Bold)
- Right: nav links (`Services`, `Our Approach`, `About`) in `rgba(255,255,255,0.5)` + `Get in touch` button (transparent bg, `#FF6139` border and text, uppercase Inter Semi-Bold)
- Bottom border: `rgba(255,255,255,0.08)`
- Height: 64px

---

### §1 — Hero

**Background:** `linear-gradient(155deg, #2a1816 0%, #361F1D 45%, #4a2826 100%)`  
**Decorative elements:** Two layered radial gradients — coral glow top-right, blue-green glow bottom-left.

**Layout:** Two-part — vertical accent line + headline copy block, followed by a full-width stats strip.

**Vertical accent line:** 3px wide, `linear-gradient(to bottom, #FF6139, transparent)`, flush left of copy, minimum height 220px.

**Content:**
- Section label: `STRATEGY CONSULTANCY · AUSTRALIAN BOARDS & EXECUTIVES` (Inter Semi-Bold, `#A1CACC`, ALL CAPS, 10px, +0.18em tracking)
- Headline (H1): *"Stability is not returning. The question is whether your strategy knows that."* — Playfair Display Bold, 52px, `#FFFFFF`, `em` tag on "strategy knows that." in `#FF6139` italic
- Subheading: *"Resilient Futures works with Australian Boards and Executives of complex organisations to see change early, make sharper strategic decisions, and build the capability to stay relevant, no matter what comes next."* — Inter Regular, 15px, `rgba(255,255,255,0.58)`, 1.7 line-height, max-width 540px
- Primary CTA button: `Get in touch` — `#FF6139` background, white text, Inter Semi-Bold, 11px, uppercase, 0.07em tracking, 14px/28px padding
- Ghost link: `Explore our approach ↓` — `rgba(255,255,255,0.45)`, Inter 13px, no border

**Stats strip** (full-width, below hero copy, separated by `rgba(255,255,255,0.1)` top border):
- `25+` / Years of Practice
- `6` / Sectors Served
- `SiA` / Proprietary Framework
- Numbers: Playfair Display Bold, 32px, `#FFFFFF`
- Labels: Inter Semi-Bold, 9px, `rgba(255,255,255,0.35)`, ALL CAPS, +0.14em tracking
- 3 equal columns, separated by `rgba(255,255,255,0.07)` vertical borders

---

### §2 — The Problem

**Background:** `#F5F5ED`  
**Section label:** `THE PROBLEM`

**Headline (H2):** *"Your strategy was designed for a different world."*

**Body copy (two paragraphs):**
1. *"Most organisations are not struggling because their strategy is poorly crafted. They are struggling because the systems used to build and execute strategy were designed for conditions of relative stability, and those conditions no longer exist."*
2. *"Change drivers are no longer linear or sequential. Technology adoption, geopolitical shifts, workforce transformation, regulatory pressure. These forces do not wait for the next planning cycle."*

**Pullquote:** Left border 3px `#FF6139`, background `rgba(54,31,29,0.04)`, padding 20px 28px:
> *"The most dangerous place any organisation can be is confidently executing a strategy that is no longer aligned to reality."*

Pullquote text: Playfair Display Bold, 20px, `#361F1D`, italic, 1.4 line-height.

**Problem grid:** 2-column grid, 6 items, bordered with `#D8D0C8`. Each item has a `+` marker in `#FF6139` and item text in Inter Regular 13px `#1A1A1A`. Items:
1. Traditional strategy cycles are too slow for the pace of change
2. Strategy becomes a project list, disconnected from real conditions
3. Boards lack real-time strategic intelligence for effective governance
4. Leadership effectiveness declines under the pressure of disruptive change
5. Undetected signals of change lead to decision lag and missed opportunity
6. Capability gaps in people, systems, and infrastructure quietly widen

---

### §3 — Services

**Background:** `#361F1D`  
**Decorative:** Radial blue-green glow, top-right.  
**Section label:** `THREE WAYS TO WORK TOGETHER`

**Headline (H2):** *"Where would you like to start?"*

**Intro body:** *"Resilient Futures is a boutique strategic advisory practice. We work with leaders of complex organisations to build the capability, clarity, and confidence to operate effectively in conditions of permanent structural change."*

**Service cards grid:** 3 equal columns, 1px gap, `rgba(255,255,255,0.08)` background (creates gap effect).

Each card: `#361F1D` background, padding 36px 28px. Hover: `#4a2826`.

| # | Name | Ideal for | Description |
|---|------|-----------|-------------|
| 01 | Strategic Fitness | Boards & Executives | Half or full-day diagnostic workshop to assess your organisation's readiness to operate in structural instability. Includes diagnostics, structured executive sessions, and immediate action pathways. |
| 02 | SiA Strategy Engagement | Boards, CEOs, Senior Leadership | A co-designed, end-to-end strategy engagement using the SiA framework. From conditions analysis through to strategic priorities, capability investment, and an implementation framework. |
| 03 | Capability Building | Executive & Leadership Teams | Embedding the SiA mindset, tools, and behaviours into your leadership team so strategic thinking becomes a continuous internal capability, not an external dependency. |

Each card includes a `Learn more →` link in `#FF6139`, Inter Semi-Bold 11px, uppercase. These are placeholder anchors (`href="#"`) for v1 — sub-pages are out of scope.

Card number: Playfair Display Bold, 40px, `rgba(255,97,57,0.18)`.  
Card name: Playfair Display Bold, 20px, `#FFFFFF`.  
Ideal for: Inter Semi-Bold, 10px, `#A1CACC`, ALL CAPS, +0.12em tracking.  
Body: Inter Regular, 13px, `rgba(255,255,255,0.5)`, 1.65 line-height.

---

### §4 — Strategy in Action (SiA) Framework

**Background:** `#F5F5ED`  
**Section label:** `STRATEGY IN ACTION`

**Headline (H2):** *"A decision-making system built for structural instability."*

**Intro body:** *"SiA operates through five interconnected standards. Not sequential steps, but an integrated system that keeps strategy aligned to changing conditions at every level of the organisation."*

**Five-step grid:** 5 equal columns, 1px gap, `#D8D0C8` background. Each cell: `#FFFFFF` background, padding 28px 20px.

| # | Name | Description |
|---|------|-------------|
| 01 | Conditions | Building a shared, evidence-based understanding of the real change landscape and what it means for your organisation. |
| 02 | Sustainable Value Generation | Clarifying the value the organisation must generate, protect, and renew, given the conditions it now faces. |
| 03 | Strategic Opportunity-Risk | Identifying the conditions and choices with the most significant implications for the organisation's trajectory. |
| 04 | Capability Investment | A deliberate view of the capabilities to build, acquire, or release to remain effective as conditions evolve. |
| 05 | Catalytic Action | Targeted initiatives with multi-pronged impact that generate feedback quickly. Strategy that moves at the pace of change. |

Step number: Playfair Display Bold, 36px, `rgba(116,55,52,0.14)`.  
Step name: Playfair Display Bold, 15px, `#361F1D`.  
Step body: Inter Regular, 12px, `#6B5350`, 1.6 line-height.

**Footer note below grid:** `FIVE INTERCONNECTED STANDARDS · NOT SEQUENTIAL STEPS · A LIVING SYSTEM` — Inter Semi-Bold, 9px, `#743734`, ALL CAPS, centered, +0.14em tracking.

---

### §5 — About

**Background:** `#361F1D`  
**Section label:** `THE PEOPLE BEHIND THE WORK` (in `#A1CACC`)

**Headline (H2):** *"Depth over delegation."*

**Intro body:** *"When you engage Resilient Futures, you work directly with the people who bring the depth, not with juniors learning on your investment."*

**Two-column practitioner grid**, 2px gap, `rgba(255,255,255,0.08)` background:

**Larry Quick — Co-founder & Lead Practitioner**
> Larry Quick has spent over 25 years working at the intersection of strategy, complex systems, and organisational transformation across Australia, the United States, and internationally. He co-authored *Disrupted: Strategy for Exponential Change* (2015). His experience spans government, health, education, peak bodies, and corporate transformation at the highest levels.

**David Platt — Co-founder & Lead Practitioner**
> David Platt brings deep expertise in organisational transformation, capability development, and the human dimensions of strategic change. He co-authored *Disrupted: Strategy for Exponential Change* alongside Larry Quick, and has spent over two decades developing the facilitation and capability transfer methodologies that make Strategy in Action practical and enduring.

Each card: initials avatar (60px circle, `rgba(161,202,204,0.15)` bg, `#A1CACC` border and text), name in Playfair Display Bold 22px white, title in Inter Semi-Bold 10px `#A1CACC` ALL CAPS, body in Inter Regular 13px `rgba(255,255,255,0.55)`.

**Closing quote block** below grid (border `rgba(255,255,255,0.1)`, padding 28px 36px, max-width 680px):
> *"We're not a traditional consultancy. Our role is to work alongside your leadership team, bringing the thinking, challenging the assumptions, and transferring the tools, so your organisation builds real strategic capability over time. Not dependency."*

Playfair Display italic, 16px, `rgba(255,255,255,0.65)`.

---

### §6 — Social Proof / Testimonials

**Background:** `#F5F5ED`  
**Section label:** `TRUSTED BY LEADERS NAVIGATING GENUINE COMPLEXITY`

**Headline (H2):** *"Over 25 years working with Boards, CEOs, and leadership teams across Australia."*

**Two testimonial cards**, side by side. Each: `#FFFFFF` background, left border 3px `#FF6139`, padding 36px, box-shadow `0 4px 24px rgba(54,31,29,0.06)`.

| Quote | Attribution |
|-------|-------------|
| *"Strategy in Action has enabled me and my team to develop an approach to managing a complex set of conditions that are constantly changing."* | CEO · Multinational Organisation |
| *"We're only a third of the way through the program, but it's already having a profound impact on our organisation."* | CEO · Health and Human Services Organisation |

Quote: Playfair Display Regular italic, 17px, `#361F1D`, 1.55 line-height.  
Attribution: Inter Semi-Bold, 11px, `#6B5350`, ALL CAPS, +0.06em tracking.

---

### §7 — Call to Action

**Background:** `linear-gradient(135deg, #2a1816 0%, #361F1D 100%)`  
**Decorative:** Centred radial coral glow (`rgba(255,97,57,0.08)`).  
**Layout:** Centred text.

**Headline (H2):** *"Ready to assess your strategic fitness?"*  
Playfair Display Bold, 42px, `#FFFFFF`, max-width 600px, centred.

**Subheading:** *"A short conversation determines whether diagnostic insight and a structured workshop would be valuable for your organisation at this point in time."*  
Inter Regular, 15px, `rgba(255,255,255,0.5)`, max-width 460px, centred.

**CTA button:** `Get in touch` — `#FF6139` background, white text, Inter Semi-Bold 13px, uppercase, 16px/40px padding.

---

### Footer

**Background:** `#1a0f0e`  
**Top border:** `rgba(255,255,255,0.06)`  
**Three columns:** logo wordmark (opacity 0.55) | copyright text | email address  
**Copyright:** `© 2026 Resilient Futures Pty Ltd · strategy for disruptive change`  
**Email:** `techadmin@resilientfutures.com`  
All text: Inter Regular, 11px, `rgba(255,255,255,0.3)`.

---

## Technical Constraints

- **Single file:** `index.html` at project root. All styles in a `<style>` block using Tailwind CDN + custom CSS. No separate `.css` files.
- **Fonts:** Google Fonts CDN — `Playfair Display` (700, italic 400) and `Inter` (300, 400, 500, 600).
- **Logo:** Real asset from `brand_assets/Resilient Futures LOGO.png`. Use in footer and optionally above-fold; use text wordmark in nav.
- **Images:** `https://placehold.co/WIDTHxHEIGHT` where real images are unavailable (e.g., team photos). Once real photos are supplied, swap in.
- **No em dashes** anywhere in the page content.
- **No `transition-all`.** Animate only `transform` and `opacity`.
- **Mobile-first responsive.** Single-column stacking on small screens; grid layouts expand at `md` / `lg` breakpoints.
- **Dev server:** `node serve.mjs` serves project root at `http://localhost:3000`.
- **Screenshots:** `node screenshot.mjs http://localhost:3000` — saved to `temporary screenshots/`.

---

## Content Source

All copy is drawn from `RF_Website_Content_v1.1 (1).pdf` (Draft 1.1, March 2026). No placeholder copy is needed. The tagline in use is **Option A**: *"Strategy for a world that won't hold still."* (brand guidelines recommendation).

---

## Out of Scope

- Sub-pages (Why Resilient Futures, Our Approach, Our Team, Who We Work With, Our Work) — separate build cycles
- Contact form backend / email handling
- CMS integration
- Analytics / tracking scripts
- Mobile navigation (hamburger menu) — simplified nav acceptable for v1
