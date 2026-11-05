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
   * 1701Q (cumulative / year-to-date).
   * input: {
   *   option: '8' | 'graduated',
   *   incomeType: 'pure' | 'mixed',
   *   deduction: 'itemized' | 'osd'       (graduated only)
   *   grossSalesYTD, costOfSalesYTD, expensesYTD, otherIncomeYTD,
   *   prevQuartersTax,                    (tax due/paid in previous quarters this year)
   *   creditableWithheld                  (BIR Form 2307, this quarter)
   * }
   */
  function compute1701Q(input) {
    var gross = round2(num(input.grossSalesYTD));
    var other = round2(num(input.otherIncomeYTD));
    var prev = round2(num(input.prevQuartersTax));
    var cwt = round2(num(input.creditableWithheld));
    var r = {
      option: input.option,
      incomeType: input.incomeType,
      deduction: input.option === 'graduated' ? input.deduction : null,
      grossSalesYTD: gross,
      otherIncomeYTD: other,
      costOfSalesYTD: 0,
      expensesYTD: 0,
      osd: 0,
      reduction: 0,
      taxableIncome: 0,
      taxDue: 0
    };

    if (input.option === '8') {
      r.reduction = input.incomeType === 'pure' ? RULES.eightPercent.reductionPureOnly : 0;
      r.taxableIncome = round2(Math.max(0, gross + other - r.reduction));
      r.taxDue = round2(r.taxableIncome * RULES.eightPercent.rate);
    } else {
      if (r.deduction === 'osd') {
        r.osd = round2(gross * RULES.osdRate);
        r.taxableIncome = round2(gross - r.osd + other);
      } else {
        r.costOfSalesYTD = round2(num(input.costOfSalesYTD));
        r.expensesYTD = round2(num(input.expensesYTD));
        r.taxableIncome = round2(gross - r.costOfSalesYTD - r.expensesYTD + other);
      }
      r.taxDue = graduatedTax(r.taxableIncome);
    }

    r.prevQuartersTax = prev;
    r.creditableWithheld = cwt;
    r.totalCredits = round2(prev + cwt);
    r.net = round2(r.taxDue - r.totalCredits);
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
