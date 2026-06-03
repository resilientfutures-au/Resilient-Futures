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
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLen) return text;
  const slice = text.slice(0, maxLen);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > maxLen * 0.6 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[,.;:—–-]$/, '') + '…';
}
