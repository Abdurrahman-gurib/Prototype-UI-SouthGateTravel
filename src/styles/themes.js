// Destination-vibe theme map, shared by all themed pages.
// grade/pattern are global.css utility classes; accents are hex/tokens.
export const CAT_THEMES = {
  umrah: {
    key: 'umrah',
    grade: 'sg-grade-night',
    pattern: 'sg-pattern-arabesque',
    accent: '#C9A14E', // gold
    accentSoft: 'rgba(201,161,78,.16)',
    eyebrowClass: 'sg-gold-eyebrow',
    heroText: '#fff',
    vibe: 'arabian'
  },
  rod: {
    key: 'rod',
    grade: 'sg-grade-tropical',
    pattern: 'sg-pattern-waves',
    accent: '#48C6A9',
    accentSoft: 'rgba(72,198,169,.16)',
    eyebrowClass: '',
    heroText: '#fff',
    vibe: 'tropical'
  },
  hol: {
    key: 'hol',
    grade: 'sg-grade-nile',
    pattern: 'sg-pattern-arabesque',
    accent: '#C9A14E',
    accentSoft: 'rgba(201,161,78,.14)',
    eyebrowClass: 'sg-gold-eyebrow',
    heroText: '#fff',
    vibe: 'nile'
  },
  cruise: {
    key: 'cruise',
    grade: 'sg-grade-tropical',
    pattern: 'sg-pattern-waves',
    accent: '#17A5DA',
    accentSoft: 'rgba(23,165,218,.14)',
    eyebrowClass: '',
    heroText: '#fff',
    vibe: 'ocean'
  },
  fly: {
    key: 'fly',
    grade: 'sg-grade-night',
    pattern: 'sg-pattern-flightgrid',
    accent: '#17A5DA',
    accentSoft: 'rgba(23,165,218,.14)',
    eyebrowClass: '',
    heroText: '#fff',
    vibe: 'aviation'
  }
};

// Route-name -> theme (listing pages use route names).
export const THEME_FOR_ROUTE = {
  umrah: CAT_THEMES.umrah,
  rodrigues: CAT_THEMES.rod,
  holidays: CAT_THEMES.hol,
  cruises: CAT_THEMES.cruise,
  flights: CAT_THEMES.fly
};

export function themeForCat(cat) {
  return CAT_THEMES[cat] || CAT_THEMES.rod;
}
