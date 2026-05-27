import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(process.argv[2], { waitUntil: 'networkidle2' });
const info = await page.evaluate(() => {
  const img = document.querySelector('img[src*="SiA_Light"]');
  if (!img) return { error: 'no img' };
  const r = img.getBoundingClientRect();
  const parent = img.parentElement.getBoundingClientRect();
  const grand = img.parentElement.parentElement.getBoundingClientRect();
  return {
    img: { w: r.width, h: r.height },
    parent: { w: parent.width, h: parent.height },
    grand: { w: grand.width, h: grand.height },
    naturalW: img.naturalWidth, naturalH: img.naturalHeight,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
