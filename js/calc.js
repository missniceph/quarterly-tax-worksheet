/*
 * CALC — the actual computations. No screen code here, so it can be tested.
 * All rates and deadlines come from rules.js.
 */
(function (root) {
  var RULES = (typeof module !== 'undefined' && module.exports)
    ? require('./rules.js')
    : root.QTW_RULES;

  // Round to centavos (2 decimals), avoiding floating-point drift.
  function round2(n) {
    var x = Number(n) || 0;
    return Math.round((x + Number.EPSILON) * 100) / 100;
  }

  function num(n) {
    var x = Number(n);
    return isFinite(x) ? x : 0;
  }

  // "₱1,234,567.89". Negative numbers get a leading minus sign.
  function formatPeso(n) {
    var v = round2(n);
    var neg = v < 0;
    var parts = Math.abs(v).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '-' : '') + '₱' + parts[0] + '.' + parts[1];
  }

  // Turn what the user typed into a number. Returns:
  //   null      -> empty
  //   NaN       -> not a valid amount
  //   a number  -> OK (may be negative; the caller decides if that's allowed)
  function parseAmount(text) {
    if (text === null || text === undefined) return null;
    var s = String(text).replace(/[₱,\s]/g, '').replace(/^php/i, '');
    if (s === '') return null;
    if (!/^-?\d*\.?\d*$/.test(s) || s === '.' || s === '-') return NaN;
    return round2(parseFloat(s));
  }

  // Income tax on taxable income using the graduated table.
  function graduatedTax(taxableIncome) {
    var ti = num(taxableIncome);
    if (ti <= 0) return 0;
    var brackets = RULES.graduatedBrackets;
    for (var i = brackets.length - 1; i >= 0; i--) {
      var b = brackets[i];
      if (ti > b.over) return round2(b.base + b.rate * (ti - b.over));
    }
    return 0;
  }

  // Which returns does this person prepare for this quarter?
  function returnsFor(option, quarter) {
    var q = Number(quarter);
    return {
      has1701Q: q >= 1 && q <= 3,           // no Q4 1701Q (annual return covers it)
      has2551Q: option === 'graduated'      // 8% replaces percentage tax
    };
  }

  /*
   * 1701Q, following the form line by line (January 2018 version).
   * The form is cumulative, but not by entering year-to-date sales: you enter
   * THIS QUARTER's figures, then add the taxable income from your previous
   * 1701Q of the same year (Item 42 / Item 50).
   *
   * input: {
   *   option: '8' | 'graduated',
   *   incomeType: 'pure' | 'mixed',
   *   deduction: 'itemized' | 'osd'        (graduated only)
   *   grossSales, costOfSales, expenses,   (this quarter)
   *   otherIncome,                         (this quarter, non-operating)
   *   prevTaxableIncome,                   (from your last 1701Q this year: Item 45, or Item 51 if 8%)
   *   prevQuartersTax,                     (tax paid on previous 1701Qs this year — Item 56)
   *   creditableWithheldPrev,              (2307, previous quarters — Item 57)
   *   creditableWithheld                   (2307, this quarter — Item 58)
   * }
   */
  function compute1701Q(input) {
    var gross = round2(num(input.grossSales));
    var other = round2(num(input.otherIncome));
    var prevTaxable = round2(num(input.prevTaxableIncome));
    var r = { option: input.option, incomeType: input.incomeType, deduction: null };

    if (input.option === '8') {
      r.item47 = gross;
      r.item48 = other;
      r.item49 = round2(gross + other);
      r.item50 = prevTaxable;
      r.item51 = round2(r.item49 + r.item50);
      r.item52 = input.incomeType === 'pure' ? RULES.eightPercent.reductionPureOnly : 0;
      r.item53 = round2(Math.max(0, r.item51 - r.item52));
      r.item54 = round2(r.item53 * RULES.eightPercent.rate);
      r.taxableIncome = r.item53;
      r.taxDue = r.item54;
      // Item 51 = gross sales/receipts + other non-operating income to date.
      r.overThreshold = r.item51 > RULES.eightPercent.threshold;
    } else {
      r.deduction = input.deduction === 'osd' ? 'osd' : 'itemized';
      var itemized = r.deduction === 'itemized';
      r.item36 = gross;
      r.item37 = itemized ? round2(num(input.costOfSales)) : 0;
      r.item38 = round2(r.item36 - r.item37);
      r.item39 = itemized ? round2(num(input.expenses)) : 0;
      r.item40 = itemized ? 0 : round2(gross * RULES.osdRate);
      r.item41 = round2(r.item38 - (itemized ? r.item39 : r.item40));
      r.item42 = prevTaxable;
      r.item43 = other;
      r.item44 = 0; // share in a general professional partnership: not covered
      r.item45 = round2(r.item41 + r.item42 + r.item43 + r.item44);
      r.item46 = graduatedTax(r.item45);
      r.taxableIncome = r.item45;
      r.taxDue = r.item46;
      r.overThreshold = false;
    }

    // Schedule III — tax credits/payments
    r.item56 = round2(num(input.prevQuartersTax));
    r.item57 = round2(num(input.creditableWithheldPrev));
    r.item58 = round2(num(input.creditableWithheld));
    r.totalCredits = round2(r.item56 + r.item57 + r.item58);   // Item 62
    r.net = round2(r.taxDue - r.totalCredits);                 // Item 63
    r.payable = Math.max(0, r.net);
    r.overpayment = Math.max(0, -r.net);
    return r;
  }

  /*
   * 2551Q (per quarter, NOT cumulative).
   * input: { grossSalesQuarter, creditableWithheld }
   */
  function compute2551Q(input) {
    var gross = round2(num(input.grossSalesQuarter));
    var cwt = round2(num(input.creditableWithheld));
    var taxDue = round2(gross * RULES.percentageTax.rate);
    var net = round2(taxDue - cwt);
    return {
      atc: RULES.percentageTax.atc,
      rate: RULES.percentageTax.rate,
      taxableAmount: gross,       // Schedule 1, Item 1
      taxDue: taxDue,             // Schedule 1, Item 1 tax due / Item 7 / Item 14
      item14: taxDue,
      item15: cwt,
      item18: cwt,
      item19: net,
      payable: Math.max(0, net),
      overpayment: Math.max(0, -net)
    };
  }

  // Deadline(s) for a quarter. Returns {year, month, day} or null.
  function deadlineFor(form, quarter, year) {
    var table = RULES.deadlines[form];
    var d = table && table[Number(quarter)];
    if (!d) return null;
    return { year: Number(year) + (d.nextYear ? 1 : 0), month: d.month, day: d.day };
  }

  var api = {
    round2: round2,
    formatPeso: formatPeso,
    parseAmount: parseAmount,
    graduatedTax: graduatedTax,
    returnsFor: returnsFor,
    compute1701Q: compute1701Q,
    compute2551Q: compute2551Q,
    deadlineFor: deadlineFor
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.QTW_CALC = api;
  }
})(this);
