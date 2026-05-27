# Why RF is Different Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Insert a new "Why Resilient Futures is Different" section into `index.html` between the Problem section and the Services section.

**Architecture:** Pure HTML/CSS addition to the existing single-file homepage. No new files needed. The section uses the existing design system tokens (colours, fonts, spacing) and follows the established two-column grid pattern used in `#approach` and `#about`. Responsive overrides follow the existing `@media` block pattern already in `<style>`.

**Tech Stack:** HTML, inline CSS, Tailwind CDN (not used here — section uses inline styles matching the rest of the file), Nunito Sans (already loaded).

---

### Task 1: Insert the section HTML

**Files:**
- Modify: `index.html` — insert after the closing `</section>` of `#problem` (~line 516), before the `<!-- SERVICES -->` comment (~line 518)

- [ ] **Step 1: Locate the exact insertion point**

Open `index.html` and find this exact comment and tag sequence:

```html
  </div>
</section>

<!-- ═══════════════════════════ SERVICES ═══════════════════════════ -->
```

The `</section>` above is the closing tag of `#problem`. The new section goes between them.

- [ ] **Step 2: Insert the new section**

Replace the gap between `</section>` (end of problem) and `<!-- ═══ SERVICES ═══ -->` with the following block:

```html
  </div>
</section>

<!-- ═══════════════════════════ WHY DIFFERENT ════════════════════════ -->
<section id="why-different" style="background:#FFFFFF; padding:96px 48px;">
  <div class="section-inner">
    <span class="section-label" style="color:#7B9BD1;">Why Resilient Futures is Different</span>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:start; margin-top:0;">

      <!-- Left: heading + integrating statement -->
      <div>
        <h2 class="font-display" style="
          font-size:43px; font-weight:700; color:#0B1D26;
          line-height:1.1; letter-spacing:-0.02em; margin-bottom:28px;
        ">Built on science. Proven in practice. Designed for what's next.</h2>
        <p style="font-size:17px; line-height:1.7; color:#4a6080; margin-bottom:16px;">
          We bring a non-traditional, whole-systems approach &mdash; grounded in complex adaptive
          systems thinking, resilience science, and cognitive science &mdash; that integrates
          strategic foresight, capability development, and governance into a single, practical
          framework.
        </p>
        <p style="font-size:17px; line-height:1.7; color:#4a6080; margin-bottom:0;">
          Our methodology, Strategy in Action (SiA), is not a consulting template. It is a living
          decision-making system that organisations adopt, internalise, and use continuously &mdash;
          connecting all three ways of working with Resilient Futures.
        </p>
      </div>

      <!-- Right: differentiator checklist -->
      <div style="align-self:center;">

        <div style="display:flex; align-items:flex-start; gap:16px; padding:20px 24px; border-top:1px solid rgba(11,29,38,0.08); border-bottom:1px solid rgba(11,29,38,0.08);">
          <div style="width:24px; height:24px; border-radius:50%; background:#EEF2F9; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px;">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#3A5A92" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div>
            <div style="font-size:16px; font-weight:700; color:#0B1D26; line-height:1.3; margin-bottom:4px;">Grounded in rigorous science</div>
            <div style="font-size:14px; line-height:1.55; color:#4a6080;">Complex adaptive systems thinking, resilience science, and cognitive science &mdash; not consulting convention.</div>
          </div>
        </div>

        <div style="display:flex; align-items:flex-start; gap:16px; padding:20px 24px; border-bottom:1px solid rgba(11,29,38,0.08);">
          <div style="width:24px; height:24px; border-radius:50%; background:#EEF2F9; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px;">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#3A5A92" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div>
            <div style="font-size:16px; font-weight:700; color:#0B1D26; line-height:1.3; margin-bottom:4px;">A proven framework for strategy development and execution</div>
            <div style="font-size:14px; line-height:1.55; color:#4a6080;">Strategy in Action (SiA) is a structured, field-tested decision-making system &mdash; not a methodology built in a boardroom.</div>
          </div>
        </div>

        <div style="display:flex; align-items:flex-start; gap:16px; padding:20px 24px; border-bottom:1px solid rgba(11,29,38,0.08);">
          <div style="width:24px; height:24px; border-radius:50%; background:#EEF2F9; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px;">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#3A5A92" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div>
            <div style="font-size:16px; font-weight:700; color:#0B1D26; line-height:1.3; margin-bottom:4px;">Genuine capability uplift &mdash; Strategic Fitness</div>
            <div style="font-size:14px; line-height:1.55; color:#4a6080;">We build internal strategic capability so your organisation can lead through change without ongoing external dependency.</div>
          </div>
        </div>

        <div style="display:flex; align-items:flex-start; gap:16px; padding:20px 24px; border-bottom:1px solid rgba(11,29,38,0.08);">
          <div style="width:24px; height:24px; border-radius:50%; background:#EEF2F9; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px;">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#3A5A92" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div>
            <div style="font-size:16px; font-weight:700; color:#0B1D26; line-height:1.3; margin-bottom:4px;">A legacy of tools for ongoing, active strategic change</div>
            <div style="font-size:14px; line-height:1.55; color:#4a6080;">Practices and tools developed over 25 years that support continuous strategy &mdash; not one-off planning events.</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════ SERVICES ═══════════════════════════ -->
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Why Resilient Futures is Different section to homepage"
```

---

### Task 2: Add responsive CSS for the new section

**Files:**
- Modify: `index.html` — two `@media` blocks inside the `<style>` tag

The existing file has two responsive blocks. Each needs a rule for `#why-different`.

- [ ] **Step 1: Add tablet rule**

Inside the `@media (min-width: 768px) and (max-width: 1023px)` block, after the `#problem` rule, add:

```css
/* Why Different: reduce padding on tablet */
#why-different {
  padding: 80px 32px !important;
}
```

- [ ] **Step 2: Add mobile rule**

Inside the `@media (max-width: 767px)` block, after the `#problem` rules, add:

```css
/* Why Different: single column on mobile */
#why-different {
  padding: 64px 24px !important;
}
#why-different [style*="grid-template-columns:1fr 1fr"] {
  grid-template-columns: 1fr !important;
}
```

- [ ] **Step 3: Verify mobile selector targets the grid**

The grid div uses `style="display:grid; grid-template-columns:1fr 1fr; ..."`. The attribute selector `[style*="grid-template-columns:1fr 1fr"]` will match it. Confirm there is no space between the colon and `1fr` in the HTML you inserted in Task 1 — the selector must match exactly.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add responsive CSS for Why RF is Different section"
```

---

### Task 3: Visual verification

**Files:** None — read-only verification steps.

- [ ] **Step 1: Start the dev server (if not already running)**

```bash
node serve.mjs
```

Server runs at `http://localhost:3000`. If already running, skip this step.

- [ ] **Step 2: Screenshot desktop view**

```bash
node screenshot.mjs http://localhost:3000 why-different-desktop
```

Read the saved PNG from `temporary screenshots/`. Confirm:
- New section appears between the Problem chips and the "Four Ways to Work Together" heading
- Two-column layout: heading + prose left, checklist right
- White background, no colour bleed from adjacent sections
- All four differentiator rows display with tick icons and descriptor text
- Section label "Why Resilient Futures is Different" in blue uppercase

- [ ] **Step 3: Screenshot mobile view**

```bash
node screenshot.mjs http://localhost:3000/index.html?mobile=1 why-different-mobile
```

If `screenshot.mjs` doesn't support a mobile flag, add `--viewport 390x844` or adjust the script. Alternatively, use browser DevTools to verify manually at 390px width.

Confirm:
- Single column layout (prose stacks above checklist)
- Padding reduces correctly
- No horizontal overflow

- [ ] **Step 4: Commit if any fixes were needed**

```bash
git add index.html
git commit -m "fix: visual adjustments to Why RF is Different section"
```

Only run this step if fixes were required in steps 2–3. Skip if none needed.
