// Back-office demo data, transcribed from the approved mockup.

export const O_NAV = [
  ['dash', 'DB', 'Dashboard'], ['book', 'BK', 'Bookings'], ['dep', 'DP', 'Departures'], ['cli', 'CL', 'Clients'],
  ['pay', 'PY', 'Payments'], ['ai', 'AI', 'AI assistant'], ['auto', 'AU', 'Automations'], ['rep', 'RP', 'Reports']
];

export const O_TITLES = {
  dash: ['Dashboard', 'Tuesday 12 May 2026, both branches'],
  book: ['Bookings', '38 active files, 6 departing this month'],
  cli: ['Clients', '1,284 records, 312 repeat travellers'],
  pay: ['Payments', 'Rs 1.42M collected, Rs 386K outstanding'],
  ai: ['AI assistant', 'Answering WhatsApp and Messenger since 06:00'],
  auto: ['Automations', '5 rules, 214 actions this week'],
  dep: ['Departures', '7 open departures, 483 seats loaded'],
  rep: ['Reports', 'Season to date, May 2025 to May 2026']
};

export const O_BOOKINGS = [
  { ref: 'SG-4821', cli: 'Fardeen Kurmally', pkg: 'Umrah Ramadan 2027', dep: '12 Feb 2027', pax: '2A', total: 'Rs 157,800', paid: 'Rs 40,000', st: 'Instalments', sb: '#FFF3D6', sf: '#8A6100', br: 'Valentina' },
  { ref: 'SG-4820', cli: 'Marie-Lise Appadoo', pkg: 'Cotton Bay Rodrigues', dep: '19 May 2026', pax: '2A 1C', total: 'Rs 55,400', paid: 'Rs 55,400', st: 'Paid', sb: '#DDF6E6', sf: '#0B6B37', br: 'Rose-Belle' },
  { ref: 'SG-4819', cli: 'Yashveer Ramdhonee', pkg: 'Dubai city break', dep: '06 Jun 2026', pax: '2A', total: 'Rs 77,000', paid: 'Rs 20,000', st: 'Deposit', sb: '#E4F3FB', sf: '#0E6C93', br: 'Valentina' },
  { ref: 'SG-4818', cli: 'Bibi Nazneen Joomun', pkg: 'Hajj 2027 registration', dep: 'Season 2027', pax: '1A', total: 'Rs 50,000', paid: 'Rs 50,000', st: 'Registered', sb: '#EDE7FB', sf: '#4B2E96', br: 'Rose-Belle' },
  { ref: 'SG-4817', cli: 'Jean-Claude Perrine', pkg: 'Rodrigues return flight', dep: '02 Jun 2026', pax: '4A', total: 'Rs 25,200', paid: 'Rs 0', st: 'Overdue', sb: '#FCE3E4', sf: '#A81820', br: 'Valentina' },
  { ref: 'SG-4816', cli: 'Sandhya Beeharry', pkg: 'Egypt, Cairo and Nile', dep: '12 Oct 2026', pax: '2A', total: 'Rs 124,800', paid: 'Rs 62,400', st: 'Instalments', sb: '#FFF3D6', sf: '#8A6100', br: 'Rose-Belle' },
  { ref: 'SG-4815', cli: 'Ahmad Peerbocus', pkg: 'Turkey, Istanbul', dep: '18 Apr 2026', pax: '2A 2C', total: 'Rs 164,700', paid: 'Rs 164,700', st: 'Paid', sb: '#DDF6E6', sf: '#0B6B37', br: 'Valentina' },
  { ref: 'SG-4814', cli: 'Vandana Seeruttun', pkg: 'Cotton Bay Rodrigues', dep: '26 May 2026', pax: '2A', total: 'Rs 41,000', paid: 'Rs 10,000', st: 'Deposit', sb: '#E4F3FB', sf: '#0E6C93', br: 'Rose-Belle' }
];

export const O_KPI = [
  { k: 'Bookings this month', v: '38', d: '+9 vs April', dc: '#0B6B37' },
  { k: 'Revenue booked', v: 'Rs 1.81M', d: '+22% vs April', dc: '#0B6B37' },
  { k: 'Outstanding', v: 'Rs 386K', d: '4 files overdue', dc: '#A81820' },
  { k: 'Seats left, May', v: '27', d: 'across 3 departures', dc: '#8CA0AC' }
];

export const O_BAR_HEIGHTS = [34, 41, 38, 52, 61, 48, 44, 57, 66, 72, 69, 88];
export const MONTH_LETTERS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export const O_FEED = [
  { t: '09:17', txt: 'AI blocked 2 seats on Cotton Bay 19 May for Reshma B.', c: '#17A5DA' },
  { t: '08:52', txt: 'Payment received, Rs 15,500 from Sandhya Beeharry, MCB Juice', c: '#0B6B37' },
  { t: '08:40', txt: 'Passport expiry flag on SG-4817, renew before 18 Apr', c: '#8A6100' },
  { t: '08:12', txt: 'Rodrigues 19 May moved to 8 seats left on the site', c: '#E1262D' },
  { t: '07:55', txt: 'New enquiry from Facebook, Hajj 2027, routed to Rose-Belle', c: '#8CA0AC' }
];

export const O_CLIENTS = [
  { ini: 'FK', n: 'Fardeen Kurmally', m: '5 trips, since 2019', tag: 'Repeat', tb: '#EDE7FB', tf: '#4B2E96', ph: '5 729 4410' },
  { ini: 'MA', n: 'Marie-Lise Appadoo', m: '2 trips, Rodrigues', tag: 'Family', tb: '#DDF6E6', tf: '#0B6B37', ph: '5 941 2276' },
  { ini: 'YR', n: 'Yashveer Ramdhonee', m: 'First booking', tag: 'New', tb: '#E4F3FB', tf: '#0E6C93', ph: '5 250 8831' },
  { ini: 'BJ', n: 'Bibi Nazneen Joomun', m: 'Hajj waitlist 2027', tag: 'Hajj', tb: '#FFF3D6', tf: '#8A6100', ph: '5 774 1902' },
  { ini: 'AP', n: 'Ahmad Peerbocus', m: '7 trips, group leader', tag: 'VIP', tb: '#FCE3E4', tf: '#A81820', ph: '5 498 3320' },
  { ini: 'VS', n: 'Vandana Seeruttun', m: '3 trips, Rodrigues', tag: 'Repeat', tb: '#EDE7FB', tf: '#4B2E96', ph: '5 812 7745' }
];

export const O_PAY_ROWS = [
  { ref: 'SG-4821', cli: 'Fardeen Kurmally', due: '05 Jun 2026', amt: 'Rs 39,450', st: 'Scheduled', sf: '#0E6C93', m: 'MCB Juice' },
  { ref: 'SG-4817', cli: 'Jean-Claude Perrine', due: '28 Apr 2026', amt: 'Rs 12,600', st: 'Overdue 14d', sf: '#A81820', m: 'Cash' },
  { ref: 'SG-4816', cli: 'Sandhya Beeharry', due: '12 Jul 2026', amt: 'Rs 31,200', st: 'Scheduled', sf: '#0E6C93', m: 'Card' },
  { ref: 'SG-4814', cli: 'Vandana Seeruttun', due: '10 May 2026', amt: 'Rs 15,500', st: 'Due in 2d', sf: '#8A6100', m: 'MyT Money' }
];

export const O_MIX = [
  { k: 'MCB Juice', v: '41%', w: '41%', c: '#17A5DA' },
  { k: 'Cash at branch', v: '28%', w: '28%', c: '#E1262D' },
  { k: 'Card, IPay', v: '19%', w: '19%', c: '#0B6B37' },
  { k: 'Bank transfer', v: '12%', w: '12%', c: '#8A6100' }
];

export const O_AUTO_DEFS = [
  ['Deposit reminder', 'WhatsApp 3 days before an instalment is due', '48 sent this week', '#17A5DA'],
  ['Seat countdown', 'Post remaining seats to the departures board every morning', '7 runs', '#E1262D'],
  ['Passport expiry watch', 'Flag any passport under 6 months validity at booking', '3 flagged', '#8A6100'],
  ['Post-trip review', 'Ask for a Google review 2 days after return', '19 sent', '#0B6B37'],
  ['Ramadan waitlist', 'Move waitlist to confirmed when a seat frees up', 'Paused', '#8CA0AC']
];

export const O_CHAT = [
  { who: 'Client', name: 'Reshma, WhatsApp 09:14', txt: 'Bonzour, mo ti pou kone komie pou Rodrigues 4 zour pou 2 dimoun mwa Me?', me: false },
  { who: 'AI', name: 'South Gate assistant, 09:14', txt: 'Bonzour Reshma. Cotton Bay Rodrigues 3 nwit, depar 19 Me 2026, Rs 20,500 par dimoun an demi-pansion, vol inklir. Pou 2 adilt sa fer Rs 41,000. Ena 8 plas ki reste.', me: true },
  { who: 'Client', name: 'Reshma, WhatsApp 09:16', txt: 'Eski mo kapav peye an trwa fwa?', me: false },
  { who: 'AI', name: 'South Gate assistant, 09:16', txt: 'Wi. Rs 10,000 depo, apre de versman Rs 15,500 avan 05 Me. Mo kapav blok de plas pou ou pandan 48 er?', me: true },
  { who: 'Client', name: 'Reshma, WhatsApp 09:17', txt: 'Wi silvouple, blok li.', me: false }
];

export const O_SUGG = ['Blocked. Sending the payment link now.', 'Adding Reshma to the 19 May rooming list.', 'Passport copies needed before 05 May.'];

export const O_REP_BARS = [
  { k: 'Rodrigues', v: 'Rs 640K', w: '88%', c: '#17A5DA' },
  { k: 'Umrah and Hajj', v: 'Rs 512K', w: '70%', c: '#0B2434' },
  { k: 'Dubai', v: 'Rs 298K', w: '41%', c: '#E1262D' },
  { k: 'Egypt', v: 'Rs 214K', w: '29%', c: '#8A6100' },
  { k: 'Turkey', v: 'Rs 148K', w: '20%', c: '#0B6B37' }
];

export const O_DEPS = [
  { name: 'Cotton Bay Rodrigues', date: '19 May 2026', sold: 22, cap: 30, w: '73%', c: '#17A5DA', rev: 'Rs 451K', st: 'Selling' },
  { name: 'Cotton Bay Rodrigues', date: '26 May 2026', sold: 16, cap: 30, w: '53%', c: '#17A5DA', rev: 'Rs 328K', st: 'Selling' },
  { name: 'Rodrigues flight only', date: '02 Jun 2026', sold: 38, cap: 44, w: '86%', c: '#0B6B37', rev: 'Rs 239K', st: 'Nearly full' },
  { name: 'Dubai city break', date: '06 Jun 2026', sold: 9, cap: 24, w: '38%', c: '#8A6100', rev: 'Rs 347K', st: 'Needs push' },
  { name: 'Umrah Ramadan 2027', date: '12 Feb 2027', sold: 29, cap: 40, w: '73%', c: '#17A5DA', rev: 'Rs 2.29M', st: 'Selling' },
  { name: 'Egypt and Nile cruise', date: '12 Oct 2026', sold: 15, cap: 24, w: '63%', c: '#17A5DA', rev: 'Rs 936K', st: 'Selling' },
  { name: 'Turkey, Istanbul', date: '18 Apr 2026', sold: 24, cap: 24, w: '100%', c: '#0B6B37', rev: 'Rs 1.32M', st: 'Sold out' }
];

export const O_FORECAST = [
  ['Jun', 62, 74], ['Jul', 71, 82], ['Aug', 58, 69], ['Sep', 44, 58],
  ['Oct', 66, 88], ['Nov', 79, 96], ['Dec', 94, 118], ['Jan', 61, 77]
].map((f) => ({ m: f[0], aH: f[1] + '%', fH: f[2] + '%', v: 'Rs ' + f[2] + 'K' }));

// Peak season heat map: per destination row, 12 monthly cells.
const PEAK_MONTHS = [
  [30, 70, 45, 20], [25, 65, 35, 15], [40, 55, 50, 30], [55, 40, 60, 45],
  [95, 35, 55, 40], [70, 30, 45, 35], [65, 25, 40, 30], [50, 30, 35, 25],
  [45, 40, 50, 60], [60, 55, 65, 95], [75, 80, 80, 70], [90, 95, 90, 55]
];

export const O_PEAK = ['Rodrigues', 'Umrah', 'Dubai', 'Egypt'].map((d, r) => ({
  dest: d,
  cells: PEAK_MONTHS.map((mo, i) => {
    const v = mo[r];
    return {
      m: MONTH_LETTERS[i],
      bg: 'rgba(23,165,218,' + (0.07 + v / 125) + ')',
      fg: v > 70 ? '#fff' : '#3C5464',
      v
    };
  })
}));

export const O_PERF = [
  { p: 'Cotton Bay Rodrigues', sold: '148 pax', rev: 'Rs 3.03M', mar: '18%', conv: '31%', cw: '31%', tr: '+14%', tc: '#0B6B37' },
  { p: 'Umrah Ramadan', sold: '62 pax', rev: 'Rs 4.89M', mar: '12%', conv: '44%', cw: '44%', tr: '+27%', tc: '#0B6B37' },
  { p: 'Rodrigues flight only', sold: '212 pax', rev: 'Rs 1.34M', mar: '7%', conv: '52%', cw: '52%', tr: '+4%', tc: '#0B6B37' },
  { p: 'Dubai city break', sold: '41 pax', rev: 'Rs 1.58M', mar: '21%', conv: '19%', cw: '19%', tr: '-6%', tc: '#A81820' },
  { p: 'Egypt and Nile', sold: '28 pax', rev: 'Rs 1.75M', mar: '24%', conv: '16%', cw: '16%', tr: '+9%', tc: '#0B6B37' },
  { p: 'Turkey', sold: '33 pax', rev: 'Rs 1.81M', mar: '22%', conv: '23%', cw: '23%', tr: '+11%', tc: '#0B6B37' }
];

export const O_FUNNEL = [
  { k: 'Enquiries', v: '1,842', w: '100%', c: '#17A5DA' },
  { k: 'Quoted', v: '1,106', w: '60%', c: '#12455F' },
  { k: 'Seat held', v: '498', w: '27%', c: '#0B2434' },
  { k: 'Deposit paid', v: '312', w: '17%', c: '#E1262D' },
  { k: 'Travelled', v: '289', w: '16%', c: '#0B6B37' }
];
