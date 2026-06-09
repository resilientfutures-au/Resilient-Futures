import { XMLParser } from 'fast-xml-parser';
import * as cheerio from 'cheerio';
import { mkdir, stat, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, basename, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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
  ['â€™', '\''],
  ['â€”', '—'],
  ['â€“', '–'],
  ['â€œ', '"'],
  ['â€˜', '\''],
  ['â€¦', '…'],
  ['â€"', '—'],
  ['â€', '"'],
  ['â€', '"'],
  ['Â ', ' '],
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
  // Strip tags, then decode common HTML entities so the excerpt is plain text
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLen) return text;
  const slice = text.slice(0, maxLen);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > maxLen * 0.6 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[,.;:—–-]$/, '') + '…';
}

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
    const localAbs = join(projectRoot, 'assets/images/articles', slug, filename);
    $(el).attr('src', localRel);

    tasks.push(downloadImage(src, localAbs).catch(err => {
      console.warn(`  WARN image ${src} -> ${err.message}`);
    }));
  });

  await Promise.all(tasks);
  return $.root().html() ?? '';
}

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

// Decode any residual HTML entities that the XML parser left in plain-text
// fields (e.g. title). This normalises &amp; → & so escapeHtml can then
// re-encode it exactly once.
export function decodeHtmlEntities(s) {
  return String(s)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
}

// Canonical production host. The Squarespace export's channel <link> and the
// site's own domain both use the www apex; canonical/OG URLs must match exactly.
export const SITE = 'https://www.resilientfutures.com';
const LOGO_URL = `${SITE}/brand_assets/Resilient%20Futures%20LOGOS%20(4).png`;

// Build the per-article SEO/AEO <head> block: meta description, canonical,
// Open Graph, Twitter card, and JSON-LD Article schema. Wrapped in seo:start/
// seo:end comment markers so injection is idempotent (the marked block can be
// stripped and replaced on re-run). `iso` is an ISO-8601 timestamp; `imageUrl`
// is an absolute URL (falls back to the brand logo when a post has no image).
export function buildArticleSeoBlock({ title, description, canonical, imageUrl, iso }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const img = imageUrl || LOGO_URL;
  // Google truncates Article headline at ~110 chars; keep schema validators happy.
  const headline = title.length > 110 ? title.slice(0, 109).trimEnd() + '…' : title;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: [img],
    datePublished: iso,
    dateModified: iso,
    author: { '@type': 'Organization', name: 'Resilient Futures', url: SITE },
    publisher: {
      '@type': 'Organization',
      name: 'Resilient Futures',
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  };
  // Escape '<' so a stray sequence in content can't break out of the script tag.
  const ldJson = JSON.stringify(ld, null, 2).replace(/</g, '\\u003c');
  return `<!-- seo:start -->
  <meta name="description" content="${d}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Resilient Futures">
  <meta property="og:title" content="${t}">
  <meta property="og:description" content="${d}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${img}">
  <meta property="article:published_time" content="${iso}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${t}">
  <meta name="twitter:description" content="${d}">
  <meta name="twitter:image" content="${img}">
  <script type="application/ld+json">
${ldJson}
  </script>
  <!-- seo:end -->`;
}

// Build a simpler SEO block for non-article (website) pages such as the
// articles listing index: description, canonical, Open Graph, Twitter card.
export function buildPageSeoBlock({ title, description, canonical }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  return `<!-- seo:start -->
  <meta name="description" content="${d}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Resilient Futures">
  <meta property="og:title" content="${t}">
  <meta property="og:description" content="${d}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${LOGO_URL}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${t}">
  <meta name="twitter:description" content="${d}">
  <meta name="twitter:image" content="${LOGO_URL}">
  <!-- seo:end -->`;
}

function fillTemplate(template, vars) {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{{${k}}}`).join(v);
  }
  return out;
}

// If the body starts with an image, lift it out to show as a hero "featured
// image" under the date. Returns { image, body } where `image` is the hero
// <figure> markup (or '') and `body` is the body with that leading image removed.
export function hoistLeadImage(bodyHtml) {
  const m = bodyHtml.match(/^\s*<img\b[^>]*>/i);
  if (!m) return { image: '', body: bodyHtml };
  const image = `<figure class="article-hero__image">${m[0].trim()}</figure>`;
  return { image, body: bodyHtml.slice(m.index + m[0].length) };
}

export function renderPost(template, { title, date, body, slug, seo = '', image = '' }) {
  return fillTemplate(template, {
    title: escapeHtml(title),
    date: escapeHtml(date),
    body,             // already-cleaned HTML, do not escape
    slug,
    seo,              // pre-built SEO block, do not escape
    image,            // pre-built hero <figure>, do not escape
  });
}

export function renderListing(template, rowTemplate, posts) {
  const sorted = [...posts].sort((a, b) => b.date - a.date);
  const rows = sorted.map(p => fillTemplate(rowTemplate, {
    date: escapeHtml(formatDate(p.date)),
    title: escapeHtml(p.title),
    excerpt: escapeHtml(p.excerpt ?? ''),
    slug: p.slug,
    image: p.image
      ? `<img class="articles-list__thumb" src="${p.image}" alt="" loading="lazy">`
      : '',
  })).join('\n');
  const seo = buildPageSeoBlock({
    title: 'Articles',
    description: 'Articles and writing from Resilient Futures on strategy, leadership, and navigating disruptive change — drawn from current client work and the conditions shaping every operating environment.',
    canonical: `${SITE}/articles/`,
  });
  return fillTemplate(template, { rows, count: String(posts.length), seo });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    const cleanedTitle = decodeHtmlEntities(cleanMojibake(p.title));
    const cleanedHtml = stripSquarespaceHtml(cleanMojibake(p.contentHtml));
    const beforeImgCount = (cleanedHtml.match(/images\.squarespace-cdn\.com/g) || []).length;
    const finalHtml = await rewriteImageSrcs(cleanedHtml, p.slug, projectRoot);
    const afterImgCount = (finalHtml.match(/images\.squarespace-cdn\.com/g) || []).length;

    const excerpt = generateExcerpt(finalHtml);
    const dateStr = formatDate(p.date);

    // SEO/AEO head block
    const description = generateExcerpt(finalHtml, 155);
    const canonical = `${SITE}/articles/${p.slug}/`;
    const firstImg = (finalHtml.match(/src="(\/assets\/images\/articles\/[^"]+)"/) || [])[1];
    const imageUrl = firstImg ? SITE + firstImg : undefined;
    const seo = buildArticleSeoBlock({
      title: cleanedTitle,
      description,
      canonical,
      imageUrl,
      iso: p.date.toISOString(),
    });

    // Lift a leading image into the hero (featured image under the date)
    const { image: heroImage, body: bodyHtml } = hoistLeadImage(finalHtml);

    const html = renderPost(postTmpl, {
      title: cleanedTitle,
      date: dateStr,
      body: bodyHtml,
      slug: p.slug,
      seo,
      image: heroImage,
    });

    const outDir = resolve(projectRoot, 'articles', p.slug);
    await mkdir(outDir, { recursive: true });
    await writeFile(resolve(outDir, 'index.html'), html, 'utf8');

    imagesRewritten += beforeImgCount - afterImgCount;
    enriched.push({ ...p, title: cleanedTitle, excerpt, image: firstImg || '' });
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
