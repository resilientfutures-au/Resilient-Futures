// Add a square thumbnail under the date in each row of the article library
// (articles/index.html). The thumbnail uses each article's lead image, read
// from the hero <figure> that hoist-hero-image.mjs created. Articles without a
// lead image get no thumbnail. Operates on the built listing so the migration
// doesn't need re-running. Idempotent.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function main() {
  const articlesDir = resolve(projectRoot, 'articles');
  const entries = await readdir(articlesDir, { withFileTypes: true });

  // 1) slug -> lead image src (from each article's hoisted hero figure)
  const imgBySlug = {};
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    let html;
    try { html = await readFile(resolve(articlesDir, e.name, 'index.html'), 'utf8'); } catch { continue; }
    // First locally-hosted image anywhere in the article — the hoisted hero
    // <figure> for posts that lead with an image, otherwise the first body
    // image. (SEO og:image/twitter:image use content="https://…" so they don't match.)
    const m = html.match(/\bsrc="(\/assets\/images\/articles\/[^"]+)"/);
    if (m) imgBySlug[e.name] = m[1];
  }

  // 2) inject thumbnails into the listing rows
  const listingPath = resolve(articlesDir, 'index.html');
  let listing = await readFile(listingPath, 'utf8');
  let added = 0, skipped = 0;

  listing = listing.replace(/<article class="articles-list__row">[\s\S]*?<\/article>/g, (block) => {
    if (block.includes('articles-list__thumb')) return block; // idempotent
    const slugM = block.match(/href="\/articles\/([^/"]+)\//);
    const src = slugM && imgBySlug[slugM[1]];
    if (!src) { skipped++; return block; }
    added++;
    return block.replace(
      /(<div class="articles-list__date">[^<]*)(<\/div>)/,
      `$1<img class="articles-list__thumb" src="${src}" alt="" loading="lazy">$2`
    );
  });

  await writeFile(listingPath, listing, 'utf8');
  console.log(`Done. ${added} thumbnails added, ${skipped} rows without a lead image.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(err => { console.error(err); process.exit(1); });
}
