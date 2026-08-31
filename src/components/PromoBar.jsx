import React from 'react';
import { useLang } from '../context/LangContext.jsx';

export default function PromoBar() {
  const { t } = useLang();
  return (
    <div style={{ background: '#0B2434', color: 'rgba(255,255,255,.72)', fontSize: 12.5, padding: '9px 0' }}>
      <div className="sg-container" style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <span style={{ color: '#fff', fontWeight: 700 }}>{t.promo}</span>
        <span style={{ flex: 1 }} />
        <span className="sg-hide-mobile">Valentina 696 2192</span>
        <span className="sg-hide-mobile" style={{ opacity: 0.4 }}>
          ·
        </span>
        <span className="sg-hide-mobile">Rose-Belle 660 9814</span>
        <span className="sg-hide-mobile" style={{ opacity: 0.4 }}>
          ·
        </span>
        <a
          href="https://wa.me/23059788007"
          target="_blank"
          rel="noreferrer"
          style={{ color: '#25D366', fontWeight: 700 }}
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
