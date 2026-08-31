import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext.jsx';
import { FLIGHTS } from '../data/packages.js';
import { travLine } from '../utils/travel.js';
import PageHero from '../components/PageHero.jsx';
import './Flights.css';

const FIELD_LABEL = {
  fontFamily: "'IBM Plex Mono',monospace",
  fontSize: 9.5,
  letterSpacing: '.11em',
  textTransform: 'uppercase',
  color: '#8CA0AC',
  marginBottom: 6
};

export default function Flights() {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const resultsRef = useRef(null);

  return (
    <div>
      <PageHero eyebrow={t.flyEyebrow} title={t.flyTitle} sub={t.flySub} />

      <div className="sg-container" style={{ marginTop: -26, position: 'relative', zIndex: 4 }}>
        <div className="sgp-flights-search">
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
          <button
            className="sgp-flights-btn"
            onClick={() => resultsRef.current && resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            {t.searchBtn}
          </button>
        </div>
      </div>

      <div ref={resultsRef} className="sg-container" style={{ paddingTop: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {FLIGHTS.map((f) => (
          <div key={f.code} className="sgp-flights-row">
            <div className="sgp-flights-airline">
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15 }}>{f.airline}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#8CA0AC', marginTop: 3 }}>{f.code}</div>
            </div>
            <div className="sgp-flights-times" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: '-.02em' }}>{f.dep}</div>
                <div style={{ fontSize: 12, color: '#8CA0AC', marginTop: 2 }}>{f.depA}</div>
              </div>
              <div style={{ flex: 1, position: 'relative', height: 2, background: 'rgba(11,36,52,.12)', maxWidth: 180 }}>
                <div style={{ position: 'absolute', top: -7, right: 0, width: 8, height: 8, borderRadius: 99, background: '#17A5DA' }} />
                <div style={{ position: 'absolute', top: -7, left: 0, width: 8, height: 8, borderRadius: 99, background: '#CBD6DD' }} />
                <div
                  style={{
                    position: 'absolute',
                    top: -22,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 11,
                    color: '#8CA0AC',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {f.dur}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: '-.02em' }}>{f.arr}</div>
                <div style={{ fontSize: 12, color: '#8CA0AC', marginTop: 2 }}>{f.arrA}</div>
              </div>
            </div>
            <div className="sgp-flights-note">
              <div style={{ fontSize: 12.5, color: '#5B7280', lineHeight: 1.5 }}>{f.note}</div>
            </div>
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
