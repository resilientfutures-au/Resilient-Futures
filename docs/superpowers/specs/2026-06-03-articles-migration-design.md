# Articles Migration — Design Spec

**Date:** 2026-06-03
**Status:** Approved (awaiting implementation plan)
**Owner:** James Cacciottolo
**Source data:** `brand_assets/Squarespace-Wordpress-Export-06-03-2026.xml`

## Goal

Migrate the Resilient Futures Squarespace blog archive into the new static HTML site as an `Articles` section, then turn Squarespace off. Preserve all 36 published posts (2019‑07‑11 → 2023‑04‑17) so URLs, content, and inbound links survive the transition. Zero ongoing dependency on Squarespace once shipped.

## Scope

**In scope**
- Migrate the 36 published `post` items from the WordPress XML export.
- Download all images currently hot-linked from `images.squarespace-cdn.com` and rehost them locally.
- Generate a chronological listing page at `/articles/` and 36 per-post pages at `/articles/<slug>/`.
- Add an `Articles` entry under the existing `About` dropdown in nav, and under the `About` column in the footer.
- Surgical content cleanup (strip Squarespace wrappers, fix mojibake).
- A re-runnable Node migration script committed at `scripts/migrate-articles.mjs`.
- Patch `assets/js/includes.js` so partial includes resolve from any URL depth.

**Out of scope**
- New post authoring workflow (a markdown pipeline or SSG). Future posts are added by hand or by re-running the script with an updated XML.
- Pagination, tag/category filtering, search, related posts, next/prev navigation, post-end CTAs, newsletter signup, RSS feed.
- Image optimisation, resizing, format conversion, `srcset` generation.
- Redirects from old Squarespace URLs. Squarespace gets cancelled; broken inbound links eventually fall out of Google.
- Rewriting post copy, restructuring headings, or promoting first paragraphs to ledes.
- Author bylines (hidden in the rendered output regardless of what the XML records).

## Decisions taken during brainstorm

| Decision | Choice |
|---|---|
| Section name | `Articles` |
| URL structure | `/articles/<slug>/` (directory-style, served as `index.html`) |
| Strategic role | Full archive, low effort |
| Content cleanup level | Surgical |
| Nav placement | Under the `About` dropdown |
| Author display | Hidden |
| Listing layout | Single-column with 2-line excerpt |
| Generation pipeline | One-shot Node script, committed and re-runnable |

## File layout

```
/articles/
  index.html                              # listing page
  <slug>/
    index.html                            # one per post (36 total)

/assets/
  images/articles/<slug>/
    <sanitised-filename>.<ext>            # downloaded from Squarespace CDN

/partials/
  nav.html                                # adds 'Articles' to About dropdown
  footer.html                             # adds 'Articles' to About column

/assets/js/
  includes.js                             # patched: absolute paths for partials

/scripts/
  migrate-articles.mjs                    # single Node script
  templates/
    post.html                             # {{title}} {{date}} {{body}} {{slug}} placeholders
    listing-row.html                      # {{date}} {{title}} {{excerpt}} {{slug}} placeholders
```

The migration script itself stays in the repo. It is committed alongside its output so the generation can be re-run if the template needs tweaking, the export is updated, or images need re-downloading.

## URL & path resolution

Posts live at `/articles/<slug>/index.html`. The `serve.mjs` dev server and every common static host (Netlify, Cloudflare Pages, GitHub Pages) serves `/articles/<slug>/` → `index.html` automatically — no server config required.

`assets/js/includes.js` currently fetches `partials/nav.html` and `partials/footer.html` via relative paths. From a page at `/articles/<slug>/`, those resolve to `/articles/<slug>/partials/nav.html` and 404. The fix is a one-line change to absolute paths (`/partials/nav.html`, `/partials/footer.html`). All existing pages live at the root so the change is backwards-compatible; a smoke test (load every existing top-level page on localhost) confirms nothing breaks.

## Content cleanup — surgical pass

Operations applied to each post's `<content:encoded>` block, in order:

1. **Mojibake repair.** UTF-8 sequences mis-decoded as Windows-1252 — `â€œ` → `"`, `â€` → `"`, `â€™` → `'`, `â€˜` → `'`, `â€"` → `—`, `â€"` → `–`, `Â ` → ` `, etc. A fixed lookup table covers the cases observed in the export.
2. **HTML-entity normalisation.** `&nbsp;` → ` `, collapse runs of whitespace.
3. **Strip Squarespace wrapper divs.** `<div class="sqs-html-content" data-sqsp-text-block-content>...</div>` → unwrap to children. Same for `<div class="sqs-block ...">` and other `sqs-*` containers. The children survive; only the wrapper element is removed.
4. **Strip inline `style="white-space:pre-wrap"`** from `<p>` tags.
5. **Drop empty paragraphs** — `<p></p>`, `<p>&nbsp;</p>`, `<p> </p>` after step 2.
6. **Rewrite image URLs** — see image handling below.

What is **not** modified: heading levels, blockquote structure, lists, links, paragraph order, copy. The post template's CSS handles the visual styling of those elements.

## Image handling

For each post:
1. Walk every `<img>` whose `src` starts with `https://images.squarespace-cdn.com/`.
2. Strip query string (`?format=original`, `?format=750w` etc.) from the URL before deriving the filename.
3. Download via Node's built-in `fetch`.
4. Save to `assets/images/articles/<slug>/<sanitised-filename>.<ext>`.
5. Rewrite the `<img src>` to the local path (`/assets/images/articles/<slug>/<filename>.<ext>`).
6. Cache: if the target file already exists on disk, skip the download. This makes re-runs cheap.
7. Filename fallback: if the URL cannot yield a clean filename, use `image-1.<ext>`, `image-2.<ext>` in document order, derived from the `Content-Type` response header.

No resizing, no format conversion, no responsive `srcset`. Whatever Squarespace gave us, that's what we host.

## Listing page — `/articles/index.html`

Approved mock: `articles-mock.html` (root level, deleted at implementation time).

**Hero band (navy)**
- Padding: `104px 0 96px`.
- Vertical accent rule on the left, 3px wide, fade-out gradient (matches homepage pattern).
- Eyebrow: small caps, accent blue, `Archive` with a 32px leading rule (matches `.eyebrow` site convention).
- H1: serif (Source Serif 4), `clamp(44px, 6vw, 72px)`, weight 500, white, `letter-spacing: -0.025em`.
- Subhead: 18px, `rgba(255,255,255,0.78)`, max-width 580px. Copy: *"Strategy, leadership, and observations on a world that won't sit still — drawn from our work with Australian boards and executive teams."*
- Meta line below subhead: small caps, dim, with accent count. Format: `▬ 36 articles · 2019–2023`.
- Subtle radial accent glow at the top-right (decorative, low-impact).

**List body (cream)**
- `max-width: 900px`, centred in container.
- Padding: `88px 0 128px`.
- Each row: CSS Grid, columns `140px 1fr`, gap `56px`, padding-y `44px`, divider below using `--rf-divider-soft`.
- **Date column** (left, 140px): Inter, 12px, weight 500, tracked `0.22em`, uppercase, `--rf-accent-deep`. Format: `17 Apr 2023`.
- **Content column** (right):
  - Title: serif, 32px, weight 500, `letter-spacing: -0.018em`, `line-height: 1.22`, navy, max-width `36ch`, margin-bottom `14px`.
  - Excerpt: Inter, 16px, `line-height: 1.65`, `--rf-text-muted`, max-width `62ch`, clamped to 2 lines via `-webkit-line-clamp`.
- **Hover state**: title shifts to `--rf-accent-deep` (200ms transition), and a 16px rule slides into the left gutter from the date (subtle, editorial feedback).
- **Focus state**: 2px accent outline with 8px offset, 2px border-radius.
- Sorted **newest first**. No pagination (36 rows fit one scroll comfortably).

**Responsive (≤720px)**
- Hero padding reduced.
- List grid collapses to single column. Date becomes inline header above title (smaller, tracked).
- Title font drops to 24px. Hover rule indicator hidden.

## Post template — `/articles/<slug>/index.html`

Mirrors the listing's hero pattern at smaller scale, then a cream body.

**Hero band (navy)**
- Padding: `88px 0 80px`.
- Same vertical accent rule on the left.
- Eyebrow: `← Articles`, links back to `/articles/`.
- H1: serif, `clamp(36px, 4.5vw, 56px)`, weight 500, white, max-width 800px. Receives the post title.
- Date below H1: 13px, tracked uppercase, accent blue. Format: `17 Apr 2023`. No author.

**Body (cream)**
- `max-width: 720px`, centred, padding `72px 0 96px`.
- Prose styles scoped to `.article-body`:
  - `p`: Inter, 17px, `line-height: 1.7`, `--rf-text`, margin-bottom `24px`.
  - `h2`: serif, 32px, weight 500, navy, `letter-spacing: -0.015em`, margin `48px 0 16px`.
  - `h3`: serif, 24px, weight 500, navy, margin `36px 0 12px`.
  - `blockquote`: serif italic, 22px, `line-height: 1.45`, padded `0 0 0 24px`, left border `3px solid --rf-accent`, margin `32px 0`.
  - `ul`, `ol`: standard, with `li` margin-bottom `8px`.
  - `img`: full content-width, `border-radius: 4px`, margin `32px 0`.
  - `a`: `--rf-accent-deep`, underline `text-decoration-thickness: 1px`, `text-underline-offset: 3px`. Hover → `--rf-accent`.

**Footer of post**
- Simple `← Back to Articles` link, centred, 32px above the page footer.
- No next/prev. No related posts. No CTA. No share buttons.

**Responsive (≤720px)**
- Body padding reduced; prose `font-size` stays 17px (readable).

## Nav and footer integration

**`partials/nav.html`** — the About dropdown gains an `Articles` link:

```html
<div class="nav-dropdown-menu" id="nav-about-menu" role="menu">
  <a href="/why.html" class="nav-dropdown-item" role="menuitem">Why Resilient Futures</a>
  <a href="/articles/" class="nav-dropdown-item" role="menuitem">Articles</a>
</div>
```

Existing nav links also switch from relative (`why.html`) to absolute (`/why.html`) for consistency, since the nav is now loaded from pages at varying depth.

**`partials/footer.html`** — the About column gains an `Articles` link:

```html
<ul class="site-footer__list">
  <li><a href="/why.html">Why Resilient Futures</a></li>
  <li><a href="/strategy-in-action.html">Strategy in Action</a></li>
  <li><a href="/articles/">Articles</a></li>
</ul>
```

All other footer links similarly become absolute.

**`assets/js/includes.js`** — partial fetches become absolute:

```js
include('[data-include="nav"]', '/partials/nav.html'),
include('[data-include="footer"]', '/partials/footer.html'),
```

The "current page" highlighter inside `includes.js` currently compares the URL's last path segment to each nav link's `href`. That logic needs a small update so any URL starting with `/articles/` (the listing or a post page) highlights the `Articles` nav entry. The change is bounded to the matcher block already in `includes.js`; no new file or significant refactor.

## Migration script — `scripts/migrate-articles.mjs`

Single Node module, runnable as `node scripts/migrate-articles.mjs`. Functions:

```
parseXml(path)             → { posts: [{ title, slug, date, contentHtml, link }] }
                             filters to wp:post_type=post AND wp:status=publish
cleanMojibake(text)        → text with Windows-1252 mis-decodes repaired
stripSquarespaceHtml(html) → html with sqs-* wrappers unwrapped, empty <p>s dropped
downloadImage(url, dest)   → ensures dest dir exists, fetches if dest missing
rewriteImageSrcs(html,     → html with rewritten <img src>, returns list of
                 slug)        downloaded paths for caching
generateExcerpt(html)      → stripped, whitespace-normalised, 180-char word-bounded
renderPost(post, tmpl)     → fills {{title}} {{date}} {{body}} {{slug}}, writes file
renderListing(posts, tmpl) → sorts newest-first, fills rows, writes /articles/index.html
main()                     → orchestrates, prints per-post `OK` / `SKIP` / `FAIL`
```

**Dependencies:** `cheerio` (added via `npm install cheerio --save-dev`). `fetch` is built into Node 18+ — no other deps.

**Templates:** `scripts/templates/post.html` and `scripts/templates/listing-row.html`. Plain HTML files with `{{placeholder}}` tokens replaced by `String.replaceAll`. No templating engine.

**Idempotency:** Re-running the script overwrites generated HTML files and skips already-downloaded images. Safe to run repeatedly during development.

**Output report:** Final log line summarises `N posts written, M images downloaded, K images cached, T failures`.

## Acceptance criteria

1. `node scripts/migrate-articles.mjs` runs cleanly with the committed `brand_assets/Squarespace-Wordpress-Export-06-03-2026.xml` and produces 36 post pages plus one listing page.
2. Every generated post page renders correctly on localhost (`node serve.mjs`) — nav, footer, hero, body, back link all present.
3. Every `<img>` in every generated post points at a local `/assets/images/articles/<slug>/...` path. No remaining `images.squarespace-cdn.com` URLs anywhere under `/articles/`.
4. The listing page shows all 36 posts, newest first, with title, date, and 2-line excerpt for each.
5. Navigating from listing → post → back returns to the listing.
6. The `About` dropdown in nav contains an `Articles` link from every existing page (visual smoke test on `index.html`, `why.html`, `strategy-and-planning.html`, `contact.html`).
7. No 404s on partial loads (`/partials/nav.html`, `/partials/footer.html`) from any depth — verified by loading `/articles/<some-slug>/` and confirming nav + footer render.
8. Mojibake characters (`â€œ`, `â€™`, `â€"`) do not appear anywhere in the rendered HTML.
9. `articles-mock.html` at the project root is deleted at the end of implementation.

## Open questions

None blocking. The following can be tuned during implementation if observed in practice:
- Excerpt length (currently 180 chars). May adjust ±30 chars for visual balance.
- Mojibake table coverage. Adding entries is cheap if missed sequences turn up.
- Per-post quirks. If any single post's HTML resists the surgical pass, document and either hand-fix the generated output or extend the cleanup function — whichever is shorter.
