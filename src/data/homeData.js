import { cw } from './packages.js';

// Live departures board (Home).
export const BOARD = [
  { name: 'Cotton Bay Rodrigues', place: 'Rodrigues', date: '19 MAY 2026', sold: 22, cap: 30, price: 'Rs 20,500', img: cw('cotton', 0, 300), id: 'cotton' },
  { name: 'Umrah Ramadan 2027', place: 'Makkah and Madinah', date: '12 FEB 2027', sold: 29, cap: 40, price: 'Rs 78,900', img: cw('umrah-ram', 0, 300), id: 'umrah-ram' },
  { name: 'Egypt and Nile cruise', place: 'Cairo, Luxor, Aswan', date: '12 OCT 2026', sold: 15, cap: 24, price: 'Rs 62,400', img: cw('egypt', 0, 300), id: 'egypt' },
  { name: 'Dubai city break', place: 'United Arab Emirates', date: 'WEEKLY', sold: 9, cap: 24, price: 'Rs 38,500', img: cw('dubai', 0, 300), id: 'dubai' },
  { name: 'Bakwa Lodge Rodrigues', place: 'Port Sud-Est', date: '01 FEB 2026', sold: 12, cap: 20, price: 'Rs 28,500', img: cw('bakwa', 0, 300), id: 'bakwa' }
];

// "From a WhatsApp message to a boarding pass, in four steps."
export const STEPS = [
  { n: '01', k: 'Tell us the shape of the trip', v: 'WhatsApp, walk in, or send the form. Dates, how many of you, and roughly what you want to spend.' },
  { n: '02', k: 'We hold the seats for 48 hours', v: 'No card, no deposit. We check live availability and write the hold down against your name.' },
  { n: '03', k: 'Pay a deposit, then instalments', v: 'Rs 10,000 on holidays, Rs 20,000 on Umrah. The rest in up to three payments before departure.' },
  { n: '04', k: 'Documents and departure', v: 'We prepare the visa file, send the vouchers, and a leader meets Umrah and guided groups at Plaisance.' }
];

// "Where to go, and when it is cheapest to go there."
export const WHEN = [
  { m: 'Jan to Mar', d: 'Rodrigues', n: 'Warm, quiet lagoons. Our lowest package prices of the year.', c: '#17A5DA' },
  { m: 'Feb to Apr', d: 'Umrah', n: 'Ramadan falls in this window. Register nine months ahead.', c: '#0B2434' },
  { m: 'Apr to Jun', d: 'Turkey and Egypt', n: 'Spring in Cappadocia and Cairo before the summer heat.', c: '#7C2F26' },
  { m: 'May to Sep', d: 'Dubai', n: 'Low season fares. Indoor attractions and evening desert trips.', c: '#E1262D' },
  { m: 'Oct to Dec', d: 'Mediterranean', n: 'The last cruise sailings of the season out of Genoa.', c: '#0E7FAB' },
  { m: 'Dec to Jan', d: 'Indian Ocean cruise', n: 'Ships home port at Port Louis. No flight to pay for.', c: '#0B6B37' }
];

// Trust strip under the promo cards.
export const TRUST = [
  { k: 'IATA registered since 2010', v: 'Full service, best price' },
  { k: '88,000 followers', v: 'Award winner for Rodrigues' },
  { k: 'Pay in instalments', v: 'Juice, card, cash or transfer' },
  { k: 'Kreol, French, English', v: 'Real people, both branches' }
];

// "Four things a booking site cannot do for you."
export const BENEFITS = [
  { n: '01', k: 'Local group leaders', v: 'A South Gate leader travels with every Umrah and Hajj group. Not a phone number in another country.' },
  { n: '02', k: 'Price is the price', v: 'Airport taxes, transfers and visa fees are in the figure you see. No surprise at the counter.' },
  { n: '03', k: 'Hold a seat free', v: 'Reserve for 48 hours with no card, then pay a deposit when you are ready.' },
  { n: '04', k: 'Two offices to walk into', v: 'Valentina Mall in Phoenix and Rose-Belle in Grand Port. Open six days.' }
];

// "Questions people ask before they pay."
export const FAQS = [
  ['How much deposit do I need?', 'For Rodrigues and holiday packages the deposit is Rs 10,000 per person. For Umrah it is Rs 20,000 and the balance can be spread over three instalments up to 30 days before departure.'],
  ['Can I hold seats before I pay?', 'Yes. We hold a seat for 48 hours with no payment and no card details. Message either branch on WhatsApp and we will confirm the hold in writing.'],
  ['What is included in the price shown?', 'Return flights, airport taxes, accommodation on the board basis listed, airport transfers and, for Umrah and guided tours, the South Gate group leader. Visa fees are included where a visa is required.'],
  ['What happens if a departure does not fill?', 'We tell you at least 21 days before. You move to the next departure at the same price, or take a full refund. We have never cancelled a Rodrigues departure.'],
  ['Do you handle Hajj registration?', 'Yes, through the official quota. Registration opens with a Rs 50,000 deposit and a place is never confirmed by our assistant. A staff member always calls you.']
];

// Reviews rating bars.
export const RATING_BARS = [
  { star: '5', w: '86%', n: 414 },
  { star: '4', w: '9%', n: 43 },
  { star: '3', w: '3%', n: 14 },
  { star: '2', w: '1%', n: 6 },
  { star: '1', w: '1%', n: 4 }
];

// Destination marquee (dim = opacity string per mockup: i % 3 === 0 ? '.5' : '.34').
export const MARQUEE = ['Makkah', 'Madinah', 'Rodrigues', 'Dubai', 'Cairo', 'Luxor', 'Istanbul', 'Cappadocia', 'Aswan', 'Pointe Coton', 'Jeddah', 'Le Morne'].map((x, i) => ({
  txt: x,
  dim: i % 3 === 0 ? '.5' : '.34'
}));

// Category carousel cards. label/sub: use tKey when set, otherwise the literal text.
export const CAT_CARDS = [
  { k: 'umrah', labelKey: 'catUmrah', subKey: 'catUmrahSub', imgId: 'umrah-ram', to: '/umrah' },
  { k: 'rod', labelKey: 'catRod', subKey: 'catRodSub', imgId: 'cotton', to: '/rodrigues' },
  { k: 'hol', labelKey: 'catHol', subKey: 'catHolSub', imgId: 'dubai', to: '/holidays' },
  { k: 'cruise', label: 'Cruises', sub: 'MSC and Costa, from Port Louis or fly-cruise', imgId: 'cruise-io', to: '/cruises' },
  { k: 'egy', label: 'Egypt and the Nile', sub: 'Cairo, Luxor and Aswan, fully guided', imgId: 'egypt', to: '/holidays' },
  { k: 'tur', label: 'Turkey', sub: 'Istanbul and the balloons over Cappadocia', imgId: 'turkey', to: '/holidays' },
  { k: 'fly', labelKey: 'catFly', subKey: 'catFlySub', imgId: 'cruise-med', imgIndex: 1, to: '/flights' }
];

// Home search tabs.
export const SEARCH_TABS = [
  ['pkg', 'Packages'],
  ['fly', 'Flights'],
  ['umrah', 'Umrah and Hajj'],
  ['hotel', 'Hotels']
];
