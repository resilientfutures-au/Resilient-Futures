---
name: Get Started Page Design
description: Design spec for the getstarted.html page — funnel layout with booking cards, SiAPC community section, and contact form
type: project
---

# Get Started Page — Design Spec

## Overview

A new `getstarted.html` page that matches the existing site design system (Playfair Display + Inter, dark warm-red palette, `#FF6139` orange accent). Content sourced from the live page at resilientfutures.com/getstarted, confirmed up-to-date by the client. Layout follows the Focused Funnel approach: each section has one clear action, guiding visitors step-by-step.

## Design System

Matches all existing pages exactly:
- **Fonts:** Playfair Display (headings/display) + Inter (body/UI)
- **Palette:** `#1a0f0e` (footer bg), `#1a1a1a` (body bg), `#2a1816` (dark section), `#361F1D` (nav/card bg), `#EFEFE7` (light section), `#fff` (white section)
- **Accents:** `#FF6139` (primary orange), `#A1CACC` (teal), `#743734` (logo mid-tone)
- **Nav/footer:** Identical to team.html — same sticky nav, same footer with logo, columns, and social icons
- **Booking links:** Placeholder `#` — will be swapped for HubSpot links (later possibly Calendly)

---

## Page Sections (top to bottom)

### 1. Nav
Identical to all other pages. "Get Started" is not currently a nav item, but the page will be linked from the "Get in touch" button and footer.

### 2. Hero
- **Background:** `linear-gradient(155deg, #2a1816 0%, #361F1D 45%, #4a2826 100%)` with radial glow decorations (same as other pages)
- **Breadcrumb:** Home / Get Started
- **Section label (teal):** "Get Started"
- **H1 (Playfair Display, ~50px):** "We'd love to speak with you."
- **Italic subheading (orange, Playfair italic ~20px):** "Getting started with Resilient Futures is easy."
- **Body copy:** Brief explanation that RF works globally, entirely online, with three paths below
- **Layout:** Accent bar + text, no hero graphic (keeps focus on copy)

### 3. Book a Conversation
- **Background:** `#2a1816`
- **Section label (teal):** "Book a Conversation"
- **Heading (Playfair, ~34px, white):** "Speak directly with our principals."
- **Sub-copy:** One sentence — confidential, executive-level, choose who to speak with
- **Two white cards** side-by-side, each with:
  - `border-top: 3px solid #FF6139` (matches team cards)
  - Placeholder circular avatar image
  - Name (Playfair Display, 22px, `#361F1D`)
  - Title (uppercase label, `#FF6139`)
  - 1–2 sentence description
  - "Book a call with [Name]" — `btn-primary` button linking to `#` (HubSpot placeholder)

**Card content:**
| | David Platt | Niloo Amendra |
|---|---|---|
| Title | Co-Founder & Facilitator | Chief Strategy Officer & Facilitator |
| Description | Strategic leadership and organisational resilience. 25+ years building and running the Resilient Futures practice. | Learning design, leadership capability, and workshop facilitation. Leads Resilient Futures' learning programmes globally. |
| CTA | Book a call with David | Book a call with Niloo |

### 4. SiAPC — Practice Community
- **Background:** `#EFEFE7` (light beige, same as team grid section)
- **Two-column layout** (1fr 1fr, 64px gap):
  - **Left:** Badge pill ("Practice Community"), H2 "Join the Strategy in Action Practice Community.", body copy, three attribute pills (Peer Learning · Framework Access · Senior Network), dark CTA button ("Register Now" → `#`)
  - **Right:** Dark card (`#361F1D` bg) with teal section label, pull quote in Playfair italic, and three bullet points with orange dots listing community benefits
- **Community benefits listed:**
  - Complementary learning resources
  - Online community platform
  - Peer networking with senior leaders

### 5. Contact Form
- **Background:** `#fff`
- **Two-column layout** (1fr 1fr, 80px gap):
  - **Left (form):**
    - Section label (orange): "Get in Touch"
    - H2 "Send us a message."
    - Body copy: "Not sure which path is right for you? Send us a message and we'll point you in the right direction."
    - Fields: Name, Email Address, Message (textarea)
    - Submit: "Send Message" — `btn-primary`
    - Form submission: `mailto:info@resilientfutures.com` (or backend later — for now mailto is acceptable)
  - **Right (direct contacts):**
    - Section label: "Direct Contacts"
    - Intro line: "Or reach us directly by email:"
    - Three email rows with uppercase label + email link, separated by `#EFEFE7` borders:
      - Strategic Services → services@resilientfutures.com
      - Learning Programs → learning@resilientfutures.com
      - General Enquiries → info@resilientfutures.com

### 6. Footer
Identical to all other pages (team.html). Logo, About/Services/Contact column links, social icons, copyright line.

---

## Responsive Behaviour

- **Mobile (<768px):** Nav links hidden (hamburger not needed — matches other pages). Hero accent bar hidden. Booking cards stack to single column. SiAPC two-column stacks (copy then dark card). Contact form two-column stacks (form then emails).
- **Tablet (768–1023px):** Booking cards remain 2-col. SiAPC and contact stack to single column.
- **Desktop (≥1024px):** Full two-column layouts as designed.

---

## Nav Link

The "Get in touch" button in the sticky nav on all pages currently links to `mailto:`. Update it to link to `getstarted.html` — this page is the proper destination for that CTA. Also add "Get Started" as a link in the footer Contact column on all pages.

---

## Files to Create/Edit

- **Create:** `getstarted.html`
- **Edit:** `index.html`, `team.html`, `why.html`, `strategy-in-action.html`, `strategic-fitness.html` — update nav and footer to include link to getstarted.html
