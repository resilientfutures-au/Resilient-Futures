# Homepage Colour Repalette Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce two colour-variant copies of the homepage (`index-v1-dark-light.html` and `index-v2-light-dominant.html`) using the new blue palette, leaving `index.html` untouched.

**Architecture:** Both files are plain copies of `index.html` with colour values swapped in-place. V1 preserves the dark/light alternating section rhythm; V2 lifts all interior dark sections to light, keeping only the hero and footer in Midnight. No structural, content, layout, or script changes.

**Tech Stack:** Static HTML/CSS (inline styles + embedded `<style>` block), Tailwind CDN, Three.js, Google Fonts. Node dev server (`node serve.mjs`). Puppeteer screenshots (`node screenshot.mjs`).

---

## New Palette Reference

| Name | Hex | Replaces |
|---|---|---|
| Midnight | `#0B1D26` | `#361F1D` (dark surfaces) |
| Deep midnight | `#060f14` | `#1a0f0e` (footer) / `#2a1816` (gradient start) |
| Service card dark | `#0d2535` | `#2a1816` (dropdown / card bg) |
| Service card hover | `#162f44` | `#4a2826` |
| Periwinkle | `#7B9BD1` | `#FF6139`, `#A1CACC`, `#B8360F` |
| Deep blue | `#3A5A92` | `#743734` (sub-labels on light) |
| Paper | `#FAFAF7` | `#F5F5ED` |
| Blue tint | `#EEF2F9` | `#EFEFE7` |
| Cool slate | `#4a6080` | `#6B5350` (muted captions) |
| Cool divider | `#D4DCE8` | `#D8D0C8` |

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `index.html` | Read-only reference | Never modified |
| `index-v1-dark-light.html` | Create | V1 — dark/light alternating, new palette |
| `index-v2-light-dominant.html` | Create | V2 — light-dominant, built on top of V1 |

---

## Task 1: Copy source file to both output files

**Files:**
- Create: `index-v1-dark-light.html`
- Create: `index-v2-light-dominant.html`

- [ ] **Step 1: Copy index.html to both output files**

```powershell
Copy-Item "index.html" "index-v1-dark-light.html"
Copy-Item "index.html" "index-v2-light-dominant.html"
```

- [ ] **Step 2: Verify both files exist and are the same size as index.html**

```powershell
Get-Item index.html, index-v1-dark-light.html, index-v2-light-dominant.html | Select-Object Name, Length
```

Expected: all three files with identical `Length` values.

- [ ] **Step 3: Commit**

```powershell
git add index-v1-dark-light.html index-v2-light-dominant.html
git commit -m "chore: scaffold V1 and V2 colour variant files from index.html"
```

---

## Task 2: Apply global colour swaps to V1

All replacements here are unambiguous — the same string value means the same visual role everywhere in the file. Apply them all to `index-v1-dark-light.html` in a single PowerShell script.

**Files:**
- Modify: `index-v1-dark-light.html`

- [ ] **Step 1: Run the global replacement script**

```powershell
$f = "index-v1-dark-light.html"
$c = Get-Content $f -Raw -Encoding utf8

# ── Dark surfaces ──────────────────────────────────────
$c = $c -replace '#361F1D',          '#0B1D26'
$c = $c -replace '#4a2826',          '#162f44'
$c = $c -replace 'background: #1a1a1a', 'background: #0B1D26'
$c = $c -replace '#1a0f0e',          '#060f14'

# ── Dropdown bg and CTA gradient start (#2a1816 appears in both) ──
$c = $c -replace 'background: #2a1816',  'background: #0d2535'
$c = $c -replace '#2a1816 0%',           '#060f14 0%'

# ── Coral → Periwinkle ─────────────────────────────────
$c = $c -replace '#FF6139',              '#7B9BD1'
$c = $c -replace '#B8360F',              '#7B9BD1'
$c = $c -replace 'rgba\(255,97,57,0\.18\)',  'rgba(123,155,209,0.18)'
$c = $c -replace 'rgba\(255,97,57,0\.3\)',   'rgba(123,155,209,0.3)'
$c = $c -replace 'rgba\(255,97,57,0\.5\)',   'rgba(123,155,209,0.5)'
$c = $c -replace 'rgba\(255,97,57,0\.25\)',  'rgba(123,155,209,0.25)'

# ── Blue-green secondary → Periwinkle ──────────────────
$c = $c -replace '#A1CACC',              '#7B9BD1'
$c = $c -replace 'rgba\(161,202,204,0\.07\)', 'rgba(123,155,209,0.07)'
$c = $c -replace 'rgba\(161,202,204,0\.06\)', 'rgba(123,155,209,0.06)'
$c = $c -replace 'rgba\(161,202,204,0\.4\)',  'rgba(123,155,209,0.4)'
$c = $c -replace 'rgba\(161,202,204,0\.3\)',  'rgba(123,155,209,0.3)'

# ── Light backgrounds ───────────────────────────────────
$c = $c -replace '#F5F5ED',              '#FAFAF7'
$c = $c -replace '#EFEFE7',              '#EEF2F9'

# ── Warm brown alphas → Midnight alphas ────────────────
$c = $c -replace 'rgba\(54,31,29,0\.06\)',   'rgba(11,29,38,0.06)'
$c = $c -replace 'rgba\(54,31,29,0\.08\)',   'rgba(11,29,38,0.08)'
$c = $c -replace 'rgba\(54,31,29,0\.04\)',   'rgba(11,29,38,0.04)'
$c = $c -replace 'rgba\(54,31,29,0\.65\)',   'rgba(11,29,38,0.65)'

# ── Warm neutral on dark cards ──────────────────────────
$c = $c -replace '#F2EDE6',              'rgba(255,255,255,0.88)'

# ── Warm grey captions / dividers ──────────────────────
$c = $c -replace '#6B5350',              '#4a6080'
$c = $c -replace '#D8D0C8',              '#D4DCE8'

# ── Deep blue borders (runs AFTER coral->Periwinkle swap above) ──
# Pullquote border-left has a space after colon; testimonials do not
$c = $c -replace 'border-left: 3px solid #7B9BD1', 'border-left: 3px solid #3A5A92'
$c = $c -replace 'border-left:3px solid #7B9BD1',  'border-left:3px solid #3A5A92'

Set-Content $f $c -Encoding utf8
```

- [ ] **Step 2: Verify no old colours remain (spot-check the most common ones)**

```powershell
$c = Get-Content "index-v1-dark-light.html" -Raw
@('#361F1D','#FF6139','#F5F5ED','#EFEFE7','#A1CACC','#4a2826','#1a0f0e','#B8360F','#6B5350','#D8D0C8','#F2EDE6') | ForEach-Object {
    $count = ([regex]::Matches($c, [regex]::Escape($_))).Count
    "$_ → $count occurrences"
}
```

Expected: all lines show `→ 0 occurrences`.

---

## Task 3: Apply targeted colour edits to V1

These changes can't be done with global replace because the same hex value appears in different semantic contexts.

**Files:**
- Modify: `index-v1-dark-light.html`

The colour `#743734` (brick) appears in three places:
1. Logo `futures` span — on dark nav, becomes Periwinkle
2. SiA italic lead sub-heading — on light section, becomes Deep blue
3. "Five Interconnected Standards" label — on light section, becomes Deep blue

- [ ] **Step 1: Update logo `futures` span (on dark nav → Periwinkle)**

Find:
```html
<span style="color:#743734;">futures</span>
```
Replace with:
```html
<span style="color:#7B9BD1;">futures</span>
```

Use the Edit tool on `index-v1-dark-light.html`.

- [ ] **Step 2: Update SiA italic sub-heading (on light → Deep blue)**

Find:
```html
<p class="font-display" style="font-size:17px; font-weight:600; color:#743734; letter-spacing:-0.01em; margin-bottom:20px;">Making your organisation the strategist.</p>
```
Replace with:
```html
<p class="font-display" style="font-size:17px; font-weight:600; color:#3A5A92; letter-spacing:-0.01em; margin-bottom:20px;">Making your organisation the strategist.</p>
```

- [ ] **Step 3: Update "Five Interconnected Standards" caption (on light → Deep blue)**

Find:
```html
        <p style="font-size:11px; font-weight:600; letter-spacing:0.13em; text-transform:uppercase; color:#743734; margin-top:24px;">
```
Replace with:
```html
        <p style="font-size:11px; font-weight:600; letter-spacing:0.13em; text-transform:uppercase; color:#3A5A92; margin-top:24px;">
```

- [ ] **Step 4: Verify no `#743734` values remain**

```powershell
$c = Get-Content "index-v1-dark-light.html" -Raw
([regex]::Matches($c, [regex]::Escape('#743734'))).Count
```

Expected: `0`

- [ ] **Step 5: Commit**

```powershell
git add index-v1-dark-light.html
git commit -m "feat: apply blue palette colour swaps to V1 dark/light homepage variant"
```

---

## Task 4: Screenshot and verify V1

**Files:** (none modified)

- [ ] **Step 1: Ensure dev server is running**

```powershell
# Only run if not already running. Check by trying the URL first.
# If not running: node serve.mjs (in background)
```

The dev server runs on `http://localhost:3000`. If it isn't already running, start it with `node serve.mjs` in the background before proceeding.

- [ ] **Step 2: Screenshot V1 at full page**

```powershell
node screenshot.mjs http://localhost:3000/index-v1-dark-light.html v1-full
```

Saved to `temporary screenshots/screenshot-N-v1-full.png`.

- [ ] **Step 3: Read and inspect the screenshot**

Use the Read tool on the saved screenshot PNG. Check:
- Nav is Midnight, not brown
- Hero is Midnight with Periwinkle sub-headline and CTA button
- Problem section is Paper (`#FAFAF7`) — slightly cooler than the old warm off-white
- Services section is Midnight with Periwinkle labels and links
- SiA section is Paper
- About section is Midnight
- Testimonials is Paper, quote cards have Deep blue left border
- Client logos strip is Blue tint
- CTA section is Midnight gradient
- Footer is deep Midnight
- No coral or brown tones visible anywhere

- [ ] **Step 4: Screenshot individual sections if anything looks off**

```powershell
# Hero
node screenshot.mjs "http://localhost:3000/index-v1-dark-light.html#hero" v1-hero
# Services
node screenshot.mjs "http://localhost:3000/index-v1-dark-light.html#services" v1-services
```

Inspect each screenshot with the Read tool. Fix any colour mismatches before proceeding to Task 5.

---

## Task 5: Apply V2 overrides to the light-dominant variant

V2 starts from `index-v2-light-dominant.html` (still an unchanged copy of `index.html` at this point). Apply the same global swaps as Task 2 first, then apply section-specific overrides that flip interior dark sections to light.

**Files:**
- Modify: `index-v2-light-dominant.html`

### Step group A: Apply shared global swaps (same script as Task 2)

- [ ] **Step 1: Run the same global replacement script on V2**

```powershell
$f = "index-v2-light-dominant.html"
$c = Get-Content $f -Raw -Encoding utf8

$c = $c -replace '#361F1D',          '#0B1D26'
$c = $c -replace '#4a2826',          '#162f44'
$c = $c -replace 'background: #1a1a1a', 'background: #0B1D26'
$c = $c -replace '#1a0f0e',          '#060f14'
$c = $c -replace 'background: #2a1816',  'background: #0d2535'
$c = $c -replace '#2a1816 0%',           '#060f14 0%'
$c = $c -replace '#FF6139',              '#7B9BD1'
$c = $c -replace '#B8360F',              '#7B9BD1'
$c = $c -replace 'rgba\(255,97,57,0\.18\)',  'rgba(123,155,209,0.18)'
$c = $c -replace 'rgba\(255,97,57,0\.3\)',   'rgba(123,155,209,0.3)'
$c = $c -replace 'rgba\(255,97,57,0\.5\)',   'rgba(123,155,209,0.5)'
$c = $c -replace 'rgba\(255,97,57,0\.25\)',  'rgba(123,155,209,0.25)'
$c = $c -replace '#A1CACC',              '#7B9BD1'
$c = $c -replace 'rgba\(161,202,204,0\.07\)', 'rgba(123,155,209,0.07)'
$c = $c -replace 'rgba\(161,202,204,0\.06\)', 'rgba(123,155,209,0.06)'
$c = $c -replace 'rgba\(161,202,204,0\.4\)',  'rgba(123,155,209,0.4)'
$c = $c -replace 'rgba\(161,202,204,0\.3\)',  'rgba(123,155,209,0.3)'
$c = $c -replace '#F5F5ED',              '#FAFAF7'
$c = $c -replace '#EFEFE7',              '#EEF2F9'
$c = $c -replace 'rgba\(54,31,29,0\.06\)',   'rgba(11,29,38,0.06)'
$c = $c -replace 'rgba\(54,31,29,0\.08\)',   'rgba(11,29,38,0.08)'
$c = $c -replace 'rgba\(54,31,29,0\.04\)',   'rgba(11,29,38,0.04)'
$c = $c -replace 'rgba\(54,31,29,0\.65\)',   'rgba(11,29,38,0.65)'
$c = $c -replace '#F2EDE6',              'rgba(255,255,255,0.88)'
$c = $c -replace '#6B5350',              '#4a6080'
$c = $c -replace '#D8D0C8',              '#D4DCE8'

# ── Deep blue borders (runs AFTER coral->Periwinkle swap above) ──
$c = $c -replace 'border-left: 3px solid #7B9BD1', 'border-left: 3px solid #3A5A92'
$c = $c -replace 'border-left:3px solid #7B9BD1',  'border-left:3px solid #3A5A92'

Set-Content $f $c -Encoding utf8
```

- [ ] **Step 2: Apply targeted edits for `#743734` (same as Task 3)**

In `index-v2-light-dominant.html`, make the same three edits from Task 3 (Steps 1–3):
- Logo `futures` span: `color:#743734;` → `color:#7B9BD1;`
- SiA italic sub-heading: `color:#743734;` → `color:#3A5A92;`
- "Five Interconnected Standards" caption: `color:#743734;` → `color:#3A5A92;`

Use the Edit tool for each.

### Step group A2: Override SiA Framework section background (Paper → White)

The spec requires V2 SiA Framework to use `#FFFFFF` (White) rather than `#FAFAF7` (Paper).

- [ ] **Step 2b: Change SiA Framework section background from Paper to White**

Find in `index-v2-light-dominant.html`:
```html
<section id="approach" style="background:#FAFAF7; padding:96px 48px;">
```
Replace with:
```html
<section id="approach" style="background:#FFFFFF; padding:96px 48px;">
```

### Step group B: Override Services section (Midnight → Blue tint)

- [ ] **Step 3: Change services section background from Midnight to Blue tint**

Find in `index-v2-light-dominant.html`:
```html
<section id="services" style="
  background: #0B1D26;
  padding: 96px 48px;
  position:relative; overflow:hidden;
">
```
Replace with:
```html
<section id="services" style="
  background: #EEF2F9;
  padding: 96px 48px;
  position:relative; overflow:hidden;
">
```

- [ ] **Step 4: Change services heading and body text from white/rgba to dark**

Find:
```html
    <h2 class="font-display" style="
      font-size:38px; font-weight:700; color:#fff;
      line-height:1.15; letter-spacing:-0.02em;
      max-width:640px; margin-bottom:24px;
    ">Where would you like to start?</h2>
    <p style="font-size:15px; line-height:1.7; color:rgba(255,255,255,0.82); max-width:680px; margin-bottom:16px;">
      We work with Australian Boards and Executives
```
Replace with:
```html
    <h2 class="font-display" style="
      font-size:38px; font-weight:700; color:#0B1D26;
      line-height:1.15; letter-spacing:-0.02em;
      max-width:640px; margin-bottom:24px;
    ">Where would you like to start?</h2>
    <p style="font-size:15px; line-height:1.7; color:#1A1A1A; max-width:680px; margin-bottom:16px;">
      We work with Australian Boards and Executives
```

- [ ] **Step 5: Change second services body paragraph from rgba white to dark**

Find:
```html
    <p style="font-size:15px; line-height:1.7; color:rgba(255,255,255,0.82); max-width:680px; margin-bottom:0;">
      Our approach integrates strategic foresight
```
Replace with:
```html
    <p style="font-size:15px; line-height:1.7; color:#1A1A1A; max-width:680px; margin-bottom:0;">
      Our approach integrates strategic foresight
```

- [ ] **Step 6: Change service card CSS in the style block (card bg and hover)**

Find in the `<style>` block:
```css
    .svc-card {
      background: #361F1D;
      padding: 36px 28px;
      transition: background 0.2s;
    }
    .svc-card:hover { background: #4a2826; }
```

Note: after Task 2's global swaps this will now read:
```css
    .svc-card {
      background: #0B1D26;
      padding: 36px 28px;
      transition: background 0.2s;
    }
    .svc-card:hover { background: #162f44; }
```

Replace with:
```css
    .svc-card {
      background: #FFFFFF;
      padding: 36px 28px;
      transition: background 0.2s;
    }
    .svc-card:hover { background: #f4f7fd; }
```

- [ ] **Step 7: Change service card large background numbers (Periwinkle tint → Deep blue tint)**

The three large `01`, `02`, `03` numbers in the service cards use `rgba(123,155,209,0.18)` (after global swap). On white cards they need a slightly darker tint.

Find all three (they are identical):
```html
        <div class="font-display" style="font-size:40px; font-weight:700; color:rgba(123,155,209,0.18); line-height:1; margin-bottom:16px;">01</div>
```
Replace with:
```html
        <div class="font-display" style="font-size:40px; font-weight:700; color:rgba(58,90,146,0.10); line-height:1; margin-bottom:16px;">01</div>
```
Do the same for `02` and `03`.

- [ ] **Step 8: Change service card title colour (white → Midnight)**

Find all three (identical pattern):
```html
        <div class="font-display" style="font-size:20px; font-weight:700; color:#fff; margin-bottom:6px; line-height:1.2;">Strategic Fitness</div>
```
Replace with:
```html
        <div class="font-display" style="font-size:20px; font-weight:700; color:#0B1D26; margin-bottom:6px; line-height:1.2;">Strategic Fitness</div>
```
Do the same for "SiA Strategy Engagement" and "Capability Building".

- [ ] **Step 9: Change service card sub-labels (Periwinkle → Deep blue)**

Find all three sub-label divs (each has a different text but identical style):
```html
        <div style="font-size:12px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#7B9BD1; margin-bottom:16px;">Boards, CEOs, Senior Leadership Teams</div>
```
Replace `color:#7B9BD1;` with `color:#3A5A92;` for all three service card sub-labels.

- [ ] **Step 10: Change service card body text (rgba white → dark)**

Find all three body paragraphs in service cards (they use `color:#F2EDE6` in the original, after global swap now `color:rgba(255,255,255,0.88)`):
```html
        <p style="font-size:15px; line-height:1.7; color:rgba(255,255,255,0.88);">
```
Replace with:
```html
        <p style="font-size:15px; line-height:1.7; color:#1A1A1A;">
```
Apply to all three service card body paragraphs.

- [ ] **Step 11: Change service links (Periwinkle → Deep blue) in V2 services**

The `.svc-link` CSS class currently has `color: #7B9BD1` (after global swap). This class is used across dark sections in V1 but in V2 the services section is light, so we need Deep blue there. Since the CSS class is shared, add inline overrides on each link:

Find each service link in the services section:
```html
        <a href="strategic-fitness.html" class="svc-link">Learn more &#8594;</a>
```
Replace with:
```html
        <a href="strategic-fitness.html" class="svc-link" style="color:#3A5A92;">Learn more &#8594;</a>
```
Do the same for the other two `<a class="svc-link">` elements in the services section.

### Step group C: Override About section (Midnight → Paper)

- [ ] **Step 12: Change about section background from Midnight to Paper**

Find:
```html
<section id="about" style="
  background: #0B1D26;
  padding: 96px 48px;
  position:relative; overflow:hidden;
">
```
Replace with:
```html
<section id="about" style="
  background: #FAFAF7;
  padding: 96px 48px;
  position:relative; overflow:hidden;
">
```

- [ ] **Step 13: Change about section label, heading, and intro text**

Find:
```html
    <span class="section-label section-label--light">The People Behind the Work</span>
    <h2 class="font-display" style="
      font-size:38px; font-weight:700; color:#fff;
      line-height:1.15; letter-spacing:-0.02em;
      max-width:640px; margin-bottom:24px;
    ">Depth over delegation.</h2>
    <p style="font-size:15px; line-height:1.7; color:rgba(255,255,255,0.82); max-width:680px; margin-bottom:0;">
      When you engage Resilient Futures
```
Replace with:
```html
    <span class="section-label">The People Behind the Work</span>
    <h2 class="font-display" style="
      font-size:38px; font-weight:700; color:#0B1D26;
      line-height:1.15; letter-spacing:-0.02em;
      max-width:640px; margin-bottom:24px;
    ">Depth over delegation.</h2>
    <p style="font-size:15px; line-height:1.7; color:#1A1A1A; max-width:680px; margin-bottom:0;">
      When you engage Resilient Futures
```

Note: removing `section-label--light` class makes the label use the standard Periwinkle from the `.section-label` style.

- [ ] **Step 14: Change Larry bio card colours (white text on dark → dark text on light)**

Find:
```html
      <!-- Larry -->
      <div style="border-top:2px solid rgba(123,155,209,0.3); padding-top:32px;">
```
Replace with:
```html
      <!-- Larry -->
      <div style="border-top:2px solid rgba(58,90,146,0.25); padding-top:32px;">
```

Find Larry's name:
```html
        <div class="font-display" style="font-size:24px; font-weight:700; color:#fff; line-height:1.1; margin-bottom:6px;">Larry Quick</div>
```
Replace with:
```html
        <div class="font-display" style="font-size:24px; font-weight:700; color:#0B1D26; line-height:1.1; margin-bottom:6px;">Larry Quick</div>
```

Find Larry's title label:
```html
        <div style="font-size:12px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:#7B9BD1; margin-bottom:12px;">Co-founder · Strategy &amp; Complex Systems</div>
```
Replace with:
```html
        <div style="font-size:12px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:#3A5A92; margin-bottom:12px;">Co-founder · Strategy &amp; Complex Systems</div>
```

Find Larry's meta line (credentials + divider):
```html
        <div style="font-size:13px; color:rgba(255,255,255,0.68); letter-spacing:0.02em; margin-bottom:20px; padding-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.08);">
```
Replace with:
```html
        <div style="font-size:13px; color:#5a6a7a; letter-spacing:0.02em; margin-bottom:20px; padding-bottom:20px; border-bottom:1px solid #D4DCE8;">
```

Find Larry's bio paragraph:
```html
        <p style="font-size:14px; line-height:1.75; color:rgba(255,255,255,0.82); margin:0;">
          Larry has spent over 25 years
```
Replace with:
```html
        <p style="font-size:14px; line-height:1.75; color:#1A1A1A; margin:0;">
          Larry has spent over 25 years
```

- [ ] **Step 15: Change David bio card colours (same pattern as Larry)**

Apply the same four substitutions from Step 14 to David's bio card:
- `border-top:2px solid rgba(123,155,209,0.3)` → `rgba(58,90,146,0.25)`
- Name `color:#fff` → `color:#0B1D26`
- Title label `color:#7B9BD1` → `color:#3A5A92`
- Meta div `color:rgba(255,255,255,0.68)` + `border-bottom:1px solid rgba(255,255,255,0.08)` → `color:#5a6a7a` + `border-bottom:1px solid #D4DCE8`
- Bio paragraph `color:rgba(255,255,255,0.82)` → `color:#1A1A1A`

- [ ] **Step 16: Change about section pull-quote block**

Find:
```html
    <div style="margin-top:64px; background:rgba(255,255,255,0.04); padding:56px 64px;">
      <p class="font-display" style="
        font-size:22px; font-weight:700;
        color:rgba(255,255,255,0.85); line-height:1.6;
        max-width:800px; margin:0 0 32px;
      ">
        &ldquo;Our role is to work alongside your leadership team &mdash; bringing the thinking, challenging the assumptions, and transferring the tools &mdash; so your organisation builds real strategic capability over time. <span style="color:#7B9BD1;">Not dependency.&rdquo;</span>
      </p>
      <p style="font-size:12px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.60); margin:0;">
        &mdash; David Platt, Resilient Futures
      </p>
    </div>
```
Replace with:
```html
    <div style="margin-top:64px; background:rgba(11,29,38,0.04); padding:56px 64px;">
      <p class="font-display" style="
        font-size:22px; font-weight:700;
        color:#0B1D26; line-height:1.6;
        max-width:800px; margin:0 0 32px;
      ">
        &ldquo;Our role is to work alongside your leadership team &mdash; bringing the thinking, challenging the assumptions, and transferring the tools &mdash; so your organisation builds real strategic capability over time. <span style="color:#3A5A92;">Not dependency.&rdquo;</span>
      </p>
      <p style="font-size:12px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#5a6a7a; margin:0;">
        &mdash; David Platt, Resilient Futures
      </p>
    </div>
```

### Step group D: Override Testimonials, Client Logos, and CTA sections

- [ ] **Step 17: Change testimonials section background (Paper → Blue tint)**

Find:
```html
<section style="background:#FAFAF7; padding:96px 48px;">
  <div class="section-inner">
    <span class="section-label" style="color:#7B9BD1;">Trusted by Leaders
```
Replace with:
```html
<section style="background:#EEF2F9; padding:96px 48px;">
  <div class="section-inner">
    <span class="section-label" style="color:#7B9BD1;">Trusted by Leaders
```

- [ ] **Step 18: Change client logos section background (Blue tint → White)**

Find:
```html
<section style="background:#EEF2F9; padding:56px 48px; border-top:1px solid rgba(11,29,38,0.08);">
```
Replace with:
```html
<section style="background:#FFFFFF; padding:56px 48px; border-top:1px solid rgba(11,29,38,0.08);">
```

- [ ] **Step 19: Change CTA section from Midnight gradient to solid Deep blue**

Find:
```html
<section id="contact" style="
  background: linear-gradient(135deg, #060f14 0%, #0B1D26 100%);
  padding: 96px 48px;
  text-align: center;
  position:relative; overflow:hidden;
">
  <div style="
    position:absolute; top:50%; left:50%;
    transform: translate(-50%,-50%);
    width:600px; height:600px; border-radius:50%;
    background: radial-gradient(circle, rgba(123,155,209,0.10) 0%, transparent 60%);
    pointer-events:none;
  "></div>
```
Replace with:
```html
<section id="contact" style="
  background: #3A5A92;
  padding: 96px 48px;
  text-align: center;
  position:relative; overflow:hidden;
">
  <div style="
    position:absolute; top:50%; left:50%;
    transform: translate(-50%,-50%);
    width:600px; height:600px; border-radius:50%;
    background: radial-gradient(circle, rgba(123,155,209,0.15) 0%, transparent 60%);
    pointer-events:none;
  "></div>
```

- [ ] **Step 20: Override CTA button to white-on-deep-blue**

The `.btn-primary` class has `background:#7B9BD1` (Periwinkle) globally. On the Deep blue CTA section this creates a Periwinkle button on Deep blue — too close in value. Override with an inline style.

Find the CTA button:
```html
    <a href="mailto:techadmin@resilientfutures.com" class="btn-primary" style="font-size:13px; padding:16px 40px;">
      Book a conversation
    </a>
```
Replace with:
```html
    <a href="mailto:techadmin@resilientfutures.com" class="btn-primary" style="font-size:13px; padding:16px 40px; background:#FFFFFF; color:#0B1D26;">
      Book a conversation
    </a>
```

- [ ] **Step 21: Commit V2 progress**

```powershell
git add index-v2-light-dominant.html
git commit -m "feat: apply blue palette colour swaps to V2 light-dominant homepage variant"
```

---

## Task 6: Screenshot and verify V2

**Files:** (none modified)

- [ ] **Step 1: Screenshot V2 at full page**

```powershell
node screenshot.mjs http://localhost:3000/index-v2-light-dominant.html v2-full
```

- [ ] **Step 2: Read and inspect the screenshot**

Use the Read tool. Check:
- Nav: Midnight (same as V1)
- Hero: Midnight (same as V1)
- Problem: Paper (same as V1)
- Services: Blue tint background, white cards, Midnight headings, Deep blue sub-labels
- SiA Framework: White background, Midnight headings
- About/Team: Paper background, Midnight headings and names, Dark body text
- Testimonials: Blue tint background
- Client logos: White background
- CTA: Deep blue solid background, white button
- Footer: Deep Midnight (same as V1)
- No white text on light backgrounds, no dark text on dark backgrounds

- [ ] **Step 3: Screenshot individual problem areas if any**

```powershell
node screenshot.mjs http://localhost:3000/index-v2-light-dominant.html v2-services
node screenshot.mjs http://localhost:3000/index-v2-light-dominant.html v2-about
node screenshot.mjs http://localhost:3000/index-v2-light-dominant.html v2-cta
```

Read each screenshot and fix any contrast or colour issues before the final commit.

---

## Task 7: Side-by-side comparison and final commit

- [ ] **Step 1: Screenshot both variants for comparison**

```powershell
node screenshot.mjs http://localhost:3000/index-v1-dark-light.html final-v1
node screenshot.mjs http://localhost:3000/index-v2-light-dominant.html final-v2
```

Read both screenshots. Confirm:
- The two versions look visually distinct
- V1 has alternating dark/light sections
- V2 is predominantly light with only hero and footer in Midnight

- [ ] **Step 2: Final commit**

```powershell
git add index-v1-dark-light.html index-v2-light-dominant.html
git commit -m "feat: complete blue palette colour repalette for both homepage variants"
```
