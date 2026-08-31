import React from 'react';

/**
 * Dark gradient page header used by listing / flights pages.
 */
export default function PageHero({ eyebrow, title, sub, children }) {
  return (
    <div style={{ background: 'linear-gradient(115deg,#0B2434 0%,#12455F 58%,#0E7FAB 100%)', padding: '52px 0 46px' }}>
      <div className="sg-container">
        {eyebrow && (
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
            {eyebrow}
          </div>
        )}
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
          {title}
        </h1>
        {sub && (
          <p style={{ fontSize: 17, lineHeight: 1.55, color: 'rgba(255,255,255,.62)', margin: 0, maxWidth: 620 }}>{sub}</p>
        )}
        {children}
      </div>
    </div>
  );
}
