// Chart color system for the back office (light surface: white cards).
// Categorical palette = validated reference instance (fixed slot order — never cycle,
// never re-order; assignment is by entity, stable across filters).
// Light slots below 3:1 on white (aqua/yellow/magenta) are covered by the relief
// rule: every ChartCard ships a table view, and key values are direct-labeled.

export const SERIES = [
  '#2a78d6', // 1 blue
  '#eb6834', // 2 orange
  '#1baf7a', // 3 aqua
  '#eda100', // 4 yellow
  '#e87ba4', // 5 magenta
  '#008300', // 6 green
  '#4a3aa7', // 7 violet
  '#e34948' // 8 red
];

// Sequential blue ramp (magnitude: heatmaps). 100 -> 700.
export const SEQ = ['#cde2fb', '#b7d3f6', '#9ec5f4', '#86b6ef', '#6da7ec', '#5598e7', '#3987e5', '#2a78d6', '#256abf', '#1c5cab', '#184f95', '#104281', '#0d366b'];

// Ordinal blue ramp (ordered stages: funnel). Light end >= step 250 (2:1 on surface).
export const ORDINAL = ['#86b6ef', '#5598e7', '#3987e5', '#256abf', '#1c5cab', '#104281'];

// Diverging (polarity): warm/cool poles + neutral gray midpoint.
export const DIVERGING = { pos: '#2a78d6', mid: '#f0efec', neg: '#e34948' };

// Status palette (reserved meaning; always icon + label, never a series color).
export const STATUS = { good: '#0ca30c', warning: '#fab219', serious: '#ec835a', critical: '#d03b3b' };

// De-emphasis gray for context series (emphasis form: one hue + gray).
export const DEEMPH = '#C4CFD6';

// Ink & chrome (office text tokens; text never wears a series color).
export const INK = {
  primary: '#0B2434',
  secondary: '#3C5464',
  muted: '#8CA0AC',
  grid: 'rgba(11,36,52,.07)', // hairline, solid, recessive
  axisLine: 'rgba(11,36,52,.14)',
  surface: '#ffffff'
};

export const FONT = "'Manrope',system-ui,sans-serif";
export const MONO = "'IBM Plex Mono',monospace";

// Compact Rs money for axes/tiles: 1284 -> 'Rs 1.3K', 1810000 -> 'Rs 1.81M'.
export function fmtRs(n) {
  const v = Math.abs(n);
  if (v >= 1e6) return 'Rs ' + (n / 1e6).toFixed(2) + 'M';
  if (v >= 1e3) return 'Rs ' + (n / 1e3).toFixed(v >= 100e3 ? 0 : 1) + 'K';
  return 'Rs ' + Math.round(n).toLocaleString('en-US');
}

// Plain compact number: 1842 -> '1.8K'.
export function fmtN(n) {
  const v = Math.abs(n);
  if (v >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (v >= 1e3) return (n / 1e3).toFixed(v >= 100e3 ? 0 : 1) + 'K';
  return String(Math.round(n));
}

// Shared recharts prop bundles — keep every chart on the same quiet chrome.
export const AXIS_TICK = { fill: INK.muted, fontSize: 11, fontFamily: FONT };
export const AXIS_PROPS = { tickLine: false, axisLine: { stroke: INK.axisLine, strokeWidth: 1 }, tick: AXIS_TICK };
export const GRID_PROPS = { stroke: INK.grid, strokeWidth: 1, vertical: false }; // solid hairlines, never dashed
export const LINE_PROPS = { strokeWidth: 2, dot: false, activeDot: { r: 5, strokeWidth: 2, stroke: INK.surface } };
export const BAR_PROPS = { maxBarSize: 24, radius: [4, 4, 0, 0] }; // <=24px, rounded data-end, square baseline
export const AREA_OPACITY = 0.1; // area fill is a wash
