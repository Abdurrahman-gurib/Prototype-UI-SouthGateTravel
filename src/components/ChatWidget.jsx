import React, { useEffect, useRef, useState } from 'react';
import { useLang } from '../context/LangContext.jsx';
import { TOPICS, CHAT_GREET } from '../data/chatTopics.js';

export default function ChatWidget() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState([]);
  const [typing, setTyping] = useState(false);
  const timerRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [log, typing, open]);

  const ask = (q, a) => {
    setLog((l) => [...l, { me: true, txt: q }]);
    setTyping(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setLog((l) => [...l, { me: false, txt: a }]);
      setTyping(false);
    }, 750);
  };

  const greet = CHAT_GREET[lang] || CHAT_GREET.en;

  return (
    <div
      style={{
        position: 'fixed',
        right: 22,
        bottom: 22,
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 12,
        fontFamily: "'Manrope',system-ui,sans-serif"
      }}
    >
      {open && (
        <div
          style={{
            width: 352,
            maxWidth: 'calc(100vw - 44px)',
            height: 472,
            maxHeight: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255,255,255,.9)',
            backdropFilter: 'blur(26px) saturate(180%)',
            WebkitBackdropFilter: 'blur(26px) saturate(180%)',
            border: '1px solid rgba(255,255,255,.9)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 30px 70px rgba(11,36,52,.26)',
            animation: 'sgRise .35s cubic-bezier(.2,.8,.25,1) both'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '16px 18px',
              background: 'linear-gradient(120deg,#0B2434,#12455F)',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 11,
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <img src="/assets/southgate-logo.webp" alt="" style={{ width: 26, height: 'auto', display: 'block' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>South Gate assistant</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: '#4ADE80', animation: 'sgPulse 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>Replies in seconds</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{
                border: 0,
                background: 'rgba(255,255,255,.12)',
                color: '#fff',
                cursor: 'pointer',
                width: 28,
                height: 28,
                borderRadius: 99,
                fontSize: 16,
                lineHeight: 1,
                flexShrink: 0
              }}
            >
              ×
            </button>
          </div>

          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              background: 'linear-gradient(180deg,rgba(242,248,251,.7),rgba(255,255,255,.4))'
            }}
          >
            <div
              style={{
                alignSelf: 'flex-start',
                maxWidth: '86%',
                background: 'rgba(255,255,255,.94)',
                border: '1px solid rgba(11,36,52,.1)',
                borderRadius: '16px 16px 16px 5px',
                padding: '13px 15px',
                fontSize: 13.5,
                lineHeight: 1.55,
                color: '#0B2434'
              }}
            >
              {greet}
            </div>
            {log.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.me ? 'flex-end' : 'flex-start',
                  maxWidth: '86%',
                  background: m.me ? '#0B2434' : 'rgba(255,255,255,.94)',
                  color: m.me ? '#fff' : '#0B2434',
                  border: m.me ? '1px solid transparent' : '1px solid rgba(11,36,52,.1)',
                  borderRadius: 16,
                  padding: '13px 15px',
                  fontSize: 13.5,
                  lineHeight: 1.55
                }}
              >
                {m.txt}
              </div>
            ))}
            {typing && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: 'rgba(255,255,255,.94)',
                  border: '1px solid rgba(11,36,52,.1)',
                  borderRadius: 16,
                  padding: '14px 16px',
                  display: 'flex',
                  gap: 5
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 99, background: '#8CA0AC', animation: 'sgPulse 1.1s ease-in-out infinite' }} />
                <span style={{ width: 6, height: 6, borderRadius: 99, background: '#8CA0AC', animation: 'sgPulse 1.1s ease-in-out .2s infinite' }} />
                <span style={{ width: 6, height: 6, borderRadius: 99, background: '#8CA0AC', animation: 'sgPulse 1.1s ease-in-out .4s infinite' }} />
              </div>
            )}
          </div>

          <div style={{ flexShrink: 0, borderTop: '1px solid rgba(11,36,52,.09)', padding: '12px 14px 14px', background: 'rgba(255,255,255,.7)' }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono',monospace",
                fontSize: 9,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: '#8CA0AC',
                marginBottom: 9
              }}
            >
              Common questions
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxHeight: 104, overflowY: 'auto' }}>
              {TOPICS.map((tp) => (
                <button
                  key={tp[0]}
                  onClick={() => ask(tp[0], tp[1])}
                  style={{
                    border: '1px solid rgba(11,36,52,.14)',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#3C5464',
                    padding: '8px 12px',
                    borderRadius: 999,
                    transition: 'border-color .3s,color .3s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tp[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        style={{
          border: 0,
          cursor: 'pointer',
          background: 'linear-gradient(135deg,#E1262D,#B01820)',
          color: '#fff',
          fontWeight: 800,
          fontSize: 14,
          padding: '15px 24px',
          borderRadius: 999,
          boxShadow: '0 14px 34px rgba(225,38,45,.34)',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          transition: 'transform .35s cubic-bezier(.2,.7,.25,1),box-shadow .35s'
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 99, background: '#4ADE80', flexShrink: 0 }} />
        <span style={{ whiteSpace: 'nowrap' }}>{open ? '×' : 'Ask us'}</span>
      </button>
    </div>
  );
}
