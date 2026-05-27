# Get Started Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `getstarted.html` in the Resilient Futures design system and wire up the "Get in touch" nav button and footer Contact column on all existing pages to point to it.

**Architecture:** Single static HTML file following the exact pattern of `team.html` — inline styles, Tailwind CDN, Google Fonts, no JS framework. All sections are self-contained. Nav and footer are copy-pasted from `team.html` with minor edits.

**Tech Stack:** HTML, inline CSS, Tailwind CSS (CDN), Google Fonts (Playfair Display + Inter), `node serve.mjs` for local dev, `node screenshot.mjs` for visual verification.

**Reference file:** `team.html` — copy nav and footer blocks verbatim, then adapt.

---

## File Map

| Action | File | What changes |
|--------|------|--------------|
| Create | `getstarted.html` | Full new page |
| Modify | `index.html` | Nav button href + footer Contact link |
| Modify | `team.html` | Nav button href + footer Contact link |
| Modify | `why.html` | Nav button href + footer Contact link |
| Modify `strategy-in-action.html` | Nav button href + footer Contact link |
| Modify | `strategic-fitness.html` | Nav button href + footer Contact link |

---

## Task 1: Scaffold getstarted.html — head, CSS, and nav

**Files:**
- Create: `getstarted.html`

- [ ] **Step 1: Create the file with head, shared CSS, and nav**

Copy the `<head>` block and all `<style>` rules from `team.html` verbatim. Replace the `<title>`. Then paste the nav block, removing all `nav-link--active` classes (Get Started is not in the nav dropdowns). On `getstarted.html` the "Get in touch" nav button links to `#contact` (already on this page).

Create `getstarted.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Get Started — Resilient Futures</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      line-height: 1.7;
      color: #1A1A1A;
      background: #1a1a1a;
      -webkit-font-smoothing: antialiased;
    }
    .font-display { font-family: 'Playfair Display', serif; }
    .section-label {
      font-family: 'Inter', sans-serif;
      font-size: 13px; font-weight: 600;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: #FF6139; display: block; margin-bottom: 20px;
    }
    .section-label--light { color: #A1CACC; }
    .btn-primary {
      display: inline-block; background: #FF6139; color: #fff;
      font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600;
      letter-spacing: 0.07em; text-transform: uppercase;
      padding: 14px 28px; border: none; cursor: pointer;
      text-decoration: none; transition: opacity 0.2s;
    }
    .btn-primary:hover { opacity: 0.88; }
    .btn-primary:focus-visible { outline: 2px solid #FF6139; outline-offset: 3px; }
    .btn-primary:active { transform: translateY(1px); }
    .section-inner { max-width: 1100px; margin: 0 auto; }
    .nav-link {
      color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 500;
      text-decoration: none; transition: color 0.2s;
    }
    .nav-link:hover { color: rgba(255,255,255,0.9); }
    .nav-link:focus-visible { outline: 2px solid rgba(255,255,255,0.5); outline-offset: 4px; color: rgba(255,255,255,0.9); }
    .nav-link:active { color: #fff; }
    .nav-link--active { color: rgba(255,255,255,0.9) !important; }
    .nav-logo-link { text-decoration: none; transition: opacity 0.2s; }
    .nav-logo-link:hover { opacity: 0.8; }
    .nav-logo-link:focus-visible { outline: 2px solid rgba(255,255,255,0.5); outline-offset: 4px; }
    .nav-dropdown { position: relative; }
    .nav-dropdown-trigger {
      background: none; border: none; cursor: pointer;
      color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 500;
      font-family: 'Inter', sans-serif; text-decoration: none;
      transition: color 0.2s; display: flex; align-items: center; gap: 4px;
      padding: 4px 8px;
    }
    .nav-dropdown-trigger:hover,
    .nav-dropdown:focus-within .nav-dropdown-trigger { color: rgba(255,255,255,0.9); }
    .nav-caret { font-size: 8px; opacity: 0.5; transition: transform 0.15s; display: inline-block; }
    .nav-dropdown:hover .nav-caret,
    .nav-dropdown:focus-within .nav-caret { transform: rotate(180deg); }
    .nav-dropdown-menu {
      position: absolute; top: calc(100% + 10px); left: 50%;
      transform: translateX(-50%) translateY(-4px);
      background: #2a1816; border: 1px solid rgba(255,255,255,0.08);
      min-width: 190px; padding: 6px 0;
      opacity: 0; pointer-events: none;
      transition: opacity 0.15s, transform 0.15s;
    }
    .nav-dropdown:hover .nav-dropdown-menu,
    .nav-dropdown:focus-within .nav-dropdown-menu {
      opacity: 1; pointer-events: auto;
      transform: translateX(-50%) translateY(0);
    }
    .nav-dropdown-item {
      display: block; padding: 9px 20px;
      color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 400;
      text-decoration: none; transition: color 0.15s, background 0.15s;
      white-space: nowrap;
    }
    .nav-dropdown-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
    .footer-email {
      font-size: 11px; color: rgba(255,255,255,0.45);
      text-decoration: none; transition: color 0.2s;
    }
    .footer-email:hover { color: rgba(255,255,255,0.8); }

    /* Page-specific */
    .hero-inner-flex { display: flex; gap: 48px; align-items: flex-start; }
    .hero-accent-line {
      width: 3px; flex-shrink: 0; min-height: 200px; margin-top: 4px;
      background: linear-gradient(to bottom, #FF6139, rgba(255,97,57,0));
    }
    .booking-card {
      background: #fff; padding: 36px 32px 32px;
      border-top: 3px solid #FF6139;
      display: flex; flex-direction: column;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .booking-card:hover {
      box-shadow: 0 8px 32px rgba(54,31,29,0.12);
      transform: translateY(-2px);
    }
    .form-input {
      width: 100%; border: 1px solid #D5D5CF;
      padding: 11px 14px; font-family: 'Inter', sans-serif;
      font-size: 14px; color: #1A1A1A; background: #FAFAF8;
      outline: none; transition: border-color 0.2s;
      -webkit-appearance: none;
    }
    .form-input:focus { border-color: #FF6139; }
    .cta-section {
      background: linear-gradient(135deg, #2a1816 0%, #361F1D 100%);
      padding: 96px 48px; text-align: center;
      position: relative; overflow: hidden;
    }

    /* Responsive */
    @media (max-width: 767px) {
      nav > div:last-child { display: none !important; }
      .hero-inner-flex { flex-direction: column !important; }
      .hero-accent-line { display: none !important; }
      .booking-grid { grid-template-columns: 1fr !important; }
      .siapc-grid { grid-template-columns: 1fr !important; }
      .contact-grid { grid-template-columns: 1fr !important; }
      footer { padding: 40px 24px 28px !important; }
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      .siapc-grid { grid-template-columns: 1fr !important; }
      .contact-grid { grid-template-columns: 1fr !important; }
    }
  </style>
</head>
<body>

<!-- ═══════════════════════════ NAV ═══════════════════════════ -->
<nav style="
  background: #361F1D;
  height: 64px;
  padding: 0 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255,255,255,0.08);
">
  <a href="index.html" class="nav-logo-link">
    <span class="font-display" style="font-size:20px; font-weight:700; letter-spacing:-0.03em; line-height:1;">
      <span style="color:#fff;">resilient</span><span style="color:#743734;">futures</span><span style="color:#FF6139;">+</span>
    </span>
  </a>
  <div style="display:flex; gap:4px; align-items:center;">
    <div class="nav-dropdown">
      <button class="nav-dropdown-trigger">About <span class="nav-caret">▾</span></button>
      <div class="nav-dropdown-menu">
        <a href="why.html" class="nav-dropdown-item">Why Resilient Futures</a>
        <a href="#" class="nav-dropdown-item">How We Work</a>
        <a href="team.html" class="nav-dropdown-item">Our Team</a>
      </div>
    </div>
    <a href="strategy-in-action.html" class="nav-link" style="padding:4px 8px;">Strategy in Action</a>
    <div class="nav-dropdown">
      <button class="nav-dropdown-trigger">Services <span class="nav-caret">▾</span></button>
      <div class="nav-dropdown-menu">
        <a href="#" class="nav-dropdown-item">Strategic Services</a>
        <a href="strategic-fitness.html" class="nav-dropdown-item">Strategic Fitness</a>
      </div>
    </div>
    <a href="#contact" class="btn-primary" style="padding:8px 20px; font-size:11px; margin-left:16px;">Get in touch</a>
  </div>
</nav>

</body>
</html>
```

- [ ] **Step 2: Start the dev server and take a screenshot to verify the nav renders**

```bash
node serve.mjs &
node screenshot.mjs http://localhost:3000/getstarted.html nav-check
```

Read the screenshot from `temporary screenshots/` and confirm the nav renders identically to `team.html`.

- [ ] **Step 3: Commit**

```bash
git add getstarted.html
git commit -m "feat: scaffold getstarted.html with head, CSS, and nav"
```

---

## Task 2: Hero section

**Files:**
- Modify: `getstarted.html` — add hero section before `</body>`

- [ ] **Step 1: Add hero section**

Insert the following between the closing `</nav>` and `</body>` tags:

```html
<!-- ═══════════════════════════ HERO ═══════════════════════════ -->
<section style="
  background: linear-gradient(155deg, #2a1816 0%, #361F1D 45%, #4a2826 100%);
  padding: 80px 48px 96px;
  position: relative;
  overflow: hidden;
">
  <div style="position:absolute; top:-80px; right:-80px; width:500px; height:500px; border-radius:50%; background: radial-gradient(circle, rgba(255,97,57,0.1) 0%, transparent 65%); pointer-events:none;"></div>
  <div style="position:absolute; bottom:40px; left:-60px; width:350px; height:350px; border-radius:50%; background: radial-gradient(circle, rgba(161,202,204,0.07) 0%, transparent 65%); pointer-events:none;"></div>

  <div class="section-inner" style="position:relative; z-index:1;">
    <div style="display:inline-flex; align-items:center; gap:10px; margin-bottom:40px; border-left:2px solid rgba(255,97,57,0.4); padding-left:12px;">
      <a href="index.html" style="font-size:11px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:rgba(255,255,255,0.45); text-decoration:none; transition:color 0.2s;" onmouseover="this.style.color='rgba(255,255,255,0.8)'" onmouseout="this.style.color='rgba(255,255,255,0.45)'">Home</a>
      <span style="font-size:11px; color:rgba(255,255,255,0.2);">&#47;</span>
      <span style="font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#FF6139;">Get Started</span>
    </div>

    <div class="hero-inner-flex">
      <div class="hero-accent-line"></div>
      <div style="flex:1;">
        <span class="section-label section-label--light">Get Started</span>
        <h1 class="font-display" style="font-size:52px; font-weight:700; color:#fff; line-height:1.05; letter-spacing:-0.025em; margin-bottom:12px; max-width:580px;">
          We&rsquo;d love to speak with you.
        </h1>
        <p class="font-display" style="font-size:20px; font-weight:400; font-style:italic; color:#FF6139; line-height:1.4; letter-spacing:-0.01em; max-width:520px; margin-bottom:28px;">
          Getting started with Resilient Futures is easy.
        </p>
        <p style="color:rgba(255,255,255,0.55); font-size:15px; line-height:1.75; max-width:520px;">
          We work with senior leaders and organisations globally &mdash; entirely online. Book a direct conversation with one of our principals, join our practice community, or send us a message below.
        </p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/getstarted.html hero-check
```

Read the screenshot and confirm: gradient background, breadcrumb (Home / Get Started), orange accent line, teal "Get Started" label, large Playfair Display h1, italic orange subheading, body copy visible.

- [ ] **Step 3: Commit**

```bash
git add getstarted.html
git commit -m "feat: add hero section to getstarted.html"
```

---

## Task 3: Booking cards section

**Files:**
- Modify: `getstarted.html` — add booking section after hero, before `</body>`

- [ ] **Step 1: Add booking section**

Insert after the hero `</section>` and before `</body>`:

```html
<!-- ═══════════════════════════ BOOKING ═══════════════════════════ -->
<section style="background:#2a1816; padding:88px 48px;">
  <div class="section-inner">
    <span class="section-label section-label--light">Book a Conversation</span>
    <h2 class="font-display" style="font-size:38px; font-weight:700; color:#fff; line-height:1.15; letter-spacing:-0.02em; max-width:520px; margin-bottom:12px;">
      Speak directly with our principals.
    </h2>
    <p style="color:rgba(255,255,255,0.45); font-size:15px; line-height:1.75; max-width:520px; margin-bottom:48px;">
      Every conversation is confidential and executive-level. Choose who you&rsquo;d like to speak with.
    </p>

    <div class="booking-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">

      <div class="booking-card">
        <img src="https://placehold.co/72x72/D5D5CF/6B5350" alt="David Platt" style="width:72px; height:72px; border-radius:50%; object-fit:cover; margin-bottom:20px;">
        <div class="font-display" style="font-size:22px; font-weight:700; color:#361F1D; line-height:1.2; letter-spacing:-0.01em; margin-bottom:4px;">David Platt</div>
        <div style="font-size:10px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#FF6139; margin-bottom:16px;">Co-Founder &amp; Facilitator</div>
        <p style="font-size:13px; line-height:1.7; color:#6B5350; flex:1; margin-bottom:28px;">Strategic leadership and organisational resilience. 25+ years building and running the Resilient Futures practice.</p>
        <a href="#" class="btn-primary">Book a call with David</a>
      </div>

      <div class="booking-card">
        <img src="https://placehold.co/72x72/D5D5CF/6B5350" alt="Niloo Amendra" style="width:72px; height:72px; border-radius:50%; object-fit:cover; margin-bottom:20px;">
        <div class="font-display" style="font-size:22px; font-weight:700; color:#361F1D; line-height:1.2; letter-spacing:-0.01em; margin-bottom:4px;">Niloo Amendra</div>
        <div style="font-size:10px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#FF6139; margin-bottom:16px;">Chief Strategy Officer &amp; Facilitator</div>
        <p style="font-size:13px; line-height:1.7; color:#6B5350; flex:1; margin-bottom:28px;">Learning design, leadership capability, and workshop facilitation. Leads Resilient Futures&rsquo; learning programmes globally.</p>
        <a href="#" class="btn-primary">Book a call with Niloo</a>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/getstarted.html booking-check
```

Read the screenshot and confirm: dark `#2a1816` background, teal label, Playfair h2, two white cards side-by-side each with avatar placeholder, name, title in orange uppercase, description, and orange "Book a call" button.

- [ ] **Step 3: Commit**

```bash
git add getstarted.html
git commit -m "feat: add booking cards section to getstarted.html"
```

---

## Task 4: SiAPC — Practice Community section

**Files:**
- Modify: `getstarted.html` — add SiAPC section after booking, before `</body>`

- [ ] **Step 1: Add SiAPC section**

Insert after the booking `</section>` and before `</body>`:

```html
<!-- ═══════════════════════════ SiAPC ═══════════════════════════ -->
<section style="background:#EFEFE7; padding:96px 48px;">
  <div class="section-inner">
    <div class="siapc-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center;">

      <div>
        <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(255,97,57,0.08); border:1px solid rgba(255,97,57,0.2); padding:6px 14px; margin-bottom:24px;">
          <span style="font-size:10px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#FF6139;">Practice Community</span>
        </div>
        <h2 class="font-display" style="font-size:38px; font-weight:700; color:#361F1D; line-height:1.2; letter-spacing:-0.02em; margin-bottom:16px;">
          Join the Strategy in Action Practice Community.
        </h2>
        <p style="font-size:15px; line-height:1.75; color:#6B5350; margin-bottom:20px;">
          The SiAPC is a space for strategic leaders and thinkers to learn and practise the Resilient Futures framework together. Access complementary learning resources, engage in peer discussion, and build your network of senior practitioners.
        </p>
        <p style="font-size:12px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:rgba(54,31,29,0.4); margin-bottom:32px;">
          Peer Learning &nbsp;&middot;&nbsp; Framework Access &nbsp;&middot;&nbsp; Senior Network
        </p>
        <a href="#" class="btn-primary" style="background:#361F1D;">Register Now</a>
      </div>

      <div style="background:#361F1D; padding:48px 40px; position:relative; overflow:hidden;">
        <div style="position:absolute; top:-40px; right:-40px; width:220px; height:220px; border-radius:50%; background:radial-gradient(circle, rgba(255,97,57,0.12) 0%, transparent 65%); pointer-events:none;"></div>
        <span class="section-label section-label--light" style="position:relative; z-index:1;">SiAPC</span>
        <p class="font-display" style="font-size:22px; font-weight:400; font-style:italic; color:#fff; line-height:1.5; position:relative; z-index:1; margin-bottom:28px;">
          &ldquo;A community built around practice, not just theory.&rdquo;
        </p>
        <div style="display:flex; flex-direction:column; gap:14px; position:relative; z-index:1;">
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="width:6px; height:6px; border-radius:50%; background:#FF6139; flex-shrink:0;"></div>
            <span style="font-size:13px; color:rgba(255,255,255,0.6);">Complementary learning resources</span>
          </div>
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="width:6px; height:6px; border-radius:50%; background:#FF6139; flex-shrink:0;"></div>
            <span style="font-size:13px; color:rgba(255,255,255,0.6);">Online community platform</span>
          </div>
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="width:6px; height:6px; border-radius:50%; background:#FF6139; flex-shrink:0;"></div>
            <span style="font-size:13px; color:rgba(255,255,255,0.6);">Peer networking with senior leaders</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/getstarted.html siapc-check
```

Read the screenshot and confirm: light beige `#EFEFE7` background, two-column layout, orange badge pill on left, Playfair h2, body copy, dark CTA button, dark card on right with pull quote and bullet list.

- [ ] **Step 3: Commit**

```bash
git add getstarted.html
git commit -m "feat: add SiAPC practice community section to getstarted.html"
```

---

## Task 5: Contact form section

**Files:**
- Modify: `getstarted.html` — add contact section with id="contact" after SiAPC, before `</body>`

- [ ] **Step 1: Add contact form section**

Insert after the SiAPC `</section>` and before `</body>`:

```html
<!-- ═══════════════════════════ CONTACT ═══════════════════════════ -->
<section id="contact" style="background:#fff; padding:96px 48px;">
  <div class="section-inner">
    <div class="contact-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:start;">

      <div>
        <span class="section-label">Get in Touch</span>
        <h2 class="font-display" style="font-size:38px; font-weight:700; color:#361F1D; line-height:1.15; letter-spacing:-0.02em; margin-bottom:14px;">
          Send us a message.
        </h2>
        <p style="font-size:15px; line-height:1.75; color:#6B5350; margin-bottom:36px;">
          Not sure which path is right for you? Send us a message and we&rsquo;ll point you in the right direction.
        </p>

        <form action="mailto:info@resilientfutures.com" method="post" enctype="text/plain">
          <div style="margin-bottom:20px;">
            <label style="display:block; font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#6B5350; margin-bottom:7px;">Your Name</label>
            <input type="text" name="name" class="form-input" placeholder="Full name" required>
          </div>
          <div style="margin-bottom:20px;">
            <label style="display:block; font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#6B5350; margin-bottom:7px;">Email Address</label>
            <input type="email" name="email" class="form-input" placeholder="your@email.com" required>
          </div>
          <div style="margin-bottom:28px;">
            <label style="display:block; font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#6B5350; margin-bottom:7px;">Message</label>
            <textarea name="message" class="form-input" placeholder="Tell us a little about your organisation and what you&rsquo;re looking for&hellip;" style="min-height:120px; resize:vertical;" required></textarea>
          </div>
          <button type="submit" class="btn-primary" style="font-size:13px; padding:16px 36px;">Send Message</button>
        </form>
      </div>

      <div>
        <span class="section-label" style="margin-bottom:8px;">Direct Contacts</span>
        <p style="font-size:14px; color:#6B5350; margin-bottom:28px; line-height:1.6;">Or reach us directly by email:</p>

        <div style="display:flex; flex-direction:column;">
          <div style="padding:18px 0; border-bottom:1px solid #EFEFE7;">
            <div style="font-size:10px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:rgba(54,31,29,0.4); margin-bottom:5px;">Strategic Services</div>
            <a href="mailto:services@resilientfutures.com" style="font-size:14px; color:#361F1D; text-decoration:none; transition:color 0.2s;" onmouseover="this.style.color='#FF6139'" onmouseout="this.style.color='#361F1D'">services@resilientfutures.com</a>
          </div>
          <div style="padding:18px 0; border-bottom:1px solid #EFEFE7;">
            <div style="font-size:10px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:rgba(54,31,29,0.4); margin-bottom:5px;">Learning Programs</div>
            <a href="mailto:learning@resilientfutures.com" style="font-size:14px; color:#361F1D; text-decoration:none; transition:color 0.2s;" onmouseover="this.style.color='#FF6139'" onmouseout="this.style.color='#361F1D'">learning@resilientfutures.com</a>
          </div>
          <div style="padding:18px 0;">
            <div style="font-size:10px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:rgba(54,31,29,0.4); margin-bottom:5px;">General Enquiries</div>
            <a href="mailto:info@resilientfutures.com" style="font-size:14px; color:#361F1D; text-decoration:none; transition:color 0.2s;" onmouseover="this.style.color='#FF6139'" onmouseout="this.style.color='#361F1D'">info@resilientfutures.com</a>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/getstarted.html contact-check
```

Read the screenshot and confirm: white background, two columns, form on left with Name / Email / Message fields and "Send Message" button, direct email contacts on right with three rows separated by lines.

- [ ] **Step 3: Commit**

```bash
git add getstarted.html
git commit -m "feat: add contact form section to getstarted.html"
```

---

## Task 6: Footer

**Files:**
- Modify: `getstarted.html` — add footer after contact section, before `</body>`

- [ ] **Step 1: Add footer**

Copy the footer block from `team.html` verbatim. In the Contact column, change the "Get in touch" href from `mailto:...` to `getstarted.html`, and add `style="color:rgba(255,255,255,0.8);"` to it to show it as active. Also remove the email address line that follows (the footer on getstarted.html doesn't need to link back to itself via mailto — the page itself has the contact form).

Insert after the contact `</section>` and before `</body>`:

```html
<!-- ═══════════════════════════ FOOTER ═══════════════════════════ -->
<footer style="background:#1a0f0e; border-top:1px solid rgba(255,255,255,0.06);">
  <div style="padding:40px 48px 28px; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:32px;">
    <a href="index.html" class="nav-logo-link">
      <img src="brand_assets/Resilient Futures LOGO.png" alt="Resilient Futures" style="height:32px; width:auto; display:block; filter:brightness(0) invert(1); opacity:0.55;">
    </a>
    <div style="display:flex; gap:48px; flex-wrap:wrap;">
      <div style="display:flex; flex-direction:column; gap:10px;">
        <span style="font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.25); margin-bottom:4px;">About</span>
        <a href="why.html" class="nav-link">Why Resilient Futures</a>
        <a href="#" class="nav-link">How We Work</a>
        <a href="team.html" class="nav-link">Our Team</a>
        <a href="strategy-in-action.html" class="nav-link">Strategy in Action</a>
      </div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <span style="font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.25); margin-bottom:4px;">Services</span>
        <a href="#" class="nav-link">Strategic Services</a>
        <a href="strategic-fitness.html" class="nav-link">Strategic Fitness</a>
      </div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <span style="font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.25); margin-bottom:4px;">Contact</span>
        <a href="getstarted.html" class="nav-link" style="color:rgba(255,255,255,0.8);">Get Started</a>
        <a href="mailto:james.cacciottolo@resilientfutures.com" class="footer-email">james.cacciottolo@resilientfutures.com</a>
      </div>
    </div>
    <div style="display:flex; gap:10px; align-items:center;">
      <a href="#" aria-label="LinkedIn" style="width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);text-decoration:none;transition:border-color 0.2s,color 0.2s;" onmouseover="this.style.borderColor='rgba(255,255,255,0.4)';this.style.color='rgba(255,255,255,0.85)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)';this.style.color='rgba(255,255,255,0.4)'">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
      <a href="#" aria-label="X (Twitter)" style="width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);text-decoration:none;transition:border-color 0.2s,color 0.2s;" onmouseover="this.style.borderColor='rgba(255,255,255,0.4)';this.style.color='rgba(255,255,255,0.85)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)';this.style.color='rgba(255,255,255,0.4)'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a href="#" aria-label="Facebook" style="width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);text-decoration:none;transition:border-color 0.2s,color 0.2s;" onmouseover="this.style.borderColor='rgba(255,255,255,0.4)';this.style.color='rgba(255,255,255,0.85)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)';this.style.color='rgba(255,255,255,0.4)'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </a>
      <a href="#" aria-label="YouTube" style="width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);text-decoration:none;transition:border-color 0.2s,color 0.2s;" onmouseover="this.style.borderColor='rgba(255,255,255,0.4)';this.style.color='rgba(255,255,255,0.85)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)';this.style.color='rgba(255,255,255,0.4)'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
      </a>
      <a href="#" aria-label="Instagram" style="width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);text-decoration:none;transition:border-color 0.2s,color 0.2s;" onmouseover="this.style.borderColor='rgba(255,255,255,0.4)';this.style.color='rgba(255,255,255,0.85)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)';this.style.color='rgba(255,255,255,0.4)'">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
      </a>
    </div>
  </div>
  <div style="padding:20px 48px; border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
    <p style="font-size:11px; color:rgba(255,255,255,0.25); margin:0;">Resilient Futures &copy; 2026 &middot; All rights reserved</p>
    <p style="font-size:11px; color:rgba(255,255,255,0.2); margin:0;">Strategy for a world that won&rsquo;t hold still</p>
  </div>
</footer>
```

- [ ] **Step 2: Screenshot full page and verify**

```bash
node screenshot.mjs http://localhost:3000/getstarted.html full-page
```

Read the screenshot. Verify the footer is present with logo, three columns (About, Services, Contact), social icons, and copyright line. Confirm "Get Started" appears in the Contact column highlighted in white.

- [ ] **Step 3: Commit**

```bash
git add getstarted.html
git commit -m "feat: add footer to getstarted.html"
```

---

## Task 7: Update nav and footer on all existing pages

**Files:**
- Modify: `index.html`
- Modify: `team.html`
- Modify: `why.html`
- Modify: `strategy-in-action.html`
- Modify: `strategic-fitness.html`

On each file, make two edits:

**Edit A — Nav "Get in touch" button:** Change `href="mailto:james.cacciottolo@resilientfutures.com"` → `href="getstarted.html"` on the element that has class `btn-primary` and text "Get in touch".

The old string (same in all files):
```html
<a href="mailto:james.cacciottolo@resilientfutures.com" class="btn-primary" style="padding:8px 20px; font-size:11px; margin-left:16px;">Get in touch</a>
```

Replace with:
```html
<a href="getstarted.html" class="btn-primary" style="padding:8px 20px; font-size:11px; margin-left:16px;">Get in touch</a>
```

**Edit B — Footer Contact column:** Add "Get Started" link before the existing "Get in touch" link. The old Contact column block (same in all files):
```html
      <div style="display:flex; flex-direction:column; gap:10px;">
        <span style="font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.25); margin-bottom:4px;">Contact</span>
        <a href="mailto:james.cacciottolo@resilientfutures.com" class="nav-link">Get in touch</a>
        <a href="mailto:james.cacciottolo@resilientfutures.com" class="footer-email">james.cacciottolo@resilientfutures.com</a>
      </div>
```

Replace with:
```html
      <div style="display:flex; flex-direction:column; gap:10px;">
        <span style="font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.25); margin-bottom:4px;">Contact</span>
        <a href="getstarted.html" class="nav-link">Get Started</a>
        <a href="mailto:james.cacciottolo@resilientfutures.com" class="nav-link">Get in touch</a>
        <a href="mailto:james.cacciottolo@resilientfutures.com" class="footer-email">james.cacciottolo@resilientfutures.com</a>
      </div>
```

> **Note:** Apply both edits to all five files: `index.html`, `team.html`, `why.html`, `strategy-in-action.html`, `strategic-fitness.html`. Use the Edit tool on each file individually — do not use find-and-replace across files in one step, as each file needs to be read first.

- [ ] **Step 1: Apply both edits to index.html**

Read `index.html`, then make Edit A and Edit B.

- [ ] **Step 2: Apply both edits to team.html**

Read `team.html`, then make Edit A and Edit B.

- [ ] **Step 3: Apply both edits to why.html**

Read `why.html`, then make Edit A and Edit B.

- [ ] **Step 4: Apply both edits to strategy-in-action.html**

Read `strategy-in-action.html`, then make Edit A and Edit B.

- [ ] **Step 5: Apply both edits to strategic-fitness.html**

Read `strategic-fitness.html`, then make Edit A and Edit B.

- [ ] **Step 6: Screenshot each updated page to verify nav and footer**

```bash
node screenshot.mjs http://localhost:3000/index.html index-nav
node screenshot.mjs http://localhost:3000/team.html team-nav
```

Read both screenshots. Verify the "Get in touch" button in the nav is present (it still says "Get in touch", just the href has changed — no visual difference expected). Spot-check the footer Contact column on one page to confirm "Get Started" link is present.

- [ ] **Step 7: Commit**

```bash
git add index.html team.html why.html strategy-in-action.html strategic-fitness.html
git commit -m "feat: update nav and footer on all pages to link to getstarted.html"
```

---

## Task 8: Final visual verification

- [ ] **Step 1: Full-page screenshot of getstarted.html**

```bash
node screenshot.mjs http://localhost:3000/getstarted.html final
```

Read the screenshot. Verify all five sections are visible and in order: nav → hero → booking cards → SiAPC → contact form → footer.

- [ ] **Step 2: Check mobile layout**

Open DevTools in the browser and resize to 375px wide, or use the screenshot tool with a viewport flag if available. Verify booking cards stack to single column, SiAPC stacks, contact grid stacks. If any section overflows horizontally, fix the responsive CSS in the `<style>` block.

- [ ] **Step 3: Verify all internal links work**

Click through: logo links to index.html, nav dropdowns open, "Get in touch" in nav scrolls to `#contact`, footer "Get Started" links back to the same page (no-op, acceptable).

- [ ] **Step 4: Final commit**

```bash
git add getstarted.html
git commit -m "fix: responsive and link verification pass on getstarted.html"
```

---

## Spec Coverage Checklist

| Spec requirement | Task |
|---|---|
| Hero with breadcrumb, h1, italic subheading, body copy | Task 2 |
| Booking section with two white cards (David + Niloo), correct titles | Task 3 |
| HubSpot links as `#` placeholder | Task 3 |
| SiAPC section with badge, h2, body copy, dark card, bullet points | Task 4 |
| Contact form (name, email, message, mailto submit) | Task 5 |
| Direct email contacts (services@, learning@, info@) | Task 5 |
| Footer identical to team.html | Task 6 |
| Nav "Get in touch" updated on all pages | Task 7 |
| Footer Contact "Get Started" link on all pages | Task 7 |
| Responsive — mobile stacking, hidden nav | Tasks 1 + 8 |
