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
