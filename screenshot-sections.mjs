import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3000';
const screenshotsDir = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

// Get full page height
const fullHeight = await page.evaluate(() => document.body.scrollHeight);
console.log('Full page height:', fullHeight);

const sectionHeight = 800;
let idx = 0;
for (let y = 0; y < fullHeight; y += sectionHeight) {
  const h = Math.min(sectionHeight, fullHeight - y);
  const outPath = path.join(screenshotsDir, `v2-section-${String(idx).padStart(2, '0')}-y${y}.png`);
  await page.screenshot({
    path: outPath,
    clip: { x: 0, y, width: 1440, height: h }
  });
  console.log(`Saved: ${path.basename(outPath)}`);
  idx++;
}

await browser.close();
console.log('Done.');
