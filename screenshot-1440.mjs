import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2];
const label = process.argv[3] || '1440';

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
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();
console.log(`Screenshot saved: ${outPath}`);
