// MixCharts — channel/segment mix, destination share, booking pace, enquiry heat, funnel.
// Every export is ChartCard-wrapped with a table twin derived from the same `data`
// prop it charts, so range-filtered data stays in sync in both views.

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList
} from 'recharts';
import { SERIES, SEQ, ORDINAL, INK, FONT, MONO, fmtRs, AXIS_PROPS, GRID_PROPS, LINE_PROPS, BAR_PROPS } from './theme.js';
import { ChartCard, SGTooltip, LegendRow } from './core.jsx';
import { ENQUIRY_HEAT, HEAT_DAYS, HEAT_HOURS } from '../../data/officeAnalytics.js';

const BAR_CURSOR = { fill: 'rgba(11,36,52,.04)' }; // gentle wash on bar charts
const LINE_CURSOR = { stroke: 'rgba(11,36,52,.18)' }; // crosshair on line charts

/** Legend + plot stacked in the ChartCard's fixed-height slot (plot flexes; x-axis band stays inside). */
function LegendAndPlot({ legend, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
      {legend}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>{children}</div>
    </div>
  );
}

/**
 * ChannelStacked — bookings by acquisition channel, stacked monthly bars.
 * props: data (CHANNEL_12M shape [{m, ...channel counts}]), keys (CHANNEL_KEYS), height.
 */
export function ChannelStacked({ data, keys, height = 240 }) {
  const legendItems = keys.map((k, i) => ({ label: k, color: SERIES[i] }));
  const columns = ['Month', ...keys, 'Total'];
  const rows = data.map((d) => [d.m, ...keys.map((k) => d[k] ?? 0), keys.reduce((s, k) => s + (d[k] || 0), 0)]);
  return (
    <ChartCard title="Bookings by channel" subtitle="Files opened per month, by acquisition channel" table={{ columns, rows }} height={height}>
      <LegendAndPlot legend={<LegendRow kind="rect" items={legendItems} />}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -6, bottom: 0 }}>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis dataKey="m" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} width={34} allowDecimals={false} />
            <Tooltip content={<SGTooltip />} cursor={BAR_CURSOR} />
            {keys.map((k, i) => (
              <Bar
                key={k}
                dataKey={k}
                name={k}
                stackId="a"
                fill={SERIES[i]}
                stroke="#fff"
                strokeWidth={2}
                {...BAR_PROPS}
                radius={i === keys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </LegendAndPlot>
    </ChartCard>
  );
}

/**
 * DestDonut — season-to-date revenue share by destination (donut + center total).
 * props: data (DEST_SHARE shape [{name, value}] with value in Rs 000s), height.
 */
export function DestDonut({ data, height = 240 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const colorOf = {};
  data.forEach((d, i) => {
    colorOf[d.name] = SERIES[i];
  });
  const legendItems = data.map((d, i) => ({ label: d.name + ' · ' + fmtRs(d.value * 1000), color: SERIES[i] }));
  const columns = ['Destination', 'Revenue', 'Share'];
  const rows = data.map((d) => [d.name, fmtRs(d.value * 1000), ((d.value / (total || 1)) * 100).toFixed(1) + '%']);
  // Remap swatch color by entity name (pie payloads carry the '#fff' segment stroke).
  const tipContent = (props) => {
    const payload = (props.payload || []).map((p) => ({ ...p, color: colorOf[p.name] || p.color }));
    return <SGTooltip {...props} payload={payload} fmt={(v) => fmtRs(v * 1000) + ' · ' + Math.round((v / (total || 1)) * 100) + '%'} />;
  };
  return (
    <ChartCard title="Revenue by destination" subtitle="Season to date, Rs 000s" table={{ columns, rows }} height={height}>
      <LegendAndPlot legend={<LegendRow kind="rect" items={legendItems} />}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="85%"
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              stroke="#fff"
              strokeWidth={2}
            >
              {data.map((d, i) => (
                <Cell key={d.name} fill={SERIES[i]} />
              ))}
            </Pie>
            <Tooltip content={tipContent} />
          </PieChart>
        </ResponsiveContainer>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            fontFamily: FONT
          }}
        >
          <div style={{ fontSize: 21, fontWeight: 800, color: INK.primary, fontVariantNumeric: 'tabular-nums' }}>{fmtRs(total * 1000)}</div>
          <div style={{ fontSize: 11, color: INK.muted, marginTop: 2 }}>season to date</div>
        </div>
      </LegendAndPlot>
    </ChartCard>
  );
}

/**
 * SegmentsStacked — client mix (New / Repeat / VIP) per quarter, stacked bars.
 * props: data (SEGMENTS_Q shape [{q, ...segment counts}]), keys (SEGMENT_KEYS), height.
 */
export function SegmentsStacked({ data, keys, height = 240 }) {
  const legendItems = keys.map((k, i) => ({ label: k, color: SERIES[i] }));
  const columns = ['Quarter', ...keys, 'Total'];
  const rows = data.map((d) => [d.q, ...keys.map((k) => d[k] ?? 0), keys.reduce((s, k) => s + (d[k] || 0), 0)]);
  return (
    <ChartCard title="Client mix by segment" subtitle="Files per quarter, by client segment" table={{ columns, rows }} height={height}>
      <LegendAndPlot legend={<LegendRow kind="rect" items={legendItems} />}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -6, bottom: 0 }}>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis dataKey="q" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} width={34} allowDecimals={false} />
            <Tooltip content={<SGTooltip />} cursor={BAR_CURSOR} />
            {keys.map((k, i) => (
              <Bar
                key={k}
                dataKey={k}
                name={k}
                stackId="a"
                fill={SERIES[i]}
                stroke="#fff"
                strokeWidth={2}
                {...BAR_PROPS}
                radius={i === keys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </LegendAndPlot>
    </ChartCard>
  );
}

/**
 * PaceCurves — cumulative % of capacity sold by weeks before departure, three departures.
 * props: data (PACE shape [{w, ...departure %s}]), keys (PACE_KEYS), height.
 */
export function PaceCurves({ data, keys, height = 240 }) {
  const legendItems = keys.map((k, i) => ({ label: k, color: SERIES[i] }));
  const columns = ['Weeks out', ...keys];
  const rows = data.map((d) => [d.w, ...keys.map((k) => (d[k] ?? 0) + '%')]);
  return (
    <ChartCard title="Booking pace" subtitle="Cumulative % of capacity sold, by weeks to departure" table={{ columns, rows }} height={height}>
      <LegendAndPlot legend={<LegendRow kind="line" items={legendItems} />}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 10, left: -6, bottom: 0 }}>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis dataKey="w" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} width={38} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => v + '%'} />
            <Tooltip content={<SGTooltip fmt={(v) => v + '%'} />} cursor={LINE_CURSOR} />
            {keys.map((k, i) => (
              <Line key={k} type="monotone" dataKey={k} name={k} stroke={SERIES[i]} strokeLinecap="round" strokeLinejoin="round" {...LINE_PROPS} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </LegendAndPlot>
    </ChartCard>
  );
}

/**
 * EnquiryHeatmap — CSS-grid heatmap of enquiries by day of week x two-hour block.
 * Not recharts. props: data (7 rows x 8 cols of counts), days, hours, height.
 */
export function EnquiryHeatmap({ data = ENQUIRY_HEAT, days = HEAT_DAYS, hours = HEAT_HOURS, height = 240 }) {
  const [hover, setHover] = useState(null); // { r, c, x, y, below }
  const max = data.reduce((m, row) => Math.max(m, ...row), 0);
  const fillFor = (v) => SEQ[Math.round((v / (max || 1)) * (SEQ.length - 1))];
  const blockRange = (h) => h + ':00–' + String(parseInt(h, 10) + 2).padStart(2, '0') + ':00';
  // Cell height budgeted from the card height (ramp legend + hour labels + gaps), width = 1.4x.
  const cellH = Math.max(16, (height - 66) / days.length);
  const gridMaxW = Math.round(38 + hours.length * (cellH * 1.4 + 2));
  const labelStyle = { fontFamily: MONO, fontSize: 10, color: INK.muted };
  const columns = ['Day', ...hours.map((h) => blockRange(h))];
  const rows = days.map((d, r) => [d, ...data[r]]);
  const onEnter = (r, c) => (e) => {
    const el = e.currentTarget;
    const below = r === 0;
    setHover({ r, c, x: el.offsetLeft + el.offsetWidth / 2, y: below ? el.offsetTop + el.offsetHeight + 8 : el.offsetTop - 8, below });
  };
  return (
    <ChartCard title="Enquiry heat" subtitle="Enquiries by day of week and two-hour block" table={{ columns, rows }} height={height}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0, fontFamily: FONT }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={labelStyle}>fewer</span>
          <span style={{ display: 'inline-flex', gap: 3 }}>
            {[0, 3, 6, 9, 12].map((i) => (
              <span key={i} style={{ width: 14, height: 10, borderRadius: 3, background: SEQ[i] }} />
            ))}
          </span>
          <span style={labelStyle}>more</span>
        </div>
        <div style={{ position: 'relative', flex: 1, minHeight: 0 }} onPointerLeave={() => setHover(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '38px repeat(' + hours.length + ', minmax(0, 1fr))', gap: 2, maxWidth: gridMaxW }}>
            {days.map((day, r) => (
              <React.Fragment key={day}>
                <span style={{ ...labelStyle, alignSelf: 'center' }}>{day}</span>
                {hours.map((h, c) => {
                  const on = hover && hover.r === r && hover.c === c;
                  return (
                    <div
                      key={h}
                      onPointerEnter={onEnter(r, c)}
                      style={{
                        aspectRatio: '1.4',
                        borderRadius: 4,
                        background: fillFor(data[r][c]),
                        outline: on ? '2px solid ' + INK.axisLine : 'none',
                        outlineOffset: 1
                      }}
                    />
                  );
                })}
              </React.Fragment>
            ))}
            <span />
            {hours.map((h) => (
              <span key={h} style={{ ...labelStyle, textAlign: 'center', paddingTop: 4 }}>
                {h}:00
              </span>
            ))}
          </div>
          {hover && (
            <div
              style={{
                position: 'absolute',
                left: hover.x,
                top: hover.y,
                transform: hover.below ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
                background: '#fff',
                border: '1px solid rgba(11,36,52,.1)',
                borderRadius: 8,
                boxShadow: '0 10px 24px rgba(11,36,52,.14)',
                padding: '6px 10px',
                fontSize: 11.5,
                color: INK.secondary,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 2
              }}
            >
              {days[hover.r]} {blockRange(hours[hover.c])} {'—'}{' '}
              <b style={{ color: INK.primary, fontVariantNumeric: 'tabular-nums' }}>{data[hover.r][hover.c]}</b> enquiries
            </div>
          )}
        </div>
      </div>
    </ChartCard>
  );
}

/**
 * FunnelChart — conversion funnel as horizontal bars on the ORDINAL one-hue ramp.
 * props: data (FUNNEL_STAGES shape [{k, v}]), height.
 */
export function FunnelChart({ data, height = 240 }) {
  const first = data.length ? data[0].v : 0;
  const columns = ['Stage', 'Count', '% of enquiries', '% of previous'];
  const rows = data.map((d, i) => [
    d.k,
    d.v.toLocaleString('en-US'),
    Math.round((d.v / (first || 1)) * 100) + '%',
    i === 0 ? '—' : Math.round((d.v / data[i - 1].v) * 100) + '%'
  ]);
  // Sanctioned selective labeling: value at each bar tip + muted conversion vs previous.
  const TipLabel = (props) => {
    const { x, y, width, height: h, value, index } = props;
    const prev = index > 0 ? data[index - 1].v : null;
    return (
      <text x={x + width + 8} y={y + h / 2} dominantBaseline="central" fontFamily={FONT} fontSize={12}>
        <tspan fill={INK.primary} fontWeight="700">
          {Number(value).toLocaleString('en-US')}
        </tspan>
        {prev != null && (
          <tspan fill={INK.muted} fontSize="10.5" dx="7">
            {Math.round((value / prev) * 100) + '%'}
          </tspan>
        )}
      </text>
    );
  };
  return (
    <ChartCard title="Conversion funnel" subtitle="Season to date, enquiry to travelled" table={{ columns, rows }} height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 84, left: 0, bottom: 4 }}>
          <XAxis type="number" hide domain={[0, 'dataMax']} />
          <YAxis type="category" dataKey="k" width={92} {...AXIS_PROPS} />
          <Tooltip content={<SGTooltip fmt={(v) => Number(v).toLocaleString('en-US')} />} cursor={BAR_CURSOR} />
          <Bar dataKey="v" name="files" fill={ORDINAL[3]} isAnimationActive={false} {...BAR_PROPS} radius={[0, 4, 4, 0]}>
            {data.map((d, i) => (
              <Cell key={d.k} fill={ORDINAL[i]} />
            ))}
            <LabelList dataKey="v" content={TipLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
