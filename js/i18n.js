/*
 * TEXT & TRANSLATIONS
 *
 * Every word on the screen lives here. Each entry has an English (en) and a
 * Filipino (fil) version side by side. To change wording, edit the text
 * between the quotes. Keep anything in {curly braces} as is — the app fills
 * those in (e.g. {year} becomes 2026).
 *
 * `npm test` checks that every entry has both an en and a fil version.
 */
(function (root) {
  var STRINGS = {
    // ---------- Header, banner, buttons ----------
    'app.title': {
      en: 'Quarterly Tax Worksheet',
      fil: 'Quarterly Tax Worksheet'
    },
    'app.tagline': {
      en: 'Practice your quarterly BIR returns, then see exactly what to type in eBIRForms.',
      fil: 'I-practice muna ang quarterly BIR returns mo, tapos makikita mo kung ano mismo ang ita-type sa eBIRForms.'
    },
    'app.by': {
      en: 'by Nice to Know (@missniceph)',
      fil: 'gawa ng Nice to Know (@missniceph)'
    },
    'banner': {
      en: 'Unofficial practice worksheet. Not a BIR form. File your actual return through eBIRForms or your RDO.',
      fil: 'Hindi opisyal na practice worksheet. Hindi ito BIR form. I-file ang totoong return mo sa eBIRForms o sa RDO mo.'
    },
    'privacy': {
      en: 'Nothing you enter is saved or sent anywhere. It all stays on this page and disappears when you close it.',
      fil: 'Walang sine-save o ipinapadala kahit saan sa mga ilalagay mo. Dito lang lahat sa page na ito, at mawawala pag sinara mo.'
    },
    'lang.label': { en: 'Language', fil: 'Wika' },
    'theme.toDark': { en: 'Switch to dark mode', fil: 'Lumipat sa dark mode' },
    'theme.toLight': { en: 'Switch to light mode', fil: 'Lumipat sa light mode' },
    'btn.startOver': { en: 'Start over', fil: 'Ulitin' },
    'btn.next': { en: 'Next', fil: 'Susunod' },
    'btn.back': { en: 'Back', fil: 'Bumalik' },
    'btn.seeResults': { en: 'See my results', fil: 'Tingnan ang resulta' },
    'btn.copy': { en: 'Copy my summary', fil: 'Kopyahin ang summary ko' },
    'btn.copied': { en: 'Copied! Paste it in your notes.', fil: 'Nakopya na! I-paste mo sa notes mo.' },
    'btn.copyFailed': {
      en: 'Couldn’t copy automatically. Select the text below and copy it.',
      fil: 'Hindi ma-copy nang kusa. I-select ang text sa ibaba at i-copy.'
    },
    'confirm.startOver': {
      en: 'Clear everything and start over?',
      fil: 'Buburahin lahat at uulit tayo mula simula. Okay lang?'
    },
    'whatIsThis': { en: 'What is this?', fil: 'Ano ito?' },
    'progress': { en: 'Step {n} of {total}', fil: 'Hakbang {n} sa {total}' },
    'confirmTag': { en: '[confirm]', fil: '[confirm]' },

    // ---------- Step 1: 8% or graduated ----------
    'q.option': {
      en: 'Did you choose the 8% income tax option for this year?',
      fil: 'Pinili mo ba ang 8% income tax option para sa taong ito?'
    },
    'q.option.help': {
      en: 'There are two ways to compute income tax if you’re self-employed or a professional. The 8% option is one flat rate on your gross sales/receipts and other non-operating income, and it replaces BOTH the graduated income tax and the 3% percentage tax. With the graduated option, you use the income tax table, and you also pay 3% percentage tax on a separate return (BIR Form 2551Q).',
      fil: 'Dalawa ang paraan ng pag-compute ng income tax kapag self-employed o professional ka. Ang 8% option ay isang flat rate sa gross sales/receipts mo at sa iba pang non-operating income, at ito na ang kapalit ng graduated income tax AT ng 3% percentage tax. Sa graduated option naman, gagamitin mo ang income tax table, at magbabayad ka rin ng 3% percentage tax sa hiwalay na return (BIR Form 2551Q).'
    },
    'q.option.help3m': {
      en: 'The 8% option only applies while your gross sales/receipts and other non-operating income stay within \u20b13,000,000 for the year. Above that, you\u2019re moved to graduated rates.',
      fil: 'Puwede lang ang 8% option habang ang gross sales/receipts at other non-operating income mo ay hindi lumalampas sa \u20b13,000,000 sa isang taon. Kapag lumampas, lilipat ka sa graduated rates.'
    },
    'note.over3m': {
      en: 'Heads up: your gross sales/receipts and other non-operating income are over \u20b13,000,000. The 8% option only applies up to \u20b13,000,000, so you may have to move to graduated rates. This worksheet doesn\u2019t compute that switch \u2014 talk to your RDO or a tax professional before filing.',
      fil: 'Paalala: lampas na sa \u20b13,000,000 ang gross sales/receipts at other non-operating income mo. Hanggang \u20b13,000,000 lang ang 8% option, kaya baka kailangan mo nang lumipat sa graduated rates. Hindi ito kino-compute ng worksheet na ito \u2014 kumonsulta muna sa RDO mo o sa tax professional bago mag-file.'
    },
    'note.mixedGraduated': {
      en: 'Mixed income on graduated rates: in your annual return, your salary and business income are added together before the tax table is applied, and the \u20b1250,000 zero-tax bracket is already used up by your salary. This worksheet only uses your business income, as the quarterly return does, so the quarterly figure may be lower than your actual share. Check with your RDO or a tax professional.',
      fil: 'Mixed income sa graduated rates: sa annual return mo, pinagsasama ang sweldo at kita sa negosyo bago gamitin ang tax table, at nagamit na ng sweldo mo ang \u20b1250,000 na zero-tax bracket. Kita lang sa negosyo ang ginagamit ng worksheet na ito, gaya ng quarterly return, kaya baka mas mababa ang lumabas na tax kaysa sa totoong dapat. Kumonsulta sa RDO mo o sa tax professional.'
    },
    'opt.8': { en: 'Yes, 8%', fil: 'Oo, 8%' },
    'opt.8.sub': {
      en: 'You’ll do the 1701Q worksheet only.',
      fil: '1701Q worksheet lang ang gagawin mo.'
    },
    'opt.graduated': { en: 'No, graduated rates', fil: 'Hindi, graduated rates' },
    'opt.graduated.sub': {
      en: 'You’ll do the 1701Q and the 2551Q worksheets.',
      fil: 'Gagawin mo ang 1701Q at 2551Q worksheets.'
    },
    'opt.notSure': { en: 'Not sure', fil: 'Hindi ako sigurado' },
    'opt.notSure.sub': { en: 'Let’s find out.', fil: 'Alamin natin.' },
    'notSure.title': { en: 'How to find out', fil: 'Paano malalaman' },
    'notSure.body': {
      en: 'You make this choice on your first-quarter return of the year — Item 13 of BIR Form 2551Q, or the corresponding item in BIR Form 1701Q — and it can’t be changed for the rest of the year. Check your first-quarter return for this year, or ask your RDO (Revenue District Office, the BIR office where you’re registered).',
      fil: 'Ginagawa ang pagpiling ito sa first-quarter return mo ng taon — sa Item 13 ng BIR Form 2551Q, o sa katumbas na item sa BIR Form 1701Q — at hindi na ito puwedeng palitan sa natitirang bahagi ng taon. Silipin ang first-quarter return mo ngayong taon, o magtanong sa RDO mo (Revenue District Office, ang BIR office kung saan ka naka-register).'
    },
    'notSure.pick': {
      en: 'Once you know, pick one:',
      fil: 'Kapag alam mo na, pumili ka rito:'
    },
    'err.pickOne': { en: 'Please pick one to continue.', fil: 'Pumili muna ng isa para tumuloy.' },

    // ---------- Step 2: quarter and year ----------
    'q.period': {
      en: 'Which quarter and year are you filing for?',
      fil: 'Para sa aling quarter at taon ka magfa-file?'
    },
    'q.period.help': {
      en: 'A quarter is a 3-month period of the calendar year. Q1 is January–March, Q2 is April–June, Q3 is July–September and Q4 is October–December.',
      fil: 'Ang quarter ay 3 buwan ng taon. Ang Q1 ay Enero–Marso, Q2 ay Abril–Hunyo, Q3 ay Hulyo–Setyembre, at Q4 ay Oktubre–Disyembre.'
    },
    'label.year': { en: 'Year', fil: 'Taon' },
    'label.quarter': { en: 'Quarter', fil: 'Quarter' },
    'q1': { en: 'Q1 · Jan–Mar', fil: 'Q1 · Ene–Mar' },
    'q2': { en: 'Q2 · Apr–Jun', fil: 'Q2 · Abr–Hun' },
    'q3': { en: 'Q3 · Jul–Sep', fil: 'Q3 · Hul–Set' },
    'q4': { en: 'Q4 · Oct–Dec', fil: 'Q4 · Okt–Dis' },
    'q4.graduated': {
      en: 'There’s no Q4 1701Q — your annual income tax return covers the fourth quarter. So for Q4, you’ll only do the 2551Q worksheet.',
      fil: 'Walang Q4 na 1701Q — sakop na ng annual income tax return mo ang fourth quarter. Kaya sa Q4, 2551Q worksheet lang ang gagawin mo.'
    },
    'q4.eight': {
      en: 'There’s no Q4 1701Q — your annual income tax return covers the fourth quarter. And since you’re on 8%, you don’t file 2551Q. So there’s no quarterly return to prepare for Q4.',
      fil: 'Walang Q4 na 1701Q — sakop na ng annual income tax return mo ang fourth quarter. At dahil naka-8% ka, hindi ka nagfa-file ng 2551Q. Kaya walang quarterly return na kailangang ihanda para sa Q4.'
    },

    // ---------- Step 3: purely self-employed or mixed ----------
    'q.incomeType': {
      en: 'Are you purely self-employed/professional, or do you have mixed income (also employed)?',
      fil: 'Purely self-employed/professional ka ba, o mixed income (may trabaho ka rin bilang empleyado)?'
    },
    'q.incomeType.help': {
      en: 'Purely self-employed means all your income comes from your business or profession. Mixed income means you ALSO earn a salary (compensation income) from an employer. Your salary is NOT reported in the quarterly return — only in the annual return — so you’ll only enter your business or professional income here.',
      fil: 'Ang purely self-employed ay yung lahat ng kita mo ay galing sa negosyo o propesyon mo. Ang mixed income naman ay yung may sweldo ka RIN (compensation income) mula sa employer. HINDI isinasama ang sweldo mo sa quarterly return — sa annual return lang — kaya kita lang mula sa negosyo o propesyon ang ilalagay mo rito.'
    },
    'q.incomeType.help8': {
      en: 'For the 8% option, this matters: purely self-employed people and professionals deduct ₱250,000 first. Mixed-income earners do NOT get the ₱250,000 reduction.',
      fil: 'Mahalaga ito sa 8% option: ang purely self-employed at professionals ay may ₱250,000 na ibabawas muna. Ang mixed-income earners ay WALANG ₱250,000 na bawas.'
    },
    'opt.pure': { en: 'Purely self-employed or professional', fil: 'Purely self-employed o professional' },
    'opt.pure.sub': {
      en: 'Business, freelance or professional income only.',
      fil: 'Kita mula sa negosyo, freelance o propesyon lang.'
    },
    'opt.mixed': { en: 'Mixed income (also employed)', fil: 'Mixed income (empleyado rin)' },
    'opt.mixed.sub': {
      en: 'You also get a salary from an employer.',
      fil: 'May sweldo ka rin mula sa employer.'
    },

    // ---------- Step 4: itemized or OSD ----------
    'q.deduction': {
      en: 'Itemized deductions or Optional Standard Deduction (OSD, 40%)?',
      fil: 'Itemized deductions o Optional Standard Deduction (OSD, 40%)?'
    },
    'q.deduction.help': {
      en: 'This is how you subtract expenses before computing graduated income tax. Itemized: you subtract your actual cost of sales/services and allowable expenses. OSD: instead of listing expenses, you simply deduct 40% of your gross sales/receipts.',
      fil: 'Ito ang paraan ng pagbawas ng gastos bago i-compute ang graduated income tax. Sa Itemized, ibabawas mo ang aktuwal na cost of sales/services at allowable expenses mo. Sa OSD, hindi mo na kailangang ilista ang gastos — 40% ng gross sales/receipts mo ang ibabawas nang diretso.'
    },
    'opt.itemized': { en: 'Itemized deductions', fil: 'Itemized deductions' },
    'opt.itemized.sub': {
      en: 'Subtract your actual costs and expenses.',
      fil: 'Isa-isang ibabawas ang aktuwal na gastos.'
    },
    'opt.osd': { en: 'Optional Standard Deduction (OSD, 40%)', fil: 'Optional Standard Deduction (OSD, 40%)' },
    'opt.osd.sub': {
      en: 'Deduct a flat 40% of gross sales/receipts.',
      fil: 'Flat na 40% ng gross sales/receipts ang ibabawas.'
    },

    // ---------- Step 5: numbers ----------
    'section.1701Q': { en: '1701Q worksheet · Quarterly Income Tax', fil: '1701Q worksheet · Quarterly Income Tax' },
    'section.2551Q': { en: '2551Q worksheet · Quarterly Percentage Tax', fil: '2551Q worksheet · Quarterly Percentage Tax' },
    'ytdHint': {
      en: 'Year-to-date: January 1 to {end}, {year}',
      fil: 'Year-to-date: Enero 1 hanggang {end}, {year}'
    },
    'quarterHint': {
      en: 'This quarter only: {start} to {end}, {year}',
      fil: 'Itong quarter lang: {start} hanggang {end}, {year}'
    },
    'optionalHint': {
      en: 'Leave blank or enter 0 if none.',
      fil: 'Iwanang blangko o ilagay ang 0 kung wala.'
    },
    'err.required': {
      en: 'Please enter an amount (enter 0 if none).',
      fil: 'Maglagay ng halaga (ilagay ang 0 kung wala).'
    },
    'err.invalid': {
      en: 'Please enter numbers only, like 150000 or 150,000.50.',
      fil: 'Numero lang ang ilagay, halimbawa 150000 o 150,000.50.'
    },
    'err.negative': {
      en: 'The amount can’t be negative.',
      fil: 'Hindi puwedeng negative ang halaga.'
    },

    'f.grossYTD': {
      en: 'Gross Sales/Receipts, year-to-date',
      fil: 'Gross Sales/Receipts, year-to-date (kabuuang benta o kita bago ibawas ang gastos, mula Enero)'
    },
    'f.grossYTD.help': {
      en: 'Your total sales or receipts from your business or profession, from January 1 up to the end of this quarter, before subtracting any expenses. The 1701Q is cumulative, so use year-to-date figures — for example, for Q2, add up January to June. Don’t include your salary.',
      fil: 'Kabuuang benta o natanggap mo mula sa negosyo o propesyon, mula Enero 1 hanggang katapusan ng quarter na ito, bago ibawas ang kahit anong gastos. Cumulative ang 1701Q, kaya year-to-date ang gamitin — halimbawa, sa Q2, pagsamahin ang Enero hanggang Hunyo. Huwag isama ang sweldo mo.'
    },
    'f.costYTD': {
      en: 'Cost of Sales/Services, year-to-date',
      fil: 'Cost of Sales/Services, year-to-date (direktang gastos sa produkto o serbisyong ibinenta mo)'
    },
    'f.costYTD.help': {
      en: 'The direct cost of the goods you sold or the services you provided, from January 1 up to the end of this quarter.',
      fil: 'Ang direktang gastos sa mga produktong ibinenta mo o sa serbisyong ibinigay mo, mula Enero 1 hanggang katapusan ng quarter na ito.'
    },
    'f.expensesYTD': {
      en: 'Allowable expenses, year-to-date',
      fil: 'Allowable expenses, year-to-date (iba pang gastos sa negosyo na puwedeng ibawas)'
    },
    'f.expensesYTD.help': {
      en: 'Your other business or professional expenses that are allowed as deductions, from January 1 up to the end of this quarter. Keep your receipts and records for these.',
      fil: 'Iba pang gastos sa negosyo o propesyon na puwedeng ibawas, mula Enero 1 hanggang katapusan ng quarter na ito. Itago ang resibo at records mo para dito.'
    },
    'f.otherYTD': {
      en: 'Other non-operating income, year-to-date',
      fil: 'Other non-operating income, year-to-date (iba pang kita na hindi galing sa pangunahing negosyo o propesyon mo)'
    },
    'f.otherYTD.help': {
      en: 'Income that isn’t from your main business or profession, from January 1 up to the end of this quarter. Most people have none. Don’t include your salary.',
      fil: 'Kita na hindi galing sa pangunahing negosyo o propesyon mo, mula Enero 1 hanggang katapusan ng quarter na ito. Kadalasan, wala nito. Huwag isama ang sweldo mo.'
    },
    'f.prevTax': {
      en: 'Tax due/paid in previous quarters of {year}',
      fil: 'Tax due/paid sa mga naunang quarter ng {year} (buwis na nabayaran mo na sa naunang 1701Q)'
    },
    'f.prevTax.help': {
      en: 'The income tax from your earlier 1701Q returns this year. Because the 1701Q is cumulative, your year-to-date tax is computed first, then what you already paid is subtracted so you don’t pay twice.',
      fil: 'Ang income tax mula sa mga naunang 1701Q mo ngayong taon. Dahil cumulative ang 1701Q, kino-compute muna ang year-to-date na tax, tapos ibabawas ang nabayaran mo na para hindi ka magbayad nang dalawang beses.'
    },
    'f.cwtPrev1701': {
      en: 'Creditable tax withheld in previous quarters of {year} (per BIR Form 2307)',
      fil: 'Creditable tax withheld sa mga naunang quarter ng {year} (ayon sa BIR Form 2307 na natanggap mo para sa naunang quarters)'
    },
    'f.cwtPrev1701.help': {
      en: 'Because the 1701Q is cumulative, 2307s from earlier quarters of this year still count as credits. Add up the income tax withheld on the 2307s you already claimed in your earlier 1701Q returns this year. This quarter\u2019s 2307s come next, on a separate line.',
      fil: 'Dahil cumulative ang 1701Q, kasama pa rin bilang credit ang mga 2307 mula sa naunang quarters ngayong taon. Pagsamahin ang income tax withheld sa mga 2307 na na-claim mo na sa naunang 1701Q mo ngayong taon. Ang 2307 para sa quarter na ito ay sa susunod na tanong, hiwalay na linya.'
    },
    'f.cwt1701': {
      en: 'Creditable tax withheld this quarter (per BIR Form 2307)',
      fil: 'Creditable tax withheld ngayong quarter (ayon sa BIR Form 2307 — buwis na kinaltas na ng client mo)'
    },
    'f.cwt1701.help': {
      en: 'If a client withheld income tax from your payments, they give you a BIR Form 2307. Add up the income tax withheld shown on the 2307s for this quarter. Attach the 2307s to your return.',
      fil: 'Kung may client na nagkaltas ng income tax sa bayad sa iyo, bibigyan ka nila ng BIR Form 2307. Pagsamahin ang income tax withheld na nakalagay sa mga 2307 para sa quarter na ito. I-attach ang mga 2307 sa return mo.'
    },
    'f.gross2551': {
      en: 'Gross Sales/Receipts for this quarter only',
      fil: 'Gross Sales/Receipts para sa quarter na ito lang (kabuuang benta o kita sa 3 buwang ito, bago ibawas ang gastos)'
    },
    'f.gross2551.help': {
      en: 'Careful: this is NOT year-to-date. The 2551Q is per quarter, so enter only your sales or receipts for the 3 months of this quarter, before expenses.',
      fil: 'Ingat: HINDI ito year-to-date. Per quarter ang 2551Q, kaya ang benta o kita mo lang sa 3 buwan ng quarter na ito ang ilagay, bago ibawas ang gastos.'
    },
    'f.cwt2551': {
      en: 'Creditable Percentage Tax Withheld (per BIR Form 2307)',
      fil: 'Creditable Percentage Tax Withheld (ayon sa BIR Form 2307 — percentage tax na kinaltas na ng client mo)'
    },
    'f.cwt2551.help': {
      en: 'If a client withheld percentage tax from your payments this quarter, it shows on the BIR Form 2307 they gave you. Most people have none.',
      fil: 'Kung may client na nagkaltas ng percentage tax sa bayad sa iyo ngayong quarter, makikita ito sa BIR Form 2307 na binigay nila. Kadalasan, wala nito.'
    },

    // ---------- Results ----------
    'res.title': { en: 'Your results', fil: 'Ang resulta mo' },
    'res.intro': {
      en: '{quarter} {year} · {option} · {incomeType}',
      fil: '{quarter} {year} · {option} · {incomeType}'
    },
    'res.option.8': { en: '8% option', fil: '8% option' },
    'res.option.graduated': { en: 'Graduated rates', fil: 'Graduated rates' },
    'res.nothing.title': { en: 'Nothing to file this quarter', fil: 'Walang ifa-file ngayong quarter' },
    'res.1701.title': { en: '1701Q · Quarterly Income Tax', fil: '1701Q · Quarterly Income Tax' },
    'res.2551.title': { en: '2551Q · Quarterly Percentage Tax', fil: '2551Q · Quarterly Percentage Tax' },
    'res.1701.help': {
      en: 'The 1701Q is cumulative: tax is computed on your year-to-date income, then taxes already paid in earlier quarters and credits are subtracted.',
      fil: 'Cumulative ang 1701Q: kino-compute ang tax sa year-to-date na kita mo, tapos ibabawas ang nabayaran na sa naunang quarters at ang credits.'
    },
    'res.2551.help': {
      en: 'The 2551Q is per quarter: 3% of this quarter’s gross sales/receipts.',
      fil: 'Per quarter ang 2551Q: 3% ng gross sales/receipts ng quarter na ito.'
    },
    'row.grossYTD': { en: 'Gross sales/receipts (YTD)', fil: 'Gross sales/receipts (YTD)' },
    'row.costYTD': { en: 'Less: cost of sales/services', fil: 'Bawas: cost of sales/services' },
    'row.expensesYTD': { en: 'Less: allowable expenses', fil: 'Bawas: allowable expenses' },
    'row.osd': { en: 'Less: OSD (40% of gross)', fil: 'Bawas: OSD (40% ng gross)' },
    'row.otherYTD': { en: 'Add: other non-operating income', fil: 'Dagdag: other non-operating income' },
    'row.reduction': { en: 'Less: ₱250,000 (purely self-employed)', fil: 'Bawas: ₱250,000 (purely self-employed)' },
    'row.noReduction': {
      en: 'No ₱250,000 reduction (mixed income)',
      fil: 'Walang ₱250,000 na bawas (mixed income)'
    },
    'row.taxable': { en: 'Taxable income (YTD)', fil: 'Taxable income (YTD)' },
    'row.taxDueYTD8': { en: 'Income tax due (YTD) · 8%', fil: 'Income tax due (YTD) · 8%' },
    'row.taxDueYTDgrad': { en: 'Income tax due (YTD) · graduated table', fil: 'Income tax due (YTD) · graduated table' },
    'row.prevTax': { en: 'Less: tax paid in previous quarters', fil: 'Bawas: tax na nabayaran sa naunang quarters' },
    'row.cwtPrev1701': {
      en: 'Less: creditable tax withheld, previous quarters (2307)',
      fil: 'Bawas: creditable tax withheld, naunang quarters (2307)'
    },
    'row.cwt1701': { en: 'Less: creditable tax withheld (2307)', fil: 'Bawas: creditable tax withheld (2307)' },
    'row.payable': { en: 'Tax still payable this quarter', fil: 'Tax na babayaran ngayong quarter' },
    'row.overpayment': { en: 'Overpayment', fil: 'Overpayment (sobra ang nabayaran)' },
    'row.gross2551': { en: 'Gross sales/receipts (this quarter)', fil: 'Gross sales/receipts (itong quarter)' },
    'row.taxDue2551': { en: 'Percentage tax due · 3%', fil: 'Percentage tax due · 3%' },
    'row.cwt2551': { en: 'Less: creditable percentage tax withheld (2307)', fil: 'Bawas: creditable percentage tax withheld (2307)' },
    'overpayment.note': {
      en: 'Your credits are more than your tax due, so there’s nothing to pay on this return. Ask your RDO what to do with the overpayment.',
      fil: 'Mas malaki ang credits mo kaysa sa tax due, kaya walang babayaran sa return na ito. Itanong sa RDO mo kung ano ang gagawin sa overpayment.'
    },
    'total.label': { en: 'Total to pay this quarter', fil: 'Kabuuang babayaran ngayong quarter' },
    'total.help': {
      en: 'If you file on time. Pay each return separately.',
      fil: 'Kung on time ang pag-file. Hiwalay na babayaran ang bawat return.'
    },

    // ---------- eBIRForms summary ----------
    'ebir.title': { en: 'What to enter in eBIRForms', fil: 'Ano ang ilalagay sa eBIRForms' },
    'ebir.help': {
      en: 'Open the matching form in eBIRForms and type these in. Items marked [confirm] still need to be checked against the actual form — look for the line with the same description.',
      fil: 'Buksan ang tamang form sa eBIRForms at i-type ang mga ito. Ang mga item na may [confirm] ay kailangan pang i-check sa mismong form — hanapin ang linyang may parehong description.'
    },
    'ebir.col.item': { en: 'Item', fil: 'Item' },
    'ebir.col.what': { en: 'What', fil: 'Ano' },
    'ebir.col.enter': { en: 'Enter', fil: 'Ilagay' },
    'ebir.1701.title': {
      en: 'BIR Form 1701Q (January 2018 ENCS)',
      fil: 'BIR Form 1701Q (January 2018 ENCS)'
    },
    'ebir.2551.title': {
      en: 'BIR Form 2551Q (January 2018 ENCS)',
      fil: 'BIR Form 2551Q (January 2018 ENCS)'
    },
    'ebir.quarter': { en: 'Quarter', fil: 'Quarter' },
    'ebir.taxRate': { en: 'Income tax rate chosen', fil: 'Income tax rate na pinili' },
    'ebir.taxRate.q1.8': {
      en: '8% option (chosen on the first-quarter return)',
      fil: '8% option (pinipili sa first-quarter return)'
    },
    'ebir.taxRate.q1.graduated': {
      en: 'Graduated income tax rates (chosen on the first-quarter return)',
      fil: 'Graduated income tax rates (pinipili sa first-quarter return)'
    },
    'ebir.taxRate.later': {
      en: 'Already chosen on your Q1 return ({option})',
      fil: 'Napili na sa Q1 return mo ({option})'
    },
    'ebir.taxRate.2551.later': {
      en: 'Leave as is — filled only on the initial quarter of the year',
      fil: 'Hayaan lang — sa initial quarter lang ng taon ito pinupunan'
    },
    'ebir.deduction': { en: 'Method of deduction', fil: 'Method of deduction' },
    'ebir.sched.grad': { en: 'Schedule for graduated rates', fil: 'Schedule para sa graduated rates' },
    'ebir.sched.8': { en: 'Schedule for the 8% rate', fil: 'Schedule para sa 8% rate' },
    'ebir.credits': { en: 'Tax credits/payments', fil: 'Tax credits/payments' },
    'ebir.totalCredits': { en: 'Total tax credits/payments', fil: 'Total tax credits/payments' },
    'ebir.taxPayable': { en: 'Tax payable/(overpayment)', fil: 'Tax payable/(overpayment)' },
    'ebir.part1': { en: 'Part I \u00b7 Background information', fil: 'Part I \u00b7 Background information' },
    'ebir.part3': { en: 'Part III \u00b7 Total tax payable (page 1)', fil: 'Part III \u00b7 Total tax payable (page 1)' },
    'atc.business': { en: 'if business income', fil: 'kung kita sa negosyo' },
    'atc.profession': { en: 'if income from profession', fil: 'kung kita sa propesyon' },
    'atc.mixed': { en: 'mixed income', fil: 'mixed income' },
    'atc.or': { en: ' or ', fil: ' o ' },
    'ebir.1701.item26': {
      en: 'Tax Due (from Schedule I Item 46 or Schedule II Item 54)',
      fil: 'Tax Due (galing sa Schedule I Item 46 o Schedule II Item 54)'
    },
    'ebir.1701.item27': {
      en: 'Less: Tax Credits/Payments (from Schedule III Item 62)',
      fil: 'Bawas: Tax Credits/Payments (galing sa Schedule III Item 62)'
    },
    'ebir.1701.item28': {
      en: 'Tax Payable/(Overpayment) = Item 26 \u2212 Item 27',
      fil: 'Tax Payable/(Overpayment) = Item 26 \u2212 Item 27'
    },
    'ebir.1701.penalties.note': {
      en: 'Leave blank if filing on time. If late, ask your RDO.',
      fil: 'Iwanang blangko kung on time ang pag-file. Kung late, magtanong sa RDO mo.'
    },
    'ebir.1701.item30': {
      en: 'Total Amount Payable/(Overpayment) (same as Item 28 if filing on time)',
      fil: 'Total Amount Payable/(Overpayment) (pareho sa Item 28 kung on time ang pag-file)'
    },
    'ebir.attach': { en: 'Attachment', fil: 'Attachment' },
    'ebir.attach.2307': {
      en: 'BIR Form 2307 (if you have any)',
      fil: 'BIR Form 2307 (kung mayroon ka)'
    },
    'ebir.atc': {
      en: 'ATC PT 010 — Persons exempt from VAT (Sec. 116)',
      fil: 'ATC PT 010 — Persons exempt from VAT (Sec. 116)'
    },
    'ebir.taxableAmount': { en: 'Taxable Amount', fil: 'Taxable Amount' },
    'ebir.taxRateCol': { en: 'Tax Rate', fil: 'Tax Rate' },
    'ebir.taxDue': { en: 'Tax Due', fil: 'Tax Due' },
    'ebir.sched1Total': {
      en: 'Total Tax Due (carry to Part II, Item 14)',
      fil: 'Total Tax Due (ilipat sa Part II, Item 14)'
    },
    'ebir.item14': { en: 'Total Tax Due', fil: 'Total Tax Due' },
    'ebir.item15': {
      en: 'Creditable Percentage Tax Withheld per BIR Form 2307',
      fil: 'Creditable Percentage Tax Withheld per BIR Form 2307'
    },
    'ebir.item18': { en: 'Total Tax Credits/Payments', fil: 'Total Tax Credits/Payments' },
    'ebir.item19': {
      en: 'Tax Still Payable/(Overpayment) = Item 14 − Item 18',
      fil: 'Tax Still Payable/(Overpayment) = Item 14 − Item 18'
    },
    'ebir.penalties': { en: 'Penalties', fil: 'Penalties (multa)' },
    'ebir.penalties.note': {
      en: 'Leave blank if filing on time. If late, ask your RDO; micro and small taxpayers get reduced penalties.',
      fil: 'Iwanang blangko kung on time ang pag-file. Kung late, magtanong sa RDO mo; may bawas na penalties ang micro at small taxpayers.'
    },
    'ebir.item24': { en: 'Total Amount Payable', fil: 'Total Amount Payable' },
    'ebir.item24.note': {
      en: 'Same as Item 19 if filing on time',
      fil: 'Pareho sa Item 19 kung on time ang pag-file'
    },
    'ebir.inParens': { en: 'in parentheses = overpayment', fil: 'naka-parentheses = overpayment' },

    // ---------- Deadlines ----------
    'dl.title': { en: 'Deadlines for this quarter', fil: 'Deadlines para sa quarter na ito' },
    'dl.1701': { en: '1701Q for {quarter} {year}', fil: '1701Q para sa {quarter} {year}' },
    'dl.2551': { en: '2551Q for {quarter} {year}', fil: '2551Q para sa {quarter} {year}' },
    'dl.no1701Q4': {
      en: 'No Q4 1701Q — your annual return covers it.',
      fil: 'Walang Q4 na 1701Q — sakop na ito ng annual return mo.'
    },
    'dl.help': {
      en: '1701Q: Q1 May 15, Q2 August 15, Q3 November 15. 2551Q: 25 days after the quarter ends (Q1 April 25, Q2 July 25, Q3 October 25, Q4 January 25 of the following year).',
      fil: '1701Q: Q1 Mayo 15, Q2 Agosto 15, Q3 Nobyembre 15. 2551Q: ika-25 araw matapos ang quarter (Q1 Abril 25, Q2 Hulyo 25, Q3 Oktubre 25, Q4 Enero 25 ng susunod na taon).'
    },

    // ---------- Copy summary ----------
    'copy.header': {
      en: 'QUARTERLY TAX WORKSHEET — MY SUMMARY',
      fil: 'QUARTERLY TAX WORKSHEET — SUMMARY KO'
    },
    'copy.inputs': { en: 'What I entered', fil: 'Mga inilagay ko' },

    // ---------- Footer ----------
    'footer.disclaimer': {
      en: 'General information only, not tax advice. This is an unofficial practice worksheet and is not affiliated with the BIR. Always double-check with eBIRForms or your RDO.',
      fil: 'Pangkalahatang impormasyon lamang, hindi tax advice. Hindi opisyal ang practice worksheet na ito at walang kaugnayan sa BIR. Laging i-double check sa eBIRForms o sa RDO mo.'
    },
    'footer.sources': { en: 'Sources', fil: 'Mga pinagkunan' },
    'footer.made': { en: 'Made by Nice to Know', fil: 'Gawa ng Nice to Know' },
    'footer.follow': { en: 'Follow @missniceph on Instagram', fil: 'I-follow si @missniceph sa Instagram' },

    // ---------- Months ----------
    'm1': { en: 'January', fil: 'Enero' },
    'm2': { en: 'February', fil: 'Pebrero' },
    'm3': { en: 'March', fil: 'Marso' },
    'm4': { en: 'April', fil: 'Abril' },
    'm5': { en: 'May', fil: 'Mayo' },
    'm6': { en: 'June', fil: 'Hunyo' },
    'm7': { en: 'July', fil: 'Hulyo' },
    'm8': { en: 'August', fil: 'Agosto' },
    'm9': { en: 'September', fil: 'Setyembre' },
    'm10': { en: 'October', fil: 'Oktubre' },
    'm11': { en: 'November', fil: 'Nobyembre' },
    'm12': { en: 'December', fil: 'Disyembre' }
  };

  function translate(lang, key, vars) {
    var entry = STRINGS[key];
    if (!entry) return key;
    var s = entry[lang] || entry.en;
    if (vars) {
      s = s.replace(/\{(\w+)\}/g, function (m, name) {
        return Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : m;
      });
    }
    return s;
  }

  var api = { STRINGS: STRINGS, translate: translate, LANGS: ['en', 'fil'] };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.QTW_I18N = api;
  }
})(this);
