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
- **8% limit**: `eightPercent.threshold` (3000000). The app only shows a warning above this; it doesn't switch the computation.
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

**BIR Form 1701Q (January 2018 ENCS): page 2 schedule lines (Part V)**
- Schedule I (graduated): gross sales/receipts, cost of sales/services, allowable expenses, OSD, other non-operating income, taxable income
- Schedule II (8%): gross sales/receipts, other non-operating income, ₱250,000 reduction, taxable income
- Schedule III (credits): tax paid in previous quarters, creditable tax withheld in previous quarters (2307), creditable tax withheld this quarter (2307)

Already confirmed from page 1 of the 1701Q: Item 1 (year), Item 2 (quarter), Item 8 (ATC: II012/II014/II013 graduated, II015/II017/II016 8%), Item 16 (tax rate), Item 16A (method of deduction), Items 26–30 (Part III), plus Schedule I Item 46, Schedule II Item 54, Schedule III Item 62 and Item 63 as referenced on page 1.

The 2551Q item numbers (Items 3, 13, Schedule 1 Items 1 and 7, Items 14, 15, 18, 19, 20–23 and 24) are already filled in.

---

## Sources

TRAIN Law (RA 10963), RMC 26-2018, RMC 32-2018, RMC 69-2023. As of November 2026.
