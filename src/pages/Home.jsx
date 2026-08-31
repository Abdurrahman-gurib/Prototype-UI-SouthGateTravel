import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext.jsx';
import { PKGS, cw } from '../data/packages.js';
import { BOARD, STEPS, WHEN, TRUST, BENEFITS, FAQS, RATING_BARS, MARQUEE, CAT_CARDS, SEARCH_TABS } from '../data/homeData.js';
import { money, boardLabel, tagFor, boardRow, travLine } from '../utils/travel.js';
import ImageSlot from '../components/ImageSlot.jsx';
import { WaveDivider, DuneDivider, FlightPath, ArabesqueBand, PalmCorner, CompassRose } from '../components/Motifs.jsx';
import './Home.css';

const mono = "'IBM Plex Mono',monospace";
const sora = "'Sora',sans-serif";
const rise = {
  animation: 'sgRise .85s cubic-bezier(.2,.7,.25,1) both',
  animationTimeline: 'view()',
  animationRange: 'entry 0% cover 22%'
};
const eyebrowStyle = (color) => ({
  fontFamily: mono, fontSize: 10.5, letterSpacing: '.13em', textTransform: 'uppercase',
  color, marginBottom: 14
});
const glassCard = {
  background: 'rgba(255,255,255,.78)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,.88)', boxShadow: '0 10px 30px rgba(11,36,52,.07)'
};

// Departure board runs on a night surface: same seat semantics (red/amber/green),
// lifted a step brighter so they read on dark. Falls back to the original colour.
const SEAT_DARK = { '#E1262D': '#FF8A8E', '#8A6100': '#E5B34A', '#0B6B37': '#4ADE80' };
const CHIP_DARK = { '#E1262D': 'rgba(240,101,106,.16)', '#8A6100': 'rgba(229,179,74,.15)', '#0B6B37': 'rgba(74,222,128,.13)' };

// Tiny decorative strokes for card corners (visual only, aria-hidden).
function Wavelet({ color = 'rgba(255,255,255,.7)', width = 34 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 34 12" style={{ display: 'block', width, height: Math.round(width * 12 / 34) }}>
      <path d="M1 8c4-5 8-5 12 0s8 5 12 0 6-4 8-2" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function DuneMini({ color = 'rgba(201,161,78,.8)', width = 34 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 34 12" style={{ display: 'block', width, height: Math.round(width * 12 / 34) }}>
      <path d="M1 10c5-7 11-7 16-2" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M13 10c5-6 12-7 20-3" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// One small vibe mark per category card — kept tiny and quiet.
function catMotif(k) {
  switch (k) {
    case 'umrah': return <ArabesqueBand color="rgba(201,161,78,.9)" count={3} size={11} />;
    case 'rod': return <PalmCorner color="rgba(255,255,255,.8)" size={26} style={{ position: 'static' }} />;
    case 'hol': return <CompassRose color="rgba(255,255,255,.75)" size={22} />;
    case 'cruise': return <Wavelet />;
    case 'egy': return <DuneMini color="rgba(201,161,78,.9)" />;
    case 'tur': return <CompassRose color="rgba(255,255,255,.75)" size={22} />;
    case 'fly': return <FlightPath stroke="rgba(255,255,255,.8)" width={92} height={23} />;
    default: return null;
  }
}

// Destination-appropriate whisper for each seasons card (indexed to WHEN order).
function seasonMotif(i) {
  switch (i) {
    case 0: return <PalmCorner color="rgba(23,165,218,.5)" size={30} style={{ position: 'static' }} />;
    case 1: return <ArabesqueBand color="rgba(201,161,78,.75)" count={2} size={11} />;
    case 2: return <DuneMini color="rgba(124,47,38,.55)" />;
    case 3: return <FlightPath stroke="rgba(225,38,45,.4)" labelColor="transparent" width={84} height={21} to="DXB" />;
    case 4: return <Wavelet color="rgba(14,127,171,.55)" />;
    case 5: return <Wavelet color="rgba(11,107,55,.5)" />;
    default: return null;
  }
}

// How many carousel cards are visible at the current viewport width.
function getPerView() {
  if (typeof window === 'undefined' || !window.matchMedia) return 3;
  if (window.matchMedia('(max-width: 768px)').matches) return 1;
  if (window.matchMedia('(max-width: 1024px)').matches) return 2;
  return 3;
}

export default function Home() {
  const navigate = useNavigate();
  const { lang, t } = useLang();

  const [tab, setTab] = useState('pkg');
  const [cat, setCat] = useState(0);
  const [car, setCar] = useState(0);
  const [faq, setFaq] = useState(-1);
  const [perView, setPerView] = useState(getPerView);
  const catHoldRef = useRef(0);

  useEffect(() => {
    const onResize = () => setPerView(getPerView());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ----- Category carousel (auto-advances every 4.5s, pauses 9s after a manual interaction) -----
  const catPages = Math.max(1, CAT_CARDS.length - (perView - 1));
  const cati = Math.min(Math.max(cat, 0), catPages - 1);
  const catShift = perView === 3
    ? 'translateX(calc(' + (-cati * 33.3333) + '% - ' + (cati * 18 * 0.6667) + 'px))'
    : 'translateX(calc(' + (-cati * (100 / perView)) + '% - ' + (cati * (18 / perView)) + 'px))';
  const catHold = () => { catHoldRef.current = Date.now(); };
  const catPrev = () => { catHold(); setCat((cati - 1 + catPages) % catPages); };
  const catNext = () => { catHold(); setCat((cati + 1) % catPages); };

  useEffect(() => {
    const id = setInterval(() => {
      if (catHoldRef.current && Date.now() - catHoldRef.current < 9000) return;
      setCat((c) => (c + 1) % catPages);
    }, 4500);
    return () => clearInterval(id);
  }, [catPages]);

  const catCards = CAT_CARDS.map((c) => ({
    k: c.k,
    label: c.labelKey ? t[c.labelKey] : c.label,
    sub: c.subKey ? t[c.subKey] : c.sub,
    img: cw(c.imgId, c.imgIndex || 0, 1200),
    to: c.to
  }));

  // ----- Featured packages carousel -----
  const card = (p) => {
    const tg = tagFor(p, t, lang);
    return {
      id: p.id, name: p.name, place: p.place, meta: boardLabel(p, t), price: money(p.price),
      ph: p.ph, img: cw(p.id, 0, 900), tag: tg.txt, tagBg: tg.bg, tagFg: tg.fg
    };
  };
  const carAll = PKGS.map(card);
  const carPages = Math.max(1, Math.ceil(carAll.length / perView));
  const ci = Math.min(Math.max(car, 0), carPages - 1);
  const carShift = 'translateX(calc(' + (-100 * ci) + '% - ' + (22 * ci) + 'px))';
  const carLabel = (ci + 1) + ' / ' + carPages;
  const carPrev = () => setCar((ci - 1 + carPages) % carPages);
  const carNext = () => setCar((ci + 1) % carPages);

  // ----- Departures board -----
  const board = BOARD.map((b) => boardRow(b, lang));

  const openPkg = (id) => navigate('/package/' + id);
  const travLineTxt = travLine(2, 1, lang);

  const reviews = [
    { txt: t.rev1, name: 'Nazreen S.', av: '#E8F6FC' },
    { txt: t.rev2, name: 'Jean-Luc A.', av: '#FDECEC' },
    { txt: t.rev3, name: 'Ahmad K.', av: '#E7F5F0' }
  ];

  return (
    <div>

      {/* ============ Hero ============ */}
      <div className="sgp-home-hero">
        <div style={{ position: 'absolute', inset: '-7%' }}>
          <ImageSlot
            kenburns
            src="https://commons.wikimedia.org/wiki/Special:FilePath/West_coast_of_Mauritius_(53698228720).jpg?width=3000"
            alt="Drop your own hero photo here"
          />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg,rgba(8,32,48,.82) 2%,rgba(10,54,78,.42) 44%,rgba(23,165,218,.06) 86%)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 88% 12%,rgba(255,178,84,.34) 0%,rgba(255,178,84,0) 58%)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 230, background: 'linear-gradient(180deg,rgba(8,27,40,0) 0%,rgba(8,27,40,.58) 56%,rgba(8,27,40,.94) 100%)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div className="sgp-home-hero-pad">
            <div style={{ maxWidth: 620 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22, flexWrap: 'wrap', marginBottom: 24 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.16)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,.3)', boxShadow: '0 8px 28px rgba(0,0,0,.16)', color: '#fff', fontFamily: mono, fontSize: 11, letterSpacing: '.11em', textTransform: 'uppercase', padding: '9px 16px', borderRadius: 999 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: '#4ADE80', animation: 'sgPulse 2s ease-in-out infinite' }}></span>{t.heroBadge}
                </div>
                <div className="sg-hide-mobile sgp-home-heropath" style={{ opacity: .9 }}>
                  <FlightPath stroke="rgba(255,255,255,.42)" labelColor="rgba(255,255,255,.6)" width={180} height={44} from="MRU" to="WORLD" />
                </div>
              </div>
              <h1 className="sgp-home-h1">{t.heroTitle}</h1>
              <p style={{ fontSize: 19, lineHeight: 1.55, color: 'rgba(255,255,255,.82)', margin: 0, maxWidth: 520 }}>{t.heroSub}</p>
            </div>
            <div className="sgp-home-chips" aria-hidden="true">
              <div className="sgp-home-chip"><span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--sg-gold)', flexShrink: 0 }}></span>IATA · since 2010</div>
              <div className="sgp-home-chip"><span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--sg-gold)', flexShrink: 0 }}></span>88,000 followers</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Search card (boarding pass) ============ */}
      <div style={{ maxWidth: 1280, margin: '-64px auto 0', padding: '0 32px', position: 'relative', zIndex: 5 }}>
        <div className="sgp-home-tabs">
          {SEARCH_TABS.map(([k, label]) => {
            const on = tab === k;
            return (
              <button
                key={k}
                onClick={() => setTab(k)}
                style={{ border: 0, cursor: 'pointer', fontSize: 13, fontWeight: 700, padding: '11px 22px', borderRadius: 999, background: on ? '#fff' : 'transparent', color: on ? '#0B2434' : 'rgba(255,255,255,.82)', boxShadow: on ? '0 4px 14px rgba(11,36,52,.24)' : 'none', transition: 'background .3s,color .3s' }}
              >{label}</button>
            );
          })}
        </div>
        <div className="sg-ticket sgp-home-search">
          <div className="sgp-home-srow">
            <div className="sgp-home-sf sgp-home-sf1">
              <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.13em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 6 }}>{t.dest}</div>
              <div style={{ fontSize: 15.5, fontWeight: 700 }}>Rodrigues</div>
            </div>
            <div className="sgp-home-sf sgp-home-sf2">
              <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.13em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 6 }}>{t.dates}</div>
              <div style={{ fontSize: 15.5, fontWeight: 700 }}>19 to 22 May 2026</div>
            </div>
            <div className="sgp-home-sf sgp-home-sf3">
              <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.13em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 6 }}>{t.trav}</div>
              <div style={{ fontSize: 15.5, fontWeight: 700 }}>{travLineTxt}</div>
            </div>
            <div className="sgp-home-sf sgp-home-sf4">
              <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.13em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 6 }}>{t.budget}</div>
              <div style={{ fontSize: 15.5, fontWeight: 700 }}>{t.anyBudget}</div>
            </div>
          </div>
          <div className="sg-ticket-divider sgp-home-tickcut" aria-hidden="true"></div>
          <div className="sgp-home-tickrow">
            <div className="sg-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 14 }} aria-hidden="true">
              <div className="sg-gold-rule" style={{ width: 34 }}></div>
              <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: '#8CA0AC', whiteSpace: 'nowrap' }}>SGT · MRU ✈ RRG</div>
            </div>
            <div style={{ flex: 1 }}></div>
            <button
              className="sgp-home-searchbtn"
              onClick={() => navigate('/rodrigues')}
              style={{ border: 0, cursor: 'pointer', background: 'linear-gradient(135deg,#17A5DA,#0E7FAB 55%,#0B6489)', color: '#fff', fontWeight: 800, fontSize: 15, padding: '17px 38px', borderRadius: 14, boxShadow: '0 12px 28px rgba(23,165,218,.36)' }}
            >{t.searchBtn}</button>
          </div>
        </div>
      </div>

      {/* ============ Promo duo ============ */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '34px 32px 0' }}>
        <div className="sgp-home-duo" style={rise}>
          <div className="sg-grade-night sg-pattern-arabesque" style={{ borderRadius: 22, padding: '26px 28px', display: 'flex', alignItems: 'center', gap: 22, boxShadow: '0 18px 44px rgba(11,36,52,.18)' }}>
            <div style={{ width: 8, height: 8, borderRadius: 99, background: '#4ADE80', flexShrink: 0, animation: 'sgPulse 2s ease-in-out infinite' }}></div>
            <div style={{ minWidth: 0 }}>
              <div className="sg-gold-eyebrow" style={{ fontSize: 10, marginBottom: 7 }}>Come and see us</div>
              <div style={{ fontFamily: sora, fontSize: 19, fontWeight: 800, letterSpacing: '-.022em', color: '#fff', marginBottom: 5 }}>Salon Pret a Partir 2026, SVCC</div>
              <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.66)', lineHeight: 1.5 }}>Our team is on the stand for the whole fair. Fair prices held for anyone who books at the salon.</div>
            </div>
          </div>
          <button className="sgp-home-duored sg-grade-sunset" onClick={() => navigate('/flights')} style={{ border: 0, cursor: 'pointer', textAlign: 'left', borderRadius: 22, padding: '26px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 18px 44px rgba(225,38,45,.22)', position: 'relative', overflow: 'hidden' }}>
            <PalmCorner color="rgba(255,255,255,.18)" size={118} style={{ top: -18, right: -12 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.72)', marginBottom: 7 }}>Airfare only</div>
              <div style={{ fontFamily: sora, fontSize: 19, fontWeight: 800, letterSpacing: '-.022em', color: '#fff', marginBottom: 5 }}>Rodrigues flight, no package</div>
              <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.82)', lineHeight: 1.5 }}>Return air tickets from Rs 6,300. Book the flight with us and arrange your own stay.</div>
            </div>
          </button>
        </div>
      </div>

      {/* ============ Trust strip ============ */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '34px 32px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,215px),1fr))', gap: 1, background: 'rgba(11,36,52,.09)', borderRadius: 18, overflow: 'hidden', ...rise }}>
          {TRUST.map((tr) => (
            <div key={tr.k} style={{ background: 'rgba(255,255,255,.8)', backdropFilter: 'blur(14px)', padding: '20px 22px' }}>
              <div style={{ fontSize: 13.5, fontWeight: 800, letterSpacing: '-.01em', marginBottom: 4 }}>{tr.k}</div>
              <div style={{ fontSize: 12.5, color: '#5B7280', lineHeight: 1.45 }}>{tr.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ Destination marquee ============ */}
      <div style={{ margin: '56px 0 0', padding: '16px 0', overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)', maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'sgMarq 68s linear infinite' }}>
          {['a', 'b'].map((dup) =>
            MARQUEE.map((m, i) => (
              <div key={dup + '-' + i} style={{ display: 'flex', alignItems: 'center', gap: 34, paddingRight: 34, flexShrink: 0 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.24em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: 'rgba(11,36,52,' + m.dim + ')' }}>{m.txt}</span>
                <span style={{ width: 3, height: 3, borderRadius: 99, background: 'rgba(11,36,52,.2)', flexShrink: 0 }}></span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ============ Departures board (airport night screen) ============ */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 0' }}>
        <div className="sg-grade-night sg-pattern-flightgrid" style={{ border: '1px solid rgba(255,255,255,.08)', boxShadow: '0 24px 60px rgba(8,27,40,.35)', borderRadius: 22, overflow: 'hidden', position: 'relative' }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,rgba(201,161,78,0),#C9A14E 18%,#C9A14E 82%,rgba(201,161,78,0))' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '19px 26px 17px', background: 'rgba(255,255,255,.04)', borderBottom: '1px solid rgba(255,255,255,.09)' }}>
            <div style={{ width: 8, height: 8, borderRadius: 99, background: '#E1262D', animation: 'sgPulse 2s ease-in-out infinite' }}></div>
            <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: '#fff', fontWeight: 600 }}>{t.boardTitle}</div>
            <div style={{ flex: 1 }}></div>
            <div style={{ fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,.45)' }}>{t.boardNote}</div>
          </div>
          <div className="sgp-home-boardscroll">
            <div className="sgp-home-boardgrid" style={{ padding: '12px 26px', fontFamily: mono, fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(229,179,74,.9)', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
              <div>{t.bDest}</div><div>{t.bDate}</div><div>{t.bSeats}</div><div>{t.bPrice}</div><div></div>
            </div>
            {board.map((b) => (
              <div key={b.id} className="sgp-home-boardgrid sgp-home-brow" onClick={() => openPkg(b.id)} style={{ padding: '14px 26px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                  <img src={b.img} alt="" style={{ width: 52, height: 52, borderRadius: 13, objectFit: 'cover', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,.4)', border: '1px solid rgba(255,255,255,.12)' }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.place}</div>
                  </div>
                </div>
                <div style={{ fontFamily: mono, fontSize: 12.5, color: 'rgba(255,255,255,.75)' }}>{b.date}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: SEAT_DARK[b.seatC] || b.seatC }}>{b.seats}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: CHIP_DARK[b.seatC] || b.chipBg, color: SEAT_DARK[b.seatC] || b.seatC, whiteSpace: 'nowrap' }}>{b.chip}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,.14)', overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: 99, background: b.barBg, width: b.w }}></div></div>
                </div>
                <div style={{ fontFamily: sora, fontSize: 15, fontWeight: 700, color: '#fff' }}>{b.price}</div>
                <div>
                  <button className="sgp-home-bookbtn" onClick={(e) => { e.stopPropagation(); openPkg(b.id); }} style={{ border: '1px solid rgba(255,255,255,.3)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, padding: '9px 16px', borderRadius: 999, width: '100%' }}>{t.bookNow}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ Category carousel ============ */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '76px 32px 0', ...rise }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 22, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.13em', textTransform: 'uppercase', color: '#E1262D', marginBottom: 12 }}>Where we send people</div>
            <h2 className="sgp-home-h40" style={{ fontFamily: sora, fontWeight: 800, letterSpacing: '-.032em', margin: 0 }}>Pick a direction.</h2>
          </div>
          <div style={{ flex: 1 }}></div>
          <div style={{ display: 'flex', gap: 9 }}>
            <button className="sgp-home-navbtn" onClick={catPrev} style={{ border: '1px solid rgba(11,36,52,.14)', background: 'rgba(255,255,255,.75)', backdropFilter: 'blur(14px)', cursor: 'pointer', width: 46, height: 46, borderRadius: 999, fontSize: 17, fontWeight: 700, color: '#0B2434', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'←'}</button>
            <button className="sgp-home-navbtn" onClick={catNext} style={{ border: '1px solid rgba(11,36,52,.14)', background: 'rgba(255,255,255,.75)', backdropFilter: 'blur(14px)', cursor: 'pointer', width: 46, height: 46, borderRadius: 999, fontSize: 17, fontWeight: 700, color: '#0B2434', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'→'}</button>
          </div>
        </div>
        <div style={{ overflow: 'hidden', padding: '6px 4px 12px', margin: '0 -4px' }}>
          <div style={{ display: 'flex', gap: 18, transition: 'transform .8s cubic-bezier(.22,.72,.2,1)', transform: catShift, willChange: 'transform' }}>
            {catCards.map((cc) => (
              <button key={cc.k} className="sgp-home-catcard sg-photo-grade" onClick={() => navigate(cc.to)} style={{ border: 0, padding: 0, cursor: 'pointer', position: 'relative', borderRadius: 28, overflow: 'hidden', textAlign: 'left', display: 'block', boxShadow: '0 14px 36px rgba(11,36,52,.12)' }}>
                <img src={cc.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 18, left: 18, zIndex: 1, background: 'rgba(255,255,255,.16)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 999, padding: '8px 14px', fontFamily: mono, fontSize: 10, letterSpacing: '.13em', textTransform: 'uppercase', color: '#fff', pointerEvents: 'none' }}>Explore</div>
                <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, zIndex: 1, pointerEvents: 'none', background: 'rgba(255,255,255,.14)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,.26)', borderRadius: 22, padding: '22px 24px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14 }}>
                    <div style={{ fontFamily: sora, fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: '-.026em', lineHeight: 1.15 }}>{cc.label}</div>
                    <div aria-hidden="true" style={{ flexShrink: 0, opacity: .9, paddingBottom: 4 }}>{catMotif(cc.k)}</div>
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,.78)', marginTop: 9, lineHeight: 1.45 }}>{cc.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 7, marginTop: 6 }}>
          {Array.from({ length: catPages }, (_, i) => (
            <button
              key={i}
              onClick={() => { catHold(); setCat(i); }}
              style={{ border: 0, cursor: 'pointer', height: 9, width: i === cati ? 30 : 9, borderRadius: 99, background: i === cati ? '#E1262D' : 'rgba(11,36,52,.18)', transition: 'width .45s cubic-bezier(.2,.7,.25,1),background .45s', padding: 0 }}
            ></button>
          ))}
        </div>
      </div>

      {/* ============ Featured packages carousel ============ */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.13em', textTransform: 'uppercase', color: '#E1262D', marginBottom: 12 }}>{t.featEyebrow}</div>
            <h2 className="sgp-home-h38" style={{ fontFamily: sora, fontWeight: 800, letterSpacing: '-.032em', margin: 0 }}>{t.featTitle}</h2>
          </div>
          <div style={{ flex: 1 }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button className="sgp-home-navbtn" onClick={carPrev} style={{ border: '1px solid rgba(11,36,52,.14)', background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(14px)', cursor: 'pointer', width: 46, height: 46, borderRadius: 999, fontSize: 17, fontWeight: 700, color: '#0B2434', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'←'}</button>
            <button className="sgp-home-navbtn" onClick={carNext} style={{ border: '1px solid rgba(11,36,52,.14)', background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(14px)', cursor: 'pointer', width: 46, height: 46, borderRadius: 999, fontSize: 17, fontWeight: 700, color: '#0B2434', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{'→'}</button>
            <button onClick={() => navigate('/holidays')} style={{ border: '1px solid rgba(11,36,52,.15)', background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(14px)', cursor: 'pointer', fontSize: 13.5, fontWeight: 700, padding: '13px 22px', borderRadius: 999, color: '#0B2434' }}>{t.viewAll}</button>
          </div>
        </div>
        <div style={{ overflow: 'hidden', padding: '6px 4px 10px', margin: '0 -4px' }}>
          <div style={{ display: 'flex', gap: 22, transition: 'transform .65s cubic-bezier(.22,.72,.2,1)', transform: carShift, willChange: 'transform' }}>
            {carAll.map((p) => (
              <button key={p.id} className="sgp-home-featcard" onClick={() => openPkg(p.id)} style={{ border: '1px solid rgba(255,255,255,.85)', background: 'rgba(255,255,255,.8)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', boxShadow: '0 10px 30px rgba(11,36,52,.08)', borderRadius: 24, overflow: 'hidden', padding: 0, cursor: 'pointer', textAlign: 'left', display: 'block' }}>
                <div style={{ position: 'relative', height: 222, overflow: 'hidden' }}>
                  <ImageSlot src={p.img} alt={p.ph} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(8,28,42,.34),rgba(8,28,42,0) 52%)', pointerEvents: 'none' }}></div>
                  <div style={{ position: 'absolute', top: 14, left: 14, background: p.tagBg, color: p.tagFg, fontSize: 10.5, fontWeight: 800, letterSpacing: '.05em', padding: '7px 12px', borderRadius: 999, pointerEvents: 'none', boxShadow: '0 6px 16px rgba(0,0,0,.16)' }}>{p.tag}</div>
                </div>
                <div style={{ padding: '20px 22px 22px' }}>
                  <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.11em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 9 }}>{p.place}</div>
                  <div style={{ fontFamily: sora, fontWeight: 700, fontSize: 20, letterSpacing: '-.02em', lineHeight: 1.25 }}>{p.name}</div>
                  <div style={{ fontSize: 13.5, color: '#5B7280', marginTop: 8, lineHeight: 1.45 }}>{p.meta}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(11,36,52,.08)' }}>
                    <div>
                      <div style={{ fontSize: 11.5, color: '#8CA0AC' }}>{t.from}</div>
                      <div style={{ fontFamily: sora, fontWeight: 800, fontSize: 24, letterSpacing: '-.03em' }}>{p.price}</div>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg,#0B2434,#12455F)', color: '#fff', fontSize: 12.5, fontWeight: 700, padding: '12px 20px', borderRadius: 999, boxShadow: '0 8px 20px rgba(11,36,52,.24)' }}>{t.details}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22 }}>
          <div style={{ display: 'flex', gap: 7 }}>
            {Array.from({ length: carPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCar(i)}
                style={{ border: 0, cursor: 'pointer', height: 9, width: i === ci ? 30 : 9, borderRadius: 99, background: i === ci ? '#E1262D' : 'rgba(11,36,52,.18)', transition: 'width .45s cubic-bezier(.2,.7,.25,1),background .45s', padding: 0 }}
              ></button>
            ))}
          </div>
          <div style={{ flex: 1 }}></div>
          <div style={{ fontFamily: mono, fontSize: 11.5, color: '#8CA0AC' }}>{carLabel}</div>
        </div>
      </div>

      {/* ============ Why South Gate (sand-calm, gold-ringed stats) ============ */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px 0' }}>
        <div className="sgp-home-why" style={{ background: 'linear-gradient(135deg,rgba(249,244,232,.95),rgba(255,255,255,.82) 50%,rgba(242,232,210,.9))', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.8)', boxShadow: '0 20px 52px rgba(11,36,52,.08)', borderRadius: 28, ...rise }}>
          <div>
            <div className="sg-gold-eyebrow" style={{ marginBottom: 14, color: 'var(--sg-gold-deep)' }}>{t.whyEyebrow}</div>
            <h2 className="sgp-home-h34" style={{ fontFamily: sora, fontWeight: 800, letterSpacing: '-.032em', margin: '0 0 14px', lineHeight: 1.15 }}>{t.whyTitle}</h2>
            <div className="sg-gold-rule" style={{ marginBottom: 16 }}></div>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#5B7280', margin: '0 0 26px' }}>{t.whyBody}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/about')} style={{ border: 0, cursor: 'pointer', background: '#0B2434', color: '#fff', fontWeight: 700, fontSize: 14, padding: '14px 24px', borderRadius: 999 }}>{t.aboutUs}</button>
              <button onClick={() => navigate('/contact')} style={{ border: '1px solid rgba(11,36,52,.16)', cursor: 'pointer', background: '#fff', color: '#0B2434', fontWeight: 700, fontSize: 14, padding: '14px 24px', borderRadius: 999 }}>{t.navContact}</button>
            </div>
          </div>
          <div className="sgp-home-statgrid">
            {[
              { val: '88K', c: null, txt: t.stat1 },
              { val: '96%', c: '#17A5DA', txt: t.stat2 },
              { val: 'IATA', c: null, txt: t.stat3 },
              { val: '2', c: '#E1262D', txt: t.stat4 }
            ].map((s) => (
              <div key={s.val} className="sgp-home-stat sg-gold-ring" style={{ background: '#fff', borderRadius: 20, padding: '22px 22px 24px' }}>
                <div style={{ fontFamily: sora, fontWeight: 800, fontSize: 34, letterSpacing: '-.03em', lineHeight: 1, ...(s.c ? { color: s.c } : {}) }}>{s.val}</div>
                <div style={{ fontSize: 13, color: '#5B7280', marginTop: 7, lineHeight: 1.4 }}>{s.txt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ Reviews (lagoon band) ============ */}
      <div style={{ marginTop: 80 }}>
        <WaveDivider color="#EAFAF6" height={56} />
        <div className="sg-grade-lagoon" style={{ padding: '40px 0 64px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
            <h2 className="sgp-home-h36" style={{ fontFamily: sora, fontWeight: 800, letterSpacing: '-.032em', margin: '0 0 26px', ...rise }}>{t.revTitle}</h2>
            <div style={{ display: 'grid', gap: 24, marginBottom: 22, alignItems: 'center', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))' }}>
              <div style={{ ...glassCard, borderRadius: 22, padding: '26px 28px', textAlign: 'center' }}>
                <div style={{ fontFamily: sora, fontSize: 56, fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1, background: 'linear-gradient(135deg,#E1262D,#F0656A)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>4.8</div>
                <div style={{ color: '#E1262D', fontSize: 14, letterSpacing: '.16em', margin: '10px 0 8px' }}>{'★★★★★'}</div>
                <div style={{ fontSize: 12.5, color: '#5B7280' }}>481 Google reviews</div>
              </div>
              <div style={{ ...glassCard, borderRadius: 22, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 11 }}>
                {RATING_BARS.map((rb) => (
                  <div key={rb.star} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, width: 14, color: '#5B7280' }}>{rb.star}</div>
                    <div style={{ flex: 1, height: 8, borderRadius: 99, background: 'rgba(11,36,52,.08)', overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#F0656A,#E1262D)', width: rb.w }}></div></div>
                    <div style={{ fontFamily: mono, fontSize: 11, color: '#8CA0AC', width: 34, textAlign: 'right' }}>{rb.n}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: 20 }}>
              {reviews.map((r) => (
                <div key={r.name} className="sgp-home-hlift" style={{ ...glassCard, border: '1px solid rgba(255,255,255,.86)', borderRadius: 22, padding: 28 }}>
                  <div style={{ color: '#E1262D', fontSize: 15, letterSpacing: '.14em', marginBottom: 14 }}>{'★★★★★'}</div>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: '#0B2434', margin: '0 0 18px' }}>{r.txt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 99, background: r.av }}></div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</div>
                      <div style={{ fontSize: 11.5, color: '#8CA0AC' }}>{t.revSrc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <WaveDivider color="#EEF8FC" flip height={56} />
      </div>

      {/* ============ Four steps (journey timeline on sand) ============ */}
      <div style={{ marginTop: 28 }}>
        <DuneDivider back="rgba(201,161,78,.22)" front="#F9F4E8" height={64} />
        <div className="sg-grade-sand sg-pattern-arabesque-dark" style={{ padding: '54px 0 76px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
            <div style={{ ...eyebrowStyle('#8A6420'), ...rise }}>How it works</div>
            <h2 className="sgp-home-h40" style={{ fontFamily: sora, fontWeight: 800, letterSpacing: '-.032em', margin: '0 0 12px', maxWidth: 620, ...rise }}>From a WhatsApp message to a boarding pass, in four steps.</h2>
            <div className="sg-gold-rule" style={{ marginBottom: 40, ...rise }}></div>
            <div className="sgp-home-steps" style={rise}>
              <div className="sgp-home-stepline" aria-hidden="true"></div>
              <div className="sgp-home-stepplane" aria-hidden="true">
                <FlightPath stroke="rgba(11,36,52,.5)" labelColor="rgba(11,36,52,.45)" width={128} height={31} />
              </div>
              {STEPS.map((st) => (
                <div key={st.n}>
                  <div className="sgp-home-stopnum">{st.n}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-.015em', lineHeight: 1.3, marginBottom: 10, color: '#0B2434' }}>{st.k}</div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(11,36,52,.66)' }}>{st.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============ Seasons ============ */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '76px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
          <div style={rise}>
            <div style={eyebrowStyle('#17A5DA')}>Best time to travel</div>
            <h2 className="sgp-home-h40" style={{ fontFamily: sora, fontWeight: 800, letterSpacing: '-.032em', margin: 0, maxWidth: 560 }}>Where to go, and when it is cheapest to go there.</h2>
          </div>
          <div style={{ flex: 1 }}></div>
          <div style={{ fontSize: 13.5, color: '#5B7280', maxWidth: 280, lineHeight: 1.55 }}>Prices in this table move with the season. Ask us for the exact fare on your dates.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,235px),1fr))', gap: 14 }}>
          {WHEN.map((w, i) => (
            <div key={w.m} className="sgp-home-hlift sgp-home-season" style={{ ...glassCard, borderRadius: 20, padding: '22px 24px 24px 28px', ...rise }}>
              <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: 'linear-gradient(180deg,' + w.c + ',' + w.c + '00)' }}></div>
              <div aria-hidden="true" style={{ position: 'absolute', top: 18, right: 18, opacity: .85 }}>{seasonMotif(i)}</div>
              <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: w.c, marginBottom: 12 }}>{w.m}</div>
              <div style={{ fontFamily: sora, fontSize: 19, fontWeight: 800, letterSpacing: '-.022em', marginBottom: 9 }}>{w.d}</div>
              <div style={{ fontSize: 13, lineHeight: 1.55, color: '#5B7280' }}>{w.n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ Benefits ============ */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px 0' }}>
        <div style={{ ...eyebrowStyle('#17A5DA'), ...rise }}>Why book with us</div>
        <h2 className="sgp-home-h36" style={{ fontFamily: sora, fontWeight: 800, letterSpacing: '-.032em', margin: '0 0 30px', ...rise }}>Four things a booking site cannot do for you.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,232px),1fr))', gap: 16 }}>
          {BENEFITS.map((bn) => (
            <div key={bn.n} className="sgp-home-hlift" style={{ ...glassCard, borderRadius: 22, padding: '26px 24px 28px', ...rise }}>
              <div style={{ fontFamily: sora, fontSize: 13, fontWeight: 800, letterSpacing: '.08em', background: 'linear-gradient(135deg,#17A5DA,#E1262D)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', marginBottom: 16 }}>{bn.n}</div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-.015em', marginBottom: 9 }}>{bn.k}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.6, color: '#5B7280' }}>{bn.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ FAQ ============ */}
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '84px 32px 0' }}>
        <h2 className="sgp-home-h36" style={{ fontFamily: sora, fontWeight: 800, letterSpacing: '-.032em', margin: '0 0 30px', textAlign: 'center', ...rise }}>Questions people ask before they pay.</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQS.map(([q, a], i) => {
            const open = faq === i;
            return (
              <div key={q} style={{ background: open ? 'rgba(255,255,255,.92)' : 'rgba(255,255,255,.62)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid ' + (open ? '#17A5DA' : 'rgba(255,255,255,.85)'), borderRadius: 18, overflow: 'hidden', transition: 'border-color .3s,background .3s' }}>
                <button onClick={() => setFaq(open ? -1 : i)} style={{ border: 0, background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 18, padding: '21px 26px' }}>
                  <span style={{ flex: 1, fontSize: 15.5, fontWeight: 700, letterSpacing: '-.012em', color: '#0B2434' }}>{q}</span>
                  <span style={{ width: 28, height: 28, flexShrink: 0, borderRadius: 99, background: 'rgba(23,165,218,.12)', color: '#17A5DA', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{open ? '−' : '+'}</span>
                </button>
                <div style={{ maxHeight: open ? 220 : 0, opacity: open ? 1 : 0, overflow: 'hidden', transition: 'max-height .45s cubic-bezier(.2,.7,.25,1),opacity .35s ease,padding .45s' }}>
                  <div style={{ padding: '0 26px ' + (open ? '22px' : '0px'), fontSize: 14.5, lineHeight: 1.65, color: '#5B7280', maxWidth: 700 }}>{a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ Final CTA (tropical) ============ */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '76px 32px 0' }}>
        <div className="sgp-home-cta sg-grade-tropical sg-pattern-waves" style={{ borderRadius: 28, boxShadow: '0 26px 64px rgba(14,127,171,.3)', ...rise }}>
          <PalmCorner color="rgba(255,255,255,.14)" size={170} style={{ right: -22, bottom: -30 }} />
          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <h2 className="sgp-home-h32" style={{ fontFamily: sora, fontWeight: 800, letterSpacing: '-.032em', color: '#fff', margin: '0 0 12px', lineHeight: 1.15 }}>{t.ctaTitle}</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'rgba(255,255,255,.78)', margin: 0, maxWidth: 520 }}>{t.ctaSub}</p>
          </div>
          <div className="sgp-home-ctabtns" style={{ position: 'relative', zIndex: 1 }}>
            <button onClick={() => navigate('/contact')} style={{ border: 0, cursor: 'pointer', background: '#25D366', color: '#08202E', fontWeight: 800, fontSize: 15, padding: '16px 28px', borderRadius: 999 }}>{t.ctaWa}</button>
            <button onClick={() => navigate('/contact')} style={{ border: '1px solid rgba(255,255,255,.4)', cursor: 'pointer', background: 'transparent', color: '#fff', fontWeight: 700, fontSize: 15, padding: '16px 28px', borderRadius: 999 }}>{t.ctaCall}</button>
          </div>
        </div>
      </div>

      {/* ============ Three kinds of journey ============ */}
      <div style={{ marginTop: 84, background: '#F6F2EA', padding: '76px 0 84px', borderTop: '1px solid rgba(11,36,52,.07)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ maxWidth: 640, marginBottom: 44, animation: 'sgRise .9s cubic-bezier(.2,.7,.25,1) both', animationTimeline: 'view()', animationRange: 'entry 2% cover 24%' }}>
            <div style={eyebrowStyle('#E1262D')}>Three kinds of journey</div>
            <h2 className="sgp-home-h44" style={{ fontFamily: sora, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-.032em', margin: 0 }}>Pilgrimage, island, and the long way round.</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              {
                to: '/umrah', bg: '#0B2434', chipBg: 'rgba(255,255,255,.1)', chip: 'The pilgrimage',
                title: 'Makkah and Madinah',
                sub: 'Umrah and Hajj, guided in Kreol from the day you register to the day you land back at Plaisance.',
                subC: 'rgba(255,255,255,.62)', linkBd: 'rgba(255,255,255,.1)', link: 'See Umrah packages',
                img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kaaba_mirror_edit_jj.jpg?width=2000'
              },
              {
                to: '/rodrigues', bg: '#0E5E6B', chipBg: 'rgba(255,255,255,.12)', chip: 'The island next door',
                title: 'Rodrigues',
                sub: 'Ninety minutes from Plaisance. Cotton Bay, Pointe Coton, Ile aux Cocos and the Saturday market at Port Mathurin.',
                subC: 'rgba(255,255,255,.66)', linkBd: 'rgba(255,255,255,.12)', link: 'See Rodrigues packages',
                img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aerial_view_of_the_turquoise_waters_of_the_Indian_Ocean_at_Le_Morne_Beach,_Mauritius_(53697980443).jpg?width=2000'
              },
              {
                to: '/holidays', bg: '#7C2F26', chipBg: 'rgba(255,255,255,.14)', chip: 'The long way round',
                title: 'Egypt and Turkey',
                sub: 'Cairo, a Nile cruise to Aswan, then Istanbul and the balloons over Cappadocia. Fully guided, small groups.',
                subC: 'rgba(255,255,255,.66)', linkBd: 'rgba(255,255,255,.14)', link: 'See holiday packages',
                img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nile.jpg?width=2000'
              }
            ].map((j) => (
              <button key={j.to} className="sgp-home-journey" onClick={() => navigate(j.to)} style={{ border: 0, padding: 0, cursor: 'pointer', textAlign: 'left', width: '100%', borderRadius: 26, overflow: 'hidden', background: j.bg, position: 'relative', animation: 'sgRise .95s cubic-bezier(.2,.7,.25,1) both', animationTimeline: 'view()', animationRange: 'entry 2% cover 26%' }}>
                <div className="sgp-home-jtext">
                  <div style={{ display: 'inline-flex', alignSelf: 'flex-start', fontFamily: mono, fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#fff', background: j.chipBg, padding: '7px 13px', borderRadius: 999, marginBottom: 20 }}>{j.chip}</div>
                  <div className="sgp-home-h33" style={{ fontFamily: sora, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.03em', color: '#fff', marginBottom: 13 }}>{j.title}</div>
                  <div style={{ fontSize: 15.5, lineHeight: 1.6, color: j.subC, maxWidth: 430, marginBottom: 24 }}>{j.sub}</div>
                  <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 700, color: '#fff', borderBottom: '2px solid ' + j.linkBd, paddingBottom: 5 }}>{j.link}</div>
                </div>
                <div className="sgp-home-jimg">
                  <img src={j.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,' + j.bg + ' 0%,rgba(0,0,0,0) 46%)' }}></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============ Branches banner ============ */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#0B2434' }}>
        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Spiaggia_di_Flic_en_Flac_-_Mauritius_(banner).jpg?width=3600" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', animation: 'sgDrift 14s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(11,36,52,.82),rgba(11,36,52,.2) 55%,rgba(11,36,52,.82))' }}></div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '0 20px' }}>
            <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', marginBottom: 12 }}>Two branches, one island</div>
            <div className="sgp-home-h32" style={{ fontFamily: sora, fontWeight: 800, letterSpacing: '-.028em', color: '#fff' }}>Valentina Mall, Phoenix and Rose-Belle</div>
          </div>
        </div>
      </div>

    </div>
  );
}
