# Quarterly Tax Worksheet

An **unofficial**, bilingual (English/Filipino) practice worksheet that helps self-employed Filipinos and micro taxpayers prepare their quarterly BIR returns (**1701Q** and **2551Q**), then shows exactly what to type in eBIRForms.

Made by **Nice to Know** ([@missniceph](https://instagram.com/missniceph)).

> Unofficial practice worksheet. Not a BIR form. File your actual return through eBIRForms or your RDO.

- Plain HTML, CSS and JavaScript. There's no build step and nothing to install.
- No backend and no tracking. Nothing anyone types is saved or sent anywhere. It only lives in the open browser tab.
- General information only, not tax advice.

---

## Put it online (GitHub Pages)

1. On GitHub, open the repository → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
3. Pick the branch (for example `main`) and the folder **/ (root)**, then click **Save**.
4. After a minute, the site is live at `https://<your-username>.github.io/quarterly-tax-worksheet/`.

To preview on your own computer, just double-click `index.html`.

---

## Where things are

| File | What's inside | When you'd edit it |
|---|---|---|
| `js/i18n.js` | **Every word on screen**, in English and Filipino | Fixing wording or translations |
| `js/rules.js` | **Rates, deadlines, item numbers**, "As of" date | When the BIR changes something |
| `js/calc.js` | The math | Rarely |
| `js/app.js` | The screens and buttons | Rarely |
| `css/styles.css` | Colors, sizes, light/dark mode | Changing the look |
| `index.html` | The page skeleton | Rarely |
| `tests/` | Automated checks | When you add a new rule |

---

## How to edit text and translations

Open `js/i18n.js`. Each piece of text looks like this:

```js
'btn.next': { en: 'Next', fil: 'Susunod' },
```

- Change the words between the quotes. `en` is English and `fil` is Filipino.
- **Keep anything in `{curly braces}` exactly as is**, like `{year}` or `{quarter}`. The app fills those in. Both languages need the same ones.
- If your text has an apostrophe, write it as `’` (a curly ’), or put a backslash before it: `don\'t`.
- `₱` is the peso sign ₱, and `—` is a long dash —.

The footer source list and the Instagram link are near the bottom of `js/app.js` (search for `footer.sources`).

## How to update rates, deadlines or item numbers

Open `js/rules.js`. Everything is labeled.

- **8% option**: `eightPercent.rate` (0.08 = 8%) and `reductionPureOnly` (250000).
- **Graduated table**: `graduatedBrackets`. Each line means "over `over`: tax = `base` + `rate` × (income − `over`)".
- **OSD**: `osdRate` (0.40 = 40%).
- **Percentage tax**: `percentageTax.rate` (0.03 = 3%) and its ATC.
- **Deadlines**: `deadlines`. `month` is 1–12. `nextYear: true` means the following year (used for the Q4 2551Q, January 25).
- **Item numbers**: `items1701Q` and `items2551Q`. Once you've checked a `[confirm]` item against the real form, replace `CONFIRM` with the real label, e.g. `'Item 36'`.
- **"As of" date** in the footer: `asOf`.

If you change a rate or a deadline, also update the matching explanation text in `js/i18n.js` (search for the old number), for example `dl.help` lists all deadlines in words.

## Run the checks

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm test
```

This checks the math (including the five required examples below), the deadlines, and that every text has both English and Filipino.

```bash
npm run test:ui
```

This opens the actual page in a headless browser (needs Playwright + Chromium). It goes through both routes (8% and graduated) in both languages, in light and dark mode, at phone and laptop sizes. It checks for sideways scrolling, the banner, and that the page makes no network requests.

Required examples covered by `npm test`:

| Case | Expected |
|---|---|
| 8%, purely self-employed, Q1 YTD sales ₱300,000 | ₱4,000.00 |
| 8%, purely self-employed, Q2 YTD sales ₱700,000, Q1 tax ₱4,000 | ₱32,000.00 payable |
| Graduated OSD, YTD gross ₱600,000 | OSD ₱240,000, taxable ₱360,000, tax ₱16,500.00 |
| 2551Q quarter sales ₱200,000 | ₱6,000.00 |
| 8%, mixed income, YTD sales ₱300,000 | ₱24,000.00 (no ₱250,000 reduction) |

---

## Items still marked [confirm]

These show up on screen with a yellow **[confirm]** tag until you update `js/rules.js`.

**BIR Form 1701Q (January 2018 ENCS): all item numbers**
- Quarter
- Income tax rate option (8% / graduated)
- Method of deduction (itemized / OSD)
- Schedule for graduated rates: gross sales/receipts, cost of sales/services, allowable expenses, OSD, other non-operating income, taxable income, tax due
- Schedule for the 8% rate: gross sales/receipts, other non-operating income, ₱250,000 reduction, taxable income, tax due
- Tax credits: tax paid in previous quarters, creditable tax withheld (2307), total tax credits/payments
- Tax payable/(overpayment)

The 2551Q item numbers (Items 3, 13, Schedule 1 Items 1 and 7, Items 14, 15, 18, 19, 20–23 and 24) are already filled in.

---

## Sources

TRAIN Law (RA 10963), RMC 26-2018, RMC 32-2018, RMC 69-2023. As of November 2026.
