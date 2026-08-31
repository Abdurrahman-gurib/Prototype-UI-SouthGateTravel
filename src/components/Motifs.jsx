import React from 'react';

/**
 * Decorative SVG motifs for the destination-vibes design system.
 * All aria-hidden, theme-able via props, block-level and full-width unless noted.
 */

/** Ocean wave section divider. Place between sections; `flip` mirrors vertically. */
export function WaveDivider({ color = '#EAF4F9', flip = false, height = 56 }) {
  return (
    <div aria-hidden="true" style={{ lineHeight: 0, transform: flip ? 'scaleY(-1)' : 'none' }}>
      <svg viewBox="0 0 1440 56" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height }}>
        <path
          d="M0 28 C 180 56 360 0 540 22 C 720 44 900 8 1080 24 C 1260 40 1380 20 1440 28 L 1440 56 L 0 56 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

/** Layered dunes divider (desert / Arabian sections). */
export function DuneDivider({ back = 'rgba(201,161,78,.18)', front = 'rgba(176,123,46,.28)', height = 64 }) {
  return (
    <div aria-hidden="true" style={{ lineHeight: 0 }}>
      <svg viewBox="0 0 1440 64" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height }}>
        <path d="M0 44 C 240 10 480 54 760 34 C 1040 14 1240 48 1440 30 L 1440 64 L 0 64 Z" fill={back} />
        <path d="M0 56 C 320 30 640 62 920 46 C 1180 32 1320 56 1440 48 L 1440 64 L 0 64 Z" fill={front} />
      </svg>
    </div>
  );
}

/** Dashed flight path with plane and endpoint dots (aviation vibe). Inline-block. */
export function FlightPath({ stroke = 'rgba(255,255,255,.55)', width = 220, height = 54, from = 'MRU', to = 'RRG', labelColor }) {
  const lc = labelColor || stroke;
  return (
    <svg aria-hidden="true" viewBox="0 0 220 54" style={{ display: 'block', width, height }}>
      <path d="M10 44 Q 110 -8 210 38" fill="none" stroke={stroke} strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
      <circle cx="10" cy="44" r="3.5" fill={stroke} />
      <circle cx="210" cy="38" r="3.5" fill={stroke} />
      {/* plane at path apex, rotated along heading */}
      <g transform="translate(110 17) rotate(12)">
        <path d="M0 -6 L2 -1 L9 1 L2 2 L1 7 L0 4 L-1 7 L-2 2 L-9 1 L-2 -1 Z" fill={stroke} />
      </g>
      <text x="10" y="34" textAnchor="middle" fontFamily="'IBM Plex Mono',monospace" fontSize="9" fill={lc} letterSpacing="1">
        {from}
      </text>
      <text x="210" y="52" textAnchor="middle" fontFamily="'IBM Plex Mono',monospace" fontSize="9" fill={lc} letterSpacing="1">
        {to}
      </text>
    </svg>
  );
}

/** Row of eight-point stars (Arabian band ornament). Inline, subtle. */
export function ArabesqueBand({ color = 'rgba(201,161,78,.55)', count = 5, size = 14 }) {
  const star = (cx) => (
    <path
      key={cx}
      transform={`translate(${cx} ${size / 2 + 2})`}
      d={`M0 ${-size / 2} L${size / 5} ${-size / 5} L${size / 2} 0 L${size / 5} ${size / 5} L0 ${size / 2} L${-size / 5} ${size / 5} L${-size / 2} 0 L${-size / 5} ${-size / 5} Z`}
      fill="none"
      stroke={color}
      strokeWidth="1"
    />
  );
  const gap = size + 14;
  const w = count * gap;
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${w} ${size + 6}`} style={{ display: 'block', width: w, height: size + 6 }}>
      {Array.from({ length: count }, (_, i) => star(i * gap + gap / 2))}
    </svg>
  );
}

/** Palm silhouette corner ornament (tropical). Absolute-position inside a relative card. */
export function PalmCorner({ color = 'rgba(255,255,255,.14)', size = 120, style = {} }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      style={{ position: 'absolute', width: size, height: size, pointerEvents: 'none', ...style }}
    >
      <g fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
        <path d="M58 96 C 56 70 54 52 50 40" />
        <path d="M50 40 C 38 30 24 28 12 34 C 26 22 42 24 50 32" />
        <path d="M50 40 C 44 26 46 14 56 6 C 50 18 52 30 54 36" />
        <path d="M50 40 C 60 28 74 24 88 30 C 74 20 58 26 52 34" />
        <path d="M50 40 C 64 36 78 40 86 50 C 74 42 60 42 52 42" />
        <path d="M50 40 C 36 38 24 44 18 54 C 28 44 42 42 48 42" />
      </g>
    </svg>
  );
}

/** Compass rose ornament (exploration accents). */
export function CompassRose({ color = 'rgba(23,165,218,.35)', size = 64, style = {} }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" style={{ width: size, height: size, display: 'block', ...style }}>
      <g fill="none" stroke={color} strokeWidth="1.4">
        <circle cx="32" cy="32" r="26" />
        <circle cx="32" cy="32" r="3.5" />
        <path d="M32 6 L36 28 L58 32 L36 36 L32 58 L28 36 L6 32 L28 28 Z" />
      </g>
    </svg>
  );
}
