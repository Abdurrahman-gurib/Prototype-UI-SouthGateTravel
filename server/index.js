// South Gate Travel — AI sales & reservation officer backend.
// Keys live in .env / Render env vars, server-side only — never shipped to the browser.
import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import { PKGS, FLIGHTS } from '../src/data/packages.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '2mb' }));

const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const MODEL = 'claude-opus-5';
const DATA_DIR = path.join(here, 'data');
const LEARNED_FILE = path.join(DATA_DIR, 'learned.json');

/* ---------------- learned notes ("learning") ---------------- */
function readLearned() {
  try {
    return JSON.parse(fs.readFileSync(LEARNED_FILE, 'utf8'));
  } catch {
    return [];
  }
}
function saveLearned(fact) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const all = readLearned();
  all.push({ fact: String(fact).slice(0, 500), at: new Date().toISOString() });
  fs.writeFileSync(LEARNED_FILE, JSON.stringify(all.slice(-100), null, 2));
  return all.length;
}

/* ---------------- knowledge base (stable -> cached) ---------------- */
function catalogue() {
  const pkg = PKGS.map((p) => {
    const slots = (p.slots || []).map((s) => `${s[0]} (${s[1]}, ${s[2]})`).join('; ');
    return `• ${p.name} [id ${p.id}, ${p.cat}] — ${p.place}. ${p.nights ? p.nights + ' nights, ' : ''}board: ${p.board}. From Rs ${p.price.toLocaleString('en-US')} pp sharing. Dates: ${p.dates}. Departures: ${slots}. Includes: ${(p.inc || []).join(', ')}.${p.exc ? ' Excludes: ' + p.exc.join(', ') + '.' : ''}`;
  }).join('\n');
  const fly = FLIGHTS.map((f) => `• ${f.airline} ${f.code}: ${f.depA} ${f.dep} -> ${f.arrA} ${f.arr} (${f.dur}) — ${f.price} ${'return'}, ${f.note}`).join('\n');
  return `PACKAGE CATALOGUE (all prices per person sharing, Rs = Mauritian rupees):\n${pkg}\n\nFLIGHT FARES FROM MAURITIUS:\n${fly}`;
}

const PERSONA = `You are the AI sales and reservation officer of South Gate Travel and Tourism, an IATA-accredited travel agency in the south of Mauritius (since 2010).
Branches: Valentina Mall, Phoenix (696 2192, Mon–Sat 09:00–18:00) and Royal Road, Rose-Belle (660 9814, Mon–Sat 09:00–17:00). Mobile/WhatsApp 5978 8007, southgatetravel@hotmail.com.

LANGUAGES — STRICT: you speak ONLY English and French. Reply in the language the client used (English or French). If the client writes in any other language, reply in English, apologise briefly, and offer to continue in English or French.

ROLE: help staff and clients like an experienced sales officer — quote packages, compare options (Rodrigues guesthouses and resorts, Umrah and Hajj, Dubai, Egypt, Turkey, MSC/Costa cruises, hotels, flight tickets), explain what is included, availability, seasons, and payment.

BUSINESS RULES:
- Seats can be held 48 hours with no payment and no card details.
- Deposits: Rs 10,000 pp on Rodrigues/holiday packages, Rs 20,000 pp on Umrah; balance in up to three instalments, settled 30 days before departure. Payment: MCB Juice, card (MCB IPay, 3-D Secure), cash at either branch, bank transfer, MyT Money.
- Children 2–11 pay roughly 70% of the adult package price (rounded to Rs 50).
- Free cancellation up to 30 days before departure.
- NEVER confirm a Hajj place yourself — registration is a Rs 50,000 deposit on the official quota and a staff member must call the client to complete it. Say so and offer to take their number.
- Quote only prices from the catalogue; if something is not in the catalogue, say a colleague will confirm the exact fare and offer the closest option.

TOOLS:
- Use create_quotation whenever a client wants a price for specific people/dates — it renders a branded quotation document they can print or download. Fill unitPrice from the chosen departure's price in the catalogue.
- Use generate_image when a photo/visual is requested (destination inspiration, a social-media visual, a poster idea). Describe the scene richly in the prompt; never include text, logos, or people's faces in the image prompt.
- Use save_note when staff tell you a NEW fact, correction, or standing instruction worth remembering for future conversations (e.g. "Bakwa Lodge is closed in February"). Confirm what you saved.

STYLE: warm, concise, concrete — like a good counter adviser. Lead with the answer and real numbers. Offer the logical next step (hold seats, quotation, WhatsApp). Amounts always as "Rs 20,500".`;

/* ---------------- tools ---------------- */
const TOOLS = [
  {
    name: 'create_quotation',
    description:
      'Create and display a branded South Gate quotation document for the client. Compute nothing yourself: pass unit prices and counts; the system computes totals, deposit and instalments. Use the price of the specific departure chosen.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: {
        lang: { type: 'string', enum: ['en', 'fr'], description: 'Language of the quotation document' },
        clientName: { type: 'string', description: "Client's name, or 'Valued client' if unknown" },
        packageName: { type: 'string' },
        destination: { type: 'string' },
        departureDates: { type: 'string', description: "e.g. '19 to 22 May 2026'" },
        boardBasis: { type: 'string', description: "e.g. 'Half board, 3 nights'" },
        adults: { type: 'integer', description: 'Number of adults, at least 1' },
        children: { type: 'integer', description: 'Number of children aged 2 to 11, 0 if none' },
        adultUnitPrice: { type: 'number', description: 'Per-adult price in Rs from the catalogue' },
        childUnitPrice: { type: 'number', description: 'Per-child price in Rs; 0 means compute as 70% of adult price rounded to Rs 50' },
        includes: { type: 'array', items: { type: 'string' }, description: '4-7 headline inclusions' },
        notes: { type: 'string', description: 'One short remark (availability, validity, option held...)' }
      },
      required: ['lang', 'clientName', 'packageName', 'destination', 'departureDates', 'boardBasis', 'adults', 'children', 'adultUnitPrice', 'childUnitPrice', 'includes', 'notes'],
      additionalProperties: false
    }
  },
  {
    name: 'generate_image',
    description:
      'Generate a photorealistic or stylised travel image and display it in the chat (destination inspiration, social post visual, poster concept). No text, no logos, no identifiable faces in the prompt.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Rich visual description of the scene' },
        style: { type: 'string', enum: ['photo', 'poster', 'watercolor'], description: 'Overall look' }
      },
      required: ['prompt', 'style'],
      additionalProperties: false
    }
  },
  {
    name: 'save_note',
    description: 'Persist a new fact, correction or standing instruction from staff so future conversations know it.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: { fact: { type: 'string', description: 'The fact to remember, one sentence' } },
      required: ['fact'],
      additionalProperties: false
    }
  }
];

/* ---------------- OpenAI image generation ---------------- */
async function generateImage(prompt, style) {
  const styled =
    (style === 'poster'
      ? 'Travel poster style, bold flat colours, clean composition. '
      : style === 'watercolor'
        ? 'Soft watercolour painting style. '
        : 'Photorealistic, golden-hour light, professional travel photography. ') + prompt;

  const call = (model, extra) =>
    fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model, prompt: styled.slice(0, 3800), size: '1024x1024', n: 1, ...extra })
    });

  let res = await call('gpt-image-1', {});
  if (!res.ok) {
    const firstErr = (await res.text()).slice(0, 300);
    res = await call('dall-e-3', { response_format: 'b64_json' });
    if (!res.ok) throw new Error(`Image API failed (gpt-image-1: ${firstErr}; dall-e-3: ${(await res.text()).slice(0, 300)})`);
  }
  const json = await res.json();
  const d = (json.data && json.data[0]) || {};
  if (d.b64_json) return d.b64_json;
  if (d.url) {
    const ir = await fetch(d.url);
    return Buffer.from(await ir.arrayBuffer()).toString('base64');
  }
  throw new Error('Image API returned no image data');
}

/* ---------------- quotation math (same rules as the site) ---------------- */
function buildQuotation(input) {
  const childUnit = input.childUnitPrice > 0 ? input.childUnitPrice : Math.round((input.adultUnitPrice * 0.7) / 50) * 50;
  const adultsTotal = input.adults * input.adultUnitPrice;
  const childrenTotal = input.children * childUnit;
  const total = adultsTotal + childrenTotal;
  const deposit = Math.round((total * 0.3) / 5) * 5;
  const instalment = Math.ceil(total / 3 / 50) * 50;
  return {
    ref: 'SGQ-' + Date.now().toString().slice(-6),
    date: new Date().toISOString().slice(0, 10),
    ...input,
    childUnitPrice: childUnit,
    adultsTotal,
    childrenTotal,
    total,
    deposit,
    instalment
  };
}

/* ---------------- chat endpoint ---------------- */
app.post('/api/chat', async (req, res) => {
  try {
    const incoming = Array.isArray(req.body?.messages) ? req.body.messages : [];
    // Text-only history, last 24 turns, correct alternation handled by the API.
    let messages = incoming
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
      .slice(-24)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
    if (!messages.length || messages[0].role !== 'user') {
      return res.status(400).json({ error: 'messages must start with a user turn' });
    }

    const learned = readLearned();
    const system = [
      { type: 'text', text: PERSONA + '\n\n' + catalogue(), cache_control: { type: 'ephemeral' } }
    ];
    if (learned.length) {
      system.push({ type: 'text', text: 'LEARNED NOTES FROM STAFF (most recent last):\n' + learned.map((n) => '- ' + n.fact).join('\n') });
    }

    const artifacts = { images: [], quotations: [], saved: [] };

    let response;
    for (let i = 0; i < 6; i++) {
      response = await anthropic.beta.messages.create({
        model: MODEL,
        max_tokens: 4000,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        system,
        tools: TOOLS,
        messages
      });

      if (response.stop_reason === 'pause_turn') {
        messages.push({ role: 'assistant', content: response.content });
        continue;
      }
      if (response.stop_reason !== 'tool_use') break;

      const toolUses = response.content.filter((b) => b.type === 'tool_use');
      messages.push({ role: 'assistant', content: response.content });

      const results = [];
      for (const tu of toolUses) {
        try {
          if (tu.name === 'generate_image') {
            const b64 = await generateImage(tu.input.prompt, tu.input.style);
            artifacts.images.push({ b64, mime: 'image/png', prompt: tu.input.prompt });
            results.push({ type: 'tool_result', tool_use_id: tu.id, content: 'Image generated and displayed to the client in the chat.' });
          } else if (tu.name === 'create_quotation') {
            const q = buildQuotation(tu.input);
            artifacts.quotations.push(q);
            results.push({
              type: 'tool_result',
              tool_use_id: tu.id,
              content: `Quotation ${q.ref} created and displayed. Total Rs ${q.total.toLocaleString('en-US')} (deposit Rs ${q.deposit.toLocaleString('en-US')}, or 3 x Rs ${q.instalment.toLocaleString('en-US')}). Do not repeat the full breakdown in text; refer to the document.`
            });
          } else if (tu.name === 'save_note') {
            const count = saveLearned(tu.input.fact);
            artifacts.saved.push(tu.input.fact);
            results.push({ type: 'tool_result', tool_use_id: tu.id, content: `Saved (note ${count}).` });
          } else {
            results.push({ type: 'tool_result', tool_use_id: tu.id, content: 'Unknown tool.', is_error: true });
          }
        } catch (err) {
          results.push({ type: 'tool_result', tool_use_id: tu.id, content: `Tool failed: ${String(err.message).slice(0, 300)}`, is_error: true });
        }
      }
      messages.push({ role: 'user', content: results });
    }

    let text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
    if (response.stop_reason === 'refusal') {
      text = text || 'I cannot help with that request. Is there anything travel-related I can do for you? / Je ne peux pas répondre à cette demande. Puis-je vous aider avec un voyage ?';
    }

    res.json({ text, images: artifacts.images, quotations: artifacts.quotations, saved: artifacts.saved, learnedCount: readLearned().length });
  } catch (error) {
    const status =
      error instanceof Anthropic.AuthenticationError ? 401
      : error instanceof Anthropic.RateLimitError ? 429
      : error instanceof Anthropic.APIError ? (error.status || 502)
      : 500;
    const msg =
      status === 401 ? 'The Anthropic API key is missing or invalid on the server.'
      : status === 429 ? 'Rate limited — try again in a few seconds.'
      : `Assistant error: ${String(error.message).slice(0, 200)}`;
    console.error('[chat]', error);
    res.status(status).json({ error: msg });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    anthropicKey: Boolean(process.env.ANTHROPIC_API_KEY),
    openaiKey: Boolean(process.env.OPENAI_API_KEY),
    learnedNotes: readLearned().length,
    model: MODEL
  });
});

/* ---------------- static site (production) ---------------- */
const dist = path.join(here, '..', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  // SPA fallback (Express-5-safe: middleware, not a '*' route)
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(dist, 'index.html'));
  });
}

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log(`South Gate server on http://localhost:${PORT} (dist served: ${fs.existsSync(dist)})`));
