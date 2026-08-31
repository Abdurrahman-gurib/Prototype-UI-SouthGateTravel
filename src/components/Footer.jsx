import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext.jsx';
import './Footer.css';

const mono = {
  fontFamily: "'IBM Plex Mono',monospace",
  fontSize: 10,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,.4)',
  marginBottom: 16
};

const linkStyle = {
  border: 0,
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  fontSize: 14,
  color: 'rgba(255,255,255,.72)',
  textAlign: 'left'
};

export default function Footer() {
  const { t } = useLang();
  const navigate = useNavigate();

  return (
    <>
      {/* Newsletter / fares CTA band */}
      <div className="sg-container" style={{ marginTop: 88 }}>
        <div
          style={{
            background: 'linear-gradient(120deg,rgba(232,246,252,.94),rgba(255,255,255,.8) 50%,rgba(236,244,248,.94))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,.9)',
            boxShadow: '0 20px 52px rgba(11,36,52,.09)',
            borderRadius: 28,
            padding: '40px 44px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
            gap: 32,
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.13em', textTransform: 'uppercase', color: '#E1262D', marginBottom: 12 }}>
              Fares move weekly
            </div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: '-.03em', margin: '0 0 10px', lineHeight: 1.16 }}>
              Get the Rodrigues and Umrah fares before they go public.
            </h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#5B7280', margin: 0 }}>
              One message a month on WhatsApp. Seat releases, seasonal prices and salon offers. Leave any time.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
              <input
                type="tel"
                placeholder="Your WhatsApp number"
                style={{
                  flex: 1,
                  minWidth: 180,
                  background: '#fff',
                  border: '1px solid rgba(11,36,52,.12)',
                  borderRadius: 13,
                  padding: '15px 17px',
                  fontSize: 14,
                  color: '#0B2434',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => navigate('/contact')}
                style={{
                  border: 0,
                  cursor: 'pointer',
                  background: '#25D366',
                  color: '#08202E',
                  fontWeight: 800,
                  fontSize: 14,
                  padding: '15px 26px',
                  borderRadius: 13,
                  whiteSpace: 'nowrap',
                  transition: 'transform .35s'
                }}
              >
                Send me fares
              </button>
            </div>
            <div style={{ fontSize: 12, color: '#8CA0AC', lineHeight: 1.5 }}>
              Or call Valentina 696 2192, Rose-Belle 660 9814, mobile 5978 8007.
            </div>
          </div>
        </div>
      </div>

      {/* Dark footer */}
      <div style={{ background: '#0B2434', marginTop: 88, padding: '56px 0 26px' }}>
        <div className="sg-container">
          <div className="sg-footer-grid" style={{ paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,.1)' }}>
            <div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '12px 16px', display: 'inline-block', marginBottom: 18 }}>
                <img src="/assets/southgate-logo.webp" alt="South Gate Travel and Tourism" style={{ height: 44, width: 'auto', display: 'block' }} />
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,.55)', margin: '0 0 18px', maxWidth: 290 }}>{t.footBlurb}</p>
              <div style={{ display: 'flex', gap: 9 }}>
                {['Facebook', 'Instagram', 'TikTok'].map((s) => (
                  <div key={s} style={{ border: '1px solid rgba(255,255,255,.2)', borderRadius: 9, padding: '8px 13px', fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,.75)' }}>
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={mono}>{t.footExplore}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, alignItems: 'flex-start' }}>
                <button onClick={() => navigate('/umrah')} style={linkStyle}>{t.navUmrah}</button>
                <button onClick={() => navigate('/rodrigues')} style={linkStyle}>{t.navRodrigues}</button>
                <button onClick={() => navigate('/holidays')} style={linkStyle}>{t.navHolidays}</button>
                <button onClick={() => navigate('/cruises')} style={linkStyle}>Cruises</button>
                <button onClick={() => navigate('/flights')} style={linkStyle}>{t.navFlights}</button>
              </div>
            </div>

            <div>
              <div style={mono}>{t.footCompany}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, alignItems: 'flex-start' }}>
                <button onClick={() => navigate('/about')} style={linkStyle}>{t.navAbout}</button>
                <button onClick={() => navigate('/contact')} style={linkStyle}>{t.navContact}</button>
                <button onClick={() => navigate('/bookings')} style={linkStyle}>{t.myBookings}</button>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,.72)' }}>{t.terms}</span>
                <Link
                  to="/office"
                  style={{
                    border: '1px solid rgba(255,255,255,.2)',
                    background: 'rgba(255,255,255,.06)',
                    padding: '8px 14px',
                    borderRadius: 999,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#fff',
                    marginTop: 6
                  }}
                >
                  Staff back office
                </Link>
              </div>
            </div>

            <div>
              <div style={mono}>{t.footContact}</div>
              <div style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,.72)' }}>
                Valentina Mall, Phoenix
                <br />
                696 2192, 09:00 to 18:00
                <br />
                <br />
                Royal Road, Rose-Belle
                <br />
                660 9814, 09:00 to 17:00
                <br />
                <br />
                Mobile 5978 8007
                <br />
                southgatetravel@hotmail.com
              </div>
            </div>
          </div>

          <div className="sg-footer-bottom" style={{ paddingTop: 22 }}>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.42)', lineHeight: 1.6 }}>
              {t.rights}
              <br />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.28)' }}>
                Mockup imagery from Wikimedia Commons contributors, CC BY and CC BY-SA. To be replaced with South Gate photography.
              </span>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['VISA', 'Mastercard', 'MCB IPay', 'Juice', 'MyT Money', 'CIM Finance', 'Rogers Capital'].map((b) => (
                <div key={b} style={{ background: 'rgba(255,255,255,.08)', borderRadius: 7, padding: '7px 12px', fontSize: 10.5, fontWeight: 800, color: 'rgba(255,255,255,.6)' }}>
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
