// Opens every link in content/links.yaml in a real (headless) browser and reports what loaded.
// Use it before adding links, or to double-check ones the weekly checker flags.
// Usage: npm run check-links   (needs Playwright + Chromium installed)
const { chromium } = require('playwright');
const { readFileSync } = require('node:fs');
const { parse } = require('yaml');

const links = parse(readFileSync('content/links.yaml', 'utf8'));
const only = process.argv.slice(2);

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ locale: 'en-IN', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' });
  let bad = 0;
  for (const l of links.filter((x) => !only.length || only.includes(x.id))) {
    const page = await ctx.newPage();
    try {
      const res = await page.goto(l.url, { timeout: 30000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1200);
      const s = res ? res.status() : 0;
      const title = (await page.title()).slice(0, 70);
      const mark = s === 404 || s === 410 ? '✗' : s >= 400 ? '?' : '✓';
      if (mark === '✗') bad++;
      console.log(`${mark} ${s} ${l.id.padEnd(22)} ${title}`);
    } catch (e) {
      console.log(`? ERR ${l.id.padEnd(22)} ${String(e.message).split('\n')[0].slice(0, 70)}`);
    }
    await page.close();
  }
  console.log('\n✓ loaded · ? blocked/slow from this network (check another way, e.g. web.archive.org) · ✗ page gone');
  await browser.close();
  process.exit(bad ? 1 : 0);
})();
