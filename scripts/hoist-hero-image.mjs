// Move each article's leading body image up into the hero, shown under the
// date as a "featured image". Operates on the already-built article pages so
// the [caption] fix and other post-migration edits are preserved (re-running
// the full migration would undo those). Idempotent: skips files that already
// have a hero image, and files whose body doesn't start with an image.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function main() {
  const articlesDir = resolve(projectRoot, 'articles');
  const entries = await readdir(articlesDir, { withFileTypes: true });
  let moved = 0, already = 0, noImage = 0;

  for (const e of entries) {
    if (!e.isDirectory()) continue; // skip articles/index.html (the listing)
    const file = resolve(articlesDir, e.name, 'index.html');
    let html;
    try { html = await readFile(file, 'utf8'); } catch { continue; }

    if (html.includes('article-hero__image')) { already++; continue; }

    // Leading image = the first element inside <article class="article-body">
    const m = html.match(/(<article class="article-body">\s*)(<img\b[^>]*>)/);
    if (!m) { noImage++; continue; }
    const imgTag = m[2];

    // Remove the leading image from the body...
    html = html.replace(/(<article class="article-body">\s*)<img\b[^>]*>\s*/, '$1');
    // ...and insert it into the hero, right after the date.
    html = html.replace(
      /(<p class="article-hero__date">[^<]*<\/p>)/,
      `$1\n        <figure class="article-hero__image">${imgTag}</figure>`
    );

    await writeFile(file, html, 'utf8');
    moved++;
    console.log(`  ✓ ${e.name}`);
  }

  console.log(`\nDone. ${moved} hero images hoisted, ${already} already done, ${noImage} without a lead image.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(err => { console.error(err); process.exit(1); });
}
