// Surgically inject SEO/AEO <head> metadata into the already-built article
// pages, and (re)generate sitemap.xml + robots.txt.
//
// Why a separate pass instead of re-running migrate-articles.mjs?  The article
// bodies have post-migration fixes baked in (e.g. the [caption] shortcode
// conversion). Re-running the full migration would regenerate bodies from the
// XML and undo those. This script reads the XML only for canonical metadata
// (title, date, original URL) and rewrites just the <head>, leaving bodies
// untouched. It is idempotent: the seo:start/seo:end block is stripped and
// replaced on every run.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseXml,
  cleanMojibake,
  decodeHtmlEntities,
  stripSquarespaceHtml,
  generateExcerpt,
  buildArticleSeoBlock,
  buildPageSeoBlock,
  SITE,
} from './migrate-articles.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// Remove any existing seo:start..seo:end block, then insert `block` right after
// the first </title>. Keeps a single, well-placed copy no matter how many times
// this runs.
function injectAfterTitle(html, block) {
  const stripped = html.replace(/\n?[ \t]*<!-- seo:start -->[\s\S]*?<!-- seo:end -->/g, '');
  return stripped.replace(/<\/title>/, `</title>\n  ${block}`);
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

async function main() {
  const xmlPath = resolve(projectRoot, 'brand_assets/Squarespace-Wordpress-Export-06-03-2026.xml');
  const xml = await readFile(xmlPath, 'utf8');
  const posts = parseXml(xml);

  const articleUrls = [];
  let injected = 0;
  let missing = 0;

  for (const p of posts) {
    const filePath = resolve(projectRoot, 'articles', p.slug, 'index.html');
    if (!existsSync(filePath)) {
      console.warn(`  ⚠ no built file for slug: ${p.slug}`);
      missing++;
      continue;
    }

    let fileHtml = await readFile(filePath, 'utf8');

    const title = decodeHtmlEntities(cleanMojibake(p.title));
    const cleaned = stripSquarespaceHtml(cleanMojibake(p.contentHtml));
    const description = generateExcerpt(cleaned, 155);
    const canonical = `${SITE}/articles/${p.slug}/`;
    // First locally-hosted body image becomes the OG/Twitter image.
    const firstImg = (fileHtml.match(/src="(\/assets\/images\/articles\/[^"]+)"/) || [])[1];
    const imageUrl = firstImg ? SITE + firstImg : undefined;

    const block = buildArticleSeoBlock({
      title,
      description,
      canonical,
      imageUrl,
      iso: p.date.toISOString(),
    });

    fileHtml = injectAfterTitle(fileHtml, block);
    await writeFile(filePath, fileHtml, 'utf8');

    articleUrls.push({ loc: canonical, lastmod: isoDate(p.date) });
    injected++;
    console.log(`  ✓ ${p.slug}`);
  }

  // Articles listing page
  const listingPath = resolve(projectRoot, 'articles/index.html');
  if (existsSync(listingPath)) {
    let listingHtml = await readFile(listingPath, 'utf8');
    const listingBlock = buildPageSeoBlock({
      title: 'Articles',
      description: 'Articles and writing from Resilient Futures on strategy, leadership, and navigating disruptive change — drawn from current client work and the conditions shaping every operating environment.',
      canonical: `${SITE}/articles/`,
    });
    listingHtml = injectAfterTitle(listingHtml, listingBlock);
    await writeFile(listingPath, listingHtml, 'utf8');
    console.log('  ✓ articles/index.html (listing)');
  }

  // ─── sitemap.xml ───────────────────────────────────────────────────────────
  const today = isoDate(new Date());
  // Top-level public pages (exclude archived/_-prefixed dirs — readdir is root only).
  const SITEMAP_EXCLUDE = new Set(['404.html']); // error pages must not be indexed
  const rootEntries = await readdir(projectRoot, { withFileTypes: true });
  const rootPages = rootEntries
    .filter(e => e.isFile() && e.name.endsWith('.html') && !e.name.startsWith('_') && !SITEMAP_EXCLUDE.has(e.name))
    .map(e => e.name)
    .sort();

  const pageUrls = rootPages.map(name => ({
    loc: name === 'index.html' ? `${SITE}/` : `${SITE}/${name}`,
    lastmod: today,
    priority: name === 'index.html' ? '1.0' : '0.8',
  }));

  // Articles listing, then individual articles (newest first).
  const listingUrl = { loc: `${SITE}/articles/`, lastmod: today, priority: '0.7' };
  const sortedArticles = [...articleUrls].sort((a, b) => (a.lastmod < b.lastmod ? 1 : -1));

  const allUrls = [
    ...pageUrls,
    listingUrl,
    ...sortedArticles.map(a => ({ ...a, priority: '0.6' })),
  ];

  const urlsetBody = allUrls.map(u => {
    const lines = [
      '  <url>',
      `    <loc>${u.loc}</loc>`,
      `    <lastmod>${u.lastmod}</lastmod>`,
    ];
    if (u.priority) lines.push(`    <priority>${u.priority}</priority>`);
    lines.push('  </url>');
    return lines.join('\n');
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsetBody}
</urlset>
`;
  await writeFile(resolve(projectRoot, 'sitemap.xml'), sitemap, 'utf8');
  console.log(`  ✓ sitemap.xml (${allUrls.length} URLs)`);

  // ─── robots.txt ──────────────────────────────────────────────────────────
  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
  await writeFile(resolve(projectRoot, 'robots.txt'), robots, 'utf8');
  console.log('  ✓ robots.txt');

  console.log(`\nDone. ${injected} articles updated, ${missing} missing, ${allUrls.length} sitemap URLs.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(err => { console.error(err); process.exit(1); });
}
