/*
 * RULES — rates, deadlines and form item numbers used by the worksheet.
 *
 * This is the ONLY place where tax numbers live. If a rate, a deadline or an
 * item number changes, edit it here, then run `npm test` to make sure the
 * worksheet still computes correctly.
 *
 * Item numbers marked "[confirm]" have not been verified against the actual
 * form. Once you confirm one, replace "[confirm]" with the real number,
 * e.g. "Item 36".
 */
(function (root) {
  var CONFIRM = '[confirm]';

  var RULES = {
    // Shown in the footer.
    asOf: { en: 'As of November 2026', fil: 'As of Nobyembre 2026' },

    // Years the year picker offers. The graduated table below applies 2023 onwards.
    firstYear: 2023,

    // ---------- 8% income tax option ----------
    eightPercent: {
      rate: 0.08,
      // Purely self-employed/professionals deduct this first.
      // Mixed-income earners do NOT get this reduction.
      reductionPureOnly: 250000
    },

    // ---------- Graduated income tax rates (2023 onwards) ----------
    // Tax = base + rate x (taxable income - over)
    graduatedBrackets: [
      { over: 0,       upTo: 250000,   base: 0,       rate: 0 },
      { over: 250000,  upTo: 400000,   base: 0,       rate: 0.15 },
      { over: 400000,  upTo: 800000,   base: 22500,   rate: 0.20 },
      { over: 800000,  upTo: 2000000,  base: 102500,  rate: 0.25 },
      { over: 2000000, upTo: 8000000,  base: 402500,  rate: 0.30 },
      { over: 8000000, upTo: Infinity, base: 2202500, rate: 0.35 }
    ],

    // Optional Standard Deduction: 40% of gross sales/receipts.
    osdRate: 0.40,

    // ---------- Percentage tax (2551Q) ----------
    percentageTax: {
      rate: 0.03,
      atc: 'PT 010'
    },

    // ---------- Deadlines ----------
    // month is 1-12. nextYear: true means the deadline falls in the following year.
    deadlines: {
      form1701Q: {
        1: { month: 5, day: 15 },
        2: { month: 8, day: 15 },
        3: { month: 11, day: 15 }
        // No Q4 1701Q: the annual return covers it.
      },
      form2551Q: {
        1: { month: 4, day: 25 },
        2: { month: 7, day: 25 },
        3: { month: 10, day: 25 },
        4: { month: 1, day: 25, nextYear: true }
      }
    },

    // ---------- Item numbers ----------
    items1701Q: {
      quarter: CONFIRM,
      taxRateOption: CONFIRM,
      deductionMethod: CONFIRM,
      // Schedule for graduated rates
      gradGrossSales: CONFIRM,
      gradCostOfSales: CONFIRM,
      gradExpenses: CONFIRM,
      gradOsd: CONFIRM,
      gradOtherIncome: CONFIRM,
      gradTaxableIncome: CONFIRM,
      gradTaxDue: CONFIRM,
      // Schedule for the 8% rate
      eightGrossSales: CONFIRM,
      eightOtherIncome: CONFIRM,
      eightReduction: CONFIRM,
      eightTaxableIncome: CONFIRM,
      eightTaxDue: CONFIRM,
      // Tax credits
      prevQuartersTax: CONFIRM,
      creditableWithheld: CONFIRM,
      totalCredits: CONFIRM,
      taxPayable: CONFIRM
    },

    items2551Q: {
      quarter: 'Item 3',
      taxRateOption: 'Item 13',
      schedule1Line: 'Schedule 1, Item 1',
      schedule1Total: 'Schedule 1, Item 7',
      totalTaxDue: 'Item 14',
      creditableWithheld: 'Item 15',
      totalCredits: 'Item 18',
      taxStillPayable: 'Item 19',
      penalties: 'Items 20–23',
      totalAmountPayable: 'Item 24'
    },

    CONFIRM: CONFIRM
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = RULES;
  } else {
    root.QTW_RULES = RULES;
  }
})(this);
