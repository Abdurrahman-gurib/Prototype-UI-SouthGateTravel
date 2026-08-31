import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext.jsx';
import { cw, getPackage } from '../data/packages.js';
import { money, boardLabel, tagFor, computeTotals } from '../utils/travel.js';
import ImageSlot from '../components/ImageSlot.jsx';
import './PackageDetail.css';

export default function PackageDetail() {
  const { id } = useParams();
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const p = getPackage(id);

  const [slot, setSlot] = useState(0);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(1);

  useEffect(() => {
    setSlot(0);
  }, [id]);

  const tg = tagFor(p, t, lang);
  const meta = boardLabel(p, t);
  const priceFmt = money(p.price);
  const totalFmt = money(computeTotals(p, adults, kids, 'full').total);
  const notIncluded = lang === 'fr' ? 'Non compris' : lang === 'kr' ? 'Pa inklir' : 'Not included';
  // Clamp so a stale index (id changed before the reset effect ran) never selects out of range.
  const sIdx = Math.min(slot, Math.max(0, (p.slots || []).length - 1));

  const startBooking = () => navigate('/book/' + p.id + '?slot=' + sIdx);
  const goContact = () => navigate('/contact');

  return (
    <div>
      {/* Breadcrumb */}
      <div className="sgp-detail-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '22px 32px 0', fontSize: '12.5px', color: '#8CA0AC' }}>
        <button
          onClick={() => navigate('/')}
          style={{ border: 0, background: 'none', cursor: 'pointer', fontSize: '12.5px', color: '#8CA0AC', padding: 0 }}
        >
          {t.navHome}
        </button>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: '#0B2434', fontWeight: 600 }}>{p.name}</span>
      </div>

      {/* Photo gallery */}
      <div className="sgp-detail-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 32px 0' }}>
        <div className="sgp-detail-gallery" style={{ gap: 12 }}>
          <div className="sgp-detail-gmain" style={{ borderRadius: 20, overflow: 'hidden' }}>
            <ImageSlot src={cw(p.id, 0, 1600)} alt={p.ph} />
          </div>
          <div style={{ borderRadius: 20, overflow: 'hidden' }}>
            <ImageSlot src={cw(p.id, 1, 1400)} alt={p.phB} />
          </div>
          <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
            <ImageSlot src={cw(p.id, 2, 1400)} alt={p.phC} />
            <div style={{ position: 'absolute', right: 14, bottom: 14, background: 'rgba(11,36,52,.82)', color: '#fff', fontSize: '11.5px', fontWeight: 700, padding: '8px 13px', borderRadius: 999, pointerEvents: 'none' }}>
              {t.morePhotos}
            </div>
          </div>
        </div>
      </div>

      {/* Main grid: content + booking rail */}
      <div className="sgp-detail-container sgp-detail-main" style={{ maxWidth: 1280, margin: '0 auto', padding: '34px 32px 0', alignItems: 'start' }}>
        <div>
          <div style={{ display: 'inline-block', background: tg.bg, color: tg.fg, fontSize: '10.5px', fontWeight: 800, letterSpacing: '.05em', padding: '6px 11px', borderRadius: 999, marginBottom: 14 }}>
            {tg.txt}
          </div>
          <h1 className="sgp-detail-h1" style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, letterSpacing: '-.034em', margin: '0 0 10px', lineHeight: 1.1 }}>
            {p.name}
          </h1>
          <div style={{ fontSize: '15.5px', color: '#5B7280', marginBottom: 26 }}>
            {p.place} <span style={{ opacity: 0.4 }}>·</span> {meta}
          </div>
          <p style={{ fontSize: '16.5px', lineHeight: 1.65, color: '#3C5464', margin: '0 0 18px', maxWidth: 660 }}>{p.blurb}</p>

          {/* Chips */}
          <div style={{ display: 'flex', gap: 8, margin: '0 0 30px', flexWrap: 'wrap' }}>
            {(p.chips || []).map((c) => (
              <div key={c} style={{ background: '#F2F6F8', color: '#3C5464', fontSize: '11.5px', fontWeight: 700, padding: '7px 12px', borderRadius: 8 }}>
                {c}
              </div>
            ))}
          </div>

          {/* What is included */}
          <div style={{ borderTop: '1px solid rgba(11,36,52,.1)', paddingTop: 26, marginBottom: 30 }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: '-.024em', margin: '0 0 16px' }}>{t.included}</h2>
            <div className="sgp-detail-cols2" style={{ gap: '12px 26px' }}>
              {(p.inc || []).map((i) => (
                <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 99, background: '#12805C', flex: 'none', marginTop: 2 }}></div>
                  <div style={{ fontSize: '14.5px', lineHeight: 1.45, color: '#3C5464' }}>{i}</div>
                </div>
              ))}
            </div>
            {p.exc && (
              <>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '9.5px', letterSpacing: '.11em', textTransform: 'uppercase', color: '#8CA0AC', margin: '22px 0 12px' }}>
                  {notIncluded}
                </div>
                <div className="sgp-detail-cols2" style={{ gap: '12px 26px' }}>
                  {p.exc.map((x) => (
                    <div key={x} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                      <div style={{ width: 18, height: 18, borderRadius: 99, background: 'rgba(11,36,52,.16)', flex: 'none', marginTop: 2 }}></div>
                      <div style={{ fontSize: '14.5px', lineHeight: 1.45, color: '#5B7280' }}>{x}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Day by day */}
          <div style={{ borderTop: '1px solid rgba(11,36,52,.1)', paddingTop: 26, marginBottom: 30 }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: '-.024em', margin: '0 0 18px' }}>{t.itinerary}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {(p.itin || []).map((d) => (
                <div key={d[0] + d[1]} className="sgp-detail-itinrow" style={{ padding: '18px 0', borderBottom: '1px solid rgba(11,36,52,.07)' }}>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#E1262D', fontWeight: 600 }}>{d[0]}</div>
                  <div>
                    <div style={{ fontSize: '15.5px', fontWeight: 700, marginBottom: 5 }}>{d[1]}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.55, color: '#5B7280' }}>{d[2]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Good to know */}
          <div style={{ borderTop: '1px solid rgba(11,36,52,.1)', paddingTop: 26 }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: '-.024em', margin: '0 0 16px' }}>{t.goodToKnow}</h2>
            <div className="sgp-detail-gk" style={{ gap: 14 }}>
              {[[t.gk1t, t.gk1b], [t.gk2t, t.gk2b], [t.gk3t, t.gk3b], [t.gk4t, t.gk4b]].map((g) => (
                <div key={g[0]} style={{ background: '#F2F6F8', borderRadius: 16, padding: '20px 22px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 7 }}>{g[0]}</div>
                  <div style={{ fontSize: '13.5px', lineHeight: 1.55, color: '#5B7280' }}>{g[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky booking rail */}
        <div className="sgp-detail-rail">
          <div style={{ background: '#fff', border: '1px solid rgba(11,36,52,.11)', borderRadius: 22, padding: '26px 26px 28px', boxShadow: '0 14px 38px rgba(11,36,52,.07)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: '#8CA0AC' }}>{t.from}</span>
              <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 34, letterSpacing: '-.034em' }}>{priceFmt}</span>
            </div>
            <div style={{ fontSize: 13, color: '#8CA0AC', marginBottom: 22 }}>{t.perPerson}</div>

            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '9.5px', letterSpacing: '.11em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 9 }}>{t.selectDate}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {(p.slots || []).map((s, i) => (
                <button
                  key={s[0]}
                  onClick={() => setSlot(i)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    border: '2px solid ' + (i === sIdx ? '#17A5DA' : 'rgba(11,36,52,.12)'),
                    background: i === sIdx ? '#F2FAFE' : '#fff',
                    borderRadius: 13, padding: '13px 15px', cursor: 'pointer', textAlign: 'left', width: '100%'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{s[0]}</div>
                    <div style={{ fontSize: '11.5px', color: '#8CA0AC', marginTop: 2 }}>{s[1]}</div>
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0B2434' }}>{s[2]}</div>
                </button>
              ))}
            </div>

            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '9.5px', letterSpacing: '.11em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 9 }}>{t.trav}</div>
            <div style={{ border: '1px solid rgba(11,36,52,.12)', borderRadius: 13, padding: '4px 15px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid rgba(11,36,52,.07)' }}>
                <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{t.adults}</div></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <button onClick={() => setAdults((a) => Math.max(1, a - 1))} style={{ width: 30, height: 30, borderRadius: 99, border: '1px solid rgba(11,36,52,.16)', background: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1, color: '#0B2434' }}>−</button>
                  <div style={{ fontWeight: 700, fontSize: 15, minWidth: 14, textAlign: 'center' }}>{adults}</div>
                  <button onClick={() => setAdults((a) => Math.min(9, a + 1))} style={{ width: 30, height: 30, borderRadius: 99, border: 0, background: '#0B2434', color: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>+</button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '11px 0' }}>
                <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{t.children}</div></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <button onClick={() => setKids((k) => Math.max(0, k - 1))} style={{ width: 30, height: 30, borderRadius: 99, border: '1px solid rgba(11,36,52,.16)', background: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1, color: '#0B2434' }}>−</button>
                  <div style={{ fontWeight: 700, fontSize: 15, minWidth: 14, textAlign: 'center' }}>{kids}</div>
                  <button onClick={() => setKids((k) => Math.min(9, k + 1))} style={{ width: 30, height: 30, borderRadius: 99, border: 0, background: '#0B2434', color: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>+</button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0', borderTop: '1px solid rgba(11,36,52,.1)', marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{t.total}</span>
              <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: '-.03em' }}>{totalFmt}</span>
            </div>
            <button onClick={startBooking} className="sgp-detail-book" style={{ width: '100%', border: 0, cursor: 'pointer', background: '#E1262D', color: '#fff', fontWeight: 800, fontSize: 16, padding: 17, borderRadius: 14 }}>
              {t.bookNow}
            </button>
            <div style={{ textAlign: 'center', fontSize: 12, color: '#8CA0AC', marginTop: 11, lineHeight: 1.5 }}>{t.depositHint}</div>
          </div>

          <div style={{ background: '#F2F6F8', borderRadius: 18, padding: '20px 22px', marginTop: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{t.needHelp}</div>
            <div style={{ fontSize: 13, color: '#5B7280', lineHeight: 1.55, marginBottom: 14 }}>{t.needHelpSub}</div>
            <div style={{ display: 'flex', gap: 9 }}>
              <div style={{ flex: 1, background: '#25D366', color: '#08202E', fontSize: '12.5px', fontWeight: 800, padding: 11, borderRadius: 11, textAlign: 'center' }}>WhatsApp</div>
              <div style={{ flex: 1, background: '#0B2434', color: '#fff', fontSize: '12.5px', fontWeight: 700, padding: 11, borderRadius: 11, textAlign: 'center' }}>696 2192</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom booking bar */}
      <div style={{ position: 'sticky', bottom: 0, zIndex: 60, marginTop: 34, background: 'rgba(255,255,255,.86)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', borderTop: '1px solid rgba(255,255,255,.9)', boxShadow: '0 -8px 34px rgba(11,36,52,.10)' }}>
        <div className="sgp-detail-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '13.5px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
            <div style={{ fontSize: 12, color: '#8CA0AC', marginTop: 2 }}>{meta}</div>
          </div>
          <div style={{ flex: 1, minWidth: 12 }}></div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11.5px', color: '#8CA0AC' }}>{t.from}</div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: '-.03em' }}>{priceFmt}</div>
          </div>
          <button onClick={goContact} className="sgp-detail-askwa" style={{ border: '1px solid rgba(11,36,52,.16)', background: '#fff', color: '#0B2434', cursor: 'pointer', fontWeight: 700, fontSize: '13.5px', padding: '13px 20px', borderRadius: 999, whiteSpace: 'nowrap' }}>
            Ask on WhatsApp
          </button>
          <button onClick={startBooking} className="sgp-detail-bookbar" style={{ border: 0, cursor: 'pointer', background: 'linear-gradient(135deg,#E1262D,#B01820)', color: '#fff', fontWeight: 800, fontSize: 14, padding: '14px 28px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(225,38,45,.26)', transition: 'transform .35s' }}>
            {t.bookNow}
          </button>
        </div>
      </div>
    </div>
  );
}
