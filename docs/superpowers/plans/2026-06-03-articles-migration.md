# Articles Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate 36 Squarespace blog posts into the static Resilient Futures site as an `Articles` archive at `/articles/`, with all images rehosted locally so the site has zero ongoing Squarespace dependency.

**Architecture:** A one-shot Node migration script (`scripts/migrate-articles.mjs`) reads `brand_assets/Squarespace-Wordpress-Export-06-03-2026.xml`, performs surgical content cleanup, downloads every image, and emits 36 post pages plus one listing page from two HTML templates. Pure-function helpers (mojibake repair, HTML strip, excerpt) are unit-tested with `node:test`; I/O orchestration is verified by inspecting the generated output. Existing nav/footer partials and the partial-include script are patched to use absolute paths so they resolve from `/articles/<slug>/`.

**Tech Stack:** Node 18+ (built-in `fetch`, `node:test`), `cheerio` for HTML manipulation, `fast-xml-parser` for the WordPress XML. No frontend framework — all generated pages are plain HTML linking the existing `assets/css/site.css`.

**Reference spec:** `docs/superpowers/specs/2026-06-03-articles-migration-design.md` (committed `667414e`).

---

## Task 1: Preflight — install dependencies

**Files:**
- Modify: `package.json` (add `cheerio` and `fast-xml-parser`)

- [ ] **Step 1: Install dependencies**

Run from project root:
```bash
npm install --save cheerio fast-xml-parser
```

Expected: both added to `package.json` `dependencies`, `node_modules/cheerio` and `node_modules/fast-xml-parser` directories appear.

- [ ] **Step 2: Smoke-check cheerio works**

Run from project root:
```bash
node -e "import('cheerio').then(c => { const \$ = c.load('<p>hi</p>'); console.log(\$('p').text()); })"
```

Expected output: `hi`

- [ ] **Step 3: Smoke-check fast-xml-parser works**

```bash
node -e "import('fast-xml-parser').then(m => { const p = new m.XMLParser(); console.log(p.parse('<a><b>ok</b></a>').a.b); })"
```

Expected output: `ok`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(articles): add cheerio + fast-xml-parser for migration script"
```

---

## Task 2: Patch `includes.js` for absolute paths and section matching

**Files:**
- Modify: `assets/js/includes.js`

- [ ] **Step 1: Replace the partial-include block with absolute paths**

In `assets/js/includes.js` lines 9-12, replace:

```js
  await Promise.all([
    include('[data-include="nav"]', 'partials/nav.html'),
    include('[data-include="footer"]', 'partials/footer.html'),
  ]);
```

with:

```js
  await Promise.all([
    include('[data-include="nav"]', '/partials/nav.html'),
    include('[data-include="footer"]', '/partials/footer.html'),
  ]);
```

- [ ] **Step 2: Replace the current-page matcher block**

In `assets/js/includes.js` lines 14-26, replace the entire matcher block with:

```js
  // Mark the matching nav link active. Matches either the exact current path
  // or, for section links that end with '/', any URL whose path starts with
  // that section (so /articles/<slug>/ highlights the /articles/ entry).
  const path = location.pathname.toLowerCase();
  const here = path === '/' ? '/index.html' : path;
  document.querySelectorAll('[data-include="nav"] a[href]').forEach(a => {
    const href = a.getAttribute('href').toLowerCase();
    const isMatch =
      href === here ||
      (href.endsWith('/') && here.startsWith(href));
    if (!isMatch) return;
    if (a.classList.contains('nav-link')) {
      a.classList.add('nav-link--active');
    }
    if (a.classList.contains('nav-dropdown-item')) {
      const trigger = a.closest('.nav-dropdown')?.querySelector('.nav-dropdown-trigger');
      trigger?.classList.add('nav-dropdown-trigger--active');
    }
  });
```

- [ ] **Step 3: Smoke-test on localhost**

Confirm `node serve.mjs` is running (if not, start it). Then screenshot the homepage:

```bash
node screenshot.mjs http://localhost:3000/ includes-patched
```

Read the screenshot. Expected: nav and footer load correctly (no 404s in console; visually identical to before).

- [ ] **Step 4: Commit**

```bash
git add assets/js/includes.js
git commit -m "fix(includes): use absolute paths and prefix-match for section nav"
```

---

## Task 3: Update partials with absolute hrefs and add Articles links

**Files:**
- Modify: `partials/nav.html`
- Modify: `partials/footer.html`

- [ ] **Step 1: Update `partials/nav.html`**

Replace the entire file with (all hrefs now absolute, Articles added under About):

```html
<nav style="
  background: #0B1D26;
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
  <!-- Logo -->
  <a href="/index.html" class="nav-logo-link">
    <img src="/brand_assets/Resilient Futures LOGOS (4).png" alt="Resilient Futures" style="height:36px; width:auto; display:block;">
  </a>
  <!-- Nav links -->
  <div style="display:flex; gap:4px; align-items:center;">
    <!-- About dropdown -->
    <div class="nav-dropdown">
      <button class="nav-dropdown-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="nav-about-menu">About <span class="nav-caret" aria-hidden="true">▾</span></button>
      <div class="nav-dropdown-menu" id="nav-about-menu" role="menu">
        <a href="/why.html" class="nav-dropdown-item" role="menuitem">Why Resilient Futures</a>
        <a href="/articles/" class="nav-dropdown-item" role="menuitem">Articles</a>
      </div>
    </div>
    <a href="/strategy-in-action.html" class="nav-link" style="padding:4px 8px;">Strategy in Action</a>
    <!-- Services dropdown -->
    <div class="nav-dropdown">
      <button class="nav-dropdown-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="nav-services-menu">Services <span class="nav-caret" aria-hidden="true">▾</span></button>
      <div class="nav-dropdown-menu" id="nav-services-menu" role="menu">
        <a href="/strategy-and-planning.html" class="nav-dropdown-item" role="menuitem">Strategy and Planning</a>
        <a href="/change-management.html" class="nav-dropdown-item" role="menuitem">Change Management</a>
        <a href="/leadership-development.html" class="nav-dropdown-item" role="menuitem">Leadership Development</a>
        <a href="/strategic-intelligence.html" class="nav-dropdown-item" role="menuitem">Strategic Intelligence</a>
      </div>
    </div>
    <a href="/contact.html" class="btn-primary btn--sm" style="margin-left:16px;">Get in touch</a>
  </div>
</nav>
```

- [ ] **Step 2: Update `partials/footer.html`**

Replace each href in the existing footer with an absolute version, and add an Articles entry under the About column. Apply these specific replacements:

| Old | New |
|---|---|
| `href="why.html"` | `href="/why.html"` |
| `href="strategy-in-action.html"` | `href="/strategy-in-action.html"` |
| `href="strategy-and-planning.html"` | `href="/strategy-and-planning.html"` |
| `href="change-management.html"` | `href="/change-management.html"` |
| `href="leadership-development.html"` | `href="/leadership-development.html"` |
| `href="strategic-intelligence.html"` | `href="/strategic-intelligence.html"` |
| `href="contact.html"` | `href="/contact.html"` |
| `src="brand_assets/Resilient Futures LOGOS (4).png"` | `src="/brand_assets/Resilient Futures LOGOS (4).png"` |

Then in the About column's `<ul>`, add a new list item immediately after the "Strategy in Action" entry:

```html
<li><a href="/articles/">Articles</a></li>
```

- [ ] **Step 3: Smoke-test 3 existing pages**

```bash
node screenshot.mjs http://localhost:3000/index.html partials-after-1
node screenshot.mjs http://localhost:3000/why.html partials-after-2
node screenshot.mjs http://localhost:3000/contact.html partials-after-3
```

Read each screenshot. Expected: nav and footer render exactly as before (just with Articles now present in About dropdown and About footer column).

- [ ] **Step 4: Commit**

```bash
git add partials/nav.html partials/footer.html
git commit -m "feat(nav): add Articles entry under About, switch to absolute hrefs"
```

---

## Task 4: Migration script — XML parsing and post filtering

**Files:**
- Create: `scripts/migrate-articles.mjs`
- Create: `scripts/migrate-articles.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `scripts/migrate-articles.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseXml } from './migrate-articles.mjs';

const xmlPath = new URL('../brand_assets/Squarespace-Wordpress-Export-06-03-2026.xml', import.meta.url);

test('parseXml returns 36 published posts', async () => {
  const xml = await readFile(xmlPath, 'utf8');
  const posts = parseXml(xml);
  assert.equal(posts.length, 36);
});

test('parseXml posts have required fields', async () => {
  const xml = await readFile(xmlPath, 'utf8');
  const [first] = parseXml(xml);
  assert.ok(first.title, 'title present');
  assert.ok(first.slug, 'slug present');
  assert.ok(first.date instanceof Date, 'date is Date');
  assert.ok(typeof first.contentHtml === 'string' && first.contentHtml.length > 0, 'contentHtml present');
});
```

- [ ] **Step 2: Run the test, verify failure**

```bash
node --test scripts/migrate-articles.test.mjs
```

Expected: error like `Cannot find module './migrate-articles.mjs'`.

- [ ] **Step 3: Create the migration script skeleton with `parseXml`**

Create `scripts/migrate-articles.mjs`:

```js
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: true,
  parseTagValue: false,
  trimValues: false,
});

export function parseXml(xmlString) {
  const result = parser.parse(xmlString);
  const items = result?.rss?.channel?.item ?? [];
  const arr = Array.isArray(items) ? items : [items];
  return arr
    .filter(it => it['wp:post_type'] === 'post' && it['wp:status'] === 'publish')
    .map(it => ({
      title: String(it.title ?? '').trim(),
      slug: String(it['wp:post_name'] ?? '').trim(),
      date: new Date(it.pubDate),
      contentHtml: String(it['content:encoded'] ?? ''),
      link: String(it.link ?? ''),
    }));
}
```

- [ ] **Step 4: Run the test, verify pass**

```bash
node --test scripts/migrate-articles.test.mjs
```

Expected: both tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-articles.mjs scripts/migrate-articles.test.mjs
git commit -m "feat(articles): parse WordPress XML export, filter to published posts"
```

---

## Task 5: Cleanup helpers — mojibake repair, Squarespace HTML strip, excerpt

**Files:**
- Modify: `scripts/migrate-articles.mjs` (add three exported functions)
- Modify: `scripts/migrate-articles.test.mjs` (add tests for each)

> **Note on mojibake table:** the initial table below covers the patterns seen in the XML during exploration, but real Squarespace exports sometimes emit only the first 2 of the 3 mis-decode bytes (the third is an unprintable control character that gets stripped in transit). After Task 10 step 6's grep, expect to add 1–2 more 2-char entries for whichever right-double-quote / apostrophe variants are still showing up. This is expected, not a plan failure.

- [ ] **Step 1: Add failing tests for `cleanMojibake`**

Append to `scripts/migrate-articles.test.mjs`:

```js
import { cleanMojibake, stripSquarespaceHtml, generateExcerpt } from './migrate-articles.mjs';

test('cleanMojibake fixes smart quotes', () => {
  assert.equal(cleanMojibake('â€œhelloâ€'), '"hello"');
});

test('cleanMojibake fixes apostrophes', () => {
  assert.equal(cleanMojibake("itâ€™s"), "it's");
});

test('cleanMojibake fixes em-dash', () => {
  assert.equal(cleanMojibake('one â€" two'), 'one — two');
});

test('cleanMojibake handles nbsp encoded literal', () => {
  assert.equal(cleanMojibake('a&nbsp;b'), 'a b');
});

test('stripSquarespaceHtml unwraps sqs-html-content', () => {
  const input = '<div class="sqs-html-content" data-sqsp-text-block-content><p>Hello</p></div>';
  const out = stripSquarespaceHtml(input);
  assert.match(out, /<p>Hello<\/p>/);
  assert.doesNotMatch(out, /sqs-html-content/);
});

test('stripSquarespaceHtml drops empty paragraphs', () => {
  const input = '<p>kept</p><p></p><p> </p>';
  const out = stripSquarespaceHtml(input);
  assert.match(out, /<p>kept<\/p>/);
  const pCount = (out.match(/<p[^>]*>/g) || []).length;
  assert.equal(pCount, 1);
});

test('stripSquarespaceHtml removes inline white-space:pre-wrap', () => {
  const input = '<p style="white-space:pre-wrap;">x</p>';
  const out = stripSquarespaceHtml(input);
  assert.doesNotMatch(out, /white-space:pre-wrap/);
});

test('generateExcerpt strips HTML and truncates on word boundary', () => {
  const html = '<p>The quick brown fox jumps over the lazy dog. ' + 'word '.repeat(60) + '</p>';
  const ex = generateExcerpt(html);
  assert.ok(ex.length <= 180, `length ${ex.length} > 180`);
  assert.doesNotMatch(ex, /<[^>]+>/, 'no tags remain');
  assert.match(ex, /\.\.\.$|…$|word$/, 'ends sensibly');
});

test('generateExcerpt collapses whitespace', () => {
  const html = '<p>  multiple    spaces\n\nand\tlines  </p>';
  const ex = generateExcerpt(html);
  assert.equal(ex, 'multiple spaces and lines');
});
```

- [ ] **Step 2: Run tests, verify failures**

```bash
node --test scripts/migrate-articles.test.mjs
```

Expected: `cleanMojibake`, `stripSquarespaceHtml`, `generateExcerpt` are undefined; tests fail with import errors.

- [ ] **Step 3: Implement the three helpers**

Append to `scripts/migrate-articles.mjs`:

```js
import * as cheerio from 'cheerio';

// Squarespace's WordPress export double-encodes punctuation: UTF-8 bytes
// served by Squarespace get mis-decoded by some readers as Windows-1252,
// producing strings like 'â€™' instead of '''. Each entry below maps the
// mis-decoded sequence (encoded as JS \uXXXX escapes so the table survives
// any markdown/editor character normalisation) to the intended character.
//
// Windows-1252 maps: 0x80→€(U+20AC), 0x93→'(U+201C), 0x94→'(U+201D),
//                    0x98→˜(U+02DC), 0x99→™(U+2122), 0x9C→œ(U+0153),
//                    0xA6→¦(U+00A6). 0x9D is undefined in Win1252 and
//                    passes through as U+009D. 0xA0 stays as NBSP.
const MOJIBAKE_REPLACEMENTS = [
  ['â€œ', '“'],  // mis-decoded U+201C left double quote
  ['â€', '”'],  // mis-decoded U+201D right double quote
  ['â€˜', '‘'],  // mis-decoded U+2018 left single quote
  ['â€™', '’'],  // mis-decoded U+2019 apostrophe
  ['â€”', '—'],  // mis-decoded U+2014 em dash
  ['â€“', '–'],  // mis-decoded U+2013 en dash
  ['â€¦', '…'],  // mis-decoded U+2026 ellipsis
  ['Â ', ' '],        // mis-decoded NBSP -> regular space
];

export function cleanMojibake(text) {
  let out = text;
  for (const [bad, good] of MOJIBAKE_REPLACEMENTS) {
    out = out.split(bad).join(good);
  }
  // HTML-entity nbsp → space, collapse multiple spaces but preserve newlines
  out = out.replace(/&nbsp;/g, ' ');
  return out;
}

export function stripSquarespaceHtml(html) {
  const $ = cheerio.load(html, null, false);

  // Unwrap any element whose class starts with "sqs-" — keep children.
  $('[class]').each((_, el) => {
    const cls = $(el).attr('class') || '';
    if (/\bsqs-/.test(cls)) {
      $(el).replaceWith($(el).contents());
    }
  });

  // Strip inline white-space:pre-wrap
  $('[style]').each((_, el) => {
    const style = $(el).attr('style') || '';
    const cleaned = style
      .replace(/white-space\s*:\s*pre-wrap;?/gi, '')
      .replace(/^\s*;?\s*$/, '')
      .trim();
    if (cleaned) $(el).attr('style', cleaned);
    else $(el).removeAttr('style');
  });

  // Drop empty <p> tags
  $('p').each((_, el) => {
    const text = $(el).text().replace(/ /g, ' ').trim();
    if (text === '' && $(el).find('img,iframe,video,br').length === 0) {
      $(el).remove();
    }
  });

  return $.root().html() ?? '';
}

export function generateExcerpt(html, maxLen = 180) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLen) return text;
  const slice = text.slice(0, maxLen);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > maxLen * 0.6 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[,.;:—–-]$/, '') + '…';
}
```

- [ ] **Step 4: Run tests, verify pass**

```bash
node --test scripts/migrate-articles.test.mjs
```

Expected: all 11 tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-articles.mjs scripts/migrate-articles.test.mjs
git commit -m "feat(articles): add mojibake repair, HTML cleanup, excerpt generation"
```

---

## Task 6: Image download and URL rewriting

**Files:**
- Modify: `scripts/migrate-articles.mjs` (add two functions)

- [ ] **Step 1: Add `downloadImage` to `scripts/migrate-articles.mjs`**

Append:

```js
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, basename, extname } from 'node:path';

// Download a single image to `destPath`. Skips if the file already exists.
// Returns { downloaded: true|false, bytes: number }.
export async function downloadImage(url, destPath) {
  if (existsSync(destPath)) {
    const st = await stat(destPath);
    return { downloaded: false, bytes: st.size };
  }
  await mkdir(dirname(destPath), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buf);
  return { downloaded: true, bytes: buf.length };
}
```

- [ ] **Step 2: Add `rewriteImageSrcs`**

Append:

```js
// Walk the post HTML, download every Squarespace-hosted image, and rewrite
// the <img src> to a local path under /assets/images/articles/<slug>/.
// Returns the rewritten HTML.
export async function rewriteImageSrcs(html, slug, projectRoot) {
  const $ = cheerio.load(html, null, false);
  const tasks = [];
  let fallbackCounter = 1;

  $('img').each((_, el) => {
    const src = $(el).attr('src') || '';
    if (!src.startsWith('https://images.squarespace-cdn.com/')) return;

    // Strip query string and derive filename
    const noQuery = src.split('?')[0];
    let filename = decodeURIComponent(basename(noQuery));
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '-');
    if (!extname(filename)) filename = `image-${fallbackCounter++}.jpg`;

    const localRel = `/assets/images/articles/${slug}/${filename}`;
    const localAbs = `${projectRoot}/assets/images/articles/${slug}/${filename}`;
    $(el).attr('src', localRel);

    tasks.push(downloadImage(src, localAbs).catch(err => {
      console.warn(`  WARN image ${src} -> ${err.message}`);
    }));
  });

  await Promise.all(tasks);
  return $.root().html() ?? '';
}
```

- [ ] **Step 3: Manual integration check**

Run an ad-hoc one-liner from the project root to validate against a known Squarespace image:

```bash
node -e "import('./scripts/migrate-articles.mjs').then(m => m.downloadImage('https://images.squarespace-cdn.com/content/v1/61136246ce52d960eb842f39/1649739433085-ELUO7I2FX96OG0RDLFJL/unsplash-image-CQbaooHFSWQ.jpg', './assets/images/articles/_smoke/test.jpg').then(r => console.log(r)))"
```

Expected: `{ downloaded: true, bytes: <some number> }`. File exists at `assets/images/articles/_smoke/test.jpg`.

- [ ] **Step 4: Clean up the smoke test image**

```bash
rm -rf assets/images/articles/_smoke
```

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-articles.mjs
git commit -m "feat(articles): download Squarespace images and rewrite to local paths"
```

---

## Task 7: Post template

**Files:**
- Create: `scripts/templates/post.html`

- [ ] **Step 1: Create the post template**

Write `scripts/templates/post.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>document.documentElement.classList.add('js');</script>
  <title>{{title}} — Resilient Futures</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/site.css">
  <style>
    .article-hero { background: var(--rf-navy); padding: 88px 0 80px; position: relative; overflow: hidden; }
    .article-hero__inner { position: relative; z-index: 1; display: flex; gap: 32px; align-items: flex-start; }
    .article-hero__rule { width: 3px; flex-shrink: 0; min-height: 140px; margin-top: 8px;
      background: linear-gradient(to bottom, var(--rf-accent), rgba(123,155,209,0)); }
    .article-hero__copy { flex: 0 1 800px; min-width: 0; }
    .article-hero__back {
      display: inline-flex; align-items: center; gap: 12px;
      font-family: var(--rf-font-sans); font-size: 13px; font-weight: 500;
      letter-spacing: 0.22em; text-transform: uppercase; color: var(--rf-accent);
      text-decoration: none; margin-bottom: 22px;
      transition: color 200ms ease;
    }
    .article-hero__back:hover { color: var(--rf-white); }
    .article-hero__back::before { content: ''; display:inline-block; width:32px; height:1px; background: var(--rf-accent); }
    .article-hero__title {
      font-family: var(--rf-font-serif);
      font-size: clamp(36px, 4.5vw, 56px);
      font-weight: 500; color: var(--rf-white);
      line-height: 1.08; letter-spacing: -0.022em;
      margin: 0 0 20px; max-width: 800px;
    }
    .article-hero__date {
      font-family: var(--rf-font-sans); font-size: 13px; font-weight: 500;
      letter-spacing: 0.22em; text-transform: uppercase; color: var(--rf-accent);
    }

    .article-body-wrap { background: var(--rf-cream); padding: 72px 0 96px; }
    .article-body { max-width: 720px; margin: 0 auto; color: var(--rf-text); }
    .article-body p { font-size: 17px; line-height: 1.7; margin: 0 0 24px; max-width: 65ch; }
    .article-body h2 { font-family: var(--rf-font-serif); font-size: 32px; font-weight: 500;
      letter-spacing: -0.015em; line-height: 1.2; color: var(--rf-navy);
      margin: 48px 0 16px; }
    .article-body h3 { font-family: var(--rf-font-serif); font-size: 24px; font-weight: 500;
      letter-spacing: -0.01em; color: var(--rf-navy); margin: 36px 0 12px; }
    .article-body blockquote {
      font-family: var(--rf-font-serif); font-style: italic;
      font-size: 22px; line-height: 1.45; color: var(--rf-navy);
      margin: 32px 0; padding: 0 0 0 24px;
      border-left: 3px solid var(--rf-accent);
    }
    .article-body blockquote p { font-size: inherit; line-height: inherit; max-width: none; margin-bottom: 12px; }
    .article-body ul, .article-body ol { margin: 0 0 24px 24px; }
    .article-body li { margin-bottom: 8px; font-size: 17px; line-height: 1.7; }
    .article-body img { display: block; max-width: 100%; height: auto;
      border-radius: 4px; margin: 32px auto; }
    .article-body a {
      color: var(--rf-accent-deep);
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 3px;
      transition: color 200ms ease;
    }
    .article-body a:hover { color: var(--rf-accent); }

    .article-footer { max-width: 720px; margin: 56px auto 0; padding-top: 32px;
      border-top: 1px solid var(--rf-divider-soft); text-align: center; }
    .article-footer a {
      display: inline-flex; align-items: center; gap: 10px;
      font-family: var(--rf-font-sans); font-size: 13px; font-weight: 500;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: var(--rf-accent-deep); text-decoration: none;
      transition: transform 200ms ease, color 200ms ease;
    }
    .article-footer a:hover { color: var(--rf-accent); transform: translateX(-4px); }

    @media (max-width: 720px) {
      .article-hero { padding: 64px 0 56px; }
      .article-body-wrap { padding: 56px 0 80px; }
      .article-hero__inner { gap: 20px; }
      .article-hero__rule { min-height: 110px; }
    }
  </style>
</head>
<body class="page-article">

<a href="#main-content" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;z-index:9999;background:var(--rf-accent-deep);color:var(--rf-white);padding:12px 20px;font-size:15px;font-weight:600;border-radius:0 0 4px 4px;text-decoration:none;" onfocus="this.style.left='0';this.style.width='auto';this.style.height='auto';" onblur="this.style.left='-9999px';this.style.width='1px';this.style.height='1px';">Skip to main content</a>

<div data-include="nav"></div>

<section id="main-content" class="article-hero">
  <div class="container">
    <div class="article-hero__inner">
      <div class="article-hero__rule"></div>
      <div class="article-hero__copy">
        <a href="/articles/" class="article-hero__back">Articles</a>
        <h1 class="article-hero__title">{{title}}</h1>
        <p class="article-hero__date">{{date}}</p>
      </div>
    </div>
  </div>
</section>

<section class="article-body-wrap">
  <div class="container">
    <article class="article-body">
      {{body}}
    </article>
    <div class="article-footer">
      <a href="/articles/">← Back to Articles</a>
    </div>
  </div>
</section>

<div data-include="footer"></div>

<script type="module" src="/assets/js/includes.js"></script>

</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add scripts/templates/post.html
git commit -m "feat(articles): add post page template"
```

---

## Task 8: Listing template

**Files:**
- Create: `scripts/templates/listing.html`
- Create: `scripts/templates/listing-row.html`

- [ ] **Step 1: Create the listing page template**

Write `scripts/templates/listing.html` — adapt directly from the approved mock at `articles-mock.html`, with `{{rows}}` and `{{count}}` placeholders:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>document.documentElement.classList.add('js');</script>
  <title>Articles — Resilient Futures</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/site.css">
  <style>
    .articles-hero { background: var(--rf-navy); padding: 104px 0 96px; position: relative; overflow: hidden; }
    .articles-hero::before {
      content: ""; position: absolute; top: -240px; right: -160px;
      width: 720px; height: 720px;
      background: radial-gradient(circle at 50% 50%,
        rgba(123, 155, 209, 0.18) 0%, rgba(123, 155, 209, 0.05) 38%, rgba(123, 155, 209, 0) 70%);
      pointer-events: none; z-index: 0;
    }
    .articles-hero__inner { position: relative; z-index: 1; display: flex; gap: 32px; align-items: flex-start; }
    .articles-hero__rule { width: 3px; flex-shrink: 0; min-height: 168px; margin-top: 8px;
      background: linear-gradient(to bottom, var(--rf-accent), rgba(123,155,209,0)); }
    .articles-hero__copy { flex: 0 1 760px; min-width: 0; }
    .articles-hero__eyebrow {
      display: inline-flex; align-items: center; gap: 12px;
      font-family: var(--rf-font-sans); font-weight: 500; font-size: 13px;
      letter-spacing: 0.22em; text-transform: uppercase; color: var(--rf-accent);
      margin-bottom: 22px;
    }
    .articles-hero__eyebrow::before { content:''; display:inline-block; width:32px; height:1px; background: var(--rf-accent); }
    .articles-hero__title {
      font-family: var(--rf-font-serif); font-size: clamp(44px, 6vw, 72px);
      font-weight: 500; color: var(--rf-white); line-height: 1.04;
      letter-spacing: -0.025em; margin: 0 0 24px;
    }
    .articles-hero__subhead { color: rgba(255,255,255,0.78); font-size: 18px;
      line-height: 1.65; max-width: 580px; margin: 0; }
    .articles-hero__meta {
      display: inline-flex; align-items: center; gap: 14px; margin-top: 32px;
      color: rgba(255,255,255,0.45); font-size: 12px; letter-spacing: 0.22em;
      text-transform: uppercase; font-weight: 500;
    }
    .articles-hero__meta::before { content:''; display:inline-block; width:28px; height:1px; background: rgba(255,255,255,0.25); }
    .articles-hero__meta strong { font-weight: 600; color: var(--rf-accent); }

    .articles-section { background: var(--rf-cream); padding: 88px 0 128px; position: relative; }
    .articles-list { max-width: 900px; margin: 0 auto; }
    .articles-list__row {
      display: grid; grid-template-columns: 140px 1fr; gap: 56px;
      padding: 44px 0; border-bottom: 1px solid var(--rf-divider-soft);
      align-items: baseline;
    }
    .articles-list__row:first-child { padding-top: 4px; }
    .articles-list__row:last-child { border-bottom: none; }
    .articles-list__date {
      font-family: var(--rf-font-sans); font-size: 12px; font-weight: 500;
      letter-spacing: 0.22em; text-transform: uppercase;
      color: var(--rf-accent-deep); padding-top: 10px; position: relative;
    }
    .articles-list__date::before {
      content: ""; position: absolute; left: 0; top: 14px;
      width: 16px; height: 1px; background: var(--rf-accent);
      opacity: 0; transform: translateX(-12px);
      transition: opacity 220ms ease, transform 220ms ease;
    }
    .articles-list__row:hover .articles-list__date::before,
    .articles-list__row:focus-within .articles-list__date::before {
      opacity: 1; transform: translateX(-22px);
    }
    .articles-list__link { display: block; text-decoration: none; color: inherit; }
    .articles-list__title {
      font-family: var(--rf-font-serif); font-size: 32px; font-weight: 500;
      line-height: 1.22; letter-spacing: -0.018em; color: var(--rf-navy);
      margin: 0 0 14px; transition: color 200ms ease; max-width: 36ch;
    }
    .articles-list__link:hover .articles-list__title,
    .articles-list__link:focus-visible .articles-list__title { color: var(--rf-accent-deep); }
    .articles-list__link:focus-visible { outline: 2px solid var(--rf-accent); outline-offset: 8px; border-radius: 2px; }
    .articles-list__excerpt {
      font-family: var(--rf-font-sans); font-size: 16px; line-height: 1.65;
      color: var(--rf-text-muted); margin: 0; max-width: 62ch;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }

    @media (max-width: 720px) {
      .articles-hero { padding: 80px 0 72px; }
      .articles-section { padding: 64px 0 96px; }
      .articles-hero__inner { gap: 20px; }
      .articles-hero__rule { min-height: 140px; }
      .articles-list__row { grid-template-columns: 1fr; gap: 10px; padding: 36px 0; }
      .articles-list__date { padding-top: 0; }
      .articles-list__date::before { display: none; }
      .articles-list__title { font-size: 24px; max-width: none; }
    }
  </style>
</head>
<body class="page-articles">

<a href="#main-content" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;z-index:9999;background:var(--rf-accent-deep);color:var(--rf-white);padding:12px 20px;font-size:15px;font-weight:600;border-radius:0 0 4px 4px;text-decoration:none;" onfocus="this.style.left='0';this.style.width='auto';this.style.height='auto';" onblur="this.style.left='-9999px';this.style.width='1px';this.style.height='1px';">Skip to main content</a>

<div data-include="nav"></div>

<section id="main-content" class="articles-hero">
  <div class="container">
    <div class="articles-hero__inner">
      <div class="articles-hero__rule"></div>
      <div class="articles-hero__copy">
        <span class="articles-hero__eyebrow">Archive</span>
        <h1 class="articles-hero__title">Articles</h1>
        <p class="articles-hero__subhead">
          Strategy, leadership, and observations on a world that won't sit still &mdash; drawn from our work with Australian boards and executive teams.
        </p>
        <div class="articles-hero__meta">
          <span><strong>{{count}}</strong>&nbsp;articles &nbsp;·&nbsp; 2019&ndash;2023</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="articles-section">
  <div class="container">
    <div class="articles-list">
{{rows}}
    </div>
  </div>
</section>

<div data-include="footer"></div>

<script type="module" src="/assets/js/includes.js"></script>

</body>
</html>
```

- [ ] **Step 2: Create the per-row template**

Write `scripts/templates/listing-row.html`:

```html
      <article class="articles-list__row">
        <div class="articles-list__date">{{date}}</div>
        <a href="/articles/{{slug}}/" class="articles-list__link">
          <h2 class="articles-list__title">{{title}}</h2>
          <p class="articles-list__excerpt">{{excerpt}}</p>
        </a>
      </article>
```

- [ ] **Step 3: Commit**

```bash
git add scripts/templates/listing.html scripts/templates/listing-row.html
git commit -m "feat(articles): add listing page and row templates"
```

---

## Task 9: Render functions and `main()` orchestrator

**Files:**
- Modify: `scripts/migrate-articles.mjs` (add render functions + main)
- Modify: `scripts/migrate-articles.test.mjs` (add render-function tests)

- [ ] **Step 1: Add render-function tests**

Append to `scripts/migrate-articles.test.mjs`:

```js
import { renderPost, renderListing, formatDate, escapeHtml } from './migrate-articles.mjs';

test('formatDate produces "17 Apr 2023" form', () => {
  assert.equal(formatDate(new Date('2023-04-17T00:00:00Z')), '17 Apr 2023');
});

test('escapeHtml escapes ampersands and angle brackets', () => {
  assert.equal(escapeHtml('a & b < c'), 'a &amp; b &lt; c');
});

test('renderPost injects placeholders', () => {
  const template = '<title>{{title}}</title><time>{{date}}</time><main>{{body}}</main>';
  const out = renderPost(template, { title: 'Hi', date: '17 Apr 2023', body: '<p>x</p>', slug: 'hi' });
  assert.match(out, /<title>Hi<\/title>/);
  assert.match(out, /<time>17 Apr 2023<\/time>/);
  assert.match(out, /<main><p>x<\/p><\/main>/);
});

test('renderListing produces N rows in date-descending order', () => {
  const tmpl = '<ul>{{rows}}</ul>';
  const row = '<li>{{date}} {{title}} {{slug}}</li>';
  const posts = [
    { title: 'old', slug: 'old', date: new Date('2020-01-01'), excerpt: 'a' },
    { title: 'new', slug: 'new', date: new Date('2023-04-17'), excerpt: 'b' },
  ];
  const out = renderListing(tmpl, row, posts);
  const newPos = out.indexOf('new');
  const oldPos = out.indexOf('old');
  assert.ok(newPos > 0 && oldPos > 0, 'both present');
  assert.ok(newPos < oldPos, 'newest first');
});
```

- [ ] **Step 2: Implement render functions**

Append to `scripts/migrate-articles.mjs`:

```js
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function formatDate(d) {
  const day = String(d.getUTCDate()).padStart(2, '0');
  const mon = MONTHS[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${mon} ${year}`;
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fillTemplate(template, vars) {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{{${k}}}`).join(v);
  }
  return out;
}

export function renderPost(template, { title, date, body, slug }) {
  return fillTemplate(template, {
    title: escapeHtml(title),
    date: escapeHtml(date),
    body,             // already-cleaned HTML, do not escape
    slug,
  });
}

export function renderListing(template, rowTemplate, posts) {
  const sorted = [...posts].sort((a, b) => b.date - a.date);
  const rows = sorted.map(p => fillTemplate(rowTemplate, {
    date: escapeHtml(formatDate(p.date)),
    title: escapeHtml(p.title),
    excerpt: escapeHtml(p.excerpt ?? ''),
    slug: p.slug,
  })).join('\n');
  return fillTemplate(template, { rows, count: String(posts.length) });
}
```

- [ ] **Step 3: Run tests, verify pass**

```bash
node --test scripts/migrate-articles.test.mjs
```

Expected: all tests pass (15 total now).

- [ ] **Step 4: Implement `main()` orchestrator**

Append to `scripts/migrate-articles.mjs`:

```js
import { resolve, dirname as pathDirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);

export async function main() {
  const projectRoot = resolve(__dirname, '..');
  const xmlPath = resolve(projectRoot, 'brand_assets/Squarespace-Wordpress-Export-06-03-2026.xml');
  const postTmplPath = resolve(__dirname, 'templates/post.html');
  const listingTmplPath = resolve(__dirname, 'templates/listing.html');
  const rowTmplPath = resolve(__dirname, 'templates/listing-row.html');

  const [xml, postTmpl, listingTmpl, rowTmpl] = await Promise.all([
    readFile(xmlPath, 'utf8'),
    readFile(postTmplPath, 'utf8'),
    readFile(listingTmplPath, 'utf8'),
    readFile(rowTmplPath, 'utf8'),
  ]);

  const rawPosts = parseXml(xml);
  console.log(`Parsed ${rawPosts.length} published posts.`);

  let imagesRewritten = 0;
  const enriched = [];

  for (const p of rawPosts) {
    const cleanedTitle = cleanMojibake(p.title);
    const cleanedHtml = stripSquarespaceHtml(cleanMojibake(p.contentHtml));
    const beforeImgCount = (cleanedHtml.match(/images\.squarespace-cdn\.com/g) || []).length;
    const finalHtml = await rewriteImageSrcs(cleanedHtml, p.slug, projectRoot);
    const afterImgCount = (finalHtml.match(/images\.squarespace-cdn\.com/g) || []).length;

    const excerpt = generateExcerpt(finalHtml);
    const dateStr = formatDate(p.date);

    const html = renderPost(postTmpl, {
      title: cleanedTitle,
      date: dateStr,
      body: finalHtml,
      slug: p.slug,
    });

    const outDir = resolve(projectRoot, 'articles', p.slug);
    await mkdir(outDir, { recursive: true });
    await writeFile(resolve(outDir, 'index.html'), html, 'utf8');

    imagesRewritten += beforeImgCount - afterImgCount;
    enriched.push({ ...p, title: cleanedTitle, excerpt });
    console.log(`  ✓ /articles/${p.slug}/`);
  }

  // Listing page
  const listingHtml = renderListing(listingTmpl, rowTmpl, enriched);
  await writeFile(resolve(projectRoot, 'articles/index.html'), listingHtml, 'utf8');
  console.log(`  ✓ /articles/index.html`);

  console.log(`\nDone. ${enriched.length} posts written, ${imagesRewritten} images relocated.`);
}

// Run only when invoked directly (not when imported by tests).
// fileURLToPath normalises import.meta.url to a native path so this
// comparison works on Windows (where the URL has three slashes:
// file:///C:/... — naive string-template comparison fails there).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(err => { console.error(err); process.exit(1); });
}
```

- [ ] **Step 5: Verify the entry guard doesn't break tests**

```bash
node --test scripts/migrate-articles.test.mjs
```

Expected: all tests still pass; `main()` does **not** run (test runner imports the module, but the entry guard prevents auto-execution).

- [ ] **Step 6: Commit**

```bash
git add scripts/migrate-articles.mjs scripts/migrate-articles.test.mjs
git commit -m "feat(articles): add render functions and main orchestrator"
```

---

## Task 10: First end-to-end run

**Files:**
- Output (generated): `articles/index.html`, `articles/<slug>/index.html` × 36
- Output (downloaded): `assets/images/articles/<slug>/*.{jpg,png,...}`

- [ ] **Step 1: Run the migration**

```bash
node scripts/migrate-articles.mjs
```

Expected log: `Parsed 36 published posts.` then 36 lines of `✓ /articles/<slug>/`, then `✓ /articles/index.html`, then `Done. 36 posts written, N images downloaded.`

If any image downloads warn, take note. Stop and investigate if more than ~3 fail.

- [ ] **Step 2: Verify generated file count**

```bash
ls articles/ | wc -l
```

Expected: 37 (36 post directories + `index.html`).

- [ ] **Step 3: Screenshot the listing**

```bash
node screenshot.mjs http://localhost:3000/articles/ articles-listing-real
```

Read the screenshot. Expected: matches the approved mock visually — navy hero, 36 rows in the list, dates in left gutter, titles in serif, excerpts truncated to 2 lines.

- [ ] **Step 4: Screenshot a sample post**

Pick a post with images. From inspection a known good candidate is:

```bash
node screenshot.mjs http://localhost:3000/articles/a-mad-moment-agriculture-must-flip-its-focus-from-farming-to-food-security/ articles-post-sample
```

Read the screenshot. Expected: navy hero with title + date, "Articles" eyebrow above the title links back to listing, cream body with prose, images load from `/assets/images/articles/...`.

- [ ] **Step 5: Verify nav highlighting**

While viewing the listing or any post in the browser, confirm that the `About` dropdown's `Articles` item shows the `nav-dropdown-trigger--active` class (the About trigger should look highlighted). If not, debug the `includes.js` matcher.

- [ ] **Step 6: Spot-check for mojibake**

```bash
grep -rl "â€" articles/ | head
```

Expected: no output (no remaining mojibake). If output appears, add the missing sequences to `MOJIBAKE_REPLACEMENTS` in `scripts/migrate-articles.mjs`, re-run the migration, re-check.

- [ ] **Step 7: Spot-check for remote image hot-linking**

```bash
grep -rl "images.squarespace-cdn.com" articles/ | head
```

Expected: no output. If any survive, investigate the corresponding `rewriteImageSrcs` skip (likely an unusual URL pattern); patch and re-run.

- [ ] **Step 8: Commit the generated content**

```bash
git add articles/ assets/images/articles/
git commit -m "feat(articles): migrate 36 Squarespace posts to static archive"
```

---

## Task 11: Acceptance walkthrough

**Files:** (verification only; fixes go inline)

- [ ] **Step 1: Walk acceptance criteria from the spec**

For each criterion in `docs/superpowers/specs/2026-06-03-articles-migration-design.md` § "Acceptance criteria", verify on localhost:

1. Script runs cleanly — ✓ verified in Task 10.
2. Every post page renders — navigate to 3 posts via the listing, eyeball nav/footer/hero/body/back-link.
3. No `images.squarespace-cdn.com` URLs anywhere under `/articles/` — verified in Task 10 step 7.
4. Listing shows all 36, newest first — eyeball top-of-list date is `17 Apr 2023`, bottom is `11 Jul 2019`.
5. Listing → post → back returns to listing — click through.
6. About dropdown contains Articles on every existing page — screenshot `index.html`, `why.html`, `strategy-and-planning.html`, `contact.html`; open the About dropdown manually in a browser tab to confirm.
7. No 404s on partials from any depth — open DevTools Network panel, navigate to `/articles/<some-slug>/`, confirm `/partials/nav.html` and `/partials/footer.html` return 200.
8. No mojibake — verified in Task 10 step 6. Also grep across all generated HTML one more time.
9. (Mock deletion handled in Task 12.)

- [ ] **Step 2: Record findings**

For each criterion: pass / fail with a short note. If any fail, fix inline and re-run the relevant verification step.

- [ ] **Step 3: Commit any fixes from this task**

If fixes were applied:

```bash
git add -u
git commit -m "fix(articles): address acceptance findings"
```

If no fixes were needed, skip this step.

---

## Task 12: Cleanup

**Files:**
- Delete: `articles-mock.html` (the design mock at project root)

- [ ] **Step 1: Delete the mock file**

```bash
rm articles-mock.html
```

- [ ] **Step 2: Confirm nothing references it**

```bash
grep -rl "articles-mock" . --include="*.html" --include="*.js" --include="*.css" --include="*.md" --exclude-dir=node_modules --exclude-dir=_archive --exclude-dir=.superpowers
```

Expected: only the spec and plan reference it as historical context. No source files reference it. If a source reference exists, remove it.

- [ ] **Step 3: Commit**

```bash
git add articles-mock.html
git commit -m "chore(articles): remove design-phase mock now that real page is shipped"
```

(`git add <path>` on a path that has been `rm`'d records the deletion.)

- [ ] **Step 4: Final summary log**

Print a short summary for the user:

```
Articles migration complete:
  - 36 posts at /articles/<slug>/
  - listing at /articles/
  - images at /assets/images/articles/<slug>/
  - migration script at scripts/migrate-articles.mjs (re-runnable)
  - nav + footer updated with Articles link
  - mock deleted
```
