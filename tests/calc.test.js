// Run with: npm test   (uses Node's built-in test runner, no installs needed)
const test = require('node:test');
const assert = require('node:assert/strict');
const CALC = require('../js/calc.js');
const I18N = require('../js/i18n.js');
const RULES = require('../js/rules.js');

const peso = CALC.formatPeso;

// ---------- Required scenarios ----------
test('a) 8%, purely self-employed, Q1 YTD sales 300,000 -> tax due 4,000.00', () => {
  const r = CALC.compute1701Q({ option: '8', incomeType: 'pure', grossSalesYTD: 300000 });
  assert.equal(peso(r.taxDue), '₱4,000.00');
  assert.equal(peso(r.payable), '₱4,000.00');
});

test('b) 8%, purely self-employed, Q2 YTD sales 700,000, Q1 tax 4,000 -> payable 32,000.00', () => {
  const r = CALC.compute1701Q({ option: '8', incomeType: 'pure', grossSalesYTD: 700000, prevQuartersTax: 4000 });
  assert.equal(peso(r.taxDue), '₱36,000.00');
  assert.equal(peso(r.payable), '₱32,000.00');
});

test('c) Graduated OSD, YTD gross 600,000 -> OSD 240,000, taxable 360,000, tax 16,500.00', () => {
  const r = CALC.compute1701Q({ option: 'graduated', incomeType: 'pure', deduction: 'osd', grossSalesYTD: 600000 });
  assert.equal(peso(r.osd), '₱240,000.00');
  assert.equal(peso(r.taxableIncome), '₱360,000.00');
  assert.equal(peso(r.taxDue), '₱16,500.00');
});

test('d) 2551Q quarter sales 200,000 -> percentage tax 6,000.00', () => {
  const r = CALC.compute2551Q({ grossSalesQuarter: 200000 });
  assert.equal(peso(r.taxDue), '₱6,000.00');
  assert.equal(peso(r.item14), '₱6,000.00');
  assert.equal(peso(r.item19), '₱6,000.00');
});

test('e) 8%, mixed income, YTD sales 300,000 -> 24,000.00 (no 250,000 reduction)', () => {
  const r = CALC.compute1701Q({ option: '8', incomeType: 'mixed', grossSalesYTD: 300000 });
  assert.equal(r.reduction, 0);
  assert.equal(peso(r.taxDue), '₱24,000.00');
});

// ---------- Extra checks ----------
test('graduated table at each bracket edge', () => {
  const cases = [
    [0, 0], [250000, 0], [400000, 22500], [800000, 102500],
    [2000000, 402500], [8000000, 2202500], [9000000, 2552500], [300000, 7500]
  ];
  for (const [income, tax] of cases) assert.equal(CALC.graduatedTax(income), tax, `income ${income}`);
});

test('itemized: gross - cost - expenses + other income', () => {
  const r = CALC.compute1701Q({
    option: 'graduated', incomeType: 'pure', deduction: 'itemized',
    grossSalesYTD: 900000, costOfSalesYTD: 200000, expensesYTD: 150000, otherIncomeYTD: 50000
  });
  assert.equal(r.taxableIncome, 600000);
  assert.equal(r.taxDue, 62500); // 22,500 + 20% x 200,000
});

test('8% includes other non-operating income', () => {
  const r = CALC.compute1701Q({ option: '8', incomeType: 'pure', grossSalesYTD: 300000, otherIncomeYTD: 50000 });
  assert.equal(r.taxDue, 8000);
});

test('8% purely self-employed below 250,000 -> zero, never negative', () => {
  const r = CALC.compute1701Q({ option: '8', incomeType: 'pure', grossSalesYTD: 100000 });
  assert.equal(r.taxableIncome, 0);
  assert.equal(r.taxDue, 0);
});

test('credits bigger than tax -> overpayment, payable is zero', () => {
  const r = CALC.compute1701Q({ option: '8', incomeType: 'pure', grossSalesYTD: 300000, creditableWithheld: 5000 });
  assert.equal(r.payable, 0);
  assert.equal(r.overpayment, 1000);
  const p = CALC.compute2551Q({ grossSalesQuarter: 100000, creditableWithheld: 3500 });
  assert.equal(p.payable, 0);
  assert.equal(p.overpayment, 500);
  assert.equal(p.item18, 3500);
  assert.equal(p.item19, -500);
});

test('itemized loss -> no tax', () => {
  const r = CALC.compute1701Q({ option: 'graduated', incomeType: 'pure', deduction: 'itemized', grossSalesYTD: 100000, expensesYTD: 150000 });
  assert.equal(r.taxDue, 0);
  assert.equal(r.payable, 0);
});

test('centavos are rounded to 2 decimals', () => {
  const p = CALC.compute2551Q({ grossSalesQuarter: 12345.67 });
  assert.equal(peso(p.taxDue), '₱370.37');
  assert.equal(peso(1234567.891), '₱1,234,567.89');
  assert.equal(peso(0), '₱0.00');
});

test('parseAmount accepts commas and peso sign, rejects junk', () => {
  assert.equal(CALC.parseAmount('₱150,000.50'), 150000.5);
  assert.equal(CALC.parseAmount(' 1,000 '), 1000);
  assert.equal(CALC.parseAmount(''), null);
  assert.ok(Number.isNaN(CALC.parseAmount('abc')));
  assert.ok(Number.isNaN(CALC.parseAmount('1.2.3')));
  assert.equal(CALC.parseAmount('-5'), -5);
});

test('which returns: 8% -> 1701Q only; graduated -> both; Q4 -> no 1701Q', () => {
  assert.deepEqual(CALC.returnsFor('8', 2), { has1701Q: true, has2551Q: false });
  assert.deepEqual(CALC.returnsFor('graduated', 2), { has1701Q: true, has2551Q: true });
  assert.deepEqual(CALC.returnsFor('graduated', 4), { has1701Q: false, has2551Q: true });
  assert.deepEqual(CALC.returnsFor('8', 4), { has1701Q: false, has2551Q: false });
});

test('deadlines', () => {
  assert.deepEqual(CALC.deadlineFor('form1701Q', 1, 2026), { year: 2026, month: 5, day: 15 });
  assert.deepEqual(CALC.deadlineFor('form1701Q', 2, 2026), { year: 2026, month: 8, day: 15 });
  assert.deepEqual(CALC.deadlineFor('form1701Q', 3, 2026), { year: 2026, month: 11, day: 15 });
  assert.equal(CALC.deadlineFor('form1701Q', 4, 2026), null);
  assert.deepEqual(CALC.deadlineFor('form2551Q', 1, 2026), { year: 2026, month: 4, day: 25 });
  assert.deepEqual(CALC.deadlineFor('form2551Q', 2, 2026), { year: 2026, month: 7, day: 25 });
  assert.deepEqual(CALC.deadlineFor('form2551Q', 3, 2026), { year: 2026, month: 10, day: 25 });
  assert.deepEqual(CALC.deadlineFor('form2551Q', 4, 2026), { year: 2027, month: 1, day: 25 });
});

test('every text has both English and Filipino', () => {
  for (const [key, entry] of Object.entries(I18N.STRINGS)) {
    for (const lang of I18N.LANGS) {
      assert.ok(typeof entry[lang] === 'string' && entry[lang].trim() !== '', `missing ${lang} for "${key}"`);
    }
    const varsEn = (entry.en.match(/\{\w+\}/g) || []).sort().join();
    const varsFil = (entry.fil.match(/\{\w+\}/g) || []).sort().join();
    assert.equal(varsEn, varsFil, `placeholders differ in "${key}"`);
  }
});

test('2551Q item numbers match the confirmed list', () => {
  assert.equal(RULES.items2551Q.quarter, 'Item 3');
  assert.equal(RULES.items2551Q.taxRateOption, 'Item 13');
  assert.equal(RULES.items2551Q.totalTaxDue, 'Item 14');
  assert.equal(RULES.items2551Q.creditableWithheld, 'Item 15');
  assert.equal(RULES.items2551Q.totalCredits, 'Item 18');
  assert.equal(RULES.items2551Q.taxStillPayable, 'Item 19');
  assert.equal(RULES.items2551Q.totalAmountPayable, 'Item 24');
  assert.equal(RULES.percentageTax.atc, 'PT 010');
});

test('1701Q item numbers confirmed from page 1 of the form', () => {
  const I = RULES.items1701Q;
  assert.equal(I.year, 'Item 1');
  assert.equal(I.quarter, 'Item 2');
  assert.equal(I.atc, 'Item 8');
  assert.equal(I.taxRateOption, 'Item 16');
  assert.equal(I.deductionMethod, 'Item 16A');
  assert.equal(I.partIIITaxDue, 'Item 26');
  assert.equal(I.partIIITaxPayable, 'Item 28');
  assert.equal(I.partIIITotalPayable, 'Item 30');
  assert.deepEqual(RULES.atc1701Q.mixed['8'].map((x) => x.code), ['II016']);
  assert.deepEqual(RULES.atc1701Q.pure.graduated.map((x) => x.code), ['II012', 'II014']);
});
