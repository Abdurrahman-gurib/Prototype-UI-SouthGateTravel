import React, { useEffect, useRef, useState } from 'react';
import { useLang } from '../context/LangContext.jsx';
import { TOPICS, CHAT_GREET } from '../data/chatTopics.js';

const mono = "'IBM Plex Mono',monospace";

/* ---------- markdown rendering (structured AI answers) ---------- */
function cleanMD(text) {
  return String(text || '').replace(/```[a-z]*\n?/g, '').replace(/`([^`]*)`/g, '$1');
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
          <ol key={'l' + out.length} style={{ margin: '4px 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 3 }}>{list}</ol>
        ) : (
          <ul key={'l' + out.length} style={{ margin: '4px 0', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 3 }}>{list}</ul>
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
      if (head) out.push(<div key={i} style={{ fontWeight: 800, marginTop: 7, marginBottom: 2 }}>{inlineMD(head[1])}</div>);
      else if (ln.trim() === '') out.push(<div key={i} style={{ height: 4 }} />);
      else out.push(<div key={i}>{inlineMD(ln)}</div>);
    }
  });
  flush();
  return out;
}

/* ---------- compact quotation card (public) ---------- */
const rs = (n) => 'Rs ' + Math.round(n).toLocaleString('en-US');
function esc(s) {
  return String(s ?? '').replace(/</g, '&lt;');
}
function quotationHTML(q) {
  const fr = q.lang === 'fr';
  return `<!doctype html><html><head><meta charset="utf-8"><title>${fr ? 'Devis' : 'Quotation'} ${q.ref}</title>
<style>body{font-family:'Segoe UI',system-ui,sans-serif;color:#0B2434;margin:0;padding:40px;max-width:700px}
h1{font-size:24px;margin:0}.muted{color:#5B7280}table{width:100%;border-collapse:collapse;margin:16px 0}
td{padding:8px 10px;border-bottom:1px solid #e3e8ea;font-size:14px}.tot{font-size:19px;font-weight:800}
ul{padding-left:20px;font-size:13px;line-height:1.6}.foot{margin-top:24px;font-size:12px;color:#8CA0AC;border-top:1px solid #e3e8ea;padding-top:12px}
@media print{body{padding:20px}}</style></head><body>
<h1>South Gate <span style="color:#17A5DA">Travel &amp; Tourism</span></h1>
<div class="muted" style="font-size:13px">${fr ? 'Devis' : 'Quotation'} ${q.ref} · ${q.date}</div>
<table>
<tr><td class="muted">${fr ? 'Client' : 'Client'}</td><td><strong>${esc(q.clientName)}</strong></td></tr>
<tr><td class="muted">${fr ? 'Forfait' : 'Package'}</td><td><strong>${esc(q.packageName)}</strong> — ${esc(q.destination)}</td></tr>
<tr><td class="muted">${fr ? 'Départ' : 'Departure'}</td><td>${esc(q.departureDates)} · ${esc(q.boardBasis)}</td></tr>
<tr><td class="muted">${fr ? 'Adultes' : 'Adults'}</td><td>${q.adults} × ${rs(q.adultUnitPrice)} = <strong>${rs(q.adultsTotal)}</strong></td></tr>
${q.children ? `<tr><td class="muted">${fr ? 'Enfants' : 'Children'}</td><td>${q.children} × ${rs(q.childUnitPrice)} = <strong>${rs(q.childrenTotal)}</strong></td></tr>` : ''}
<tr><td class="muted">Total</td><td class="tot">${rs(q.total)}</td></tr>
<tr><td class="muted">${fr ? 'Acompte (30%)' : 'Deposit (30%)'}</td><td><strong>${rs(q.deposit)}</strong></td></tr>
<tr><td class="muted">${fr ? '3 mensualités de' : 'Or 3 instalments of'}</td><td><strong>${rs(q.instalment)}</strong></td></tr>
</table>
<ul>${(q.includes || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
<div class="foot">${fr ? 'Prix selon disponibilité. Devis valable 48 heures.' : 'Prices subject to availability. Quotation valid 48 hours.'}<br>Valentina Mall 696 2192 · Rose-Belle 660 9814 · WhatsApp 5978 8007</div>
</body></html>`;
}
function MiniQuote({ q }) {
  const openDoc = (print) => {
    const html = quotationHTML(q);
    if (print) {
      const w = window.open('', '_blank');
      if (!w) return;
      w.document.write(html);
      w.document.close();
      setTimeout(() => w.print(), 350);
    } else {
      const blob = new Blob([html], { type: 'text/html' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${q.ref}-southgate-quotation.html`;
      a.click();
      URL.revokeObjectURL(a.href);
    }
  };
  return (
    <div style={{ alignSelf: 'flex-start', width: '92%', background: '#fff', border: '1px solid rgba(11,36,52,.12)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ background: '#0B2434', color: '#fff', padding: '9px 13px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>
          {q.lang === 'fr' ? 'Devis' : 'Quotation'}
        </span>
        <span style={{ fontFamily: mono, fontSize: 10.5 }}>{q.ref}</span>
      </div>
      <div style={{ padding: '11px 13px' }}>
        <div style={{ fontWeight: 800, fontSize: 13.5 }}>{q.packageName}</div>
        <div style={{ fontSize: 11.5, color: '#5B7280', margin: '3px 0 8px' }}>
          {q.departureDates} · {q.adults}A{q.children ? ` ${q.children}C` : ''}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, borderTop: '1px solid rgba(11,36,52,.08)', paddingTop: 7 }}>
          <span>Total</span>
          <span>{rs(q.total)}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 9 }}>
          <button onClick={() => openDoc(true)} style={{ flex: 1, border: 0, cursor: 'pointer', background: '#0B2434', color: '#fff', fontWeight: 700, fontSize: 11.5, padding: '8px 6px', borderRadius: 8 }}>
            Print / PDF
          </button>
          <button onClick={() => openDoc(false)} style={{ flex: 1, border: '1px solid rgba(11,36,52,.16)', cursor: 'pointer', background: '#fff', color: '#0B2434', fontWeight: 700, fontSize: 11.5, padding: '8px 6px', borderRadius: 8 }}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- localized starter questions ---------- */
const STARTERS = {
  en: ['Rodrigues prices?', 'Umrah on instalments?', 'Which cruises leave Port Louis?', 'Best time for Dubai?'],
  fr: ['Prix pour Rodrigues ?', 'Omra en plusieurs fois ?', 'Quelles croisières de Port Louis ?', 'Meilleure période pour Dubaï ?'],
  kr: ['Pri pou Rodrigues ?', 'Oumra an plizir fwa ?', 'Ki bato kit Port Louis ?', 'Meyer moman pou Dubai ?']
};

const SPEECH_LANG = { en: 'en-US', fr: 'fr-FR', kr: 'fr-FR' };

const UI_TEXT = {
  en: { placeholder: 'Ask anything… any language', listening: 'Listening…', offline: 'Live AI offline — showing quick answers', newChat: 'New chat' },
  fr: { placeholder: 'Posez votre question…', listening: 'Je vous écoute…', offline: 'IA hors ligne — réponses rapides', newChat: 'Nouveau' },
  kr: { placeholder: 'Poz ou kestion…', listening: 'Pe ekoute…', offline: 'AI pa disponib — repons rapid', newChat: 'Nouvo' }
};

export default function ChatWidget() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]); // {role, text, quotations?, streaming?, error?}
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [aiLive, setAiLive] = useState(null); // null unknown, true live, false offline
  const [listening, setListening] = useState(false);
  const [speak, setSpeak] = useState(false);
  const scrollRef = useRef(null);
  const recRef = useRef(null);
  const speakRef = useRef(false);
  speakRef.current = speak;

  const ui = UI_TEXT[lang] || UI_TEXT.en;
  const greet = CHAT_GREET[lang] || CHAT_GREET.en;

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((h) => setAiLive(Boolean(h.ok && h.anthropicKey)))
      .catch(() => setAiLive(false));
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, busy, open]);

  useEffect(() => () => {
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch { /* ignore */ }
    try { recRef.current && recRef.current.abort(); } catch { /* ignore */ }
  }, []);

  const speakText = (text) => {
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const plain = cleanMD(text).replace(/\*\*/g, '').replace(/^#+\s*/gm, '').replace(/^[-•]\s*/gm, '');
      const u = new SpeechSynthesisUtterance(plain.slice(0, 600));
      u.lang = SPEECH_LANG[lang] || 'en-US';
      u.rate = 1.02;
      window.speechSynthesis.speak(u);
    } catch { /* ignore */ }
  };

  const updateLast = (fn) =>
    setMsgs((cur) => {
      const copy = cur.slice();
      copy[copy.length - 1] = fn(copy[copy.length - 1]);
      return copy;
    });

  const send = async (textArg) => {
    const text = (textArg ?? input).trim();
    if (!text || busy) return;
    setInput('');

    // Offline fallback: match a canned topic, else apologise.
    if (aiLive === false) {
      const hit = TOPICS.find((tp) => tp[0].toLowerCase() === text.toLowerCase());
      setMsgs((cur) => [
        ...cur,
        { role: 'user', text },
        { role: 'assistant', text: hit ? hit[1] : 'Our live assistant is offline right now. WhatsApp us on 5978 8007 or call Valentina 696 2192 — we reply fast during opening hours.' }
      ]);
      return;
    }

    const history = [...msgs, { role: 'user', text }];
    setMsgs([...history, { role: 'assistant', text: '', streaming: true }]);
    setBusy(true);
    try {
      const resp = await fetch('/api/public-chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map((m) => ({ role: m.role, content: m.text })) })
      });
      if (!resp.ok || !resp.body) throw new Error('Assistant unavailable (' + resp.status + ')');
      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
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
          if (ev.t === 'delta') updateLast((m) => ({ ...m, text: (m.text || '') + ev.v }));
          else if (ev.t === 'error') updateLast(() => ({ role: 'assistant', text: ev.v, error: true }));
          else if (ev.t === 'final') {
            const p = ev.payload || {};
            updateLast(() => ({ role: 'assistant', text: p.text || '…', quotations: p.quotations || [] }));
            if (speakRef.current && p.text) speakText(p.text);
          }
        }
      }
      updateLast((m) => ({ ...m, streaming: false }));
    } catch (e) {
      updateLast(() => ({ role: 'assistant', text: String(e.message), error: true }));
    } finally {
      setBusy(false);
    }
  };

  /* ---------- voice input (Web Speech API) ---------- */
  const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
  const toggleMic = () => {
    if (!SR) return;
    if (listening) {
      try { recRef.current && recRef.current.stop(); } catch { /* ignore */ }
      return;
    }
    try {
      const rec = new SR();
      recRef.current = rec;
      rec.lang = SPEECH_LANG[lang] || 'en-US';
      rec.interimResults = true;
      rec.continuous = false;
      let finalText = '';
      rec.onresult = (e) => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
          else interim += e.results[i][0].transcript;
        }
        setInput(finalText + interim);
      };
      rec.onend = () => {
        setListening(false);
        if (finalText.trim()) send(finalText.trim());
      };
      rec.onerror = () => setListening(false);
      setListening(true);
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const starters = STARTERS[lang] || STARTERS.en;
  const topics = TOPICS.slice(0, 4).map((tp) => tp[0]);
  const chips = aiLive === false ? TOPICS.map((tp) => tp[0]) : lang === 'en' ? [...starters.slice(0, 2), ...topics.slice(0, 2)] : starters;

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
            width: 372,
            maxWidth: 'calc(100vw - 44px)',
            height: 520,
            maxHeight: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255,255,255,.92)',
            backdropFilter: 'blur(26px) saturate(180%)',
            WebkitBackdropFilter: 'blur(26px) saturate(180%)',
            border: '1px solid rgba(255,255,255,.9)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 30px 70px rgba(11,36,52,.26)',
            animation: 'sgRise .35s cubic-bezier(.2,.8,.25,1) both'
          }}
        >
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px', background: 'linear-gradient(120deg,#0B2434,#12455F)', flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src="/assets/southgate-logo.webp" alt="" style={{ width: 25, height: 'auto', display: 'block' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>South Gate assistant</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: aiLive === false ? '#F0656A' : '#4ADE80', animation: aiLive === false ? 'none' : 'sgPulse 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,.65)' }}>{aiLive === false ? ui.offline : 'AI · EN FR KR + more'}</span>
              </div>
            </div>
            {window.speechSynthesis && (
              <button
                onClick={() => { if (speak) try { window.speechSynthesis.cancel(); } catch { /* ignore */ } setSpeak(!speak); }}
                title={speak ? 'Voice replies on' : 'Voice replies off'}
                aria-pressed={speak}
                style={{ border: 0, background: speak ? '#25D366' : 'rgba(255,255,255,.12)', color: '#fff', cursor: 'pointer', width: 28, height: 28, borderRadius: 99, fontSize: 13, flexShrink: 0 }}
              >
                🔊
              </button>
            )}
            {msgs.length > 0 && (
              <button
                onClick={() => setMsgs([])}
                title={ui.newChat}
                style={{ border: 0, background: 'rgba(255,255,255,.12)', color: '#fff', cursor: 'pointer', height: 28, borderRadius: 99, fontSize: 10.5, fontWeight: 700, padding: '0 10px', flexShrink: 0 }}
              >
                {ui.newChat}
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{ border: 0, background: 'rgba(255,255,255,.12)', color: '#fff', cursor: 'pointer', width: 28, height: 28, borderRadius: 99, fontSize: 16, lineHeight: 1, flexShrink: 0 }}
            >
              ×
            </button>
          </div>

          {/* transcript */}
          <div
            ref={scrollRef}
            style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 11, background: 'linear-gradient(180deg,rgba(242,248,251,.7),rgba(255,255,255,.4))' }}
          >
            <div style={{ alignSelf: 'flex-start', maxWidth: '88%', background: 'rgba(255,255,255,.94)', border: '1px solid rgba(11,36,52,.1)', borderRadius: '16px 16px 16px 5px', padding: '11px 14px', fontSize: 13, lineHeight: 1.55, color: '#0B2434' }}>
              {greet}
            </div>
            {msgs.map((m, i) => (
              <React.Fragment key={i}>
                <div
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '88%',
                    background: m.role === 'user' ? '#0B2434' : m.error ? '#FCE3E4' : 'rgba(255,255,255,.94)',
                    color: m.role === 'user' ? '#fff' : m.error ? '#A81820' : '#0B2434',
                    border: m.role === 'user' ? '1px solid transparent' : '1px solid rgba(11,36,52,.1)',
                    borderRadius: 16,
                    padding: '11px 14px',
                    fontSize: 13,
                    lineHeight: 1.55
                  }}
                >
                  {m.role === 'user' ? m.text : renderMD(m.text)}
                  {m.streaming && !m.text && (
                    <span style={{ display: 'inline-flex', gap: 5, padding: '2px 0' }}>
                      <span style={{ width: 6, height: 6, borderRadius: 99, background: '#8CA0AC', animation: 'sgPulse 1.1s ease-in-out infinite' }} />
                      <span style={{ width: 6, height: 6, borderRadius: 99, background: '#8CA0AC', animation: 'sgPulse 1.1s ease-in-out .2s infinite' }} />
                      <span style={{ width: 6, height: 6, borderRadius: 99, background: '#8CA0AC', animation: 'sgPulse 1.1s ease-in-out .4s infinite' }} />
                    </span>
                  )}
                </div>
                {(m.quotations || []).map((q) => (
                  <MiniQuote key={q.ref} q={q} />
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* chips + input */}
          <div style={{ flexShrink: 0, borderTop: '1px solid rgba(11,36,52,.09)', padding: '10px 12px 12px', background: 'rgba(255,255,255,.7)' }}>
            {msgs.length === 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 9, maxHeight: 84, overflowY: 'auto' }}>
                {chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => send(c)}
                    disabled={busy}
                    style={{ border: '1px solid rgba(11,36,52,.14)', background: '#fff', cursor: 'pointer', fontSize: 11.5, fontWeight: 600, color: '#3C5464', padding: '7px 11px', borderRadius: 999, whiteSpace: 'nowrap' }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
              {SR && (
                <button
                  onClick={toggleMic}
                  disabled={busy || aiLive === false}
                  title="Speak your question"
                  aria-pressed={listening}
                  style={{
                    border: listening ? '1px solid #E1262D' : '1px solid rgba(11,36,52,.14)',
                    background: listening ? '#FCE3E4' : '#fff',
                    cursor: 'pointer',
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    fontSize: 16,
                    flexShrink: 0,
                    animation: listening ? 'sgPulse 1.4s ease-in-out infinite' : 'none'
                  }}
                >
                  🎤
                </button>
              )}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={listening ? ui.listening : ui.placeholder}
                disabled={busy}
                style={{ flex: 1, border: '1px solid rgba(11,36,52,.14)', borderRadius: 12, padding: '10px 13px', fontSize: 13, outline: 'none', minWidth: 0, background: '#fff' }}
              />
              <button
                onClick={() => send()}
                disabled={busy || !input.trim()}
                aria-label="Send"
                style={{ border: 0, cursor: busy ? 'default' : 'pointer', background: busy ? '#8CA0AC' : '#E1262D', color: '#fff', fontWeight: 800, fontSize: 15, width: 40, height: 40, borderRadius: 12, flexShrink: 0 }}
              >
                ➤
              </button>
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
