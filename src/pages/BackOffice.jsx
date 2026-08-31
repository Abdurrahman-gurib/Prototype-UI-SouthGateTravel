import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as O from '../data/officeData.js';
import * as A from '../data/officeAnalytics.js';
import { SERIES } from '../components/charts/theme.js';
import { Sparkline, RangeRow } from '../components/charts/core.jsx';
import { RevenueTrend, CollectionsChart, BranchCompare, AIWeekly } from '../components/charts/TrendCharts.jsx';
import { ChannelStacked, DestDonut, SegmentsStacked, PaceCurves, EnquiryHeatmap, FunnelChart } from '../components/charts/MixCharts.jsx';
import AiDesk from '../components/office/AiDesk.jsx';
import './BackOffice.css';

const mono = "'IBM Plex Mono',monospace";
const sora = "'Sora',sans-serif";
const card = { background: '#fff', border: '1px solid rgba(11,36,52,.08)', borderRadius: 16 };

// Local nav extension: Analytics slots in right after the dashboard entry (officeData.js untouched).
const NAV = [O.O_NAV[0], ['an', 'AN', 'Analytics'], ...O.O_NAV.slice(1)];
const TITLES = { ...O.O_TITLES, an: ['Analytics', 'Season May 2025 to May 2026, both branches'] };

// Analytics range presets: window scopes every time-series chart in the section.
const RANGE_OPTIONS = [['6m', 'Last 6 months'], ['12m', 'Last 12 months'], ['24m', '24 months']];
const RANGE_N = { '6m': 6, '12m': 12, '24m': 24 };

// KPI tile sparklines (first three tiles only, all on the primary series slot).
const KPI_SPARKS = [A.SPARK.bookings, A.SPARK.revenue, A.SPARK.outstanding];

export default function BackOffice() {
  const navigate = useNavigate();
  const [sec, setSec] = useState('dash');
  const [range, setRange] = useState('12m');
  const [selRow, setSelRow] = useState(0);
  const [autos, setAutos] = useState([true, true, false, true, true]);
  const [aiExtra, setAiExtra] = useState([]);

  const sel = O.O_BOOKINGS[Math.min(selRow, O.O_BOOKINGS.length - 1)];

  // Range window for the Analytics time-series group (slice(-n) keeps latest months).
  const win = (arr) => arr.slice(-RANGE_N[range]);

  const chatRows = O.O_CHAT.concat(
    aiExtra.map((x) => ({ name: 'Sent by you, just now', txt: x, me: true }))
  ).map((m) => ({
    name: m.name,
    txt: m.txt,
    bg: m.me ? '#0B2434' : '#fff',
    fg: m.me ? '#fff' : '#0B2434',
    al: m.me ? 'flex-end' : 'flex-start',
    bd: m.me ? 'transparent' : 'rgba(11,36,52,.1)'
  }));

  const toggleAuto = (i) => {
    setAutos((prev) => {
      const arr = prev.slice();
      arr[i] = !arr[i];
      return arr;
    });
  };

  return (
    <div className="sgp-office-root">

      {/* ---- Sidebar ---- */}
      <div className="sgp-office-side">
        <div className="sgp-office-brand">
          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img src="/assets/southgate-logo.webp" alt="" style={{ width: 26, height: 'auto', display: 'block' }} />
          </div>
          <div>
            <div style={{ fontFamily: sora, fontSize: 13.5, fontWeight: 700, color: '#fff', lineHeight: 1.2, whiteSpace: 'nowrap' }}>South Gate</div>
            <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', whiteSpace: 'nowrap' }}>Back office</div>
          </div>
        </div>
        <div className="sgp-office-nav">
          {NAV.map((n) => {
            const active = sec === n[0];
            return (
              <button key={n[0]} onClick={() => setSec(n[0])} className={'sgp-office-navbtn' + (active ? ' is-active' : '')}>
                <span style={{ width: 26, height: 26, borderRadius: 8, background: active ? '#E1262D' : 'rgba(255,255,255,.07)', color: active ? '#fff' : 'rgba(255,255,255,.5)', fontFamily: mono, fontSize: 9.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n[1]}</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: active ? '#fff' : 'rgba(255,255,255,.52)', whiteSpace: 'nowrap' }}>{n[2]}</span>
              </button>
            );
          })}
        </div>
        <div className="sgp-office-spacer" />
        <div className="sgp-office-staff">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px' }}>
            <div style={{ width: 30, height: 30, borderRadius: 99, background: '#E1262D', color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>SV</div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>Shabnam V.</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.42)', whiteSpace: 'nowrap' }}>Valentina branch</div>
            </div>
          </div>
          <button className="sgp-office-backbtn" onClick={() => navigate('/')}>Back to the website</button>
        </div>
      </div>

      {/* ---- Main ---- */}
      <div className="sgp-office-main">
        <div className="sgp-office-head">
          <div>
            <div className="sgp-office-title">{TITLES[sec][0]}</div>
            <div style={{ fontSize: 12.5, color: '#8CA0AC', marginTop: 2 }}>{TITLES[sec][1]}</div>
          </div>
          <div style={{ flex: 1 }} />
          <div className="sgp-office-search">
            <span style={{ fontSize: 12.5, color: '#8CA0AC' }}>Search bookings, clients</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FCE3E4', borderRadius: 999, padding: '8px 14px' }}>
            <span style={{ width: 7, height: 7, borderRadius: 99, background: '#E1262D', animation: 'sgPulse 1.8s ease-in-out infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#A81820', whiteSpace: 'nowrap' }}>4 overdue</span>
          </div>
        </div>

        <div className="sgp-office-body">

          {/* ---- Dashboard ---- */}
          {sec === 'dash' && (
            <>
              <div className="sgp-office-kpi">
                {O.O_KPI.map((k, i) => (
                  <div key={k.k} style={{ ...card, padding: 20, minWidth: 0 }}>
                    <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.11em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 12 }}>{k.k}</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', minWidth: 0 }}>
                      <div style={{ fontFamily: sora, fontSize: 30, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1 }}>{k.v}</div>
                      {i < KPI_SPARKS.length && <Sparkline data={KPI_SPARKS[i]} accent={SERIES[0]} />}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: k.dc, marginTop: 8 }}>{k.d}</div>
                  </div>
                ))}
              </div>
              <div className="sgp-office-dashgrid">
                <RevenueTrend data={A.REV_24M.slice(-12)} title="Revenue booked, last 12 months" subtitle="Rs 000s per month, actual against forecast" />
                <div style={{ ...card, padding: '22px 24px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>Today at both branches</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                    {O.O_FEED.map((f) => (
                      <div key={f.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ fontFamily: mono, fontSize: 11, color: '#8CA0AC', paddingTop: 2, flexShrink: 0 }}>{f.t}</div>
                        <div style={{ width: 6, height: 6, borderRadius: 99, background: f.c, marginTop: 7, flexShrink: 0 }} />
                        <div style={{ fontSize: 13, lineHeight: 1.5, color: '#3C5464' }}>{f.txt}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ---- Analytics ---- */}
          {sec === 'an' && (
            <>
              <div style={{ marginBottom: 16 }}>
                <RangeRow value={range} onChange={setRange} options={RANGE_OPTIONS} />
              </div>
              <div className="sgp-office-angrid">
                <RevenueTrend data={win(A.REV_24M)} title="Revenue booked" subtitle="Rs 000s per month, actual against forecast" />
                <ChannelStacked data={win(A.CHANNEL_12M)} keys={A.CHANNEL_KEYS} />
                <BranchCompare data={win(A.BRANCH_12M)} />
                <CollectionsChart data={win(A.COLLECT_12M)} />
              </div>
              <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#8CA0AC', margin: '24px 2px 12px' }}>Season to date</div>
              <div className="sgp-office-angrid">
                <DestDonut data={A.DEST_SHARE} />
                <FunnelChart data={A.FUNNEL_STAGES} />
                <div className="sgp-office-anfull"><EnquiryHeatmap data={A.ENQUIRY_HEAT} days={A.HEAT_DAYS} hours={A.HEAT_HOURS} /></div>
                <div className="sgp-office-anfull"><PaceCurves data={A.PACE} keys={A.PACE_KEYS} /></div>
              </div>
            </>
          )}

          {/* ---- Bookings ---- */}
          {sec === 'book' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,540px),1fr))', gap: 14 }}>
              <div style={{ ...card, overflow: 'hidden' }}>
                <div className="sgp-office-tscroll">
                  <div style={{ minWidth: 540 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '80px minmax(0,1.35fr) minmax(0,1.35fr) minmax(0,1fr) 92px', gap: 14, padding: '14px 20px', fontFamily: mono, fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#8CA0AC', borderBottom: '1px solid rgba(11,36,52,.08)' }}>
                      <div>Ref</div><div>Client</div><div>Package</div><div>Departure</div><div>Status</div>
                    </div>
                    {O.O_BOOKINGS.map((r, i) => (
                      <button key={r.ref} onClick={() => setSelRow(i)} className={'sgp-office-row' + (i === selRow ? ' is-sel' : '')}>
                        <div style={{ fontFamily: mono, fontSize: 11.5, color: '#3C5464' }}>{r.ref}</div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.cli}</div>
                        <div style={{ fontSize: 12.5, color: '#3C5464', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.pkg}</div>
                        <div style={{ fontFamily: mono, fontSize: 11.5, color: '#3C5464' }}>{r.dep}</div>
                        <div><span style={{ display: 'inline-block', fontSize: 10.5, fontWeight: 700, padding: '5px 9px', borderRadius: 6, background: r.sb, color: r.sf }}>{r.st}</span></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ ...card, padding: '22px 24px', alignSelf: 'start' }}>
                <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 8 }}>{sel.ref}</div>
                <div style={{ fontFamily: sora, fontSize: 21, fontWeight: 800, letterSpacing: '-.028em', marginBottom: 4 }}>{sel.cli}</div>
                <div style={{ fontSize: 13, color: '#3C5464', marginBottom: 18 }}>{sel.pkg}</div>
                <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '6px 11px', borderRadius: 7, background: sel.sb, color: sel.sf, marginBottom: 20 }}>{sel.st}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid rgba(11,36,52,.08)', paddingTop: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: '#8CA0AC' }}>Departure</span><span style={{ fontWeight: 700 }}>{sel.dep}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: '#8CA0AC' }}>Travellers</span><span style={{ fontWeight: 700 }}>{sel.pax}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: '#8CA0AC' }}>Branch</span><span style={{ fontWeight: 700 }}>{sel.br}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: '#8CA0AC' }}>Total</span><span style={{ fontWeight: 700 }}>{sel.total}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: '#8CA0AC' }}>Paid</span><span style={{ fontWeight: 700, color: '#0B6B37' }}>{sel.paid}</span></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
                  <div style={{ background: '#25D366', color: '#fff', textAlign: 'center', fontSize: 13, fontWeight: 700, padding: 12, borderRadius: 10 }}>Message on WhatsApp</div>
                  <div style={{ background: '#F4F6F7', color: '#3C5464', textAlign: 'center', fontSize: 13, fontWeight: 700, padding: 12, borderRadius: 10 }}>Print the voucher</div>
                </div>
              </div>
            </div>
          )}

          {/* ---- Departures ---- */}
          {sec === 'dep' && (
            <>
              <div style={{ ...card, overflow: 'hidden', marginBottom: 14 }}>
                <div className="sgp-office-tscroll">
                  <div style={{ minWidth: 620 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) 110px minmax(0,1.5fr) 96px 96px', gap: 14, padding: '14px 22px', fontFamily: mono, fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#8CA0AC', borderBottom: '1px solid rgba(11,36,52,.08)' }}>
                      <div>Departure</div><div>Date</div><div>Seats sold</div><div>Revenue</div><div>Status</div>
                    </div>
                    {O.O_DEPS.map((d) => (
                      <div key={d.name + d.date} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) 110px minmax(0,1.5fr) 96px 96px', gap: 14, padding: '15px 22px', alignItems: 'center', borderBottom: '1px solid rgba(11,36,52,.06)' }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                        <div style={{ fontFamily: mono, fontSize: 11.5, color: '#3C5464' }}>{d.date}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                          <div style={{ flex: 1, height: 8, borderRadius: 99, background: '#F1F4F6', overflow: 'hidden', minWidth: 0 }}>
                            <div style={{ height: '100%', borderRadius: 99, background: d.c, width: d.w }} />
                          </div>
                          <div style={{ fontFamily: mono, fontSize: 11, color: '#3C5464', flexShrink: 0 }}>{d.sold}/{d.cap}</div>
                        </div>
                        <div style={{ fontFamily: sora, fontSize: 13.5, fontWeight: 700 }}>{d.rev}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: d.c }}>{d.st}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <PaceCurves data={A.PACE} keys={A.PACE_KEYS} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: 14 }}>
                <div style={{ ...card, padding: '20px 22px' }}>
                  <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.11em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 11 }}>Seats loaded</div>
                  <div style={{ fontFamily: sora, fontSize: 28, fontWeight: 800, letterSpacing: '-.03em' }}>483</div>
                </div>
                <div style={{ ...card, padding: '20px 22px' }}>
                  <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.11em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 11 }}>Sold</div>
                  <div style={{ fontFamily: sora, fontSize: 28, fontWeight: 800, letterSpacing: '-.03em', color: '#0B6B37' }}>153</div>
                </div>
                <div style={{ ...card, padding: '20px 22px' }}>
                  <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.11em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 11 }}>Average load</div>
                  <div style={{ fontFamily: sora, fontSize: 28, fontWeight: 800, letterSpacing: '-.03em' }}>69%</div>
                </div>
                <div style={{ ...card, padding: '20px 22px' }}>
                  <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.11em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 11 }}>Needs attention</div>
                  <div style={{ fontFamily: sora, fontSize: 28, fontWeight: 800, letterSpacing: '-.03em', color: '#A81820' }}>1</div>
                </div>
              </div>
            </>
          )}

          {/* ---- Clients ---- */}
          {sec === 'cli' && (
            <>
            <div style={{ marginBottom: 14 }}>
              <SegmentsStacked data={A.SEGMENTS_Q} keys={A.SEGMENT_KEYS} />
            </div>
            <div className="sgp-office-cligrid">
              {O.O_CLIENTS.map((c) => (
                <div key={c.n} className="sgp-office-clicard">
                  <div style={{ width: 42, height: 42, borderRadius: 99, background: '#0B2434', color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.ini}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 3 }}>{c.n}</div>
                    <div style={{ fontSize: 12, color: '#8CA0AC', marginBottom: 10 }}>{c.m}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: '4px 9px', borderRadius: 6, background: c.tb, color: c.tf }}>{c.tag}</span>
                      <span style={{ fontFamily: mono, fontSize: 11, color: '#3C5464' }}>{c.ph}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </>
          )}

          {/* ---- Payments ---- */}
          {sec === 'pay' && (
            <>
            <div style={{ marginBottom: 14 }}>
              <CollectionsChart data={A.COLLECT_12M} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,520px),1fr))', gap: 14 }}>
              <div style={{ ...card, overflow: 'hidden' }}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(11,36,52,.08)', fontSize: 14, fontWeight: 700 }}>Instalments due</div>
                <div className="sgp-office-tscroll">
                  <div style={{ minWidth: 520 }}>
                    {O.O_PAY_ROWS.map((p) => (
                      <div key={p.ref} style={{ display: 'grid', gridTemplateColumns: '78px minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr) 96px', gap: 12, padding: '16px 22px', alignItems: 'center', borderBottom: '1px solid rgba(11,36,52,.06)' }}>
                        <div style={{ fontFamily: mono, fontSize: 11.5, color: '#3C5464' }}>{p.ref}</div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.cli}</div>
                        <div style={{ fontFamily: mono, fontSize: 11.5, color: '#3C5464' }}>{p.due}</div>
                        <div style={{ fontFamily: sora, fontSize: 14, fontWeight: 700 }}>{p.amt}</div>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: p.sf, textAlign: 'right' }}>{p.st}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ ...card, padding: '22px 24px', alignSelf: 'start' }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 20 }}>How clients pay</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {O.O_MIX.map((m) => (
                    <div key={m.k}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 7 }}>
                        <span style={{ fontWeight: 600 }}>{m.k}</span>
                        <span style={{ fontFamily: mono, color: '#8CA0AC' }}>{m.v}</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 99, background: '#F1F4F6', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 99, background: m.c, width: m.w }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(11,36,52,.08)', fontSize: 12.5, lineHeight: 1.6, color: '#3C5464' }}>Card payments went live in March. Cash at the branch is still the second largest channel.</div>
              </div>
            </div>
            </>
          )}

          {/* ---- AI assistant ---- */}
          {sec === 'ai' && (
            <>
            <div style={{ marginBottom: 14 }}>
              <AiDesk />
            </div>
            <div className="sgp-office-aigrid">
              <div style={{ ...card, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(11,36,52,.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: '#25D366', animation: 'sgPulse 2s ease-in-out infinite' }} />
                  <span style={{ fontSize: 13.5, fontWeight: 700 }}>Reshma B.</span>
                  <span style={{ fontSize: 12, color: '#8CA0AC' }}>WhatsApp, Kreol</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0B6B37', background: '#DDF6E6', padding: '5px 10px', borderRadius: 6 }}>Handled by AI</span>
                </div>
                <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14, background: '#F7F9FA' }}>
                  {chatRows.map((m, i) => (
                    <div key={m.name + i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.al, gap: 5 }}>
                      <div style={{ maxWidth: '78%', background: m.bg, color: m.fg, border: '1px solid ' + m.bd, borderRadius: 14, padding: '13px 16px', fontSize: 13.5, lineHeight: 1.55 }}>{m.txt}</div>
                      <div style={{ fontFamily: mono, fontSize: 9.5, color: '#8CA0AC' }}>{m.name}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '16px 22px', borderTop: '1px solid rgba(11,36,52,.08)' }}>
                  <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.11em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 11 }}>Suggested replies</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {O.O_SUGG.map((s) => (
                      <button key={s} className="sgp-office-sugg" onClick={() => setAiExtra((prev) => prev.concat([s]))}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: '#0B2434', borderRadius: 16, padding: '22px 24px', color: '#fff' }}>
                  <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 14 }}>This week</div>
                  <div style={{ fontFamily: sora, fontSize: 34, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1 }}>312</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.62)', marginTop: 6 }}>messages answered without a staff reply</div>
                  <div style={{ height: 1, background: 'rgba(255,255,255,.12)', margin: '20px 0' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'rgba(255,255,255,.6)' }}>Average first reply</span><span style={{ fontWeight: 700 }}>18 seconds</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'rgba(255,255,255,.6)' }}>Escalated to staff</span><span style={{ fontWeight: 700 }}>27</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'rgba(255,255,255,.6)' }}>Bookings started</span><span style={{ fontWeight: 700 }}>41</span></div>
                  </div>
                </div>
                <div style={{ ...card, padding: '22px 24px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>What it is allowed to do</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 11, fontSize: 13, color: '#3C5464', lineHeight: 1.5 }}>
                    <div>Quote published package prices and remaining seats</div>
                    <div>Explain instalment plans and take a 48 hour seat hold</div>
                    <div>Answer in English, French or Kreol, matching the client</div>
                    <div style={{ color: '#A81820' }}>Never confirms a Hajj place. Always escalated.</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <AIWeekly data={A.AI_12W} />
            </div>
            </>
          )}

          {/* ---- Automations ---- */}
          {sec === 'auto' && (
            <div className="sgp-office-autogrid">
              {O.O_AUTO_DEFS.map((a, i) => {
                const on = autos[i];
                return (
                  <div key={a[0]} style={{ ...card, padding: '22px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 9, height: 9, borderRadius: 99, background: a[3], marginTop: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 5 }}>{a[0]}</div>
                      <div style={{ fontSize: 12.5, color: '#3C5464', lineHeight: 1.5, marginBottom: 12 }}>{a[1]}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontFamily: mono, fontSize: 10.5, color: '#8CA0AC' }}>{a[2]}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: on ? '#0B6B37' : '#8CA0AC' }}>{on ? 'Active' : 'Paused'}</span>
                      </div>
                    </div>
                    <button onClick={() => toggleAuto(i)} aria-label={(on ? 'Pause ' : 'Activate ') + a[0]} style={{ border: 0, cursor: 'pointer', padding: 0, width: 44, height: 24, borderRadius: 99, background: on ? '#0B6B37' : '#CBD5DA', position: 'relative', flexShrink: 0, transition: 'background .25s' }}>
                      <span className="sgp-office-knob" style={{ left: on ? 22 : 3 }} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ---- Reports ---- */}
          {sec === 'rep' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 14, marginBottom: 14 }}>
                <RevenueTrend data={A.REV_24M.slice(-8)} title="Sales, actual against forecast" subtitle="Rs 000s per month, last 8 months" />
                <div style={{ ...card, padding: '22px 24px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Peak season heat map</div>
                  <div style={{ fontSize: 12, color: '#8CA0AC', marginBottom: 20 }}>Share of annual bookings by month</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {O.O_PEAK.map((pk) => (
                      <div key={pk.dest} className="sgp-office-peakrow">
                        <div style={{ fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pk.dest}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 3 }}>
                          {pk.cells.map((c, i) => (
                            <div key={c.m + i} style={{ aspectRatio: '1', borderRadius: 5, background: c.bg, color: c.fg, fontSize: 8.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.m}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(11,36,52,.08)', fontSize: 12.5, color: '#3C5464', lineHeight: 1.55 }}>Rodrigues peaks in May and December. Umrah peaks with Ramadan, which moves earlier each year.</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,460px),1fr))', gap: 14 }}>
                <div style={{ ...card, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(11,36,52,.08)', fontSize: 14, fontWeight: 700 }}>Package performance</div>
                  <div className="sgp-office-tscroll">
                    <div style={{ minWidth: 560 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) 78px 88px 62px minmax(0,1fr) 56px', gap: 10, padding: '12px 22px', fontFamily: mono, fontSize: 9, letterSpacing: '.09em', textTransform: 'uppercase', color: '#8CA0AC', borderBottom: '1px solid rgba(11,36,52,.08)' }}>
                        <div>Package</div><div>Sold</div><div>Revenue</div><div>Margin</div><div>Conversion</div><div>Trend</div>
                      </div>
                      {O.O_PERF.map((pf) => (
                        <div key={pf.p} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) 78px 88px 62px minmax(0,1fr) 56px', gap: 10, padding: '14px 22px', alignItems: 'center', borderBottom: '1px solid rgba(11,36,52,.06)' }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pf.p}</div>
                          <div style={{ fontFamily: mono, fontSize: 11, color: '#3C5464' }}>{pf.sold}</div>
                          <div style={{ fontFamily: sora, fontSize: 12.5, fontWeight: 700 }}>{pf.rev}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#0B6B37' }}>{pf.mar}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, borderRadius: 99, background: '#F1F4F6', overflow: 'hidden', minWidth: 0 }}>
                              <div style={{ height: '100%', borderRadius: 99, background: '#17A5DA', width: pf.cw }} />
                            </div>
                            <span style={{ fontFamily: mono, fontSize: 10, color: '#8CA0AC', flexShrink: 0 }}>{pf.conv}</span>
                          </div>
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: pf.tc, textAlign: 'right' }}>{pf.tr}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ ...card, padding: '22px 24px' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>Enquiry to travelled</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {O.O_FUNNEL.map((fn) => (
                        <div key={fn.k}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
                            <span style={{ fontWeight: 600 }}>{fn.k}</span>
                            <span style={{ fontFamily: mono, color: '#8CA0AC' }}>{fn.v}</span>
                          </div>
                          <div style={{ height: 10, borderRadius: 99, background: '#F1F4F6', overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 99, background: fn.c, width: fn.w }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ ...card, padding: '22px 24px' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 20 }}>Revenue by destination</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {O.O_REP_BARS.map((r) => (
                        <div key={r.k}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 7 }}>
                            <span style={{ fontWeight: 700 }}>{r.k}</span>
                            <span style={{ fontFamily: mono, color: '#3C5464' }}>{r.v}</span>
                          </div>
                          <div style={{ height: 9, borderRadius: 99, background: '#F1F4F6', overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 99, background: r.c, width: r.w }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={{ ...card, padding: '20px 22px' }}>
                      <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.11em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 10 }}>Load factor</div>
                      <div style={{ fontFamily: sora, fontSize: 28, fontWeight: 800, letterSpacing: '-.03em' }}>91%</div>
                      <div style={{ fontSize: 12, color: '#3C5464', marginTop: 5 }}>14 Rodrigues departures</div>
                    </div>
                    <div style={{ ...card, padding: '20px 22px' }}>
                      <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.11em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 10 }}>Repeat rate</div>
                      <div style={{ fontFamily: sora, fontSize: 28, fontWeight: 800, letterSpacing: '-.03em' }}>24%</div>
                      <div style={{ fontSize: 12, color: '#3C5464', marginTop: 5 }}>312 of 1,284 clients</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
