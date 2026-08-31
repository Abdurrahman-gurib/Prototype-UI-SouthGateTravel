import React from 'react';
import { useLang } from '../context/LangContext.jsx';
import ImageSlot from '../components/ImageSlot.jsx';
import { DuneDivider, CompassRose } from '../components/Motifs.jsx';
import './About.css';

const mono = "'IBM Plex Mono',monospace";
const sora = "'Sora',sans-serif";
const WA_URL = 'https://wa.me/23059788007';

const OFFICES = [
  {
    id: 'valentina',
    name: 'Valentina Mall',
    place: 'Valentina, Phoenix',
    tel: '696 2192',
    telHref: 'tel:+2306962192',
    hours: '09:00 to 18:00',
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Coucher_de_Soleil_(Flic_en_Flac,_Ile_Maurice).jpg?width=1800',
    ph: 'Photo of the Valentina office'
  },
  {
    id: 'rosebelle',
    name: 'Rose-Belle',
    place: 'Rose-Belle, Grand Port',
    tel: '660 9814',
    telHref: 'tel:+2306609814',
    hours: '09:00 to 17:00',
    img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mauritius_sunset,_July_2016.jpg?width=1800',
    ph: 'Photo of the Rose-Belle office'
  }
];

export default function About() {
  const { t } = useLang();

  const stats = [
    { v: '481', c: null, txt: t.stat1 },
    { v: '96%', c: '#17A5DA', txt: t.stat2 },
    { v: 'IATA', c: null, txt: t.stat3 },
    { v: '2', c: '#E1262D', txt: t.stat4 }
  ];

  return (
    <div className="sgp-about-wrap" style={{ maxWidth: 1280, margin: '0 auto', padding: '52px 32px 0' }}>
      <div className="sgp-about-hero">
        <div style={{ position: 'relative' }}>
          <div className="sgp-about-compass" aria-hidden="true">
            <CompassRose color="rgba(201,161,78,.28)" size={116} />
          </div>
          <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.13em', textTransform: 'uppercase', color: '#E1262D', marginBottom: 16 }}>{t.aboutEyebrow}</div>
          <h1 className="sgp-about-title" style={{ fontFamily: sora, fontWeight: 800, fontSize: 46, letterSpacing: '-.034em', margin: '0 0 18px', lineHeight: 1.08 }}>{t.aboutTitle}</h1>
          <div className="sg-gold-rule" aria-hidden="true" style={{ marginBottom: 20 }} />
          <p style={{ fontSize: 16.5, lineHeight: 1.65, color: '#3C5464', margin: '0 0 16px' }}>{t.aboutP1}</p>
          <p style={{ fontSize: 16.5, lineHeight: 1.65, color: '#3C5464', margin: 0 }}>{t.aboutP2}</p>
        </div>
        <div className="sgp-about-img" style={{ height: 400, borderRadius: 22, overflow: 'hidden' }}>
          <ImageSlot src="https://commons.wikimedia.org/wiki/Special:FilePath/Mauritius_beach1.jpg?width=1800" alt="Drop a photo of your team here" />
        </div>
      </div>

      <div className="sgp-about-stats">
        {stats.map((s) => (
          <div key={s.v} className="sg-gold-ring" style={{ background: '#FBF7EE', borderRadius: 18, padding: '26px 24px' }}>
            <div style={{ fontFamily: sora, fontWeight: 800, fontSize: 32, letterSpacing: '-.03em', ...(s.c ? { color: s.c } : {}) }}>{s.v}</div>
            <div style={{ fontSize: 13.5, color: '#5B7280', marginTop: 8, lineHeight: 1.45 }}>{s.txt}</div>
          </div>
        ))}
      </div>

      <div className="sgp-about-duneband">
        <DuneDivider back="rgba(201,161,78,.30)" front="#F9F4E8" height={72} />
        <div className="sgp-about-sandpanel sg-grade-sand">
          <div className="sg-gold-rule" aria-hidden="true" style={{ marginBottom: 14 }} />
          <h2 className="sgp-about-h2" style={{ fontFamily: sora, fontWeight: 800, fontSize: 32, letterSpacing: '-.032em', margin: '0 0 22px' }}>{t.ourOffices}</h2>
          <div className="sgp-about-offices">
            {OFFICES.map((o) => (
              <div key={o.id} className="sgp-about-office sg-lift" style={{ border: '1px solid rgba(11,36,52,.1)', background: '#fff', borderRadius: 20, overflow: 'hidden' }}>
                <div className="sg-photo-warm" style={{ height: 190, position: 'relative' }}>
                  <ImageSlot src={o.img} alt={o.ph} />
                </div>
                <div style={{ padding: '24px 26px 26px' }}>
                  <div style={{ fontFamily: sora, fontWeight: 700, fontSize: 22, letterSpacing: '-.024em' }}>{o.name}</div>
                  <div style={{ fontSize: 14, color: '#5B7280', marginTop: 6 }}>{o.place}</div>
                  <div style={{ height: 1, background: 'rgba(11,36,52,.08)', margin: '18px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, marginBottom: 10 }}>
                    <span style={{ color: '#5B7280' }}>{t.telephone}</span><strong>{o.tel}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5 }}>
                    <span style={{ color: '#5B7280' }}>{t.hours}</span><strong>{o.hours}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <a href={o.telHref} className="sgp-about-btn" style={{ flex: 1, display: 'block', background: '#0B2434', color: '#fff', fontSize: 13.5, fontWeight: 700, padding: 13, borderRadius: 12, textAlign: 'center', textDecoration: 'none' }}>{t.callBtn}</a>
                    <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="sgp-about-btn" style={{ flex: 1, display: 'block', background: '#25D366', color: '#08202E', fontSize: 13.5, fontWeight: 800, padding: 13, borderRadius: 12, textAlign: 'center', textDecoration: 'none' }}>WhatsApp</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
