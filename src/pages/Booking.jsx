import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useLang } from '../context/LangContext.jsx';
import { getPackage, cw } from '../data/packages.js';
import { money, computeTotals, travellerWords, travLine } from '../utils/travel.js';
import ImageSlot from '../components/ImageSlot.jsx';
import { FlightPath } from '../components/Motifs.jsx';
import './Booking.css';

const cardBox = { background: '#fff', border: '1px solid rgba(11,36,52,.1)', borderRadius: 20, padding: '28px 30px 30px' };
const h2Style = { fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: '-.024em' };
const fieldLabel = { fontSize: 12.5, fontWeight: 700, marginBottom: 7 };
const inputBase = { border: '1px solid rgba(11,36,52,.14)', borderRadius: 12, padding: '14px 15px', fontSize: 15, color: '#0B2434' };
const decBtn = { width: 30, height: 30, borderRadius: 99, border: '1px solid rgba(11,36,52,.16)', background: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1, color: '#0B2434' };
const incBtn = { width: 30, height: 30, borderRadius: 99, border: 0, background: '#0B2434', color: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1 };
const backBtn = { border: 0, background: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#5B7280' };
const mono = "'IBM Plex Mono',monospace";
const refLabel = { fontFamily: mono, fontSize: 9.5, letterSpacing: '.11em', textTransform: 'uppercase', color: '#8CA0AC', marginBottom: 6 };

function Field({ label, value, onChange, style }) {
  return (
    <div>
      <div style={fieldLabel}>{label}</div>
      <input className="sgp-book-input" value={value} onChange={onChange} style={{ ...inputBase, ...style }} />
    </div>
  );
}

export default function Booking() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const pk = getPackage(id);

  const [step, setStep] = useState(1);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(1);
  const [plan, setPlan] = useState('deposit');
  const [lead, setLead] = useState({
    firstName: 'Fatimah',
    lastName: 'Beebeejaun',
    email: 'fatimah.b@gmail.com',
    phone: '+230 5xxx xxxx',
    passport: 'MU2314887',
    passportExp: '14 Aug 2029'
  });
  const [card, setCard] = useState({
    num: '5412 7512 3412 3456',
    name: 'FATIMAH BEEBEEJAUN',
    expiry: '09 / 29',
    cvv: '•••'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const slotRaw = parseInt(searchParams.get('slot') || '0', 10);
  const slotIdx = Number.isNaN(slotRaw) ? 0 : slotRaw;
  const selDate = pk.slots && pk.slots[slotIdx] ? pk.slots[slotIdx][0] : pk.dates;

  const { unit, kidUnit, total, deposit, instal, payNow, later } = computeTotals(pk, adults, kids, plan);
  const w = travellerWords(lang);
  const aW = adults === 1 ? w.aOne : w.aMany;
  const cW = kids === 1 ? w.cOne : w.cMany;

  // Destination code for the boarding-pass flight path (first 3 letters of the place).
  const destCode = (((pk.place || '').replace(/[^A-Za-z]/g, '').slice(0, 3)) || 'SGT').toUpperCase();

  const stp = (n) =>
    step >= n
      ? { bg: '#0B2434', fg: '#fff', tx: '#0B2434' }
      : { bg: '#EEF3F6', fg: '#8CA0AC', tx: '#8CA0AC' };
  const psel = (k) =>
    plan === k ? { bd: '#17A5DA', dot: '#17A5DA' } : { bd: 'rgba(11,36,52,.12)', dot: '#fff' };

  const setL = (k) => (e) => setLead({ ...lead, [k]: e.target.value });
  const setC = (k) => (e) => setCard({ ...card, [k]: e.target.value });

  const plans = [
    ['full', t.payFull, t.payFullNote, money(total)],
    ['deposit', t.payDeposit, t.balance + ' ' + money(total - deposit), money(deposit)],
    ['instal', t.payInstal, t.payInstalNote, money(instal) + ' × 3']
  ];

  return (
    <div className="sgp-book-wrap" style={{ maxWidth: 1080, margin: '0 auto', padding: '34px 32px 0' }}>
      {/* Step indicator — boarding-pass stubs joined by a dashed line */}
      <div className="sgp-book-steps" style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 34 }}>
        {[[1, t.step1], [2, t.step2], [3, t.step3]].map(([n, label], i) => {
          const q = stp(n);
          const on = step >= n;
          return (
            <React.Fragment key={n}>
              {i > 0 && (
                <div className="sgp-book-conn" style={{ flex: 1, height: 0, borderTop: '2px dashed rgba(11,36,52,.18)', margin: '0 18px' }} />
              )}
              <div className="sgp-book-stub" style={{ display: 'flex', alignItems: 'stretch', background: q.bg, color: q.fg, borderRadius: 11, border: '1px solid ' + (on ? '#0B2434' : 'rgba(11,36,52,.1)'), overflow: 'hidden' }}>
                <div className="sgp-book-stubnum" style={{ display: 'flex', alignItems: 'center', fontFamily: mono, fontSize: 12, fontWeight: 700, letterSpacing: '.06em', padding: '10px 11px', borderRight: '1.5px dashed ' + (on ? 'rgba(255,255,255,.3)' : 'rgba(11,36,52,.14)') }}>
                  {'0' + n}
                </div>
                <div className="sgp-book-steplabel" style={{ display: 'flex', alignItems: 'center', fontSize: 13.5, fontWeight: 700, padding: '10px 14px 10px 12px' }}>{label}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="sgp-book-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 344px', gap: 36, alignItems: 'start' }}>
        <div>
          {step === 1 && (
            <>
              {/* Travellers */}
              <div className="sgp-book-card" style={{ ...cardBox, marginBottom: 16 }}>
                <h2 style={{ ...h2Style, margin: '0 0 20px' }}>{t.trav}</h2>
                <div style={{ border: '1px solid rgba(11,36,52,.12)', borderRadius: 13, padding: '4px 15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid rgba(11,36,52,.07)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{t.adults}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                      <button onClick={() => setAdults(Math.max(1, adults - 1))} style={decBtn}>{'−'}</button>
                      <div style={{ fontWeight: 700, fontSize: 15, minWidth: 14, textAlign: 'center' }}>{adults}</div>
                      <button onClick={() => setAdults(Math.min(9, adults + 1))} style={incBtn}>+</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '11px 0' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{t.children}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                      <button onClick={() => setKids(Math.max(0, kids - 1))} style={decBtn}>{'−'}</button>
                      <div style={{ fontWeight: 700, fontSize: 15, minWidth: 14, textAlign: 'center' }}>{kids}</div>
                      <button onClick={() => setKids(Math.min(9, kids + 1))} style={incBtn}>+</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead traveller */}
              <div className="sgp-book-card" style={cardBox}>
                <h2 style={{ ...h2Style, margin: '0 0 6px' }}>{t.leadTraveller}</h2>
                <p style={{ fontSize: 14, color: '#5B7280', margin: '0 0 24px', lineHeight: 1.55 }}>{t.leadNote}</p>
                <div className="sgp-book-form2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label={t.firstName} value={lead.firstName} onChange={setL('firstName')} />
                  <Field label={t.lastName} value={lead.lastName} onChange={setL('lastName')} />
                  <Field label={t.email} value={lead.email} onChange={setL('email')} />
                  <Field label={t.phone} value={lead.phone} onChange={setL('phone')} style={{ border: '2px solid #17A5DA', padding: '13px 15px' }} />
                  <Field label={t.passport} value={lead.passport} onChange={setL('passport')} />
                  <Field label={t.passportExp} value={lead.passportExp} onChange={setL('passportExp')} />
                </div>
                <div style={{ display: 'flex', gap: 11, background: '#E8F6FC', borderRadius: 14, padding: '15px 17px', marginTop: 20 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 99, background: '#17A5DA', flex: 'none', marginTop: 1 }} />
                  <div style={{ fontSize: 13.5, lineHeight: 1.55, color: '#0B5878' }}>{t.waNotice}</div>
                </div>
                <div className="sgp-book-btnrow" style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 24 }}>
                  <button onClick={() => setStep(2)} style={{ border: 0, cursor: 'pointer', background: '#0B2434', color: '#fff', fontWeight: 800, fontSize: 15.5, padding: '16px 34px', borderRadius: 13 }}>
                    {t.continueBtn}
                  </button>
                  <button onClick={() => navigate('/package/' + pk.id)} style={backBtn}>{t.back}</button>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Payment plan */}
              <div className="sgp-book-card" style={{ ...cardBox, marginBottom: 16 }}>
                <h2 style={{ ...h2Style, margin: '0 0 20px' }}>{t.payHow}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {plans.map(([key, name, note, amt]) => {
                    const q = psel(key);
                    return (
                      <button
                        key={key}
                        onClick={() => setPlan(key)}
                        className="sgp-book-planbtn"
                        style={{ display: 'flex', alignItems: 'center', gap: 14, border: '2px solid ' + q.bd, background: '#fff', borderRadius: 15, padding: '17px 18px', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                      >
                        <div style={{ width: 20, height: 20, borderRadius: 99, border: '2px solid ' + q.bd, background: q.dot, flex: 'none' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>{name}</div>
                          <div style={{ fontSize: 12.5, color: '#8CA0AC', marginTop: 3 }}>{note}</div>
                        </div>
                        <div className="sgp-book-planprice" style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 18 }}>{amt}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card details */}
              <div className="sgp-book-card" style={cardBox}>
                <div className="sgp-book-cardhead" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <h2 style={{ ...h2Style, margin: 0 }}>{t.cardTitle}</h2>
                  <div style={{ flex: 1 }} />
                  <div className="sgp-book-brands" style={{ display: 'flex', gap: 7 }}>
                    {['VISA', 'Mastercard', 'Juice', 'MyT Money'].map((b) => (
                      <div key={b} style={{ border: '1px solid rgba(11,36,52,.12)', borderRadius: 7, padding: '6px 11px', fontSize: 11, fontWeight: 800, color: '#3C5464' }}>{b}</div>
                    ))}
                  </div>
                </div>
                <div className="sgp-book-form2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={fieldLabel}>{t.cardNum}</div>
                    <div style={{ border: '1px solid rgba(11,36,52,.14)', borderRadius: 12, padding: '14px 15px', fontFamily: mono, fontSize: 16, letterSpacing: '.04em', display: 'flex', alignItems: 'center' }}>
                      <input
                        className="sgp-book-bare"
                        value={card.num}
                        onChange={setC('num')}
                        style={{ flex: 1, minWidth: 0, border: 0, padding: 0, background: 'transparent', fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', color: '#0B2434' }}
                      />
                      <span style={{ width: 28, height: 18, borderRadius: 4, background: '#EB001B', display: 'inline-block', flex: 'none' }} />
                      <span style={{ width: 28, height: 18, borderRadius: 4, background: '#F79E1B', display: 'inline-block', marginLeft: -13, flex: 'none' }} />
                    </div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <Field label={t.cardName} value={card.name} onChange={setC('name')} style={{ fontWeight: 600 }} />
                  </div>
                  <Field label={t.expiry} value={card.expiry} onChange={setC('expiry')} style={{ fontFamily: mono }} />
                  <Field label={t.cvv} value={card.cvv} onChange={setC('cvv')} style={{ fontFamily: mono }} />
                </div>
                <div style={{ display: 'flex', gap: 11, background: '#F2F6F8', borderRadius: 14, padding: '15px 17px', marginTop: 20 }}>
                  <div style={{ width: 15, height: 19, borderRadius: 4, border: '2px solid #12805C', flex: 'none', marginTop: 1 }} />
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: '#5B7280' }}>{t.secureNote}</div>
                </div>
                <div className="sgp-book-btnrow" style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 24 }}>
                  <button onClick={() => setStep(3)} style={{ border: 0, cursor: 'pointer', background: '#12805C', color: '#fff', fontWeight: 800, fontSize: 15.5, padding: '16px 34px', borderRadius: 13 }}>
                    {t.pay + ' ' + money(payNow)}
                  </button>
                  <button onClick={() => setStep(1)} style={backBtn}>{t.back}</button>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="sg-ticket" style={{ overflow: 'visible' }}>
              {/* Night header band: flight path + reference */}
              <div className="sg-grade-night sg-pattern-flightgrid sgp-book-band" style={{ borderRadius: '17px 17px 0 0', padding: '26px 30px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px 28px', flexWrap: 'wrap' }}>
                <FlightPath stroke="rgba(255,255,255,.6)" labelColor="rgba(201,161,78,.95)" width={210} height={54} from="MRU" to={destCode} />
                <div>
                  <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', marginBottom: 6 }}>{t.ref}</div>
                  <div style={{ fontFamily: mono, fontSize: 'clamp(20px, 5vw, 27px)', fontWeight: 600, letterSpacing: '.06em', color: '#fff' }}>SG-26-0481</div>
                </div>
              </div>
              {/* Ticket perforation */}
              <div style={{ padding: '18px 22px 0' }}>
                <div className="sg-ticket-divider" />
              </div>
              <div className="sgp-book-confirmbody" style={{ padding: '24px 30px 32px' }}>
                <div style={{ width: 62, height: 62, borderRadius: 99, background: '#12805C', marginBottom: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 26px rgba(18,128,92,.28)' }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12.5l4.2 4.3L19 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="sgp-book-confirmtitle" style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: '-.03em', margin: '0 0 10px', lineHeight: 1.15 }}>
                  {t.confirmTitle}
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: '#5B7280', margin: '0 0 26px', maxWidth: 520 }}>{t.confirmSub}</p>
                <div className="sgp-book-refrow" style={{ display: 'flex', gap: 34, padding: '22px 0', borderTop: '1px solid rgba(11,36,52,.09)', borderBottom: '1px solid rgba(11,36,52,.09)', marginBottom: 26 }}>
                  <div>
                    <div style={refLabel}>{t.paidToday}</div>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 17, fontWeight: 800, color: '#12805C' }}>{money(payNow)}</div>
                  </div>
                  <div>
                    <div style={refLabel}>{t.balance}</div>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 17, fontWeight: 800 }}>{later ? money(later) : 'Rs 0'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, background: '#E7F9EE', border: '1px solid rgba(18,128,92,.2)', borderRadius: 15, padding: '17px 19px', marginBottom: 26 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 99, background: '#25D366', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12.5l4.2 4.3L19 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.55, color: '#0B5F44' }}>{t.waSent}</div>
                </div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '-.02em', margin: '0 0 14px' }}>{t.whatNext}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                  {[['01', t.next1], ['02', t.next2], ['03', t.next3]].map(([n, txt]) => (
                    <div key={n} style={{ display: 'flex', gap: 13 }}>
                      <div style={{ fontFamily: mono, fontSize: 12, color: '#E1262D', fontWeight: 600, paddingTop: 1 }}>{n}</div>
                      <div style={{ fontSize: 14.5, lineHeight: 1.55, color: '#3C5464' }}>{txt}</div>
                    </div>
                  ))}
                </div>
                <div className="sgp-book-btnrow" style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => navigate('/bookings')} style={{ border: 0, cursor: 'pointer', background: '#0B2434', color: '#fff', fontWeight: 700, fontSize: 15, padding: '15px 28px', borderRadius: 13 }}>
                    {t.viewBookings}
                  </button>
                  <button onClick={() => navigate('/')} style={{ border: '1px solid rgba(11,36,52,.16)', cursor: 'pointer', background: '#fff', color: '#0B2434', fontWeight: 700, fontSize: 15, padding: '15px 28px', borderRadius: 13 }}>
                    {t.backHome}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order summary rail — boarding-pass ticket */}
        <div className="sgp-book-rail sg-ticket" style={{ position: 'sticky', top: 104, overflow: 'visible' }}>
          <div className="sg-photo-grade" style={{ height: 150, borderRadius: '17px 17px 0 0', overflow: 'hidden', position: 'relative' }}>
            <ImageSlot src={cw(pk.id, 0, 900)} alt={pk.ph} />
          </div>
          <div style={{ padding: '20px 22px 24px' }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: '-.022em', lineHeight: 1.25 }}>{pk.name}</div>
            <div style={{ fontSize: 12.5, color: '#8CA0AC', marginTop: 6 }}>{pk.place}</div>
            <div style={{ height: 1, background: 'rgba(11,36,52,.09)', margin: '16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 9 }}>
              <span style={{ color: '#5B7280' }}>{t.dates}</span>
              <span style={{ fontWeight: 600 }}>{selDate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 9 }}>
              <span style={{ color: '#5B7280' }}>{t.trav}</span>
              <span style={{ fontWeight: 600 }}>{travLine(adults, kids, lang)}</span>
            </div>
            <div style={{ height: 1, background: 'rgba(11,36,52,.09)', margin: '16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 8 }}>
              <span style={{ color: '#5B7280' }}>{adults + ' × ' + aW}</span>
              <span style={{ fontWeight: 600 }}>{money(adults * unit)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
              <span style={{ color: '#5B7280' }}>{kids + ' × ' + cW}</span>
              <span style={{ fontWeight: 600 }}>{money(kids * kidUnit)}</span>
            </div>
            <div className="sg-ticket-divider" style={{ margin: '18px 0 14px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{t.total}</span>
              <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '-.03em' }}>{money(total)}</span>
            </div>
            <div style={{ background: '#0B2434', borderRadius: 13, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.62)' }}>{t.payToday}</span>
                <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 19, color: '#fff' }}>{money(payNow)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
