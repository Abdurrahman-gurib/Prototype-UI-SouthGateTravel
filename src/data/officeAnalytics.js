// Back-office analytics demo data. Static and deterministic (stable renders).
// Season shape: Rodrigues peaks May + Dec, Umrah peaks with Ramadan (Feb–Mar), Dec holiday spike.

// 24 months, Jun 2024 -> May 2026. revenue/forecast in Rs 000s; bookings = files; pax = travellers.
export const REV_24M = [
  { m: 'Jun 24', revenue: 58, forecast: 55, bookings: 21, pax: 52 },
  { m: 'Jul 24', revenue: 64, forecast: 60, bookings: 24, pax: 61 },
  { m: 'Aug 24', revenue: 52, forecast: 56, bookings: 19, pax: 47 },
  { m: 'Sep 24', revenue: 47, forecast: 49, bookings: 17, pax: 41 },
  { m: 'Oct 24', revenue: 61, forecast: 58, bookings: 22, pax: 55 },
  { m: 'Nov 24', revenue: 72, forecast: 66, bookings: 26, pax: 64 },
  { m: 'Dec 24', revenue: 94, forecast: 84, bookings: 34, pax: 88 },
  { m: 'Jan 25', revenue: 66, forecast: 62, bookings: 24, pax: 58 },
  { m: 'Feb 25', revenue: 88, forecast: 78, bookings: 30, pax: 74 },
  { m: 'Mar 25', revenue: 92, forecast: 86, bookings: 31, pax: 79 },
  { m: 'Apr 25', revenue: 71, forecast: 74, bookings: 25, pax: 60 },
  { m: 'May 25', revenue: 83, forecast: 76, bookings: 29, pax: 71 },
  { m: 'Jun 25', revenue: 62, forecast: 64, bookings: 23, pax: 55 },
  { m: 'Jul 25', revenue: 71, forecast: 68, bookings: 26, pax: 63 },
  { m: 'Aug 25', revenue: 58, forecast: 61, bookings: 21, pax: 49 },
  { m: 'Sep 25', revenue: 54, forecast: 52, bookings: 19, pax: 44 },
  { m: 'Oct 25', revenue: 69, forecast: 66, bookings: 24, pax: 58 },
  { m: 'Nov 25', revenue: 81, forecast: 75, bookings: 28, pax: 69 },
  { m: 'Dec 25', revenue: 108, forecast: 96, bookings: 38, pax: 97 },
  { m: 'Jan 26', revenue: 74, forecast: 70, bookings: 26, pax: 62 },
  { m: 'Feb 26', revenue: 101, forecast: 90, bookings: 34, pax: 84 },
  { m: 'Mar 26', revenue: 106, forecast: 98, bookings: 35, pax: 87 },
  { m: 'Apr 26', revenue: 82, forecast: 84, bookings: 28, pax: 66 },
  { m: 'May 26', revenue: 96, forecast: 88, bookings: 33, pax: 78 }
];

// Bookings by acquisition channel, last 12 months (files opened).
export const CHANNEL_12M = [
  { m: 'Jun 25', WhatsApp: 9, 'Walk-in': 6, Facebook: 4, Website: 2, Phone: 2 },
  { m: 'Jul 25', WhatsApp: 10, 'Walk-in': 7, Facebook: 4, Website: 3, Phone: 2 },
  { m: 'Aug 25', WhatsApp: 8, 'Walk-in': 6, Facebook: 3, Website: 2, Phone: 2 },
  { m: 'Sep 25', WhatsApp: 8, 'Walk-in': 5, Facebook: 3, Website: 2, Phone: 1 },
  { m: 'Oct 25', WhatsApp: 10, 'Walk-in': 6, Facebook: 4, Website: 3, Phone: 1 },
  { m: 'Nov 25', WhatsApp: 12, 'Walk-in': 7, Facebook: 4, Website: 4, Phone: 1 },
  { m: 'Dec 25', WhatsApp: 16, 'Walk-in': 9, Facebook: 6, Website: 5, Phone: 2 },
  { m: 'Jan 26', WhatsApp: 11, 'Walk-in': 6, Facebook: 4, Website: 4, Phone: 1 },
  { m: 'Feb 26', WhatsApp: 15, 'Walk-in': 8, Facebook: 5, Website: 5, Phone: 1 },
  { m: 'Mar 26', WhatsApp: 16, 'Walk-in': 8, Facebook: 5, Website: 5, Phone: 1 },
  { m: 'Apr 26', WhatsApp: 12, 'Walk-in': 7, Facebook: 4, Website: 4, Phone: 1 },
  { m: 'May 26', WhatsApp: 15, 'Walk-in': 7, Facebook: 5, Website: 5, Phone: 1 }
];
export const CHANNEL_KEYS = ['WhatsApp', 'Walk-in', 'Facebook', 'Website', 'Phone'];

// Season-to-date revenue by destination (Rs 000s) — part-to-whole, 6 segments.
export const DEST_SHARE = [
  { name: 'Rodrigues', value: 640 },
  { name: 'Umrah and Hajj', value: 512 },
  { name: 'Dubai', value: 298 },
  { name: 'Egypt', value: 214 },
  { name: 'Turkey', value: 148 },
  { name: 'Cruises', value: 121 }
];

// Branch bookings per month, last 12 months — two series.
export const BRANCH_12M = [
  { m: 'Jun 25', Valentina: 13, 'Rose-Belle': 10 },
  { m: 'Jul 25', Valentina: 15, 'Rose-Belle': 11 },
  { m: 'Aug 25', Valentina: 12, 'Rose-Belle': 9 },
  { m: 'Sep 25', Valentina: 11, 'Rose-Belle': 8 },
  { m: 'Oct 25', Valentina: 14, 'Rose-Belle': 10 },
  { m: 'Nov 25', Valentina: 16, 'Rose-Belle': 12 },
  { m: 'Dec 25', Valentina: 22, 'Rose-Belle': 16 },
  { m: 'Jan 26', Valentina: 15, 'Rose-Belle': 11 },
  { m: 'Feb 26', Valentina: 19, 'Rose-Belle': 15 },
  { m: 'Mar 26', Valentina: 20, 'Rose-Belle': 15 },
  { m: 'Apr 26', Valentina: 16, 'Rose-Belle': 12 },
  { m: 'May 26', Valentina: 19, 'Rose-Belle': 14 }
];

// Billed vs collected per month (Rs 000s), last 12 months.
export const COLLECT_12M = [
  { m: 'Jun 25', billed: 62, collected: 55 },
  { m: 'Jul 25', billed: 71, collected: 64 },
  { m: 'Aug 25', billed: 58, collected: 54 },
  { m: 'Sep 25', billed: 54, collected: 49 },
  { m: 'Oct 25', billed: 69, collected: 61 },
  { m: 'Nov 25', billed: 81, collected: 70 },
  { m: 'Dec 25', billed: 108, collected: 92 },
  { m: 'Jan 26', billed: 74, collected: 68 },
  { m: 'Feb 26', billed: 101, collected: 86 },
  { m: 'Mar 26', billed: 106, collected: 93 },
  { m: 'Apr 26', billed: 82, collected: 74 },
  { m: 'May 26', billed: 96, collected: 79 }
];

// Booking pace: cumulative % of capacity sold, by weeks before departure (3 departures).
export const PACE = [
  { w: 'W-16', 'Cotton Bay 19 May': 8, 'Umrah Ramadan 2027': 22, 'Egypt Nile Oct': 5 },
  { w: 'W-14', 'Cotton Bay 19 May': 14, 'Umrah Ramadan 2027': 31, 'Egypt Nile Oct': 9 },
  { w: 'W-12', 'Cotton Bay 19 May': 22, 'Umrah Ramadan 2027': 38, 'Egypt Nile Oct': 15 },
  { w: 'W-10', 'Cotton Bay 19 May': 31, 'Umrah Ramadan 2027': 44, 'Egypt Nile Oct': 22 },
  { w: 'W-8', 'Cotton Bay 19 May': 42, 'Umrah Ramadan 2027': 51, 'Egypt Nile Oct': 31 },
  { w: 'W-6', 'Cotton Bay 19 May': 55, 'Umrah Ramadan 2027': 58, 'Egypt Nile Oct': 42 },
  { w: 'W-4', 'Cotton Bay 19 May': 66, 'Umrah Ramadan 2027': 65, 'Egypt Nile Oct': 51 },
  { w: 'W-2', 'Cotton Bay 19 May': 73, 'Umrah Ramadan 2027': 70, 'Egypt Nile Oct': 58 },
  { w: 'Now', 'Cotton Bay 19 May': 73, 'Umrah Ramadan 2027': 73, 'Egypt Nile Oct': 63 }
];
export const PACE_KEYS = ['Cotton Bay 19 May', 'Umrah Ramadan 2027', 'Egypt Nile Oct'];

// Enquiries heat: day of week x 2-hour block (count).
export const HEAT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const HEAT_HOURS = ['06', '08', '10', '12', '14', '16', '18', '20'];
export const ENQUIRY_HEAT = [
  [2, 8, 14, 11, 9, 12, 7, 3],
  [1, 7, 12, 10, 8, 10, 6, 2],
  [2, 6, 11, 9, 8, 9, 5, 2],
  [1, 7, 13, 10, 9, 11, 6, 3],
  [3, 9, 16, 13, 11, 14, 9, 4],
  [4, 12, 21, 18, 13, 10, 5, 2],
  [1, 3, 6, 7, 5, 4, 3, 1]
];

// Client base by segment, per quarter (files).
export const SEGMENTS_Q = [
  { q: 'Q3 25', New: 34, Repeat: 22, VIP: 6 },
  { q: 'Q4 25', New: 41, Repeat: 28, VIP: 7 },
  { q: 'Q1 26', New: 46, Repeat: 34, VIP: 9 },
  { q: 'Q2 26', New: 39, Repeat: 38, VIP: 11 }
];
export const SEGMENT_KEYS = ['New', 'Repeat', 'VIP'];

// AI assistant, weekly (last 12 weeks).
export const AI_12W = [
  { w: 'W09', handled: 214, escalated: 31, holds: 22 },
  { w: 'W10', handled: 231, escalated: 28, holds: 26 },
  { w: 'W11', handled: 248, escalated: 33, holds: 29 },
  { w: 'W12', handled: 240, escalated: 26, holds: 27 },
  { w: 'W13', handled: 262, escalated: 30, holds: 33 },
  { w: 'W14', handled: 255, escalated: 24, holds: 31 },
  { w: 'W15', handled: 271, escalated: 27, holds: 35 },
  { w: 'W16', handled: 266, escalated: 22, holds: 34 },
  { w: 'W17', handled: 284, escalated: 25, holds: 38 },
  { w: 'W18', handled: 279, escalated: 21, holds: 37 },
  { w: 'W19', handled: 298, escalated: 24, holds: 41 },
  { w: 'W20', handled: 312, escalated: 27, holds: 41 }
];

// Conversion funnel, season to date (ordered stages -> ordinal ramp).
export const FUNNEL_STAGES = [
  { k: 'Enquiries', v: 1842 },
  { k: 'Quoted', v: 1106 },
  { k: 'Seat held', v: 498 },
  { k: 'Deposit paid', v: 312 },
  { k: 'Travelled', v: 289 }
];

// KPI sparklines (12 points, last 12 months).
export const SPARK = {
  bookings: [23, 26, 21, 19, 24, 28, 38, 26, 34, 35, 28, 33],
  revenue: [62, 71, 58, 54, 69, 81, 108, 74, 101, 106, 82, 96],
  outstanding: [18, 17, 14, 16, 19, 24, 34, 21, 30, 28, 25, 32],
  pax: [55, 63, 49, 44, 58, 69, 97, 62, 84, 87, 66, 78]
};
