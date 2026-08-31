import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext.jsx';
import { FLIGHTS } from '../data/packages.js';
import { travLine } from '../utils/travel.js';
import { THEME_FOR_ROUTE } from '../styles/themes.js';
import { FlightPath } from '../components/Motifs.jsx';
import './Flights.css';

const FIELD_LABEL = {
  fontFamily: "'IBM Plex Mono',monospace",
  fontSize: 9.5,
  letterSpacing: '.11em',
  textTransform: 'uppercase',
  color: '#8CA0AC',
  marginBottom: 6
};

// Boarding-pass airport codes: big, mono, letterspaced.
const MONO_CODE = {
  fontFamily: "'IBM Plex Mono',monospace",
  fontSize: 15,
  fontWeight: 700,
  letterSpacing: '.16em',
  color: '#5B7280'
};

const TIME_STYLE = {
  fontFamily: "'Sora',sans-serif",
  fontWeight: 800,
  fontSize: 22,
  letterSpacing: '-.02em',
  marginTop: 2
};

export default function Flights() {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const resultsRef = useRef(null);
  const th = THEME_FOR_ROUTE.flights;

  return (
    <div>
      <section className={'sgp-flights-hero ' + th.grade}>
        <div className={th.pattern} aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div className="sg-container sgp-flights-hero-inner" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono',monospace",
                fontSize: 10.5,
                letterSpacing: '.13em',
                textTransform: 'uppercase',
                color: '#17A5DA',
                marginBottom: 14
              }}
            >
              {t.flyEyebrow}
            </div>
            <h1
              style={{
                fontFamily: "'Sora',sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(30px, 5vw, 46px)',
                letterSpacing: '-.034em',
                color: '#fff',
                margin: '0 0 14px',
                lineHeight: 1.08
              }}
            >
              {t.flyTitle}
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: 'rgba(255,255,255,.62)', margin: 0, maxWidth: 620 }}>{t.flySub}</p>
          </div>
          <div className="sgp-flights-hero-path sg-hide-mobile" aria-hidden="true">
            <FlightPath stroke="rgba(255,255,255,.5)" labelColor="rgba(255,255,255,.75)" width={264} height={65} from="MRU" to="DXB" />
          </div>
        </div>
      </section>

      <div className="sg-container" style={{ marginTop: -26, position: 'relative', zIndex: 4 }}>
        <div className="sgp-flights-search sg-ticket">
          <div className="sgp-flights-field sgp-flights-field-first">
            <div style={FIELD_LABEL}>{t.flyFrom}</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Mauritius, MRU</div>
          </div>
          <div className="sgp-flights-field">
            <div style={FIELD_LABEL}>{t.flyTo}</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Rodrigues, RRG</div>
          </div>
          <div className="sgp-flights-field">
            <div style={FIELD_LABEL}>{t.dates}</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>19 to 22 May 2026</div>
          </div>
          <div className="sgp-flights-field sgp-flights-field-trav">
            <div style={FIELD_LABEL}>{t.trav}</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{travLine(2, 1, lang)}</div>
          </div>
          <div className="sg-ticket-divider sgp-flights-search-cut" aria-hidden="true" />
          <button
            className="sgp-flights-btn"
            onClick={() => resultsRef.current && resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            {t.searchBtn}
          </button>
        </div>
      </div>

      <div ref={resultsRef} className="sg-container" style={{ paddingTop: 36, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {FLIGHTS.map((f) => (
          <div key={f.code} className="sgp-flights-row sg-ticket">
            <div className="sgp-flights-airline">
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15 }}>{f.airline}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#8CA0AC', marginTop: 3 }}>{f.code}</div>
            </div>
            <div className="sgp-flights-times" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div>
                <div style={MONO_CODE}>{f.depA}</div>
                <div style={TIME_STYLE}>{f.dep}</div>
              </div>
              <div
                style={{
                  flex: 1,
                  position: 'relative',
                  height: 2,
                  maxWidth: 180,
                  background: 'repeating-linear-gradient(90deg, rgba(11,36,52,.22) 0 6px, transparent 6px 12px)'
                }}
              >
                <div style={{ position: 'absolute', top: -7, right: 0, width: 8, height: 8, borderRadius: 99, background: '#17A5DA' }} />
                <div style={{ position: 'absolute', top: -7, left: 0, width: 8, height: 8, borderRadius: 99, background: '#CBD6DD' }} />
                <div
                  style={{
                    position: 'absolute',
                    top: -26,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 11,
                    color: '#8CA0AC',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {f.dur}
                </div>
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#fff',
                    padding: '0 3px',
                    lineHeight: 0
                  }}
                >
                  <svg width="18" height="18" viewBox="-10 -10 20 20" style={{ display: 'block' }}>
                    <g transform="rotate(90)">
                      <path d="M0 -7 L2.2 -1 L9 1 L2.2 2.2 L1.2 7.5 L0 4.5 L-1.2 7.5 L-2.2 2.2 L-9 1 L-2.2 -1 Z" fill="#17A5DA" />
                    </g>
                  </svg>
                </div>
              </div>
              <div>
                <div style={MONO_CODE}>{f.arrA}</div>
                <div style={TIME_STYLE}>{f.arr}</div>
              </div>
            </div>
            <div className="sgp-flights-note">
              <div style={{ fontSize: 12.5, color: '#5B7280', lineHeight: 1.5 }}>{f.note}</div>
            </div>
            <div className="sg-ticket-divider sgp-flights-cut" aria-hidden="true" />
            <div className="sgp-flights-price">
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '-.03em' }}>{f.price}</div>
              <div style={{ fontSize: 11.5, color: '#8CA0AC', marginBottom: 10 }}>{t.returnFare}</div>
              <button
                onClick={() => navigate('/rodrigues')}
                style={{
                  border: 0,
                  cursor: 'pointer',
                  background: '#0B2434',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  padding: '11px 20px',
                  borderRadius: 999
                }}
              >
                {t.select}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
