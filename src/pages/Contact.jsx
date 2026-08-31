import React, { useState } from 'react';
import { useLang } from '../context/LangContext.jsx';
import ImageSlot from '../components/ImageSlot.jsx';
import './Contact.css';

// Demo-submit confirmation copy (no i18n keys exist for this — kept local per contracts).
const SENT_COPY = {
  en: {
    title: 'Message sent. Thank you.',
    sub: 'An adviser will come back to you shortly on WhatsApp or by phone.',
    again: 'Send another message'
  },
  fr: {
    title: 'Message envoyé. Merci.',
    sub: 'Un conseiller vous recontacte très vite sur WhatsApp ou par téléphone.',
    again: 'Envoyer un autre message'
  },
  kr: {
    title: 'Mesaz inn ale. Mersi.',
    sub: 'Enn konseye pou revinn ver ou biento lor WhatsApp ou par telefonn.',
    again: 'Avoy enn lot mesaz'
  }
};

const LABEL_STYLE = { fontSize: 12.5, fontWeight: 700, marginBottom: 7 };

export default function Contact() {
  const { lang, t } = useLang();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('umrah');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const sent = SENT_COPY[lang] || SENT_COPY.en;
  const interests = [
    ['umrah', 'Umrah'],
    ['hajj', 'Hajj'],
    ['rod', 'Rodrigues'],
    ['other', t.other]
  ];

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const reset = () => {
    setName('');
    setPhone('');
    setInterest('umrah');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="sgp-contact-wrap">
      <div
        style={{
          fontFamily: "'IBM Plex Mono',monospace",
          fontSize: 10.5,
          letterSpacing: '.13em',
          textTransform: 'uppercase',
          color: '#E1262D',
          marginBottom: 16
        }}
      >
        {t.contactEyebrow}
      </div>
      <h1
        className="sgp-contact-title"
        style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, letterSpacing: '-.034em', margin: '0 0 14px', lineHeight: 1.08 }}
      >
        {t.contactTitle}
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.6, color: '#5B7280', margin: '0 0 36px', maxWidth: 600 }}>{t.contactSub}</p>

      <div className="sgp-contact-grid">
        {/* Form card */}
        <div className="sgp-contact-card" style={{ background: '#fff', border: '1px solid rgba(11,36,52,.1)', borderRadius: 20 }}>
          {submitted ? (
            <div className="sgp-contact-sent" role="status">
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'rgba(11,107,55,.1)',
                  color: '#0B6B37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 800,
                  marginBottom: 16
                }}
              >
                {'✓'}
              </div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 21, letterSpacing: '-.022em', marginBottom: 8 }}>
                {sent.title}
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#5B7280', margin: '0 0 6px', maxWidth: 400 }}>{sent.sub}</p>
              <p style={{ fontSize: 12.5, color: '#8CA0AC', lineHeight: 1.5, margin: '0 0 20px' }}>{t.formNote}</p>
              <button type="button" className="sgp-contact-again" onClick={reset}>
                {sent.again}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="sgp-contact-formgrid" style={{ marginBottom: 14 }}>
                <div>
                  <div style={LABEL_STYLE}>{t.yourName}</div>
                  <input
                    className="sgp-contact-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nazreen S."
                    aria-label={t.yourName}
                  />
                </div>
                <div>
                  <div style={LABEL_STYLE}>{t.phone}</div>
                  <input
                    className="sgp-contact-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+230 5xxx xxxx"
                    aria-label={t.phone}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={LABEL_STYLE}>{t.interestedIn}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {interests.map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      className="sgp-contact-chip"
                      onClick={() => setInterest(val)}
                      aria-pressed={interest === val}
                      style={
                        interest === val
                          ? { background: '#0B2434', border: '1px solid #0B2434', color: '#fff' }
                          : { background: 'transparent', border: '1px solid rgba(11,36,52,.14)', color: '#5B7280' }
                      }
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={LABEL_STYLE}>{t.message}</div>
                <textarea
                  className="sgp-contact-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.messagePh}
                  aria-label={t.message}
                  style={{ minHeight: 110, resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <button type="submit" className="sgp-contact-send">
                  {t.send}
                </button>
                <div style={{ fontSize: 12.5, color: '#8CA0AC', lineHeight: 1.5, maxWidth: 230 }}>{t.formNote}</div>
              </div>
            </form>
          )}
        </div>

        {/* Right column */}
        <div>
          <div style={{ background: '#0B2434', borderRadius: 20, padding: '26px 26px 28px', marginBottom: 16 }}>
            <div
              style={{
                fontFamily: "'Sora',sans-serif",
                fontWeight: 700,
                fontSize: 19,
                color: '#fff',
                letterSpacing: '-.022em',
                marginBottom: 8
              }}
            >
              {t.fastest}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,.62)', margin: '0 0 20px' }}>{t.fastestSub}</p>
            <a
              className="sgp-contact-wa"
              href="https://wa.me/23059788007"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                background: '#25D366',
                color: '#08202E',
                fontSize: 14.5,
                fontWeight: 800,
                padding: 15,
                borderRadius: 12,
                textAlign: 'center',
                textDecoration: 'none'
              }}
            >
              {t.waBtn}
            </a>
          </div>

          <div style={{ border: '1px solid rgba(11,36,52,.1)', background: '#fff', borderRadius: 20, padding: '22px 24px', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>Valentina Mall</div>
            <div style={{ fontSize: 13.5, color: '#5B7280', lineHeight: 1.6 }}>
              696 2192
              <br />
              {t.monSat} 09:00 to 18:00
            </div>
            <div style={{ height: 1, background: 'rgba(11,36,52,.08)', margin: '16px 0' }} />
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>Rose-Belle</div>
            <div style={{ fontSize: 13.5, color: '#5B7280', lineHeight: 1.6 }}>
              660 9814
              <br />
              {t.monSat} 09:00 to 17:00
            </div>
          </div>

          <div style={{ height: 190, borderRadius: 20, overflow: 'hidden' }}>
            <ImageSlot
              src="https://commons.wikimedia.org/wiki/Special:FilePath/Mauritius_-_Silent_Seascape2.jpg?width=800"
              alt="Map of both branches"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
