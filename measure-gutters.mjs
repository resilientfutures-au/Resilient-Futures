import puppeteer from 'puppeteer';

const url = process.argv[2] || 'http://localhost:3000/index.html';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2' });

const results = await page.evaluate(() => {
  const viewportWidth = window.innerWidth;
  const containers = Array.from(document.querySelectorAll('section .container, section .section-inner'));
  return containers.map(el => {
    const rect = el.getBoundingClientRect();
    const sect = el.closest('section');
    const sectClass = sect ? (sect.getAttribute('class') || '') : '';
    const sectId = sect ? (sect.id || '') : '';
    const leftGutter = rect.left;
    const rightGutter = viewportWidth - rect.right;
    const cls = el.getAttribute('class') || '';
    return { sectId, sectClass, wrapperClass: cls, width: Math.round(rect.width), leftGutter: Math.round(leftGutter), rightGutter: Math.round(rightGutter) };
  });
});

console.log(`Viewport: 1440`);
console.log(JSON.stringify(results, null, 2));
await browser.close();
