// Browser check of the real page: both languages, both routes, phone + laptop.
// Run with: npm run test:ui   (needs Playwright + Chromium installed)
// Set SCREENSHOT_DIR=some/folder to also save screenshots.
const path = require('path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
const SIZES = { phone: { width: 375, height: 740 }, laptop: { width: 1366, height: 820 } };
const shotDir = process.env.SCREENSHOT_DIR;

async function choose(page, name, value) {
  await page.click(`[data-choice="${name}"][data-value="${value}"]`);
}
async function next(page) { await page.click('[data-action="next"]'); }
async function amount(page, text) {
  await page.fill('#amount', text);
  await next(page);
}
async function noSideScroll(page, label) {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(over <= 0, `${label}: page scrolls sideways by ${over}px`);
}
async function bannerShown(page, lang) {
  const text = await page.textContent('#banner');
  assert.match(text, lang === 'fil' ? /Hindi opisyal na practice worksheet/ : /Unofficial practice worksheet\. Not a BIR form\./);
  assert.ok(await page.isVisible('#banner'));
}

const scenarios = [
  {
    name: '8pct-pure-q2', lang: 'en',
    async run(page) {
      await choose(page, 'option', '8'); await next(page);
      await page.selectOption('#year', '2026'); await choose(page, 'quarter', '2'); await next(page);
      await choose(page, 'incomeType', 'pure'); await next(page);
      await amount(page, '700,000');       // gross YTD
      await amount(page, '');              // other income
      await amount(page, '4000');          // previous quarters
      await amount(page, '');              // 2307
      const res = await page.textContent('#res-1701');
      assert.match(res, /₱36,000\.00/);
      assert.match(res, /₱32,000\.00/);
      assert.equal(await page.$('#res-2551'), null, '8% must not show 2551Q');
      assert.match(await page.textContent('#total'), /₱32,000\.00/);
      assert.match(await page.textContent('#deadlines'), /August 15, 2026/);
      assert.match(await page.textContent('#ebir'), /\[confirm\]/);
    }
  },
  {
    name: 'graduated-osd-q1', lang: 'fil',
    async run(page) {
      await choose(page, 'option', 'graduated'); await next(page);
      await page.selectOption('#year', '2026'); await choose(page, 'quarter', '1'); await next(page);
      await choose(page, 'incomeType', 'pure'); await next(page);
      await choose(page, 'deduction', 'osd'); await next(page);
      assert.match(await page.textContent('#screen'), /kabuuang benta o kita bago ibawas ang gastos/);
      await amount(page, '600000');        // gross YTD
      await amount(page, '0');             // other income
      await amount(page, '');              // 2307
      assert.match(await page.textContent('#screen'), /2551Q worksheet/);
      await amount(page, '200000');        // 2551Q gross for quarter
      await amount(page, '');              // 2551Q 2307
      assert.match(await page.textContent('#res-1701'), /₱240,000\.00/);
      assert.match(await page.textContent('#res-1701'), /₱360,000\.00/);
      assert.match(await page.textContent('#res-1701'), /₱16,500\.00/);
      assert.match(await page.textContent('#res-2551'), /₱6,000\.00/);
      assert.match(await page.textContent('#total'), /₱22,500\.00/);
      const ebir = await page.textContent('#ebir');
      assert.match(ebir, /PT 010/);
      assert.match(ebir, /Item 14/);
      assert.match(ebir, /Item 24/);
      assert.match(ebir, /Graduated income tax rates/);
      const dl = await page.textContent('#deadlines');
      assert.match(dl, /Mayo 15, 2026/);
      assert.match(dl, /Abril 25, 2026/);
    }
  },
  {
    name: 'not-sure-then-graduated-q4', lang: 'en',
    async run(page) {
      await choose(page, 'option', 'notSure');
      assert.match(await page.textContent('#not-sure-note'), /Item 13 of BIR Form 2551Q/);
      await next(page);
      assert.match(await page.textContent('#err'), /pick one/i);
      await choose(page, 'optionAfter', 'graduated'); await next(page);
      await page.selectOption('#year', '2026'); await choose(page, 'quarter', '4');
      assert.match(await page.textContent('#q4-note'), /no Q4 1701Q/);
      await next(page);
      assert.match(await page.textContent('#screen'), /this quarter only/i);
      await amount(page, '200000');
      await amount(page, '1000');
      assert.equal(await page.$('#res-1701'), null);
      assert.match(await page.textContent('#res-2551'), /₱5,000\.00/);
      assert.match(await page.textContent('#deadlines'), /January 25, 2027/);
    }
  },
  {
    name: '8pct-q4-nothing', lang: 'fil',
    async run(page) {
      await choose(page, 'option', '8'); await next(page);
      await choose(page, 'quarter', '4'); await next(page);
      assert.ok(await page.isVisible('#nothing-note'));
    }
  },
  {
    name: '8pct-mixed-q1-validation', lang: 'en',
    async run(page) {
      await choose(page, 'option', '8'); await next(page);
      await page.selectOption('#year', '2026'); await choose(page, 'quarter', '1'); await next(page);
      await choose(page, 'incomeType', 'mixed'); await next(page);
      await amount(page, '');
      assert.match(await page.textContent('#err'), /enter an amount/);
      await amount(page, 'abc');
      assert.match(await page.textContent('#err'), /numbers only/);
      await amount(page, '300000');
      await amount(page, '');
      await amount(page, '');
      assert.match(await page.textContent('#res-1701'), /₱24,000\.00/);
      // switch language on the results screen
      await page.click('[data-lang="fil"]');
      assert.match(await page.textContent('#screen'), /Ang resulta mo/);
      await bannerShown(page, 'fil');
      const summary = await page.evaluate(() => window.QTW_APP.summaryText());
      assert.match(summary, /₱24,000\.00/);
      assert.match(summary, /Hindi opisyal/);
      await page.click('[data-action="copy"]');
      await page.waitForFunction(() => document.getElementById('copy-status').textContent.trim() !== '', null, { timeout: 3000 });
    }
  }
];

(async () => {
  const browser = await chromium.launch();
  let failures = 0;
  for (const [sizeName, viewport] of Object.entries(SIZES)) {
    for (const s of scenarios) {
      for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({ viewport, colorScheme: theme, deviceScaleFactor: 1 });
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        const page = await context.newPage();
        const problems = [];
        page.on('pageerror', (e) => problems.push('page error: ' + e.message));
        page.on('console', (m) => { if (m.type() === 'error') problems.push('console: ' + m.text()); });
        page.on('request', (r) => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) problems.push('network request: ' + r.url()); });
        const label = `${s.name} @ ${sizeName} (${s.lang}, ${theme})`;
        try {
          await page.goto(URL + '?lang=' + s.lang);
          await bannerShown(page, s.lang);
          await s.run(page);
          await bannerShown(page, (await page.getAttribute('html', 'lang')) === 'fil' ? 'fil' : 'en');
          await noSideScroll(page, label);
          assert.match(await page.textContent('footer'), /RA 10963|Republic Act No\. 10963/);
          assert.ok(await page.$('footer a[href="https://instagram.com/missniceph"]'));
          assert.deepEqual(problems, []);
          if (shotDir) await page.screenshot({ path: path.join(shotDir, `${s.name}-${sizeName}-${theme}.png`), fullPage: true });
          console.log('ok   ', label);
        } catch (e) {
          failures++;
          console.log('FAIL ', label, '\n     ', e.message);
          if (shotDir) await page.screenshot({ path: path.join(shotDir, `FAIL-${s.name}-${sizeName}-${theme}.png`), fullPage: true });
        }
        await context.close();
      }
    }
  }
  await browser.close();
  console.log(failures ? `\n${failures} UI check(s) failed` : '\nAll UI checks passed');
  process.exit(failures ? 1 : 0);
})();
