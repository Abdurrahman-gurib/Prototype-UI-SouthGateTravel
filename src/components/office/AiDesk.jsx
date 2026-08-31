import React, { useEffect, useRef, useState } from 'react';

const mono = "'IBM Plex Mono',monospace";
const sora = "'Sora',sans-serif";

const QUOTE_LABELS = {
  en: {
    title: 'Quotation', client: 'Prepared for', pkg: 'Package', dates: 'Departure', board: 'Board basis',
    adults: 'Adults', children: 'Children (2–11)', total: 'Total', deposit: 'Deposit to hold (30%)',
    instal: 'Or three instalments of', includes: 'What is included', validity: 'Prices subject to availability. Quotation valid 48 hours.',
    print: 'Print / Save PDF', download: 'Download', perPerson: 'per person'
  },
  fr: {
    title: 'Devis', client: 'Préparé pour', pkg: 'Forfait', dates: 'Départ', board: 'Pension',
    adults: 'Adultes', children: 'Enfants (2–11)', total: 'Total', deposit: 'Acompte pour réserver (30%)',
    instal: 'Ou trois mensualités de', includes: 'Ce qui est compris', validity: 'Prix selon disponibilité. Devis valable 48 heures.',
    print: 'Imprimer / PDF', download: 'Télécharger', perPerson: 'par personne'
  }
};

const rs = (n) => 'Rs ' + Math.round(n).toLocaleString('en-US');

function quotationHTML(q) {
  const L = QUOTE_LABELS[q.lang] || QUOTE_LABELS.en;
  const inc = (q.includes || []).map((x) => `<li>${String(x).replace(/</g, '&lt;')}</li>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><title>${L.title} ${q.ref}</title>
<style>body{font-family:'Segoe UI',system-ui,sans-serif;color:#0B2434;margin:0;padding:40px;max-width:720px}
h1{font-size:26px;margin:0} .muted{color:#5B7280} .mono{font-family:Consolas,monospace;font-size:12px;letter-spacing:.08em}
table{width:100%;border-collapse:collapse;margin:18px 0} td,th{padding:9px 10px;border-bottom:1px solid #e3e8ea;text-align:left;font-size:14px}
.tot{font-size:20px;font-weight:800} .badge{display:inline-block;background:#0B2434;color:#fff;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700}
ul{margin:8px 0;padding-left:20px;font-size:13.5px;line-height:1.6} .foot{margin-top:26px;font-size:12px;color:#8CA0AC;border-top:1px solid #e3e8ea;padding-top:14px}
@media print{body{padding:20px}}</style></head><body>
<div style="display:flex;justify-content:space-between;align-items:flex-start">
  <div><h1>South Gate <span style="color:#17A5DA">Travel &amp; Tourism</span></h1>
  <div class="muted" style="font-size:13px">IATA accredited agent — Valentina Mall, Phoenix · Rose-Belle</div></div>
  <div style="text-align:right"><div class="badge">${L.title}</div><div class="mono" style="margin-top:8px">${q.ref} · ${q.date}</div></div>
</div>
<table>
<tr><td class="muted">${L.client}</td><td><strong>${String(q.clientName).replace(/</g, '&lt;')}</strong></td></tr>
<tr><td class="muted">${L.pkg}</td><td><strong>${String(q.packageName).replace(/</g, '&lt;')}</strong> — ${String(q.destination).replace(/</g, '&lt;')}</td></tr>
<tr><td class="muted">${L.dates}</td><td>${String(q.departureDates).replace(/</g, '&lt;')}</td></tr>
<tr><td class="muted">${L.board}</td><td>${String(q.boardBasis).replace(/</g, '&lt;')}</td></tr>
<tr><td class="muted">${L.adults}</td><td>${q.adults} × ${rs(q.adultUnitPrice)} = <strong>${rs(q.adultsTotal)}</strong></td></tr>
${q.children ? `<tr><td class="muted">${L.children}</td><td>${q.children} × ${rs(q.childUnitPrice)} = <strong>${rs(q.childrenTotal)}</strong></td></tr>` : ''}
<tr><td class="muted">${L.total}</td><td class="tot">${rs(q.total)}</td></tr>
<tr><td class="muted">${L.deposit}</td><td><strong>${rs(q.deposit)}</strong></td></tr>
<tr><td class="muted">${L.instal}</td><td><strong>${rs(q.instalment)}</strong></td></tr>
</table>
<div><strong>${L.includes}</strong><ul>${inc}</ul></div>
${q.notes ? `<div class="muted" style="font-size:13px">${String(q.notes).replace(/</g, '&lt;')}</div>` : ''}
<div class="foot">${L.validity}<br>Valentina Mall 696 2192 · Rose-Belle 660 9814 · WhatsApp 5978 8007 · southgatetravel@hotmail.com</div>
</body></html>`;
}

function QuotationCard({ q }) {
  const L = QUOTE_LABELS[q.lang] || QUOTE_LABELS.en;
  const openPrint = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(quotationHTML(q));
    w.document.close();
    setTimeout(() => w.print(), 350);
  };
  const download = () => {
    const blob = new Blob([quotationHTML(q)], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${q.ref}-southgate-quotation.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div style={{ border: '1px solid rgba(11,36,52,.12)', borderRadius: 14, overflow: 'hidden', background: '#fff', maxWidth: 420 }}>
      <div style={{ background: '#0B2434', color: '#fff', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)' }}>{L.title}</span>
        <span style={{ fontFamily: mono, fontSize: 11 }}>{q.ref}</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(255,255,255,.55)' }}>{q.date}</span>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontFamily: sora, fontWeight: 700, fontSize: 15.5, letterSpacing: '-.02em' }}>{q.packageName}</div>
        <div style={{ fontSize: 12.5, color: '#5B7280', marginTop: 3 }}>
          {q.destination} · {q.departureDates} · {q.boardBasis}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, margin: '12px 0', fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#8CA0AC' }}>{L.adults} × {q.adults}</span>
            <strong>{rs(q.adultsTotal)}</strong>
          </div>
          {q.children > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8CA0AC' }}>{L.children} × {q.children}</span>
              <strong>{rs(q.childrenTotal)}</strong>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(11,36,52,.09)', paddingTop: 7, marginTop: 3 }}>
            <span style={{ fontWeight: 700 }}>{L.total}</span>
            <span style={{ fontFamily: sora, fontWeight: 800, fontSize: 17 }}>{rs(q.total)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5B7280' }}>
            <span>{L.deposit}</span>
            <span style={{ fontWeight: 700, color: '#0B6B37' }}>{rs(q.deposit)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5B7280' }}>
            <span>{L.instal}</span>
            <span style={{ fontWeight: 700 }}>{rs(q.instalment)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={openPrint} style={{ flex: 1, border: 0, cursor: 'pointer', background: '#0B2434', color: '#fff', fontWeight: 700, fontSize: 12.5, padding: '10px 12px', borderRadius: 9 }}>
            {L.print}
          </button>
          <button onClick={download} style={{ flex: 1, border: '1px solid rgba(11,36,52,.16)', cursor: 'pointer', background: '#fff', color: '#0B2434', fontWeight: 700, fontSize: 12.5, padding: '10px 12px', borderRadius: 9 }}>
            {L.download}
          </button>
        </div>
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  'Quote Cotton Bay, 2 adults 1 child, 19 May',
  'Quelles croisières partent de Port Louis ?',
  'Generate a photo of Rodrigues lagoon for a Facebook post',
  'Compare Dubai and Turkey for a family in April',
  'Client wants Umrah on instalments — what do I tell them?'
];

export default function AiDesk() {
  const [msgs, setMsgs] = useState([]); // {role, text, images?, quotations?, saved?, error?}
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [health, setHealth] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth({ ok: false }));
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, busy]);

  const send = async (textArg) => {
    const text = (textArg ?? input).trim();
    if (!text || busy) return;
    setInput('');
    const next = [...msgs, { role: 'user', text }];
    setMsgs(next);
    setBusy(true);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.text })) })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Request failed');
      setMsgs((cur) => [...cur, { role: 'assistant', text: j.text || '…', images: j.images || [], quotations: j.quotations || [], saved: j.saved || [] }]);
    } catch (e) {
      setMsgs((cur) => [...cur, { role: 'assistant', text: String(e.message), error: true }]);
    } finally {
      setBusy(false);
    }
  };

  const offline = health && (!health.ok || !health.anthropicKey);

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(11,36,52,.08)', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      {/* Header */}
      <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(11,36,52,.08)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ width: 8, height: 8, borderRadius: 99, background: offline ? '#D03B3B' : '#25D366', animation: offline ? 'none' : 'sgPulse 2s ease-in-out infinite' }} />
        <span style={{ fontSize: 14, fontWeight: 700 }}>AI sales &amp; reservation desk</span>
        <span style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#8CA0AC' }}>EN · FR</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: '#8CA0AC' }}>
          {offline
            ? 'Server keys missing — start the API server with npm run server'
            : health
              ? `Live · quotations, photos, notes${health.learnedNotes ? ` · ${health.learnedNotes} learned notes` : ''}`
              : 'Connecting…'}
        </span>
      </div>

      {/* Transcript */}
      <div ref={scrollRef} style={{ height: 440, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, background: '#F7F9FA' }}>
        {msgs.length === 0 && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '82%', background: '#fff', border: '1px solid rgba(11,36,52,.1)', borderRadius: '14px 14px 14px 5px', padding: '12px 15px', fontSize: 13.5, lineHeight: 1.55 }}>
            Bonjour / Hello! I am the South Gate AI sales officer. Ask me anything about our packages, cruises, hotels or flights — I can prepare quotations, generate destination photos, and remember what you teach me. English ou français.
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}>
            <div
              style={{
                maxWidth: '82%',
                background: m.role === 'user' ? '#0B2434' : m.error ? '#FCE3E4' : '#fff',
                color: m.role === 'user' ? '#fff' : m.error ? '#A81820' : '#0B2434',
                border: m.role === 'user' ? '1px solid transparent' : '1px solid rgba(11,36,52,.1)',
                borderRadius: 14,
                padding: '12px 15px',
                fontSize: 13.5,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap'
              }}
            >
              {m.text}
            </div>
            {(m.images || []).map((img, k) => (
              <img
                key={k}
                src={`data:${img.mime};base64,${img.b64}`}
                alt={img.prompt}
                style={{ maxWidth: 360, width: '100%', borderRadius: 14, border: '1px solid rgba(11,36,52,.1)', boxShadow: '0 10px 26px rgba(11,36,52,.12)' }}
              />
            ))}
            {(m.quotations || []).map((q) => (
              <QuotationCard key={q.ref} q={q} />
            ))}
            {(m.saved || []).map((s, k) => (
              <div key={k} style={{ fontFamily: mono, fontSize: 10.5, color: '#0B6B37', background: '#DDF6E6', borderRadius: 8, padding: '6px 10px' }}>
                ✓ Learned: {s}
              </div>
            ))}
          </div>
        ))}
        {busy && (
          <div style={{ alignSelf: 'flex-start', background: '#fff', border: '1px solid rgba(11,36,52,.1)', borderRadius: 14, padding: '13px 16px', display: 'flex', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: '#8CA0AC', animation: 'sgPulse 1.1s ease-in-out infinite' }} />
            <span style={{ width: 6, height: 6, borderRadius: 99, background: '#8CA0AC', animation: 'sgPulse 1.1s ease-in-out .2s infinite' }} />
            <span style={{ width: 6, height: 6, borderRadius: 99, background: '#8CA0AC', animation: 'sgPulse 1.1s ease-in-out .4s infinite' }} />
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div style={{ padding: '10px 16px 0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={busy}
            style={{ border: '1px solid rgba(11,36,52,.14)', background: '#fff', cursor: 'pointer', fontSize: 11.5, fontWeight: 600, color: '#3C5464', padding: '7px 11px', borderRadius: 999 }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px 16px', display: 'flex', gap: 9 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask in English or French… (quotes, photos, cruise questions, staff notes)"
          disabled={busy}
          style={{ flex: 1, border: '1px solid rgba(11,36,52,.14)', borderRadius: 12, padding: '12px 15px', fontSize: 13.5, outline: 'none', minWidth: 0 }}
        />
        <button
          onClick={() => send()}
          disabled={busy || !input.trim()}
          style={{ border: 0, cursor: busy ? 'default' : 'pointer', background: busy ? '#8CA0AC' : '#E1262D', color: '#fff', fontWeight: 800, fontSize: 13.5, padding: '12px 22px', borderRadius: 12 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
