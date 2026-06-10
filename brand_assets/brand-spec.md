# Resilient Futures — Working Brand Spec

**Source of truth:** the live home page (`index.html`) and `assets/css/site.css`.

This document supersedes the color, typography, and component guidance in
`resilient-futures-brand-guidelines.docx` (Sienna palette, v1.0, April 2026).
The earlier doc remains in this folder for reference and for sections that
have not been re-derived here (logo construction, tone of voice, vocabulary).

Last updated from `index.html` and `assets/css/site.css`.

---

## 1. Color palette

The brand uses a **deep navy + layered blue accent** system on warm cream and
white surfaces. There is no green, red, or coral in the active palette.

### Primary

| Token | Hex | Role on the live site |
| --- | --- | --- |
| `--rf-navy` | `#0B1D26` | Page heroes, dark CTA bands, footer; H1/H2/H3 body color on light surfaces |
| `--rf-navy-elevated` | `#122C3A` | Hover state for `--rf-navy` buttons (already in use, needs token) |

### Accent blues

| Token | Hex | Role on the live site |
| --- | --- | --- |
| `--rf-accent-deep` | `#3A5A92` | Dark CTA section background; "Learn more →" links; co-founder role labels; service-card italic taglines; testimonial card left border; in-line emphasis spans |
| `--rf-accent` | `#7B9BD1` | Eyebrows; hero "New" word highlights; numbered step labels (01–05); 3D node-graphic nodes and lines; hero top gradient stop |
| `--rf-accent-icon` | `#4A8FCF` | Stroke color for SVG list icons (e.g. "Why Different" row). Used only inside icons on the home page. |

> The site.css already declares `--rf-accent: #4A8FCF` and `--rf-soft-blue: #7BB0E2`.
> Those values do not match home-page usage and should be reassigned to the
> values above. `#7BB0E2` is not used on the home page and can be retired.

### Surfaces

| Token | Hex | Role on the live site |
| --- | --- | --- |
| `--rf-white` | `#FFFFFF` | Primary surface (Why Different, Strategy in Action sections, card backgrounds) |
| `--rf-cream` | `#FAFAF7` | Warm off-white alternating sections (Problem, Co-founders/Leaders) |
| `--rf-surface-blue` | `#EEF2F9` | Pale icy-blue alternating sections (What We Do, Testimonials) |

> Note: `site.css` currently defines `--rf-cream: #FAF7F0` (slightly more yellow),
> but the home page uses `#FAFAF7` inline. Reconcile to `#FAFAF7`.

### Lines, dividers, neutrals

| Token | Hex | Role on the live site |
| --- | --- | --- |
| `--rf-divider` | `#D4DCE8` | Hairlines between Strategy in Action steps; under co-founder names; soft section dividers |
| `--rf-divider-soft` | `rgba(11, 29, 38, 0.08)` | Inset dividers between "Why Different" rows |

### Text colors on light surfaces

| Token | Hex | Role on the live site |
| --- | --- | --- |
| `--rf-text` | `#1A1A1A` | Body copy (lead paragraphs, primary prose) |
| `--rf-text-muted` | `#4a6080` | Secondary body copy ("Why Different" descriptions, Strategy in Action step descriptions) |
| `--rf-text-subtle` | `#5a6a7a` | Captions, co-founder bio meta lines, attribution text |

### Text colors on dark (`--rf-navy` / `--rf-accent-deep`)

| Use | Value |
| --- | --- |
| Primary body on dark | `rgba(255, 255, 255, 0.82)` |
| Secondary body on dark | `rgba(255, 255, 255, 0.78)` |
| Quiet metadata on dark | `rgba(255, 255, 255, 0.65)` |

### Decorative gradients & overlays

Used to add depth to large dark or pale sections. Layer subtly — never above 0.15 alpha.

```css
/* Pale section ambience */
background: radial-gradient(circle, rgba(123, 155, 209, 0.07) 0%, transparent 65%);

/* Dark CTA ambience */
background: radial-gradient(circle, rgba(123, 155, 209, 0.15) 0%, transparent 60%);

/* Hero edge fades to --rf-navy */
linear-gradient(to bottom, #0B1D26, transparent);
linear-gradient(to right,  #0B1D26, transparent);
```

---

## 2. Typography

### Typefaces

| Role | Family | Source |
| --- | --- | --- |
| Display / headings / pull-quotes | **Source Serif 4** (fallback: Source Serif Pro → Georgia → serif) | Google Fonts |
| Body / UI / buttons / labels | **Inter** (fallback: system-ui → Segoe UI → sans-serif) | Google Fonts |

CSS tokens already exist as `--rf-font-serif` and `--rf-font-sans`. Use them; never set `font-family` inline.

### Type scale (as used on home page)

| Role | Size | Weight | Line height | Letter-spacing |
| --- | --- | --- | --- | --- |
| Hero display | `clamp(40px, 5.5vw, 72px)` | 500 | 1.05 | `-0.02em` |
| Section heading (H2) | `43px` | 700 | ~1.1 | `-0.01em` |
| Subheading / card title (H3) | `27px` | 700 | 1.1 | `-0.01em` |
| In-section heading | `19–22px` | 700 | 1.2–1.3 | `-0.01em` |
| Lead paragraph | `19px` display, 600 | — | 1.3 | `-0.01em` |
| Body lead | `17px` | 400 | 1.7 | normal |
| Body | `16px` | 400 | 1.65 | normal |
| Body small | `15px` | 400 | 1.65 | normal |
| Body x-small | `14px` | 400 | 1.55 | normal |
| Caption / meta | `13px` | 600 | 1.4 | `0.14em`, uppercase |

### Eyebrow / section label

The most-used motif on the home page. Lock the spec:

```css
.eyebrow {
  font-family: var(--rf-font-sans);
  font-size: 11px;
  font-weight: 600;
  color: var(--rf-accent);          /* #7B9BD1 */
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-bottom: 16px;
}
```

Variants:
- **Role label** (under co-founder names): `13px`, `0.14em` tracking, color `--rf-accent-deep` (`#3A5A92`).

---

## 3. Spacing & layout

| Token | Value | Notes |
| --- | --- | --- |
| `--rf-max-width` | `1280px` | Page container max (defined in site.css) |
| `--rf-section-pad-y` | `96px` desktop / `72px` mobile | Standard vertical section padding. **Note:** declared `120px` in site.css today, but the home page uses `96px` for every section. Reconcile to `96px`. |
| `--rf-section-pad-y-tall` | `140px` | Reserved for dark testimonial / hero-style bands |
| `--rf-section-pad-y-short` | `88px` | Reserved for inline dark CTA bands (e.g. the navy strip between Problem and Why Different) |

### Text containers

| Use | Max width |
| --- | --- |
| Section intro paragraph | `680px` |
| Wide prose | `760px` |
| Narrow prose / single-column rail | `560px` |

### Grid gaps

Pick from `24px`, `32px`, `48px`. Avoid arbitrary values.

---

## 4. Components (as established on the home page)

### Buttons

Defined in `site.css` (§4). Four variants:

| Class | Use | Notes |
| --- | --- | --- |
| `.btn-primary` | Light button on dark backgrounds (hero CTA: "Book a Conversation") | White fill, navy text |
| `.btn-primary--dark` | Dark button on light backgrounds | Navy fill, white text |
| `.btn-secondary` | Outlined button on dark backgrounds (hero secondary: "Explore our approach ↓") | Transparent fill, white border |
| `.btn-secondary--dark` | Outlined button on light backgrounds ("Learn more about the framework →") | Transparent fill, navy border |

Size modifiers: `.btn--sm`, `.btn--lg`. All four base + two size variants must share the same hover lift (`translateY(-1px)`) and the same focus-ring thickness (3px). Today secondary variants skip the lift — fix.

### Service card (numbered)

Observed in "What We Do" grid:

- Hairline grid with `1px` gap revealing `rgba(11, 29, 38, 0.06)` ground
- Large display numeral (45px, weight 700, `rgba(58, 90, 146, 0.10)`)
- Card heading: display 20px, weight 700, navy
- Italic accent tagline: 14px, color `--rf-accent-deep`, italic
- Body: 15px, line-height 1.65
- "Learn more →" link in `--rf-accent-deep`, anchored bottom

### Co-founder card

- 2px top border in `rgba(58, 90, 146, 0.25)`, 32px top padding
- Circular portrait, `1.5px` border in `rgba(123, 155, 209, 0.4)`, `4px` halo via `box-shadow: 0 0 0 4px rgba(123, 155, 209, 0.06)`
- Name: display 27px, weight 700, navy
- Role label: 13px, weight 600, `0.14em` tracking, uppercase, color `--rf-accent-deep`

### Testimonial card

- White fill on `--rf-surface-blue`
- `3px` left border in `--rf-accent-deep`
- Soft elevation: `box-shadow: 0 4px 24px rgba(11, 29, 38, 0.06)`
- Quote in display serif, 19px, navy

### Dark CTA band (full-bleed)

- Background: `--rf-accent-deep`
- Layered radial gradient at center: `rgba(123, 155, 209, 0.15)` to transparent
- Body in `rgba(255, 255, 255, 0.78)`

### Reveal animation

Defined in `site.css` §4b: `opacity 600ms ease-out` + `translateY(24px → 0)`.
Respects `prefers-reduced-motion`. Use the `.reveal` class on any element that
should fade-in on scroll.

---

## 5. Token implementation plan

Add to `site.css` `:root` and remove the inline hex literals across all pages.

```css
:root {
  /* Navy + elevated */
  --rf-navy:                  #0B1D26;
  --rf-navy-elevated:         #122C3A;

  /* Accent blues */
  --rf-accent-deep:           #3A5A92;
  --rf-accent:                #7B9BD1;
  --rf-accent-icon:           #4A8FCF;

  /* Surfaces */
  --rf-white:                 #FFFFFF;
  --rf-cream:                 #FAFAF7;
  --rf-surface-blue:          #EEF2F9;

  /* Dividers */
  --rf-divider:               #D4DCE8;
  --rf-divider-soft:          rgba(11, 29, 38, 0.08);

  /* Text on light */
  --rf-text:                  #1A1A1A;
  --rf-text-muted:            #4a6080;
  --rf-text-subtle:           #5a6a7a;

  /* Layout */
  --rf-max-width:             1280px;
  --rf-section-pad-y:         96px;
  --rf-section-pad-y-mobile:  72px;
  --rf-section-pad-y-tall:    140px;
  --rf-section-pad-y-short:   88px;

  /* Fonts */
  --rf-font-serif: 'Source Serif 4', 'Source Serif Pro', Georgia, 'Times New Roman', serif;
  --rf-font-sans:  'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
}
```

Retire from `site.css`:
- `--rf-soft-blue: #7BB0E2` (not used on the home page)
- `--rf-slate: #4A5568` (does not match any live use — site uses `#4a6080` and `#5a6a7a`)
- The old `--rf-accent: #4A8FCF` meaning (repurpose token to `#7B9BD1`)

---

## 6. Known mismatches & open questions

1. **The PNG logo (`Resilient Futures LOGO.png`) was authored against the Sienna palette** (warm brown/sienna/coral). Verify on screen against the navy site — if it reads as off-brand, source a navy/blue logo variant.
2. **The `.docx` brand guidelines still describe the Sienna palette and Playfair Display headings.** Either retire the docx, mark it `v1.0 – superseded`, or rewrite it to match this spec.
3. **`#A1CACC` (Secondary in the old spec) does not appear on the home page.** Decide whether to retire it or keep it for an as-yet-undefined use (trust signals, secondary badges).
4. **No defined hover shade for `--rf-accent-deep` `#3A5A92`.** If link hovers need to darken, add a `--rf-accent-deep-hover` token (suggest `#2D4773`).
5. **`--rf-section-pad-y` is declared `120px` in CSS but the home page uses `96px` everywhere.** Pick one and update all pages.
6. **`.font-display` and `--rf-font-serif` reference Source Serif 4** — confirm the Google Fonts link is in every page's `<head>`. (Check `partials/nav.html` or per-page heads.)
