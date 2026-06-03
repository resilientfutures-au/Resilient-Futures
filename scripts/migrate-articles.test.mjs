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
