import React, { useEffect, useRef, useState } from 'react';

const mono = "'IBM Plex Mono',monospace";
const sora = "'Sora',sans-serif";

/* ================= markdown rendering (structured answers, never raw code) ================= */

function cleanMD(text) {
  return String(text || '')
    .replace(/```[a-z]*\n?/g, '')
    .replace(/`([^`]*)`/g, '$1');
}

function inlineMD(s) {
  const parts = String(s).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <React.Fragment key={i}>{p}</React.Fragment>
  );
}

function renderMD(text) {
  const lines = cleanMD(text).replace(/\r/g, '').split('\n');
  const out = [];
  let list = null;
  let listType = null;
  const flush = () => {
    if (list && list.length) {
      out.push(
        listType === 'ol' ? (
          <ol key={'l' + out.length} style={{ margin: '4px 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 3 }}>{list}</ol>
        ) : (
          <ul key={'l' + out.length} style={{ margin: '4px 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 3 }}>{list}</ul>
        )
      );
    }
    list = null;
    listType = null;
  };
  lines.forEach((ln, i) => {
    const bullet = ln.match(/^\s*[-•]\s+(.*)/);
    const num = ln.match(/^\s*\d+[.)]\s+(.*)/);
    const head = ln.match(/^\s*#{1,4}\s+(.*)/);
    if (bullet) {
      if (listType !== 'ul') { flush(); listType = 'ul'; list = []; }
      list.push(<li key={i}>{inlineMD(bullet[1])}</li>);
    } else if (num) {
      if (listType !== 'ol') { flush(); listType = 'ol'; list = []; }
      list.push(<li key={i}>{inlineMD(num[1])}</li>);
    } else {
      flush();
      if (head) out.push(<div key={i} style={{ fontWeight: 800, fontSize: 13.5, marginTop: 8, marginBottom: 2 }}>{inlineMD(head[1])}</div>);
      else if (ln.trim() === '') out.push(<div key={i} style={{ height: 5 }} />);
      else out.push(<div key={i}>{inlineMD(ln)}</div>);
    }
  });
  flush();
  return out;
}

/* ================= quotation document ================= */

const QUOTE_LABELS = {
  en: {
    title: 'Quotation', client: 'Prepared for', pkg: 'Package', dates: 'Departure', board: 'Board basis',
    adults: 'Adults', children: 'Children (2–11)', total: 'Total', deposit: 'Deposit to hold (30%)',
    instal: 'Or three instalments of', includes: 'What is included', validity: 'Prices subject to availability. Quotation valid 48 hours.',
    print: 'Print / Save PDF', download: 'Download'
  },
  fr: {
    title: 'Devis', client: 'Préparé pour', pkg: 'Forfait', dates: 'Départ', board: 'Pension',
    adults: 'Adultes', children: 'Enfants (2–11)', total: 'Total', deposit: 'Acompte pour réserver (30%)',
    instal: 'Ou trois mensualités de', includes: 'Ce qui est compris', validity: 'Prix selon disponibilité. Devis valable 48 heures.',
    print: 'Imprimer / PDF', download: 'Télécharger'
  }
};

const rs = (n) => 'Rs ' + Math.round(n).toLocaleString('en-US');

function esc(s) {
  return String(s ?? '').replace(/</g, '&lt;');
}

function quotationHTML(q) {
  const L = QUOTE_LABELS[q.lang] || QUOTE_LABELS.en;
  const inc = (q.includes || []).map((x) => `<li>${esc(x)}</li>`).join('');
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
<tr><td class="muted">${L.client}</td><td><strong>${esc(q.clientName)}</strong></td></tr>
<tr><td class="muted">${L.pkg}</td><td><strong>${esc(q.packageName)}</strong> — ${esc(q.destination)}</td></tr>
<tr><td class="muted">${L.dates}</td><td>${esc(q.departureDates)}</td></tr>
<tr><td class="muted">${L.board}</td><td>${esc(q.boardBasis)}</td></tr>
<tr><td class="muted">${L.adults}</td><td>${q.adults} × ${rs(q.adultUnitPrice)} = <strong>${rs(q.adultsTotal)}</strong></td></tr>
${q.children ? `<tr><td class="muted">${L.children}</td><td>${q.children} × ${rs(q.childUnitPrice)} = <strong>${rs(q.childrenTotal)}</strong></td></tr>` : ''}
<tr><td class="muted">${L.total}</td><td class="tot">${rs(q.total)}</td></tr>
<tr><td class="muted">${L.deposit}</td><td><strong>${rs(q.deposit)}</strong></td></tr>
<tr><td class="muted">${L.instal}</td><td><strong>${rs(q.instalment)}</strong></td></tr>
</table>
<div><strong>${L.includes}</strong><ul>${inc}</ul></div>
${q.notes ? `<div class="muted" style="font-size:13px">${esc(q.notes)}</div>` : ''}
<div class="foot">${L.validity}<br>Valentina Mall 696 2192 · Rose-Belle 660 9814 · WhatsApp 5978 8007 · southgatetravel@hotmail.com</div>
</body></html>`;
}

function openPrintHTML(html) {
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 350);
}

function downloadHTML(html, filename) {
  const blob = new Blob([html], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function CardActions({ html, filename, printLabel = 'Print / PDF' }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={() => openPrintHTML(html)} style={{ flex: 1, border: 0, cursor: 'pointer', background: '#0B2434', color: '#fff', fontWeight: 700, fontSize: 12.5, padding: '10px 12px', borderRadius: 9 }}>
        {printLabel}
      </button>
      <button onClick={() => downloadHTML(html, filename)} style={{ flex: 1, border: '1px solid rgba(11,36,52,.16)', cursor: 'pointer', background: '#fff', color: '#0B2434', fontWeight: 700, fontSize: 12.5, padding: '10px 12px', borderRadius: 9 }}>
        Download
      </button>
    </div>
  );
}

function QuotationCard({ q }) {
  const L = QUOTE_LABELS[q.lang] || QUOTE_LABELS.en;
  return (
    <div style={{ border: '1px solid rgba(11,36,52,.12)', borderRadius: 14, overflow: 'hidden', background: '#fff', maxWidth: 420, width: '100%' }}>
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
        <CardActions html={quotationHTML(q)} filename={`${q.ref}-southgate-quotation.html`} printLabel={L.print} />
      </div>
    </div>
  );
}

/* ================= proposal / forecast / report documents ================= */

const DOC_META = {
  proposal: { badge: 'Package proposal', color: '#0E7FAB' },
  forecast: { badge: 'Forecast', color: '#8A5B12' },
  report: { badge: 'Report', color: '#0B2434' }
};

function docHTML(type, d) {
  const meta = DOC_META[type];
  let body = '';
  if (type === 'proposal') {
    body = `
<div style="background:#F2F6F8;border-radius:12px;padding:16px 18px;margin:16px 0">
  <div style="font-size:13px;color:#5B7280">${esc(d.destination)} · ${d.nights} ${d.lang === 'fr' ? 'nuits' : 'nights'} · ${esc(d.board)} · ${esc(d.season)}</div>
  <div style="font-size:24px;font-weight:800;margin-top:6px">Rs ${Number(d.pricePerAdult).toLocaleString('en-US')} <span style="font-size:12px;font-weight:400;color:#8CA0AC">${d.lang === 'fr' ? 'par adulte' : 'per adult'}</span></div>
  <div style="font-size:13.5px;margin-top:8px;font-style:italic">${esc(d.positioning)}</div>
</div>
<h3>${d.lang === 'fr' ? 'Jour par jour' : 'Day by day'}</h3>
<table>${(d.itinerary || []).map((it) => `<tr><td style="white-space:nowrap;color:#8CA0AC">${esc(it.day)}</td><td><strong>${esc(it.title)}</strong><br>${esc(it.desc)}</td></tr>`).join('')}</table>
<h3>${d.lang === 'fr' ? 'Compris' : 'Included'}</h3><ul>${(d.includes || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
<h3>${d.lang === 'fr' ? 'Non compris' : 'Not included'}</h3><ul>${(d.excludes || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
<h3>${d.lang === 'fr' ? 'Coûts et marge' : 'Cost & margin notes'}</h3><p style="font-size:13.5px;line-height:1.6">${esc(d.costNotes)}</p>`;
  } else if (type === 'forecast') {
    body = `
<p style="font-size:14px;line-height:1.65;background:#F2F6F8;border-radius:12px;padding:14px 16px">${esc(d.summary)}</p>
<table><tr><th>${d.lang === 'fr' ? 'Période' : 'Period'}</th><th>${d.lang === 'fr' ? 'Indicateur' : 'Metric'}</th><th>${d.lang === 'fr' ? 'Projection' : 'Projected'}</th><th>${d.lang === 'fr' ? 'Base' : 'Basis'}</th></tr>
${(d.rows || []).map((r) => `<tr><td>${esc(r.period)}</td><td>${esc(r.metric)}</td><td><strong>${esc(r.projected)}</strong></td><td style="color:#5B7280;font-size:12.5px">${esc(r.basis)}</td></tr>`).join('')}</table>
<h3>${d.lang === 'fr' ? 'Hypothèses' : 'Assumptions'}</h3><ul>${(d.assumptions || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  } else {
    body = `
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:16px 0">
${(d.kpis || []).map((k) => `<div style="background:#F2F6F8;border-radius:12px;padding:12px 14px"><div style="font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#8CA0AC">${esc(k.label)}</div><div style="font-size:19px;font-weight:800;margin-top:4px">${esc(k.value)}</div>${k.delta ? `<div style="font-size:11.5px;color:#0B6B37;margin-top:2px">${esc(k.delta)}</div>` : ''}</div>`).join('')}
</div>
${(d.sections || []).map((s) => `<h3>${esc(s.heading)}</h3><p style="font-size:13.5px;line-height:1.65">${esc(s.body)}</p>`).join('')}
<h3>${d.lang === 'fr' ? 'Recommandations' : 'Recommendations'}</h3><ol>${(d.recommendations || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
  }
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(d.title || d.name)} ${d.ref}</title>
<style>body{font-family:'Segoe UI',system-ui,sans-serif;color:#0B2434;margin:0;padding:40px;max-width:760px}
h1{font-size:24px;margin:0} h3{font-size:14px;margin:18px 0 6px} .muted{color:#5B7280}
.mono{font-family:Consolas,monospace;font-size:12px;letter-spacing:.08em}
table{width:100%;border-collapse:collapse;margin:12px 0} td,th{padding:8px 10px;border-bottom:1px solid #e3e8ea;text-align:left;font-size:13.5px;vertical-align:top}
th{font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:#8CA0AC}
ul,ol{margin:6px 0;padding-left:20px;font-size:13.5px;line-height:1.6}
.badge{display:inline-block;background:${meta.color};color:#fff;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700}
.foot{margin-top:26px;font-size:12px;color:#8CA0AC;border-top:1px solid #e3e8ea;padding-top:14px}
@media print{body{padding:20px}}</style></head><body>
<div style="display:flex;justify-content:space-between;align-items:flex-start">
<div><h1>South Gate <span style="color:#17A5DA">Travel &amp; Tourism</span></h1>
<div class="muted" style="font-size:13px">${esc(d.title || d.name)}${d.period ? ' — ' + esc(d.period) : ''}${d.horizon ? ' — ' + esc(d.horizon) : ''}</div></div>
<div style="text-align:right"><div class="badge">${meta.badge}</div><div class="mono" style="margin-top:8px">${d.ref} · ${d.date}</div></div>
</div>
${body}
<div class="foot">South Gate Travel &amp; Tourism — internal document. Valentina Mall 696 2192 · Rose-Belle 660 9814 · southgatetravel@hotmail.com</div>
</body></html>`;
}

function DocCard({ type, d }) {
  const meta = DOC_META[type];
  const preview =
    type === 'proposal'
      ? `${d.destination} · ${d.nights} nights · Rs ${Number(d.pricePerAdult).toLocaleString('en-US')}/adult · ${d.season}`
      : type === 'forecast'
        ? `${d.horizon} · ${(d.rows || []).length} projections`
        : `${d.period} · ${(d.kpis || []).length} KPIs · ${(d.sections || []).length} sections`;
  return (
    <div style={{ border: '1px solid rgba(11,36,52,.12)', borderRadius: 14, overflow: 'hidden', background: '#fff', maxWidth: 420, width: '100%' }}>
      <div style={{ background: meta.color, color: '#fff', padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.65)' }}>{meta.badge}</span>
        <span style={{ fontFamily: mono, fontSize: 11 }}>{d.ref}</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(255,255,255,.6)' }}>{d.date}</span>
      </div>
      <div style={{ padding: '13px 16px' }}>
        <div style={{ fontFamily: sora, fontWeight: 700, fontSize: 15, letterSpacing: '-.02em' }}>{d.title || d.name}</div>
        <div style={{ fontSize: 12.5, color: '#5B7280', marginTop: 4, marginBottom: 12 }}>{preview}</div>
        <CardActions html={docHTML(type, d)} filename={`${d.ref}-southgate-${type}.html`} />
      </div>
    </div>
  );
}

/* ================= attachments ================= */

const readAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

const readAsText = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsText(file);
  });

const IMG_MIMES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const TEXT_EXT = /\.(txt|csv|md|json)$/i;

async function fileToAttachment(file) {
  if (file.size > 8 * 1024 * 1024) throw new Error(`${file.name}: max 8 MB`);
  if (IMG_MIMES.includes(file.type)) {
    return { kind: 'image', name: file.name, mime: file.type, b64: await readAsBase64(file) };
  }
  if (file.type === 'application/pdf') {
    return { kind: 'pdf', name: file.name, b64: await readAsBase64(file) };
  }
  if (file.type.startsWith('text/') || TEXT_EXT.test(file.name)) {
    return { kind: 'text', name: file.name, text: (await readAsText(file)).slice(0, 20000) };
  }
  throw new Error(`${file.name}: only images, PDF and text files`);
}

function attachmentBlocks(atts, text) {
  const blocks = [];
  for (const a of atts) {
    if (a.kind === 'image') blocks.push({ type: 'image', source: { type: 'base64', media_type: a.mime, data: a.b64 } });
    else if (a.kind === 'pdf') blocks.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: a.b64 } });
    else if (a.kind === 'text') blocks.push({ type: 'text', text: `Attached file "${a.name}":\n---\n${a.text}\n---` });
  }
  blocks.push({ type: 'text', text });
  return blocks;
}

/* ================= suggestions ================= */

const SUGGESTIONS = [
  'Quote Cotton Bay, 2 adults 1 child, 19 May',
  'Draft a new 4-night Réunion island package',
  'Forecast revenue for June to December 2026',
  'Export a season report for the directors',
  'Quelles croisières partent de Port Louis ?',
  'Photo of Rodrigues lagoon for a Facebook post'
];

/* ================= main component ================= */

export default function AiDesk() {
  // msgs: {role, text, atts?, images?, quotations?, proposals?, forecasts?, reports?, saved?, error?, streaming?, status?}
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [atts, setAtts] = useState([]);
  const [busy, setBusy] = useState(false);
  const [health, setHealth] = useState(null);
  const [showIdeas, setShowIdeas] = useState(false);
  const scrollRef = useRef(null);
  const fileRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth({ ok: false }));
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, busy]);

  const autoGrow = () => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 110) + 'px';
  };

  const addFiles = async (files) => {
    const next = [...atts];
    for (const f of Array.from(files).slice(0, 4 - next.length)) {
      try {
        next.push(await fileToAttachment(f));
      } catch (e) {
        setMsgs((cur) => [...cur, { role: 'assistant', text: String(e.message), error: true }]);
      }
    }
    setAtts(next.slice(0, 4));
  };

  const updateLast = (fn) =>
    setMsgs((cur) => {
      const copy = cur.slice();
      copy[copy.length - 1] = fn(copy[copy.length - 1]);
      return copy;
    });

  const send = async (textArg) => {
    const text = (textArg ?? input).trim();
    if ((!text && !atts.length) || busy) return;
    const outText = text || 'Please look at the attached file(s).';
    const myAtts = atts;
    setInput('');
    setAtts([]);
    if (taRef.current) taRef.current.style.height = 'auto';

    const history = [...msgs, { role: 'user', text: outText, atts: myAtts }];
    setMsgs([...history, { role: 'assistant', text: '', streaming: true, status: '' }]);
    setBusy(true);

    // Build API messages: only the current turn carries real attachment blocks.
    const apiMessages = history.map((m, i) => {
      const isLast = i === history.length - 1;
      if (m.role === 'user' && isLast && myAtts.length) return { role: 'user', content: attachmentBlocks(myAtts, outText) };
      const suffix = m.atts && m.atts.length ? ` [attached: ${m.atts.map((a) => a.name).join(', ')}]` : '';
      return { role: m.role, content: (m.text || '') + suffix };
    });

    try {
      const resp = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });
      if (!resp.ok || !resp.body) throw new Error('Assistant unavailable (' + resp.status + ')');

      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      let gotFinal = false;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf('\n\n')) >= 0) {
          const chunk = buf.slice(0, idx);
          buf = buf.slice(idx + 2);
          const line = chunk.split('\n').find((l) => l.startsWith('data: '));
          if (!line) continue;
          const payload = line.slice(6);
          if (payload === '[DONE]') continue;
          let ev;
          try { ev = JSON.parse(payload); } catch { continue; }
          if (ev.t === 'delta') updateLast((m) => ({ ...m, text: (m.text || '') + ev.v, status: '' }));
          else if (ev.t === 'status') updateLast((m) => ({ ...m, status: ev.v }));
          else if (ev.t === 'error') updateLast(() => ({ role: 'assistant', text: ev.v, error: true }));
          else if (ev.t === 'final') {
            gotFinal = true;
            const p = ev.payload || {};
            updateLast(() => ({
              role: 'assistant',
              text: p.text || '…',
              images: p.images || [],
              quotations: p.quotations || [],
              proposals: p.proposals || [],
              forecasts: p.forecasts || [],
              reports: p.reports || [],
              saved: p.saved || []
            }));
          }
        }
      }
      if (!gotFinal) updateLast((m) => (m.error ? m : { ...m, streaming: false }));
    } catch (e) {
      updateLast(() => ({ role: 'assistant', text: String(e.message), error: true }));
    } finally {
      setBusy(false);
    }
  };

  const offline = health && (!health.ok || !health.anthropicKey);

  const attChip = (a, i) => (
    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F1F4F6', border: '1px solid rgba(11,36,52,.1)', borderRadius: 999, padding: '5px 10px', fontSize: 11.5, fontWeight: 600, color: '#3C5464' }}>
      {a.kind === 'image' ? '🖼' : a.kind === 'pdf' ? '📄' : '📝'} {a.name.length > 22 ? a.name.slice(0, 20) + '…' : a.name}
      <button onClick={() => setAtts(atts.filter((_, j) => j !== i))} style={{ border: 0, background: 'none', cursor: 'pointer', color: '#8CA0AC', fontSize: 13, padding: 0, lineHeight: 1 }} aria-label="Remove">
        ×
      </button>
    </span>
  );

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(11,36,52,.08)', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      {/* Header */}
      <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(11,36,52,.08)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ width: 8, height: 8, borderRadius: 99, background: offline ? '#D03B3B' : '#25D366', animation: offline ? 'none' : 'sgPulse 2s ease-in-out infinite' }} />
        <span style={{ fontSize: 14, fontWeight: 700 }}>AI sales &amp; reservation desk</span>
        <span style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#8CA0AC' }}>EN · FR</span>
        <span style={{ flex: 1 }} />
        <span className="sg-hide-mobile" style={{ fontSize: 11, color: '#8CA0AC' }}>
          {offline ? 'Server keys missing — npm run server' : health ? 'Quotes · packages · forecasts · reports · photos · files & links' : 'Connecting…'}
        </span>
        {msgs.length > 0 && (
          <button
            onClick={() => { setMsgs([]); setShowIdeas(false); }}
            disabled={busy}
            style={{ border: '1px solid rgba(11,36,52,.14)', background: '#fff', cursor: 'pointer', fontSize: 11.5, fontWeight: 700, color: '#3C5464', padding: '6px 12px', borderRadius: 999 }}
          >
            New chat
          </button>
        )}
      </div>

      {/* Transcript */}
      <div ref={scrollRef} style={{ height: 460, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, background: '#F7F9FA' }}>
        {msgs.length === 0 && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '86%', background: '#fff', border: '1px solid rgba(11,36,52,.1)', borderRadius: '14px 14px 14px 5px', padding: '12px 15px', fontSize: 13.5, lineHeight: 1.6 }}>
            <strong>Bonjour / Hello!</strong> I am the South Gate AI sales officer.
            <ul style={{ margin: '6px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <li>Ask about packages, cruises, hotels, flights — English ou français</li>
              <li>I prepare <strong>quotations, package proposals, forecasts and reports</strong> you can print</li>
              <li>Attach <strong>images, PDFs or text files</strong> with 📎 — I read them; paste a link and I open it</li>
            </ul>
          </div>
        )}

        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}>
            {m.atts && m.atts.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {m.atts.map((a, k) => (
                  <span key={k} style={{ fontFamily: mono, fontSize: 10, background: 'rgba(11,36,52,.08)', borderRadius: 8, padding: '4px 9px', color: '#3C5464' }}>
                    {a.kind === 'image' ? '🖼' : a.kind === 'pdf' ? '📄' : '📝'} {a.name}
                  </span>
                ))}
              </div>
            )}
            {(m.text || m.streaming) && (
              <div
                style={{
                  maxWidth: '86%',
                  background: m.role === 'user' ? '#0B2434' : m.error ? '#FCE3E4' : '#fff',
                  color: m.role === 'user' ? '#fff' : m.error ? '#A81820' : '#0B2434',
                  border: m.role === 'user' ? '1px solid transparent' : '1px solid rgba(11,36,52,.1)',
                  borderRadius: 14,
                  padding: '11px 15px',
                  fontSize: 13.5,
                  lineHeight: 1.6
                }}
              >
                {m.role === 'user' ? m.text : renderMD(m.text)}
                {m.streaming && !m.text && !m.status && (
                  <span style={{ display: 'inline-flex', gap: 5, padding: '3px 0' }}>
                    <span style={{ width: 6, height: 6, borderRadius: 99, background: '#8CA0AC', animation: 'sgPulse 1.1s ease-in-out infinite' }} />
                    <span style={{ width: 6, height: 6, borderRadius: 99, background: '#8CA0AC', animation: 'sgPulse 1.1s ease-in-out .2s infinite' }} />
                    <span style={{ width: 6, height: 6, borderRadius: 99, background: '#8CA0AC', animation: 'sgPulse 1.1s ease-in-out .4s infinite' }} />
                  </span>
                )}
                {m.streaming && m.status && (
                  <div style={{ fontFamily: mono, fontSize: 10.5, color: '#8CA0AC', marginTop: 6, display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 99, background: '#17A5DA', animation: 'sgPulse 1.2s ease-in-out infinite' }} />
                    {m.status}
                  </div>
                )}
              </div>
            )}
            {(m.images || []).map((img, k) => (
              <img key={k} src={`data:${img.mime};base64,${img.b64}`} alt={img.prompt} style={{ maxWidth: 360, width: '100%', borderRadius: 14, border: '1px solid rgba(11,36,52,.1)', boxShadow: '0 10px 26px rgba(11,36,52,.12)' }} />
            ))}
            {(m.quotations || []).map((q) => <QuotationCard key={q.ref} q={q} />)}
            {(m.proposals || []).map((d) => <DocCard key={d.ref} type="proposal" d={d} />)}
            {(m.forecasts || []).map((d) => <DocCard key={d.ref} type="forecast" d={d} />)}
            {(m.reports || []).map((d) => <DocCard key={d.ref} type="report" d={d} />)}
            {(m.saved || []).map((s, k) => (
              <div key={k} style={{ fontFamily: mono, fontSize: 10.5, color: '#0B6B37', background: '#DDF6E6', borderRadius: 8, padding: '6px 10px' }}>
                ✓ Learned: {s}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Suggestions: full when empty, collapsible afterwards */}
      {(msgs.length === 0 || showIdeas) && (
        <div style={{ padding: '10px 16px 0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => { setShowIdeas(false); send(s); }} disabled={busy} style={{ border: '1px solid rgba(11,36,52,.14)', background: '#fff', cursor: 'pointer', fontSize: 11.5, fontWeight: 600, color: '#3C5464', padding: '7px 11px', borderRadius: 999 }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Attachment chips */}
      {atts.length > 0 && (
        <div style={{ padding: '10px 16px 0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>{atts.map(attChip)}</div>
      )}

      {/* Input */}
      <div style={{ padding: '12px 16px 16px', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,text/plain,text/csv,.md,.json"
          hidden
          onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy || atts.length >= 4}
          title="Attach images, PDF or text files"
          aria-label="Attach files"
          style={{ border: '1px solid rgba(11,36,52,.14)', background: '#fff', cursor: 'pointer', width: 42, height: 42, borderRadius: 12, fontSize: 17, flexShrink: 0, color: '#3C5464' }}
        >
          📎
        </button>
        {msgs.length > 0 && (
          <button
            onClick={() => setShowIdeas(!showIdeas)}
            disabled={busy}
            title="Suggestions"
            aria-label="Suggestions"
            style={{ border: '1px solid rgba(11,36,52,.14)', background: showIdeas ? '#0B2434' : '#fff', color: showIdeas ? '#fff' : '#3C5464', cursor: 'pointer', width: 42, height: 42, borderRadius: 12, fontSize: 16, flexShrink: 0 }}
          >
            💡
          </button>
        )}
        <textarea
          ref={taRef}
          value={input}
          rows={1}
          onChange={(e) => { setInput(e.target.value); autoGrow(); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
          }}
          onPaste={(e) => {
            const files = Array.from(e.clipboardData?.files || []);
            if (files.length) { e.preventDefault(); addFiles(files); }
          }}
          placeholder="Ask in English or French… Enter to send, Shift+Enter for a new line"
          disabled={busy}
          style={{ flex: 1, border: '1px solid rgba(11,36,52,.14)', borderRadius: 12, padding: '11px 15px', fontSize: 13.5, outline: 'none', minWidth: 0, resize: 'none', lineHeight: 1.5, maxHeight: 110, fontFamily: "'Manrope',system-ui,sans-serif" }}
        />
        <button
          onClick={() => send()}
          disabled={busy || (!input.trim() && !atts.length)}
          style={{ border: 0, cursor: busy ? 'default' : 'pointer', background: busy ? '#8CA0AC' : '#E1262D', color: '#fff', fontWeight: 800, fontSize: 13.5, padding: '12px 22px', borderRadius: 12, flexShrink: 0 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
