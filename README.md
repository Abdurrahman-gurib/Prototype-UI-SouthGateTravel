# South Gate Travel and Tourism — React demo

A fully working, responsive React demo of the South Gate Travel website, rebuilt from the approved design mockup ("South Gate Travel website mockup.zip").

IATA-accredited travel agency in the south of Mauritius — Umrah & Hajj, Rodrigues, holidays, cruises and flight tickets, in English, French and Kreol Morisien.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## What's inside

| Route | Screen |
|---|---|
| `/` | Home — hero, search card, live departures board, category carousel, featured packages, how-it-works, seasons guide, reviews, FAQ, CTA |
| `/umrah`, `/rodrigues`, `/holidays`, `/cruises` | Package listings with sorting + board-basis filters |
| `/flights` | Flight fares from Mauritius |
| `/package/:id` | Package detail — gallery, inclusions, day-by-day itinerary, departure picker |
| `/book/:id` | 3-step booking flow — travellers → payment plan → confirmation |
| `/bookings` | My bookings — upcoming trips, instalment progress, past trips |
| `/about` | About the agency + both branches |
| `/contact` | Contact form + WhatsApp + offices |
| `/office` | Staff back office — dashboard, bookings, departures, clients, payments, AI assistant, automations, reports |

Plus: trilingual switcher (EN / FR / KR, persisted), promo bar, sticky glass navbar with mobile menu, scroll progress bar, ambient background, chat assistant widget, newsletter band and full footer.

## Stack & structure

React 18 · Vite · react-router-dom v6 · no UI framework (hand-built design system from the mockup: Sora / Manrope / IBM Plex Mono, navy `#0B2434`, blue `#17A5DA`, red `#E1262D`).

```
src/
  main.jsx, App.jsx          entry + routes + site shell
  styles/global.css          design tokens, keyframes, utilities
  i18n/translations.js       full EN/FR/KR copy
  data/                      packages, flights, home content, back-office demo data, chat topics
  utils/travel.js            money, booking math, card/tag helpers
  context/LangContext.jsx    language state (localStorage-persisted)
  components/                NavBar, Footer, PromoBar, ChatWidget, ImageSlot, PageHero, BackgroundFX
  pages/                     one component per screen
```

Demo imagery is hot-loaded from Wikimedia Commons (CC BY / CC BY-SA contributors) — to be replaced with South Gate photography. Payments, bookings and the chat assistant are demo simulations; no real transactions occur.
