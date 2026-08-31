import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext.jsx';
import { PKGS, CAT_FOR_ROUTE, cw } from '../data/packages.js';
import { money, boardLabel, tagFor } from '../utils/travel.js';
import ImageSlot from '../components/ImageSlot.jsx';
import PageHero from '../components/PageHero.jsx';
import './PackageListing.css';

const SORT_CHIPS = [
  ['rec', 'Recommended'],
  ['lo', 'Price, low to high'],
  ['hi', 'Price, high to low'],
  ['short', 'Shortest trip']
];

const BOARD_LABELS = { all: 'All boards', hb: 'Half board', bb: 'Bed and breakfast', fb: 'Full board', flightOnly: 'Flight only' };

export default function PackageListing({ cat }) {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const [sort, setSort] = useState('rec');
  const [bd, setBd] = useState('all');

  // Reset filters whenever the category route changes.
  useEffect(() => {
    setSort('rec');
    setBd('all');
  }, [cat]);

  const catKey = CAT_FOR_ROUTE[cat];
  const catPkgs = PKGS.filter((p) => p.cat === catKey);

  let pool = bd === 'all' ? catPkgs : catPkgs.filter((p) => p.board === bd);
  if (sort === 'lo') pool = pool.slice().sort((a, b) => a.price - b.price);
  if (sort === 'hi') pool = pool.slice().sort((a, b) => b.price - a.price);
  if (sort === 'short') pool = pool.slice().sort((a, b) => a.nights - b.nights);

  const boardsIn = ['all'].concat(Array.from(new Set(catPkgs.map((p) => p.board))));

  const meta = {
    umrah: [t.umrahEyebrow, t.umrahTitle, t.umrahSub],
    rodrigues: [t.rodEyebrow, t.rodTitle, t.rodSub],
    holidays: [t.holEyebrow, t.holTitle, t.holSub],
    cruises: [
      'Cruises from Port Louis and beyond',
      'Wake up in a different island every morning.',
      'MSC and Costa call at Port Louis every season, and we book the fly-cruises out of Dubai and Genoa. Cabin, flights, transfers and port taxes in one price, payable in instalments.'
    ]
  }[cat];

  const countLine =
    pool.length === 1
      ? lang === 'fr'
        ? '1 forfait disponible'
        : lang === 'kr'
          ? '1 pake disponib'
          : '1 package available'
      : pool.length + ' ' + t.packagesFound;

  const clearFilters = () => {
    setSort('rec');
    setBd('all');
  };

  return (
    <div>
      <PageHero eyebrow={meta[0]} title={meta[1]} sub={meta[2]} />

      <div className="sg-container sgp-listing-toolbar" style={{ paddingTop: 28 }}>
        <div style={{ fontSize: 13.5, color: '#5B7280', fontWeight: 600 }}>{countLine}</div>
        <div style={{ flex: 1 }} />
        <div className="sgp-listing-sorts">
          {SORT_CHIPS.map((sc) => {
            const on = sort === sc[0];
            return (
              <button
                key={sc[0]}
                onClick={() => setSort(sc[0])}
                style={{
                  border: '1px solid ' + (on ? '#0B2434' : 'rgba(11,36,52,.14)'),
                  background: on ? '#0B2434' : 'rgba(255,255,255,.75)',
                  color: on ? '#fff' : '#5B7280',
                  cursor: 'pointer',
                  borderRadius: 999,
                  padding: '9px 16px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  transition: 'background .3s,color .3s,border-color .3s',
                  whiteSpace: 'nowrap'
                }}
              >
                {sc[1]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sg-container" style={{ paddingTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: "'IBM Plex Mono',monospace",
            fontSize: 9.5,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: '#8CA0AC',
            marginRight: 4
          }}
        >
          Board basis
        </span>
        {boardsIn.map((k) => {
          const on = bd === k;
          return (
            <button
              key={k}
              onClick={() => setBd(k)}
              style={{
                border: '1px solid ' + (on ? '#17A5DA' : 'rgba(11,36,52,.12)'),
                background: on ? 'rgba(23,165,218,.12)' : 'transparent',
                color: on ? '#0E6C93' : '#8CA0AC',
                cursor: 'pointer',
                borderRadius: 8,
                padding: '7px 13px',
                fontSize: 12,
                fontWeight: 700,
                transition: 'background .3s,color .3s,border-color .3s',
                whiteSpace: 'nowrap'
              }}
            >
              {BOARD_LABELS[k] || k}
            </button>
          );
        })}
      </div>

      {pool.length === 0 && (
        <div className="sg-container" style={{ paddingTop: 20 }}>
          <div
            style={{
              background: 'rgba(255,255,255,.78)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1px dashed rgba(11,36,52,.18)',
              borderRadius: 22,
              padding: '52px 40px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 21, fontWeight: 800, letterSpacing: '-.025em', marginBottom: 10 }}>
              Nothing matches those filters.
            </div>
            <div style={{ fontSize: 14.5, lineHeight: 1.6, color: '#5B7280', maxWidth: 420, margin: '0 auto 22px' }}>
              Try another board basis, or message us and we will build the trip around what you want.
            </div>
            <button
              className="sgp-listing-clear"
              onClick={clearFilters}
              style={{
                border: 0,
                cursor: 'pointer',
                background: '#0B2434',
                color: '#fff',
                fontWeight: 700,
                fontSize: 13.5,
                padding: '13px 26px',
                borderRadius: 999
              }}
            >
              Clear the filters
            </button>
          </div>
        </div>
      )}

      <div className="sg-container" style={{ paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {pool.map((p) => {
          const tg = tagFor(p, t, lang);
          return (
            <button key={p.id} className="sgp-listing-card" onClick={() => navigate('/package/' + p.id)}>
              <div className="sgp-listing-card-img">
                <ImageSlot src={cw(p.id, 0, 900)} alt={p.ph} style={{ position: 'absolute', inset: 0 }} />
                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    left: 14,
                    background: tg.bg,
                    color: tg.fg,
                    fontSize: 10.5,
                    fontWeight: 800,
                    letterSpacing: '.05em',
                    padding: '6px 11px',
                    borderRadius: 999,
                    pointerEvents: 'none'
                  }}
                >
                  {tg.txt}
                </div>
              </div>
              <div className="sgp-listing-body">
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: 10,
                    letterSpacing: '.11em',
                    textTransform: 'uppercase',
                    color: '#8CA0AC',
                    marginBottom: 9
                  }}
                >
                  {p.place}
                </div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: '-.024em', lineHeight: 1.2 }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 13.5, color: '#5B7280', marginTop: 8 }}>{boardLabel(p, t)}</div>
                <div style={{ fontSize: 14, color: '#3C5464', marginTop: 14, lineHeight: 1.55, maxWidth: 440 }}>{p.blurb}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                  {p.chips.map((c) => (
                    <div
                      key={c}
                      style={{ background: '#F2F6F8', color: '#3C5464', fontSize: 11.5, fontWeight: 700, padding: '7px 12px', borderRadius: 8 }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </div>
              <div className="sgp-listing-rail">
                <div>
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono',monospace",
                      fontSize: 10,
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#8CA0AC'
                    }}
                  >
                    {t.filterDate}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 6, lineHeight: 1.4 }}>{p.dates}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, color: '#8CA0AC' }}>{t.from}</div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: '-.03em', lineHeight: 1.1 }}>
                    {money(p.price)}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#8CA0AC', marginBottom: 14 }}>{t.perPerson}</div>
                  <div style={{ background: '#E1262D', color: '#fff', fontSize: 13.5, fontWeight: 700, padding: 13, borderRadius: 12, textAlign: 'center' }}>
                    {t.viewDates}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
