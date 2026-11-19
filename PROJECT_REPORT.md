# Project Report — AntiqueAuction Platform

**Task ID:** WD-AUC-005  ·  **Student Code:** DAS-AUC-005  ·  **Company:** Data Alcott Systems
**Internship:** Free Web Development Internship Online  ·  **Domain:** Antique Auction Vintage

---

## 1. Objective

To design and develop a complete, responsive, frontend-only antique auction platform that allows users to explore curated antiques, understand their history and provenance, obtain a simulated expert valuation, verify authenticity and participate in live bidding. The project also provides separate collector and seller dashboards so that the full marketplace workflow — from listing an object to winning it — can be demonstrated without a backend or database.

## 2. Technologies Used

| Layer | Technology |
| --- | --- |
| Structure | HTML5 with semantic elements (`header`, `nav`, `main`, `section`, `article`, `footer`) |
| Styling | CSS3 — custom properties, Flexbox, Grid, media queries, animations, print styles |
| Logic | JavaScript ES6+ — arrays/objects, functions, event delegation, hash routing |
| Persistence | Browser `localStorage` under key `antiqueAuction.v1` |
| Typography | Google Fonts — Cormorant Garamond and Lora |
| Icons | Font Awesome 6 (CDN) |
| Hosting | Static hosting — GitHub Pages / Netlify / Vercel |

No framework, package manager, API or database was used, keeping the project portable and easy to evaluate.

## 3. Features Implemented

**Core modules**

- **Home** — hero with live countdown, featured lots, category cards, curator's pick, auction highlights and testimonials.
- **Antique Listing** — 12 seeded lots with search, multi-select filters (category, era, region, condition, budget, authenticated, live), five sort modes and grid/list views.
- **Antique Detail** — photo gallery, lot number, price panel, increment-aware bid form, specifications table, provenance timeline, condition and restoration reports, authentication status and related items.
- **Expert Valuation** — form-driven simulated appraisal using category, era and condition multipliers; produces a price range, confidence score, named expert and saved valuation history with CSV export.
- **Live Bidding** — live room with countdowns, bid increments, quick-bid controls, leading/outbid tracking, bid history and CSV export.
- **Authenticity Verification** — public certificate register, lookup by certificate number, report generation and printable numbered certificates.
- **Collector Dashboard** — leading bids, watchlist, won items, bidding history and valuations.
- **Seller Dashboard** — inventory CRUD, status management, sales history, performance metrics, CSV export and printable report.
- **Authentication** — login, registration, seeded demo accounts, guest-to-sign-in prompt and persisted session.

**Bonus features**

Printable certificate of authenticity with seal and QR-style pattern; age and origin detection; restoration history; CSV and print/PDF export; CSS-only virtual gallery with rotation and lighting; curator's recommendations; persistent dark mode; responsive hamburger navigation; toast notifications; graceful image fallbacks; print stylesheet.

## 4. Implementation Notes

The app is a single-page application driven by hash routes (`#/home`, `#/antiques`, `#/antique/1`, …). `data.js` holds the seed dataset, `views.js` and `views2.js` return HTML strings for each screen, and `script.js` owns application state, persistence, routing and all event handling. Renderers are pure string builders; user-generated strings are HTML-escaped before insertion.

All data is stored in JavaScript arrays and objects and serialised to `localStorage`. Any mutation — a bid, a new listing, a valuation, a certificate, a watchlist change or a theme toggle — calls `save()`, so the state survives a page reload. Countdowns are updated by a single one-second timer that writes directly into the relevant DOM nodes, avoiding full re-renders.

## 5. Learning Outcomes

- Built a semantic, accessible page structure and a reusable component-style CSS system.
- Applied responsive design with mobile navigation and a dark theme.
- Implemented client-side routing and state-driven rendering without a framework.
- Practised filtering, sorting, validation and simulated financial calculations in JavaScript.
- Used `localStorage` as a lightweight persistence layer and designed a seed/reset strategy.
- Created print-friendly documents and exported tabular data as CSV.
- Learned to organise a multi-file frontend project and document it for evaluators.

## 6. Challenges Faced

- **No backend:** authentication and ownership had to be simulated. Solved with seeded users, a current-user session and a "continue as demo" path so evaluators could test every screen immediately.
- **Keeping state consistent:** changing a bid affects the lot price, bid count and several dashboards. Solved by centralising all writes in `save()` and re-rendering the active route after mutations.
- **Image reliability:** external stock photos can fail to load. Added an SVG data-URI fallback generated from the item name so every card always displays a themed image.
- **Responsive navigation:** dropdowns behave differently on desktop (hover) and mobile (tap). Solved with a shared `open` class and explicit ARIA `expanded` states.
- **Expired demo auctions:** seeded end times would eventually pass. Added a loader that moves expired live lots forward so bidding stays demonstrable.

## 7. Conclusion

AntiqueAuction delivers all core modules plus several bonus features as a self-contained static website. It demonstrates that a rich, interactive marketplace experience can be built with HTML, CSS and vanilla JavaScript alone. The project is ready to be committed to a public GitHub repository, deployed to static hosting and submitted with screenshots and a demo video for the Data Alcott Systems internship task.

---

*This is a demonstration project. No real payments, bids or transactions are processed.*
