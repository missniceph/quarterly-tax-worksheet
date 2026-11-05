/*
 * APP — the screens and buttons. Wording lives in i18n.js, numbers in
 * rules.js, and the math in calc.js. Nothing is saved or sent anywhere:
 * everything lives in the `state` object below and is gone when the page closes.
 */
(function () {
  'use strict';

  var RULES = window.QTW_RULES;
  var CALC = window.QTW_CALC;
  var I18N = window.QTW_I18N;

  var THIS_YEAR = new Date().getFullYear();

  // ---------- State (in memory only) ----------
  function freshState() {
    return {
      step: 'option',
      option: null,        // '8' | 'graduated'
      notSure: false,
      year: Math.max(RULES.firstYear, THIS_YEAR),
      quarter: null,       // 1-4
      incomeType: null,    // 'pure' | 'mixed'
      deduction: null,     // 'itemized' | 'osd'
      raw: {},             // what the user typed, by field id
      values: {},          // parsed numbers, by field id
      error: null
    };
  }
  var state = freshState();
  var lang = pickInitialLang();

  function pickInitialLang() {
    var m = /[?&]lang=(en|fil)\b/.exec(location.search);
    if (m) return m[1];
    var nav = (navigator.language || '').toLowerCase();
    return (nav.indexOf('fil') === 0 || nav.indexOf('tl') === 0) ? 'fil' : 'en';
  }

  // ---------- Helpers ----------
  function t(key, vars) { return I18N.translate(lang, key, vars); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var peso = CALC.formatPeso;
  function pesoParens(n) { return n < 0 ? '(' + peso(-n) + ')' : peso(n); }
  function monthName(m) { return t('m' + m); }
  function formatDate(d) { return monthName(d.month) + ' ' + d.day + ', ' + d.year; }
  // 0 = Sunday, 6 = Saturday. Returns the day-name key if the date is on a weekend.
  function weekendKey(d) {
    var wd = new Date(d.year, d.month - 1, d.day).getDay();
    return wd === 0 ? 'day.sun' : wd === 6 ? 'day.sat' : null;
  }
  function qLabel(q) { return 'Q' + q; }
  function itemLabel(item) { return item === RULES.CONFIRM ? 'Item ' + RULES.CONFIRM : item; }
  function itemHtml(item) {
    return item === RULES.CONFIRM
      ? 'Item <span class="confirm">' + esc(RULES.CONFIRM) + '</span>'
      : esc(item);
  }

  // ---------- Fields (step 5) ----------
  var FIELDS = {
    grossYTD:    { form: '1701Q', label: 'f.grossYTD',    help: 'f.grossYTD.help',    hint: 'ytd',     required: true },
    costYTD:     { form: '1701Q', label: 'f.costYTD',     help: 'f.costYTD.help',     hint: 'ytd' },
    expensesYTD: { form: '1701Q', label: 'f.expensesYTD', help: 'f.expensesYTD.help', hint: 'ytd' },
    otherYTD:    { form: '1701Q', label: 'f.otherYTD',    help: 'f.otherYTD.help',    hint: 'ytd' },
    prevTax:     { form: '1701Q', label: 'f.prevTax',     help: 'f.prevTax.help' },
    cwtPrev1701: { form: '1701Q', label: 'f.cwtPrev1701', help: 'f.cwtPrev1701.help' },
    cwt1701:     { form: '1701Q', label: 'f.cwt1701',     help: 'f.cwt1701.help',     hint: 'quarter' },
    gross2551:   { form: '2551Q', label: 'f.gross2551',   help: 'f.gross2551.help',   hint: 'quarter', required: true },
    cwt2551:     { form: '2551Q', label: 'f.cwt2551',     help: 'f.cwt2551.help',     hint: 'quarter' }
  };

  function returns() {
    return CALC.returnsFor(state.option, state.quarter);
  }

  // The list of screens depends on the answers so far.
  function steps() {
    var list = ['option'];
    if (!state.option) return list;
    list.push('period');
    if (!state.quarter) return list;
    var r = returns();
    if (r.has1701Q) {
      list.push('incomeType');
      if (state.option === 'graduated') list.push('deduction');
      list.push('grossYTD');
      if (state.option === 'graduated' && state.deduction !== 'osd') list.push('costYTD', 'expensesYTD');
      list.push('otherYTD');
      if (state.quarter > 1) list.push('prevTax', 'cwtPrev1701');
      list.push('cwt1701');
    }
    if (r.has2551Q) list.push('gross2551', 'cwt2551');
    list.push('results');
    return list;
  }

  function val(id) {
    var v = state.values[id];
    return typeof v === 'number' ? v : 0;
  }

  // ---------- Computation ----------
  function computeAll() {
    var r = returns();
    var out = { r: r, c1701: null, c2551: null };
    if (r.has1701Q) {
      out.c1701 = CALC.compute1701Q({
        option: state.option,
        incomeType: state.incomeType,
        deduction: state.deduction,
        grossSalesYTD: val('grossYTD'),
        costOfSalesYTD: val('costYTD'),
        expensesYTD: val('expensesYTD'),
        otherIncomeYTD: val('otherYTD'),
        prevQuartersTax: state.quarter > 1 ? val('prevTax') : 0,
        creditableWithheldPrev: state.quarter > 1 ? val('cwtPrev1701') : 0,
        creditableWithheld: val('cwt1701')
      });
    }
    if (r.has2551Q) {
      out.c2551 = CALC.compute2551Q({
        grossSalesQuarter: val('gross2551'),
        creditableWithheld: val('cwt2551')
      });
    }
    return out;
  }

  // Rows for the "Your results" breakdown. Each: {label, value, cls}
  function breakdown1701(c) {
    var rows = [{ label: t('row.grossYTD'), value: peso(c.grossSalesYTD) }];
    if (c.option === '8') {
      if (c.otherIncomeYTD) rows.push({ label: t('row.otherYTD'), value: peso(c.otherIncomeYTD) });
      if (c.incomeType === 'pure') rows.push({ label: t('row.reduction'), value: '(' + peso(c.reduction) + ')' });
      else rows.push({ label: t('row.noReduction'), value: peso(0), cls: 'muted' });
      rows.push({ label: t('row.taxable'), value: pesoParens(c.taxableIncome), cls: 'strong' });
      rows.push({ label: t('row.taxDueYTD8'), value: peso(c.taxDue), cls: 'strong' });
    } else {
      if (c.deduction === 'osd') {
        rows.push({ label: t('row.osd'), value: '(' + peso(c.osd) + ')' });
      } else {
        rows.push({ label: t('row.costYTD'), value: '(' + peso(c.costOfSalesYTD) + ')' });
        rows.push({ label: t('row.expensesYTD'), value: '(' + peso(c.expensesYTD) + ')' });
      }
      if (c.otherIncomeYTD) rows.push({ label: t('row.otherYTD'), value: peso(c.otherIncomeYTD) });
      rows.push({ label: t('row.taxable'), value: pesoParens(c.taxableIncome), cls: 'strong' });
      rows.push({ label: t('row.taxDueYTDgrad'), value: peso(c.taxDue), cls: 'strong' });
    }
    if (state.quarter > 1) {
      rows.push({ label: t('row.prevTax'), value: '(' + peso(c.prevQuartersTax) + ')' });
      rows.push({ label: t('row.cwtPrev1701'), value: '(' + peso(c.creditableWithheldPrev) + ')' });
    }
    rows.push({ label: t('row.cwt1701'), value: '(' + peso(c.creditableWithheld) + ')' });
    rows.push(c.overpayment > 0
      ? { label: t('row.overpayment'), value: '(' + peso(c.overpayment) + ')', cls: 'final over' }
      : { label: t('row.payable'), value: peso(c.payable), cls: 'final' });
    return rows;
  }

  function breakdown2551(c) {
    return [
      { label: t('row.gross2551'), value: peso(c.taxableAmount) },
      { label: t('row.taxDue2551'), value: peso(c.taxDue), cls: 'strong' },
      { label: t('row.cwt2551'), value: '(' + peso(c.item15) + ')' },
      c.overpayment > 0
        ? { label: t('row.overpayment'), value: '(' + peso(c.overpayment) + ')', cls: 'final over' }
        : { label: t('row.payable'), value: peso(c.payable), cls: 'final' }
    ];
  }

  // Extra cautions shown under the 1701Q result.
  function resultNotes1701(c) {
    var notes = [];
    if (c.overThreshold) notes.push('note.over3m');
    if (c.option === 'graduated' && c.incomeType === 'mixed') notes.push('note.mixedGraduated');
    return notes;
  }

  function optionLabel() { return t('res.option.' + state.option); }

  // "What to enter in eBIRForms" — one model used for both screen and copied text.
  // Each row: {item, what, value} or {group: 'title'}
  function ebirModel(all) {
    var forms = [];
    var I1 = RULES.items1701Q;
    var I2 = RULES.items2551Q;
    var q = state.quarter;

    if (all.c1701) {
      var c = all.c1701;
      var atcs = RULES.atc1701Q[state.incomeType][state.option].map(function (x) {
        return x.code + ' (' + t('atc.' + x.kind) + ')';
      }).join(t('atc.or'));
      var rows = [
        { group: t('ebir.part1') },
        { item: I1.year, what: t('label.year'), value: String(state.year) },
        { item: I1.quarter, what: t('ebir.quarter'), value: qLabel(q) },
        { item: I1.atc, what: 'ATC', value: atcs },
        { item: I1.taxRateOption, what: t('ebir.taxRate'),
          value: q === 1 ? t('ebir.taxRate.q1.' + state.option) : t('ebir.taxRate.later', { option: optionLabel() }) }
      ];
      if (c.option === 'graduated') {
        rows.push({ item: I1.deductionMethod, what: t('ebir.deduction'),
          value: c.deduction === 'osd' ? t('opt.osd') : t('opt.itemized') });
        rows.push({ group: t('ebir.sched.grad') });
        rows.push({ item: I1.gradGrossSales, what: t('row.grossYTD'), value: peso(c.grossSalesYTD) });
        if (c.deduction === 'osd') {
          rows.push({ item: I1.gradOsd, what: t('row.osd'), value: peso(c.osd) });
        } else {
          rows.push({ item: I1.gradCostOfSales, what: t('row.costYTD'), value: peso(c.costOfSalesYTD) });
          rows.push({ item: I1.gradExpenses, what: t('row.expensesYTD'), value: peso(c.expensesYTD) });
        }
        rows.push({ item: I1.gradOtherIncome, what: t('row.otherYTD'), value: peso(c.otherIncomeYTD) });
        rows.push({ item: I1.gradTaxableIncome, what: t('row.taxable'), value: pesoParens(c.taxableIncome) });
        rows.push({ item: I1.gradTaxDue, what: t('row.taxDueYTDgrad'), value: peso(c.taxDue) });
      } else {
        rows.push({ group: t('ebir.sched.8') });
        rows.push({ item: I1.eightGrossSales, what: t('row.grossYTD'), value: peso(c.grossSalesYTD) });
        rows.push({ item: I1.eightOtherIncome, what: t('row.otherYTD'), value: peso(c.otherIncomeYTD) });
        rows.push({ item: I1.eightReduction,
          what: c.incomeType === 'pure' ? t('row.reduction') : t('row.noReduction'),
          value: peso(c.reduction) });
        rows.push({ item: I1.eightTaxableIncome, what: t('row.taxable'), value: peso(c.taxableIncome) });
        rows.push({ item: I1.eightTaxDue, what: t('row.taxDueYTD8'), value: peso(c.taxDue) });
      }
      rows.push({ group: t('ebir.credits') });
      if (q > 1) {
        rows.push({ item: I1.prevQuartersTax, what: t('row.prevTax'), value: peso(c.prevQuartersTax) });
        rows.push({ item: I1.prevQuartersCwt, what: t('row.cwtPrev1701'), value: peso(c.creditableWithheldPrev) });
      }
      rows.push({ item: I1.creditableWithheld, what: t('row.cwt1701'), value: peso(c.creditableWithheld) });
      rows.push({ item: I1.totalCredits, what: t('ebir.totalCredits'), value: peso(c.totalCredits) });
      rows.push({ item: I1.taxPayableSchedule, what: t('ebir.taxPayable'), value: pesoParens(c.net) });
      rows.push({ group: t('ebir.part3') });
      rows.push({ item: I1.partIIITaxDue, what: t('ebir.1701.item26'), value: peso(c.taxDue) });
      rows.push({ item: I1.partIIICredits, what: t('ebir.1701.item27'), value: peso(c.totalCredits) });
      rows.push({ item: I1.partIIITaxPayable, what: t('ebir.1701.item28'), value: pesoParens(c.net), strong: true });
      rows.push({ item: I1.partIIIPenalties, what: t('ebir.penalties'), value: t('ebir.1701.penalties.note') });
      rows.push({ item: I1.partIIITotalPayable, what: t('ebir.1701.item30'), value: pesoParens(c.net), strong: true });
      if (c.creditableWithheld + c.creditableWithheldPrev > 0) rows.push({ item: t('ebir.attach'), what: t('ebir.attach.2307'), value: '\u2713', plain: true });
      forms.push({ title: t('ebir.1701.title'), rows: rows });
    }

    if (all.c2551) {
      var p = all.c2551;
      var r2 = [
        { item: I2.quarter, what: t('ebir.quarter'), value: qLabel(q) },
        { item: I2.taxRateOption, what: t('ebir.taxRate'),
          value: q === 1 ? t('ebir.taxRate.q1.graduated') : t('ebir.taxRate.2551.later') },
        { group: 'Schedule 1' },
        { item: I2.schedule1Line, what: 'ATC', value: t('ebir.atc') },
        { item: I2.schedule1Line, what: t('ebir.taxableAmount'), value: peso(p.taxableAmount) },
        { item: I2.schedule1Line, what: t('ebir.taxRateCol'), value: Math.round(p.rate * 100) + '%' },
        { item: I2.schedule1Line, what: t('ebir.taxDue'), value: peso(p.taxDue) },
        { item: I2.schedule1Total, what: t('ebir.sched1Total'), value: peso(p.taxDue) },
        { group: 'Part II' },
        { item: I2.totalTaxDue, what: t('ebir.item14'), value: peso(p.item14) },
        { item: I2.creditableWithheld, what: t('ebir.item15'), value: peso(p.item15) },
        { item: I2.totalCredits, what: t('ebir.item18'), value: peso(p.item18) },
        { item: I2.taxStillPayable, what: t('ebir.item19'), value: pesoParens(p.item19), strong: true },
        { item: I2.penalties, what: t('ebir.penalties'), value: t('ebir.penalties.note') },
        { item: I2.totalAmountPayable, what: t('ebir.item24') + ' (' + t('ebir.item24.note') + ')', value: pesoParens(p.item19), strong: true }
      ];
      if (p.item15 > 0) r2.push({ item: t('ebir.attach'), what: t('ebir.attach.2307'), value: '✓', plain: true });
      forms.push({ title: t('ebir.2551.title'), rows: r2 });
    }
    return forms;
  }

  function deadlineModel() {
    var out = [];
    var q = state.quarter, y = state.year, r = returns();
    if (r.has1701Q) {
      var d1 = CALC.deadlineFor('form1701Q', q, y);
      out.push({ label: t('dl.1701', { quarter: qLabel(q), year: y }), date: formatDate(d1), weekend: weekendKey(d1) });
    }
    if (r.has2551Q) {
      var d2 = CALC.deadlineFor('form2551Q', q, y);
      out.push({ label: t('dl.2551', { quarter: qLabel(q), year: y }), date: formatDate(d2), weekend: weekendKey(d2) });
    }
    if (q === 4) out.push({ label: t('dl.no1701Q4'), date: '' });
    return out;
  }

  // ---------- Rendering ----------
  var screen = document.getElementById('screen');

  function explain(textKeyOrKeys) {
    var keys = [].concat(textKeyOrKeys);
    return '<details class="explain"><summary>' + esc(t('whatIsThis')) + '</summary>' +
      keys.map(function (k) { return '<p>' + esc(t(k)) + '</p>'; }).join('') + '</details>';
  }

  function heading(text) {
    return '<h2 class="q" id="q" tabindex="-1">' + esc(text) + '</h2>';
  }

  function choice(value, current, titleKey, subKey, name) {
    return '<button type="button" class="choice" data-choice="' + name + '" data-value="' + value +
      '" aria-pressed="' + (String(current) === String(value)) + '"><strong>' + esc(t(titleKey)) + '</strong>' +
      (subKey ? '<small>' + esc(t(subKey)) + '</small>' : '') + '</button>';
  }

  function nav(opts) {
    opts = opts || {};
    var html = '<div class="nav">';
    if (!opts.noBack) html += '<button type="button" class="btn secondary" data-action="back">' + esc(t('btn.back')) + '</button>';
    if (!opts.noNext) html += '<button type="button" class="btn primary" data-action="next">' + esc(t(opts.nextKey || 'btn.next')) + '</button>';
    return html + '</div>';
  }

  function errorHtml() {
    return '<p class="error" id="err" role="alert">' + (state.error ? esc(t(state.error)) : '') + '</p>';
  }

  function renderOption() {
    var html = heading(t('q.option')) +
      explain(['q.option.help', 'q.option.help3m']) +
      '<div class="choices" role="group" aria-labelledby="q">' +
      choice('8', state.notSure ? '' : state.option, 'opt.8', 'opt.8.sub', 'option') +
      choice('graduated', state.notSure ? '' : state.option, 'opt.graduated', 'opt.graduated.sub', 'option') +
      choice('notSure', state.notSure ? 'notSure' : '', 'opt.notSure', 'opt.notSure.sub', 'option') +
      '</div>';
    if (state.notSure) {
      html += '<div class="note" id="not-sure-note"><h3>' + esc(t('notSure.title')) + '</h3><p>' +
        esc(t('notSure.body')) + '</p><p><strong>' + esc(t('notSure.pick')) + '</strong></p>' +
        '<div class="choices cols-2" role="group" aria-label="' + esc(t('notSure.pick')) + '">' +
        choice('8', state.option, 'opt.8', null, 'optionAfter') +
        choice('graduated', state.option, 'opt.graduated', null, 'optionAfter') +
        '</div></div>';
    }
    return html + errorHtml() + nav({ noBack: true });
  }

  function renderPeriod() {
    var years = '';
    for (var y = RULES.firstYear; y <= THIS_YEAR + 1; y++) {
      years += '<option value="' + y + '"' + (y === state.year ? ' selected' : '') + '>' + y + '</option>';
    }
    var html = heading(t('q.period')) +
      explain('q.period.help') +
      '<div class="field-group"><label class="small-label" for="year">' + esc(t('label.year')) + '</label>' +
      '<select id="year" class="big">' + years + '</select></div>' +
      '<div class="field-group"><span class="small-label" id="quarter-label">' + esc(t('label.quarter')) + '</span>' +
      '<div class="choices cols-2" role="group" aria-labelledby="quarter-label">' +
      [1, 2, 3, 4].map(function (q) { return choice(q, state.quarter, 'q' + q, null, 'quarter'); }).join('') +
      '</div></div>';
    if (state.quarter === 4) {
      html += '<div class="note" id="q4-note"><p>' +
        esc(t(state.option === '8' ? 'q4.eight' : 'q4.graduated')) + '</p></div>';
    }
    return html + errorHtml() + nav();
  }

  function renderIncomeType() {
    var helps = ['q.incomeType.help'];
    if (state.option === '8') helps.push('q.incomeType.help8');
    else helps.push('note.mixedGraduated');
    return '<span class="section-tag">' + esc(t('section.1701Q')) + '</span>' +
      heading(t('q.incomeType')) +
      explain(helps) +
      '<div class="choices" role="group" aria-labelledby="q">' +
      choice('pure', state.incomeType, 'opt.pure', 'opt.pure.sub', 'incomeType') +
      choice('mixed', state.incomeType, 'opt.mixed', 'opt.mixed.sub', 'incomeType') +
      '</div>' + errorHtml() + nav();
  }

  function renderDeduction() {
    return '<span class="section-tag">' + esc(t('section.1701Q')) + '</span>' +
      heading(t('q.deduction')) +
      explain('q.deduction.help') +
      '<div class="choices" role="group" aria-labelledby="q">' +
      choice('itemized', state.deduction, 'opt.itemized', 'opt.itemized.sub', 'deduction') +
      choice('osd', state.deduction, 'opt.osd', 'opt.osd.sub', 'deduction') +
      '</div>' + errorHtml() + nav();
  }

  function renderField(id) {
    var f = FIELDS[id];
    var q = state.quarter;
    var hint = '';
    if (f.hint === 'ytd') hint = t('ytdHint', { end: monthName(q * 3) + ' ' + new Date(state.year, q * 3, 0).getDate(), year: state.year });
    if (f.hint === 'quarter') hint = t('quarterHint', { start: monthName(q * 3 - 2) + ' 1', end: monthName(q * 3) + ' ' + new Date(state.year, q * 3, 0).getDate(), year: state.year });
    var raw = state.raw[id] !== undefined ? state.raw[id] : '';
    var isLast = steps()[steps().indexOf(id) + 1] === 'results';
    return '<span class="section-tag">' + esc(t('section.' + f.form)) + '</span>' +
      '<h2 class="q" id="q" tabindex="-1"><label class="field-label" for="amount">' + esc(t(f.label, { year: state.year })) + '</label></h2>' +
      (hint ? '<p class="hint" id="hint1">' + esc(hint) + '</p>' : '') +
      (!f.required ? '<p class="hint" id="hint2">' + esc(t('optionalHint')) + '</p>' : '') +
      '<div class="money"><span aria-hidden="true">₱</span>' +
      '<input id="amount" type="text" inputmode="decimal" autocomplete="off" enterkeyhint="next" ' +
      'aria-describedby="' + ['err', hint ? 'hint1' : '', !f.required ? 'hint2' : ''].join(' ').trim() + '"' +
      (f.required ? ' aria-required="true"' : '') + ' placeholder="0.00" value="' + esc(raw) + '"' +
      (state.error ? ' aria-invalid="true"' : '') + '></div>' +
      errorHtml() +
      explain(f.help) +
      nav({ nextKey: isLast ? 'btn.seeResults' : 'btn.next' });
  }

  function rowsTable(rows) {
    return '<table class="rows"><tbody>' + rows.map(function (r) {
      return '<tr class="' + (r.cls || '') + '"><td>' + esc(r.label) + '</td><td class="amt">' + esc(r.value) + '</td></tr>';
    }).join('') + '</tbody></table>';
  }

  function renderResults() {
    var all = computeAll();
    var r = all.r;
    var html = heading(t('res.title'));
    var introBits = [qLabel(state.quarter) + ' ' + state.year, optionLabel()];
    if (r.has1701Q && state.incomeType) introBits.push(t('opt.' + state.incomeType));
    if (r.has1701Q && state.option === 'graduated' && state.deduction) introBits.push(state.deduction === 'osd' ? 'OSD' : t('opt.itemized'));
    html += '<p class="hint">' + esc(introBits.join(' · ')) + '</p>';

    if (!r.has1701Q && !r.has2551Q) {
      html += '<div class="note" id="nothing-note"><h3>' + esc(t('res.nothing.title')) + '</h3><p>' + esc(t('q4.eight')) + '</p></div>';
      html += '<div class="nav"><button type="button" class="btn secondary" data-action="back">' + esc(t('btn.back')) + '</button>' +
        '<button type="button" class="btn primary" data-action="start-over">' + esc(t('btn.startOver')) + '</button></div>';
      return html;
    }

    if (state.option === 'graduated' && state.quarter === 4) {
      html += '<div class="note"><p>' + esc(t('q4.graduated')) + '</p></div>';
    }

    var total = 0;
    if (all.c1701) {
      total += all.c1701.payable;
      html += '<div class="result-card" id="res-1701"><h3>' + esc(t('res.1701.title')) + '</h3>' +
        '<p class="hint">' + esc(t('res.1701.help')) + '</p>' + rowsTable(breakdown1701(all.c1701)) +
        (all.c1701.overpayment > 0 ? '<p class="hint">' + esc(t('overpayment.note')) + '</p>' : '') +
        resultNotes1701(all.c1701).map(function (k) { return '<div class="note" data-note="' + k + '"><p>' + esc(t(k)) + '</p></div>'; }).join('') +
        '</div>';
    }
    if (all.c2551) {
      total += all.c2551.payable;
      html += '<div class="result-card" id="res-2551"><h3>' + esc(t('res.2551.title')) + '</h3>' +
        '<p class="hint">' + esc(t('res.2551.help')) + '</p>' + rowsTable(breakdown2551(all.c2551)) +
        (all.c2551.overpayment > 0 ? '<p class="hint">' + esc(t('overpayment.note')) + '</p>' : '') + '</div>';
    }
    html += '<div class="total" id="total"><div class="lbl">' + esc(t('total.label')) + '</div>' +
      '<div class="val">' + esc(peso(total)) + '</div><div class="sub">' + esc(t('total.help')) + '</div></div>';

    // eBIRForms summary
    html += '<div class="result-card ebir" id="ebir"><h3>' + esc(t('ebir.title')) + '</h3>' +
      '<p class="hint">' + esc(t('ebir.help')) + '</p>';
    ebirModel(all).forEach(function (form) {
      html += '<h4>' + esc(form.title) + '</h4><table role="table" aria-label="' + esc(form.title) + '"><thead role="rowgroup"><tr role="row">' +
        '<th scope="col" role="columnheader">' + esc(t('ebir.col.item')) + '</th><th scope="col" role="columnheader">' + esc(t('ebir.col.what')) +
        '</th><th scope="col" role="columnheader">' + esc(t('ebir.col.enter')) + '</th></tr></thead><tbody role="rowgroup">';
      form.rows.forEach(function (row) {
        if (row.group) { html += '<tr class="group" role="row"><td colspan="3" role="cell">' + esc(row.group) + '</td></tr>'; return; }
        var long = String(row.value).length > 16;
        html += '<tr role="row"><td class="item" role="cell">' + (row.plain ? esc(row.item) : itemHtml(row.item)) + '</td><td class="what" role="cell">' + esc(row.what) +
          '</td><td class="val' + (long ? ' long' : '') + (row.strong ? ' strong' : '') + '" role="cell">' + esc(row.value) + '</td></tr>';
      });
      html += '</tbody></table>';
    });
    html += '</div>';

    // Deadlines
    html += '<div class="result-card" id="deadlines"><h3>' + esc(t('dl.title')) + '</h3><ul class="deadlines">' +
      deadlineModel().map(function (d) {
        return '<li><span>' + esc(d.label) + '</span>' + (d.date ? '<strong>' + esc(d.date) + '</strong>' : '') +
          (d.weekend ? '<span class="weekend">' + esc(t('dl.weekend', { day: t(d.weekend) })) + '</span>' : '') + '</li>';
      }).join('') + '</ul>' + explain('dl.help') + '</div>';

    html += '<div id="copy-area"><button type="button" class="btn primary full" data-action="copy">' +
      esc(t('btn.copy')) + '</button><p class="copy-status" id="copy-status" role="status"></p></div>';
    html += '<div class="nav"><button type="button" class="btn secondary" data-action="back">' + esc(t('btn.back')) + '</button>' +
      '<button type="button" class="btn secondary grow" data-action="start-over">' + esc(t('btn.startOver')) + '</button></div>';
    return html;
  }

  // Plain-text summary for the "Copy my summary" button.
  function summaryText() {
    var all = computeAll();
    var r = all.r;
    var lines = [t('copy.header'), t('banner'), ''];
    var head = [qLabel(state.quarter) + ' ' + state.year, optionLabel()];
    if (r.has1701Q && state.incomeType) head.push(t('opt.' + state.incomeType));
    if (r.has1701Q && state.option === 'graduated' && state.deduction) head.push(state.deduction === 'osd' ? 'OSD' : t('opt.itemized'));
    lines.push(head.join(' · '), '');

    if (!r.has1701Q && !r.has2551Q) {
      lines.push(t('res.nothing.title'), t('q4.eight'), '');
    } else {
      var total = 0;
      if (all.c1701) {
        total += all.c1701.payable;
        lines.push(t('res.1701.title'));
        breakdown1701(all.c1701).forEach(function (row) { lines.push('  ' + row.label + ': ' + row.value); });
        resultNotes1701(all.c1701).forEach(function (k) { lines.push('  ! ' + t(k)); });
        lines.push('');
      }
      if (all.c2551) {
        total += all.c2551.payable;
        lines.push(t('res.2551.title'));
        breakdown2551(all.c2551).forEach(function (row) { lines.push('  ' + row.label + ': ' + row.value); });
        lines.push('');
      }
      lines.push(t('total.label') + ': ' + peso(total) + ' (' + t('total.help') + ')', '');
      lines.push(t('ebir.title').toUpperCase());
      ebirModel(all).forEach(function (form) {
        lines.push('', form.title);
        form.rows.forEach(function (row) {
          if (row.group) { lines.push('  [' + row.group + ']'); return; }
          lines.push('  ' + (row.plain ? row.item : itemLabel(row.item)) + ' — ' + row.what + ': ' + row.value);
        });
      });
      lines.push('', t('dl.title').toUpperCase());
      deadlineModel().forEach(function (d) {
        lines.push('  ' + d.label + (d.date ? ': ' + d.date : ''));
        if (d.weekend) lines.push('    ' + t('dl.weekend', { day: t(d.weekend) }));
      });
      lines.push('');
    }
    lines.push(t('footer.disclaimer'), RULES.asOf[lang], 'instagram.com/missniceph');
    return lines.join('\n');
  }

  var lastProgress = '';
  function renderProgress() {
    var list = steps();
    var el = document.getElementById('progress');
    var live = document.getElementById('progress-live');
    var i = list.indexOf(state.step);
    var known = list[list.length - 1] === 'results';
    var text = (!known || state.step === 'results') ? '' : t('progress', { n: i + 1, total: list.length });
    if (text === lastProgress) return;
    lastProgress = text;
    live.textContent = text;
    if (!text) { el.innerHTML = ''; return; }
    var pct = Math.round(((i + 1) / list.length) * 100);
    el.innerHTML = '<span aria-hidden="true">' + esc(text) + '</span>' +
      '<div class="bar" aria-hidden="true"><span style="width:' + pct + '%"></span></div>';
  }

  function renderChrome() {
    document.documentElement.lang = lang === 'fil' ? 'fil' : 'en';
    document.getElementById('banner').textContent = t('banner');
    document.getElementById('banner-region').setAttribute('aria-label', t('banner.label'));
    document.getElementById('skip-link').textContent = t('skip');
    document.title = t('app.title') + ' \u00b7 ' + t('app.titleSuffix');
    document.getElementById('app-title').textContent = t('app.title');
    document.getElementById('app-by').textContent = t('app.by');
    document.getElementById('tagline').textContent = t('app.tagline');
    document.getElementById('privacy').textContent = t('privacy');
    document.getElementById('start-over').textContent = t('btn.startOver');
    document.getElementById('lang-group').setAttribute('aria-label', t('lang.label'));
    Array.prototype.forEach.call(document.querySelectorAll('[data-lang]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    updateThemeButton();
    document.getElementById('footer').innerHTML =
      '<p><strong>' + esc(t('footer.disclaimer')) + '</strong></p>' +
      '<p>' + esc(RULES.asOf[lang]) + '</p>' +
      '<p>' + esc(t('footer.sources')) + ':</p><ul>' +
      '<li>TRAIN Law (Republic Act No. 10963)</li><li>Revenue Memorandum Circular (RMC) No. 26-2018</li>' +
      '<li>RMC No. 32-2018</li><li>RMC No. 69-2023</li>' +
      '<li>' + esc(t('footer.rr82018')) + '</li></ul>' +
      '<p>' + esc(t('footer.made')) + ' · <a href="https://instagram.com/missniceph" target="_blank" rel="noopener noreferrer">' +
      esc(t('footer.follow')) + '</a></p>';
  }

  var renderedStep = null;
  function render(focus) {
    renderChrome();
    renderProgress();
    var s = state.step;
    var openDetails = [];
    if (renderedStep === s) {
      Array.prototype.forEach.call(screen.querySelectorAll('details'), function (d, i) { if (d.open) openDetails.push(i); });
    }
    var html;
    if (s === 'option') html = renderOption();
    else if (s === 'period') html = renderPeriod();
    else if (s === 'incomeType') html = renderIncomeType();
    else if (s === 'deduction') html = renderDeduction();
    else if (s === 'results') html = renderResults();
    else html = renderField(s);
    screen.innerHTML = html;
    renderedStep = s;
    var details = screen.querySelectorAll('details');
    openDetails.forEach(function (i) { if (details[i]) details[i].open = true; });
    if (focus) {
      var input = document.getElementById('amount');
      var h = document.getElementById('q');
      if (input) input.focus();
      else if (h) h.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }

  // ---------- Navigation ----------
  function readCurrentField() {
    var id = state.step;
    if (!FIELDS[id]) return true;
    var input = document.getElementById('amount');
    var raw = input ? input.value : (state.raw[id] || '');
    state.raw[id] = raw;
    var v = CALC.parseAmount(raw);
    if (v === null) {
      if (FIELDS[id].required) { state.error = 'err.required'; return false; }
      state.values[id] = 0;
      return true;
    }
    if (isNaN(v)) { state.error = 'err.invalid'; return false; }
    if (v < 0) { state.error = 'err.negative'; return false; }
    state.values[id] = v;
    return true;
  }

  function validateStep() {
    state.error = null;
    var s = state.step;
    if (s === 'option' && !state.option) state.error = 'err.pickOne';
    if (s === 'period' && !state.quarter) state.error = 'err.pickOne';
    if (s === 'incomeType' && !state.incomeType) state.error = 'err.pickOne';
    if (s === 'deduction' && !state.deduction) state.error = 'err.pickOne';
    if (state.error) return false;
    return readCurrentField();
  }

  function goNext() {
    if (!validateStep()) {
      render(false);
      var input = document.getElementById('amount');
      if (input) input.focus();
      return;
    }
    var list = steps();
    var i = list.indexOf(state.step);
    if (i >= 0 && i < list.length - 1) state.step = list[i + 1];
    render(true);
  }

  function goBack() {
    if (FIELDS[state.step]) {
      var input = document.getElementById('amount');
      if (input) state.raw[state.step] = input.value;
    }
    state.error = null;
    var list = steps();
    var i = list.indexOf(state.step);
    if (i > 0) state.step = list[i - 1];
    render(true);
  }

  function startOver() {
    var hasData = Object.keys(state.raw).length > 0 || state.option || state.quarter;
    if (hasData && !window.confirm(t('confirm.startOver'))) return;
    state = freshState();
    renderedStep = null;
    render(true);
  }

  function copySummary() {
    var text = summaryText();
    var status = document.getElementById('copy-status');
    function fallback() {
      status.textContent = t('btn.copyFailed');
      var ta = document.getElementById('copy-fallback');
      if (!ta) {
        ta = document.createElement('textarea');
        ta.id = 'copy-fallback';
        ta.className = 'copy-fallback';
        ta.readOnly = true;
        status.parentNode.appendChild(ta);
      }
      ta.value = text;
      ta.focus();
      ta.select();
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        status.textContent = t('btn.copied');
      }, fallback);
    } else {
      fallback();
    }
  }

  // ---------- Theme (not saved) ----------
  function isDark() {
    var forced = document.documentElement.getAttribute('data-theme');
    if (forced) return forced === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function updateThemeButton() {
    var btn = document.getElementById('theme-btn');
    var dark = isDark();
    btn.textContent = dark ? '☀' : '☾';
    btn.setAttribute('aria-label', t(dark ? 'theme.toLight' : 'theme.toDark'));
    btn.title = t(dark ? 'theme.toLight' : 'theme.toDark');
  }

  // ---------- Events ----------
  screen.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    var name = btn.getAttribute('data-choice');
    if (name) {
      var v = btn.getAttribute('data-value');
      state.error = null;
      if (name === 'option') {
        if (v === 'notSure') { state.notSure = true; state.option = null; }
        else { state.notSure = false; state.option = v; }
      } else if (name === 'optionAfter') {
        state.option = v;
      } else if (name === 'quarter') {
        state.quarter = Number(v);
      } else {
        state[name] = v;
      }
      render(false);
      var again = screen.querySelector('[data-choice="' + name + '"][data-value="' + v + '"]');
      if (again) again.focus();
      return;
    }
    var action = btn.getAttribute('data-action');
    if (action === 'next') goNext();
    else if (action === 'back') goBack();
    else if (action === 'start-over') startOver();
    else if (action === 'copy') copySummary();
  });

  screen.addEventListener('change', function (e) {
    if (e.target.id === 'year') state.year = Number(e.target.value);
  });

  screen.addEventListener('input', function (e) {
    if (e.target.id === 'amount') state.raw[state.step] = e.target.value;
  });

  screen.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.id === 'amount') { e.preventDefault(); goNext(); }
  });

  // Tidy the number with thousand separators when leaving the box.
  screen.addEventListener('focusout', function (e) {
    if (e.target.id !== 'amount') return;
    var v = CALC.parseAmount(e.target.value);
    if (typeof v === 'number' && !isNaN(v) && v >= 0) {
      e.target.value = peso(v).replace('₱', '');
      state.raw[state.step] = e.target.value;
    }
  });

  document.getElementById('lang-group').addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang]');
    if (!b) return;
    if (FIELDS[state.step]) {
      var input = document.getElementById('amount');
      if (input) state.raw[state.step] = input.value;
    }
    lang = b.getAttribute('data-lang');
    render(false);
  });

  document.getElementById('theme-btn').addEventListener('click', function () {
    document.documentElement.setAttribute('data-theme', isDark() ? 'light' : 'dark');
    updateThemeButton();
  });

  document.getElementById('start-over').addEventListener('click', startOver);

  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', updateThemeButton);
  }

  // For automated UI tests only (read-only peek at the plain-text summary).
  window.QTW_APP = { summaryText: summaryText };

  render(false);
})();
