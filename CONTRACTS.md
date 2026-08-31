# South Gate Travel — build contracts (for page build agents)

React 18 + Vite + react-router-dom v6 rebuild of the approved design mockup.
Project root: `C:\Users\noorg\Desktop\SouthGate\southgate-travel`
Reference mockup chunks: `C:\Users\noorg\Desktop\SouthGate\_reference\split\` (files `01-home.html` … `09-backoffice-and-shell.html`, plus `10-script-data.js` for logic).

## Golden rules

1. **Reproduce the mockup faithfully.** The reference chunks are inline-styled HTML with a tiny template syntax. Transcribe the layout, spacing, colors, fonts and copy exactly, converting to JSX:
   - `style="a:b;c:d"` → `style={{ a: 'b', c: 'd' }}` (camelCase props).
   - `{{ t.key }}` → `{t.key}` where `t` comes from `useLang()`.
   - `<sc-if value="{{ cond }}">` → conditional render.
   - `<sc-for list="{{ xs }}" as="x">` → `xs.map(x => ...)` (add `key`).
   - `onClick="{{ goX }}"` → `useNavigate()` calls (routes below).
   - `style-hover="..."` → CSS class with `:hover` in the page's CSS file, or ignore for minor cases.
   - `<image-slot id src placeholder>` → `<ImageSlot src={...} alt={...} />` inside a sized wrapper div (the component fills its parent; give the parent the height/minHeight/aspect from the mockup).
2. **Own only your assigned files.** Never edit shared files (App.jsx, components/, data/, i18n/, utils/, global.css). If something is missing, work around it locally inside your page file/CSS.
3. **Responsive is required.** The mockup is desktop-first. Every page must degrade cleanly at 1024px, 768px and 560px. Technique: keep the mockup's inline styles, but move *layout-critical* grids/flex rows into the page's CSS file as classes with media queries (prefix classes `sgp-<page>-...` to avoid collisions). Multi-column grids stack on mobile; wide tables become horizontally scrollable (`overflow-x:auto` wrapper) or restack; font sizes use `clamp()` for big headings.
4. **All interactions must work**: filters, sorting, steppers, accordions, carousels, tab states, forms (controlled inputs with demo submit behaviour), navigation.
5. JSX text: escape apostrophes safely (use `{"..."}` or typographic ’), never break the build. Plain JavaScript, no TypeScript.

## Shared foundation (already built — import, do not recreate)

```js
import { useLang } from '../context/LangContext.jsx';        // { lang: 'en'|'fr'|'kr', setLang, t }
import { PKGS, FLIGHTS, IMG, cw, CAT_FOR_ROUTE, getPackage } from '../data/packages.js';
import { BOARD, STEPS, WHEN, TRUST, BENEFITS, FAQS, RATING_BARS, MARQUEE, CAT_CARDS, SEARCH_TABS } from '../data/homeData.js';
import { TOPICS, CHAT_GREET } from '../data/chatTopics.js';
import * as O from '../data/officeData.js';                   // O_NAV, O_TITLES, O_BOOKINGS, O_KPI, O_BAR_HEIGHTS, MONTH_LETTERS, O_FEED, O_CLIENTS, O_PAY_ROWS, O_MIX, O_AUTO_DEFS, O_CHAT, O_SUGG, O_REP_BARS, O_DEPS, O_FORECAST, O_PEAK, O_PERF, O_FUNNEL
import { money, boardLabel, tagFor, computeTotals, travellerWords, travLine, boardRow } from '../utils/travel.js';
import ImageSlot from '../components/ImageSlot.jsx';          // <ImageSlot src alt style imgStyle kenburns />
import PageHero from '../components/PageHero.jsx';            // <PageHero eyebrow title sub>{children}</PageHero>
```

- `cw(id, i, w)` → Wikimedia image URL for package `id`, photo index `i` (0–2), width `w`.
- `tagFor(p, t, lang)` → `{ bg, fg, txt }` pill for a package card.
- `boardLabel(p, t)` → `"3 nights · Half board"` / `"Flight only"`.
- `computeTotals(pk, adults, kids, plan)` → `{ unit, kidUnit, total, deposit, instal, payNow, later }` with plan `'full'|'deposit'|'instal'`.
- `boardRow(b, lang)` → decorates a BOARD row with `{ seats, w, seatC, barBg, chip, chipBg }`.
- Package card fields used by cards: `p.id, p.name, p.place, p.dates, p.blurb, p.chips (string[]), p.price (number)`; detail adds `p.inc (string[]), p.exc?, p.itin ([day,title,txt][]), p.slots ([date,left,price][])`.

Global CSS provides: keyframes `sgKb sgDrift sgMarq sgSheen sgRise sgFade sgPulse sgWide sgFloatA sgFloatB sgProg sgGrad`, classes `.sg-container` (1280px), `.sg-container-narrow` (1080px), `.sg-hide-mobile`, `.sg-only-mobile`, `.sg-glass`, `.sg-lift`.

Fonts: headings `'Sora',sans-serif` (800, tight letter-spacing), body `'Manrope',system-ui,sans-serif`, eyebrows/labels `'IBM Plex Mono',monospace` uppercase.
Palette: navy `#0B2434`, blue `#17A5DA`, red accent `#E1262D`, slate text `#3C5464` / `#5B7280` / `#8CA0AC`, green `#0B6B37`, WhatsApp `#25D366`.

## Routes

| Path | Page | Notes |
|---|---|---|
| `/` | Home | |
| `/umrah` `/rodrigues` `/holidays` `/cruises` | PackageListing (prop `cat` = route name) | filter `PKGS` by `CAT_FOR_ROUTE[cat]` |
| `/flights` | Flights | |
| `/package/:id` | PackageDetail | `useParams()`, `getPackage(id)` |
| `/book/:id?slot=N` | Booking | 3-step flow |
| `/bookings` | MyBookings | |
| `/about` | About | |
| `/contact` | Contact | |
| `/office` | BackOffice | fullscreen; site chrome is hidden on this route |

Mockup nav actions map: `goHome→'/'`, `goUmrah→'/umrah'`, `goRod→'/rodrigues'`, `goHol→'/holidays'`, `goCruise→'/cruises'`, `goFly→'/flights'`, `goAbout→'/about'`, `goContact→'/contact'`, `goMyb→'/bookings'`, `goOffice→'/office'`, `openPkg(id)→'/package/'+id`, `startBooking→'/book/'+pk.id+'?slot='+slot`.

The shell (PromoBar, NavBar, Footer, ChatWidget, background FX, scroll progress) already exists and wraps every route except `/office` — do NOT re-render any of it in a page.

## Listing page derivations (from the mockup script)

- Sort chips: `[['rec','Recommended'],['lo','Price, low to high'],['hi','Price, high to low'],['short','Shortest trip']]`; active chip: bg `#0B2434` fg `#fff` bd `#0B2434`; inactive: bg `rgba(255,255,255,.75)` fg `#5B7280` bd `rgba(11,36,52,.14)`.
- Board-basis chips: `'all'` + unique boards in the category; labels `{all:'All boards',hb:'Half board',bb:'Bed and breakfast',fb:'Full board',flightOnly:'Flight only'}`; active: bg `rgba(23,165,218,.12)` fg `#0E6C93` bd `#17A5DA`; inactive fg `#8CA0AC` bd `rgba(11,36,52,.12)`.
- Count line: 1 → localized `'1 forfait disponible' / '1 pake disponib' / '1 package available'`, else `` `${n} ${t.packagesFound}` ``.
- Header meta per cat: umrah `[t.umrahEyebrow, t.umrahTitle, t.umrahSub]`, rodrigues `[t.rodEyebrow,...]`, holidays `[t.holEyebrow,...]`, cruises `['Cruises from Port Louis and beyond', 'Wake up in a different island every morning.', 'MSC and Costa call at Port Louis every season, and we book the fly-cruises out of Dubai and Genoa. Cabin, flights, transfers and port taxes in one price, payable in instalments.']`.
- Empty state (filters match nothing) per chunk 02 lines 24–32, with a "Clear the filters" button resetting sort `'rec'` / board `'all'`.

## Definition of done (each page)

- Transcribed markup and copy match the reference chunk; all `t.*` keys via `useLang()`.
- Interactive state works; navigation wired; images via `ImageSlot` + `cw()`.
- Responsive at 1024/768/560 (no horizontal page scroll; tap targets usable).
- No console errors; builds under Vite (`npm run build`).
- Page file `src/pages/<Name>.jsx` default-exports the component; page CSS (if used) at `src/pages/<Name>.css`, imported by the page, class prefix `sgp-`.
