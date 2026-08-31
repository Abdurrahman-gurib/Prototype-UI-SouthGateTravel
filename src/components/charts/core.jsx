import React, { useState } from 'react';
import { INK, FONT, MONO } from './theme.js';

/**
 * ChartCard — the standard wrapper for every back-office chart.
 *
 * Contract (accessibility relief channel): every chart passes `table`
 * ({ columns: string[], rows: (string|number)[][] }) so viewers can flip to a
 * WCAG-clean table twin. Tooltips enhance, never gate.
 *
 * props: title, subtitle?, right? (extra header content), table, height (px, chart area),
 * children = the chart (should be a ResponsiveContainer).
 */
export function ChartCard({ title, subtitle, right, table, height = 240, children }) {
  const [showTable, setShowTable] = useState(false);

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(11,36,52,.08)', borderRadius: 16, padding: '20px 22px', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: INK.primary }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: INK.muted, marginTop: 3 }}>{subtitle}</div>}
        </div>
        <div style={{ flex: 1 }} />
        {right}
        <button
          onClick={() => setShowTable(!showTable)}
          aria-pressed={showTable}
          title={showTable ? 'Show chart' : 'Show data table'}
          style={{
            border: '1px solid rgba(11,36,52,.12)',
            background: showTable ? '#0B2434' : '#fff',
            color: showTable ? '#fff' : INK.secondary,
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 700,
            padding: '5px 10px',
            borderRadius: 7,
            flexShrink: 0,
            fontFamily: FONT
          }}
        >
          {showTable ? 'Chart' : 'Table'}
        </button>
      </div>

      {showTable ? (
        <div style={{ height: height + 8, overflowY: 'auto', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: FONT }}>
            <thead>
              <tr>
                {table.columns.map((c) => (
                  <th
                    key={c}
                    style={{
                      textAlign: 'left',
                      fontFamily: MONO,
                      fontSize: 9.5,
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: INK.muted,
                      fontWeight: 600,
                      padding: '6px 10px 6px 0',
                      borderBottom: '1px solid rgba(11,36,52,.1)',
                      position: 'sticky',
                      top: 0,
                      background: '#fff'
                    }}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((cell, j) => (
                    <td
                      key={j}
                      style={{
                        padding: '7px 10px 7px 0',
                        borderBottom: '1px solid rgba(11,36,52,.05)',
                        color: j === 0 ? INK.primary : INK.secondary,
                        fontWeight: j === 0 ? 700 : 500,
                        fontVariantNumeric: j === 0 ? undefined : 'tabular-nums',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ height: height + 8, minWidth: 0 }}>{children}</div>
      )}
    </div>
  );
}

/**
 * SGTooltip — custom recharts tooltip content.
 * Values lead (strong, high-contrast); series names follow; identity via a short
 * line key in the series color. Labels rendered as React text (never innerHTML).
 *
 * props (from recharts): active, payload, label; own: fmt (value formatter).
 */
export function SGTooltip({ active, payload, label, fmt }) {
  if (!active || !payload || !payload.length) return null;
  const f = fmt || ((v) => v);
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgba(11,36,52,.1)',
        borderRadius: 12,
        boxShadow: '0 12px 30px rgba(11,36,52,.14)',
        padding: '10px 14px',
        fontFamily: FONT,
        fontSize: 12.5,
        pointerEvents: 'none'
      }}
    >
      {label != null && (
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: INK.muted, marginBottom: 7 }}>
          {String(label)}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {payload.map((p) => (
          <div key={p.dataKey || p.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 0, borderTop: `3px solid ${p.color || p.stroke || p.fill}`, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ fontWeight: 800, color: INK.primary, fontVariantNumeric: 'tabular-nums' }}>{f(p.value, p)}</span>
            <span style={{ color: INK.secondary, fontSize: 12 }}>{String(p.name)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Legend swatch row (legend is always present for >= 2 series). kind: 'line' | 'rect'. */
export function LegendRow({ items, kind = 'line' }) {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
      {items.map((it) => (
        <span key={it.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: INK.secondary, fontFamily: FONT, fontWeight: 600 }}>
          {kind === 'line' ? (
            <span style={{ width: 14, height: 0, borderTop: `3px solid ${it.color}`, borderRadius: 2 }} />
          ) : (
            <span style={{ width: 10, height: 10, borderRadius: 3, background: it.color }} />
          )}
          {it.label}
        </span>
      ))}
    </div>
  );
}

/** 12-point sparkline for stat tiles (de-emphasis stroke, last point accented). */
export function Sparkline({ data, width = 96, height = 30, accent = '#2a78d6' }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((v, i) => [i * stepX, height - 3 - ((v - min) / span) * (height - 6)]);
  const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} aria-hidden="true" style={{ display: 'block' }}>
      <path d={d} fill="none" stroke="#C4CFD6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="4" fill={accent} stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

/** Range filter row — presets scope every chart below them (one row, above the charts). */
export function RangeRow({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}>
      {options.map(([k, label]) => {
        const on = value === k;
        return (
          <button
            key={k}
            onClick={() => onChange(k)}
            aria-pressed={on}
            style={{
              border: '1px solid ' + (on ? '#0B2434' : 'rgba(11,36,52,.14)'),
              background: on ? '#0B2434' : '#fff',
              color: on ? '#fff' : INK.secondary,
              cursor: 'pointer',
              borderRadius: 999,
              padding: '7px 14px',
              fontSize: 12,
              fontWeight: 700,
              fontFamily: FONT,
              transition: 'background .25s,color .25s,border-color .25s'
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
