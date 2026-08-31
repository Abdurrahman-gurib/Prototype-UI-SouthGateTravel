import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Bar,
  Area
} from 'recharts';
import { SERIES, fmtRs, AXIS_PROPS, GRID_PROPS, LINE_PROPS, BAR_PROPS, AREA_OPACITY } from './theme.js';
import { ChartCard, SGTooltip, LegendRow } from './core.jsx';

// Rs figures in the datasets are Rs 000s.
const rsTick = (v) => 'Rs ' + v + 'K';
const rsFull = (v) => fmtRs(v * 1000);

// Crosshair cursor for line/composed charts; gentle wash for bar charts.
const CROSSHAIR = { stroke: 'rgba(11,36,52,.18)' };
const BAR_WASH = { fill: 'rgba(11,36,52,.04)' };

const MARGIN = { top: 6, right: 12, bottom: 2, left: 4 };

// X tick thinning: every 3rd label for 24 points, every 2nd for 12, all when few.
const xInterval = (n) => (n > 16 ? 2 : n > 8 ? 1 : 0);

// Forecast/projection gray (dashed series only; grid stays solid).
const FORECAST = '#8CA0AC';

const roundJoin = { strokeLinejoin: 'round', strokeLinecap: 'round' };

/** Legend + chart stacked inside ChartCard's fixed-height body. */
function ChartBody({ legend, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
      {legend}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Revenue vs forecast over REV_24M-shaped data ([{ m, revenue, forecast }]).
 * Revenue = SERIES[0] area-washed line; Forecast = dashed projection gray line.
 */
export function RevenueTrend({ data, height = 240, title = 'Revenue vs forecast', subtitle = 'Monthly revenue against forecast (Rs 000s)' }) {
  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      height={height}
      table={{
        columns: ['Month', 'Revenue', 'Forecast'],
        rows: data.map((d) => [d.m, rsFull(d.revenue), rsFull(d.forecast)])
      }}
    >
      <ChartBody
        legend={
          <LegendRow
            kind="line"
            items={[
              { label: 'Revenue', color: SERIES[0] },
              { label: 'Forecast', color: FORECAST }
            ]}
          />
        }
      >
        <ComposedChart data={data} margin={MARGIN}>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis dataKey="m" {...AXIS_PROPS} interval={xInterval(data.length)} />
          <YAxis {...AXIS_PROPS} width={48} tickFormatter={rsTick} />
          <Tooltip content={<SGTooltip fmt={rsFull} />} cursor={CROSSHAIR} />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            {...LINE_PROPS}
            {...roundJoin}
            stroke={SERIES[0]}
            fill={SERIES[0]}
            fillOpacity={AREA_OPACITY}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            name="Forecast"
            {...LINE_PROPS}
            {...roundJoin}
            stroke={FORECAST}
            strokeDasharray="6 4"
          />
        </ComposedChart>
      </ChartBody>
    </ChartCard>
  );
}

/**
 * Billed vs collected over COLLECT_12M-shaped data ([{ m, billed, collected }]).
 * Table adds a computed Outstanding column (billed - collected).
 */
export function CollectionsChart({ data, height = 240 }) {
  return (
    <ChartCard
      title="Billed vs collected"
      subtitle="Invoiced and cash collected per month (Rs 000s)"
      height={height}
      table={{
        columns: ['Month', 'Billed', 'Collected', 'Outstanding'],
        rows: data.map((d) => [d.m, rsFull(d.billed), rsFull(d.collected), rsFull(d.billed - d.collected)])
      }}
    >
      <ChartBody
        legend={
          <LegendRow
            kind="line"
            items={[
              { label: 'Billed', color: SERIES[0] },
              { label: 'Collected', color: SERIES[1] }
            ]}
          />
        }
      >
        <LineChart data={data} margin={MARGIN}>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis dataKey="m" {...AXIS_PROPS} interval={xInterval(data.length)} />
          <YAxis {...AXIS_PROPS} width={48} tickFormatter={rsTick} />
          <Tooltip content={<SGTooltip fmt={rsFull} />} cursor={CROSSHAIR} />
          <Line type="monotone" dataKey="billed" name="Billed" {...LINE_PROPS} {...roundJoin} stroke={SERIES[0]} />
          <Line type="monotone" dataKey="collected" name="Collected" {...LINE_PROPS} {...roundJoin} stroke={SERIES[1]} />
        </LineChart>
      </ChartBody>
    </ChartCard>
  );
}

/**
 * Branch bookings, grouped bars over BRANCH_12M-shaped data
 * ([{ m, Valentina, 'Rose-Belle' }]).
 */
export function BranchCompare({ data, height = 240 }) {
  return (
    <ChartCard
      title="Bookings by branch"
      subtitle="Files opened per month"
      height={height}
      table={{
        columns: ['Month', 'Valentina', 'Rose-Belle'],
        rows: data.map((d) => [d.m, d.Valentina, d['Rose-Belle']])
      }}
    >
      <ChartBody
        legend={
          <LegendRow
            kind="rect"
            items={[
              { label: 'Valentina', color: SERIES[0] },
              { label: 'Rose-Belle', color: SERIES[1] }
            ]}
          />
        }
      >
        <BarChart data={data} margin={MARGIN} barGap={2}>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis dataKey="m" {...AXIS_PROPS} interval={xInterval(data.length)} />
          <YAxis {...AXIS_PROPS} width={28} allowDecimals={false} />
          <Tooltip content={<SGTooltip fmt={(v) => v + ' bookings'} />} cursor={BAR_WASH} />
          <Bar dataKey="Valentina" name="Valentina" fill={SERIES[0]} {...BAR_PROPS} />
          <Bar dataKey="Rose-Belle" name="Rose-Belle" fill={SERIES[1]} {...BAR_PROPS} />
        </BarChart>
      </ChartBody>
    </ChartCard>
  );
}

/**
 * AI assistant weekly activity over AI_12W-shaped data
 * ([{ w, handled, escalated, holds }]).
 */
export function AIWeekly({ data, height = 240 }) {
  return (
    <ChartCard
      title="AI assistant, weekly"
      subtitle="Conversations handled, escalations and seat holds, last 12 weeks"
      height={height}
      table={{
        columns: ['Week', 'Handled', 'Escalated', 'Holds'],
        rows: data.map((d) => [d.w, d.handled, d.escalated, d.holds])
      }}
    >
      <ChartBody
        legend={
          <LegendRow
            kind="line"
            items={[
              { label: 'Handled by AI', color: SERIES[0] },
              { label: 'Escalated to staff', color: SERIES[1] },
              { label: 'Seat holds taken', color: SERIES[2] }
            ]}
          />
        }
      >
        <LineChart data={data} margin={MARGIN}>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis dataKey="w" {...AXIS_PROPS} interval={xInterval(data.length)} />
          <YAxis {...AXIS_PROPS} width={34} allowDecimals={false} />
          <Tooltip content={<SGTooltip />} cursor={CROSSHAIR} />
          <Line type="monotone" dataKey="handled" name="Handled by AI" {...LINE_PROPS} {...roundJoin} stroke={SERIES[0]} />
          <Line type="monotone" dataKey="escalated" name="Escalated to staff" {...LINE_PROPS} {...roundJoin} stroke={SERIES[1]} />
          <Line type="monotone" dataKey="holds" name="Seat holds taken" {...LINE_PROPS} {...roundJoin} stroke={SERIES[2]} />
        </LineChart>
      </ChartBody>
    </ChartCard>
  );
}
