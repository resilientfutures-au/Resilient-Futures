import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2];
const selector = process.argv[3];
const label = process.argv[4] || 'clip';

const screenshotsDir = path.join(__dirname, 'temporary screenshots');
const existing = fs.readdirSync(screenshotsDir)
  .filter(f => f.startsWith('screenshot-') && f.endsWith('.png'))
  .map(f => { const m = f.match(/^screenshot-(\d+)/); return m ? parseInt(m[1], 10) : 0; });
const next = existing.length > 0 ? Math.max(...existing) + 1 : 1;
const outPath = path.join(screenshotsDir, `screenshot-${next}-${label}.png`);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 600));
const el = await page.$(selector);
if (!el) {
  console.error('Element not found:', selector);
  await browser.close();
  process.exit(1);
}
await el.screenshot({ path: outPath });
await browser.close();
console.log(`Screenshot saved: ${outPath}`);
