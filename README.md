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

## What's here and how to update it

| File | What's inside | Edit it when… |
|---|---|---|
| `js/i18n.js` | **Every word on screen**, English and Filipino side by side | you want to change wording or translations |
| `js/rules.js` | **Rates, deadlines, item numbers**, the "As of" date | the BIR changes a rate, deadline or form |
| `js/calc.js` | The math (uses the numbers in `rules.js`) | rarely |
| `js/app.js` | The screens, buttons and footer source list | rarely |
| `css/styles.css` | Colors, sizes, light/dark mode | you want a different look |
| `index.html` | Page skeleton, page title, description and share preview tags | you change the site name or web address |
| `assets/` | Favicon, phone home-screen icon, and the share preview image | you rebrand (see below) |
| `tests/` | Automated checks | you add a new rule |

Quick recipes:
- **Fix a typo or translation:** edit `js/i18n.js`, then run `npm test`.
- **Change a rate or deadline:** edit `js/rules.js`, update the matching explanation text in `js/i18n.js`, then run `npm test`.
- **Confirm an item number:** in `js/rules.js`, replace `CONFIRM` with the real label, e.g. `'Item 36'`.
- **Change the "As of" date:** `asOf` in `js/rules.js`.
- **Change the share preview image:** edit `assets/og-image.svg` (it's text, open it in any editor), then make a 1200×630 PNG of it named `assets/og-image.png`. Any SVG-to-PNG converter works.
- **Moved the site to a new address?** Update the `https://missniceph.github.io/...` links at the top of `index.html` so share previews keep working.

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
- **Deadlines**: `deadlines`. `month` is 1–12. `nextYear: true` means the following year (used for the Q4 2551Q, January 25). The app automatically adds a "this falls on a weekend, check with the BIR" note when a deadline lands on a Saturday or Sunday. It doesn't know about holidays.
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

This opens the actual page in a headless browser (needs Playwright + Chromium). It goes through both routes (8% and graduated) in both languages, in light and dark mode, at phone (360px), tablet and laptop sizes. It also checks keyboard-only use, the Back, language, theme and Start over buttons, the weekend deadline note, sideways scrolling, the banner, and that the page makes no network requests.

Required examples covered by `npm test`:

| Case | Expected |
|---|---|
| 8%, purely self-employed, Q1 YTD sales ₱300,000 | ₱4,000.00 |
| 8%, purely self-employed, Q2 YTD sales ₱700,000, Q1 tax ₱4,000 | ₱32,000.00 payable |
| Graduated OSD, YTD gross ₱600,000 | OSD ₱240,000, taxable ₱360,000, tax ₱16,500.00 |
| 2551Q quarter sales ₱200,000 | ₱6,000.00 |
| 8%, mixed income, YTD sales ₱300,000 | ₱24,000.00 (no ₱250,000 reduction) |

---

## Item numbers

All item numbers are now filled in (no more **[confirm]**). They follow the **January 2018 (ENCS)** versions of BIR Forms 1701Q and 2551Q:

- **1701Q page 1:** checked against a photo of the actual form (Items 1, 2, 8, 16, 16A, 26–30).
- **1701Q page 2 (Part V):** checked against the BIR's form text and several published copies (Schedule I Items 36–46, Schedule II Items 47–54, Schedule III Items 55–63).
- **2551Q:** from the original instructions (Items 3, 13, Schedule 1 Items 1 and 7, Items 14, 15, 18, 19, 20–23, 24).

If the BIR releases a new version of a form, update the numbers in `js/rules.js`. The `[confirm]` tag still works there, so any item you're not sure of can go back to `CONFIRM`.

### How the 1701Q is filled in

The 1701Q is cumulative, but **not** by typing year-to-date sales. On the form you enter **this quarter's** sales, costs and expenses. Then you add the taxable income from your previous 1701Q of the same year (Item 42, or Item 50 if on 8%). So for Q2 and Q3 the worksheet asks for:

- this quarter's figures, and
- Item 45 (graduated) or Item 51 (8%) from the last 1701Q you filed this year.

The tax due and the amount to pay come out the same as a year-to-date computation. This way, every line in the "What to enter in eBIRForms" summary also matches the form.

## Sources

TRAIN Law (RA 10963), RMC 26-2018, RMC 32-2018, RMC 69-2023. As of November 2026.

The ₱3,000,000 limit for the 8% option and the note for mixed-income earners on graduated rates come from RR 8-2018 (BIR digest), added after research. The ATC codes and 1701Q page 1 item numbers come from a photo of the actual form.
