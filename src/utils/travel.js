// Shared helpers used across pages, matching the mockup's logic exactly.

export function money(n) {
  return 'Rs ' + Math.round(n).toLocaleString('en-US');
}

// "3 nights · Half board" (or "Flight only").
export function boardLabel(p, t) {
  if (p.board === 'flightOnly') return t.flightOnly;
  return p.nights + ' ' + t.nights + ' · ' + t[p.board];
}

// Card tag pill for a package: { bg, fg, txt }.
export function tagFor(p, t, lang) {
  const m = {
    seats: ['#E1262D', '#fff'],
    promo: ['#17A5DA', '#fff'],
    instal: ['#12805C', '#fff'],
    reg: ['#FFF0DC', '#8A5B12'],
    popular: ['#0B2434', '#fff'],
    guided: ['#F1F4F6', '#0B2434']
  }[p.tag];
  const label = {
    seats: '8 ' + (lang === 'fr' ? 'places' : lang === 'kr' ? 'plas' : 'seats left'),
    promo: 'Promo',
    instal: t.payInstal,
    reg: t.upcoming,
    popular: t.featEyebrow,
    guided: t.included
  }[p.tag];
  return { bg: m[0], fg: m[1], txt: label };
}

// Booking totals, matching the mockup math.
// plan: 'full' | 'deposit' | 'instal'
export function computeTotals(pk, adults, kids, plan) {
  const unit = pk.price;
  const kidUnit = Math.round((pk.price * 0.7) / 50) * 50;
  const total = adults * unit + kids * kidUnit;
  const deposit = Math.round((total * 0.3) / 5) * 5;
  const instal = Math.ceil(total / 3 / 50) * 50;
  const payNow = plan === 'full' ? total : plan === 'deposit' ? deposit : instal;
  const later = plan === 'full' ? 0 : total - payNow;
  return { unit, kidUnit, total, deposit, instal, payNow, later };
}

// Traveller words per language.
export function travellerWords(lang) {
  const aOne = { en: 'adult', fr: 'adulte', kr: 'adilt' }[lang];
  const aMany = { en: 'adults', fr: 'adultes', kr: 'adilt' }[lang];
  const cOne = { en: 'child', fr: 'enfant', kr: 'zanfan' }[lang];
  const cMany = { en: 'children', fr: 'enfants', kr: 'zanfan' }[lang];
  return { aOne, aMany, cOne, cMany };
}

// "2 adults, 1 child"
export function travLine(adults, kids, lang) {
  const w = travellerWords(lang);
  const aW = adults === 1 ? w.aOne : w.aMany;
  const cW = kids === 1 ? w.cOne : w.cMany;
  return adults + ' ' + aW + (kids ? ', ' + kids + ' ' + cW : '');
}

// Departure-board row decorations (seat colours / urgency chips).
export function boardRow(b, lang) {
  const left = lang === 'fr' ? 'restantes' : lang === 'kr' ? 'reste' : 'left';
  const rem = b.cap - b.sold;
  const pct = Math.round((b.sold / b.cap) * 100);
  const hot = rem <= 8;
  return {
    ...b,
    seats: rem + ' ' + left,
    w: pct + '%',
    seatC: hot ? '#E1262D' : rem <= 12 ? '#8A6100' : '#0B6B37',
    barBg: hot
      ? 'linear-gradient(90deg,#E1262D,#F0656A)'
      : rem <= 12
        ? 'linear-gradient(90deg,#C88A17,#E5B34A)'
        : 'linear-gradient(90deg,#0B6B37,#3FA46A)',
    chip: hot
      ? (lang === 'fr' ? 'Bientot complet' : lang === 'kr' ? 'Preske plin' : 'Almost full')
      : pct >= 50
        ? (lang === 'fr' ? 'Se remplit' : lang === 'kr' ? 'Pe ranpli' : 'Filling up')
        : (lang === 'fr' ? 'Places libres' : lang === 'kr' ? 'Ena plas' : 'Good availability'),
    chipBg: hot ? 'rgba(225,38,45,.1)' : pct >= 50 ? 'rgba(200,138,23,.12)' : 'rgba(11,107,55,.1)'
  };
}
