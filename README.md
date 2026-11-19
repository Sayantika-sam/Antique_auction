# 🏺 AntiqueAuction — Antique Auction Platform

A complete **frontend-only antique auction marketplace** built for the Data Alcott Systems free web development internship task.

> *“Antiques are not just objects; they are storytellers of history and craft.”*

---

## 📌 Task Details

| Field | Value |
| --- | --- |
| Task ID | `WD-AUC-005` |
| Student Code | `DAS-AUC-005` |
| Task Name | Antique Auction Platform |
| Domain | Antique Auction Vintage |
| Company | Data Alcott Systems — www.dataalcott.com |
| Internship | Free Web Development Internship Online |
| Database | Not required — JavaScript arrays/objects + `localStorage` |

**Task link:** https://www.freeinternships.in/blog/

---

## ✨ Overview

AntiqueAuction connects collectors, historians and enthusiasts with antiques, vintage items and rare collectibles. Every lot has a documented history — origin, era, provenance, condition report, restoration notes and optional certificate of authenticity. Visitors can browse the catalogue, filter it, request a simulated expert valuation, take part in live bidding and manage collector/seller dashboards.

The entire application runs in the browser. There is no backend, no database and no build step.

---

## 🚀 Features

### Core
- **Home page** — hero, featured antiques, category browser, curator's pick, auction highlights and collector testimonials
- **Antique listing** — search plus filters for category, era, origin, condition, budget, authentication and live status; 5 sort options; grid/list views
- **Antique detail** — image gallery, specifications, history, provenance timeline, condition report, restoration history, authentication tab, related lots
- **Expert valuation** — simulated appraisal engine using category, era and condition multipliers, confidence score, expert name and saved history
- **Live bidding** — real-time countdowns, bid increments, quick-bid buttons, leading/outbid statuses and a full bid history log
- **Authenticity verification** — certificate register, lookup by certificate number, report generation and printable certificates
- **Collector dashboard** — leading bids, watchlist, won items, bidding history and valuations
- **Seller dashboard** — inventory CRUD (create / edit / delete / mark sold), sales history, performance metrics and CSV export
- **Login / Register** — simulated authentication with seeded demo accounts, session persistence and guest-to-sign-in flow

### Bonus
- Certificate of Authenticity with seal, QR-style verification pattern and print support
- Age & origin detection display on every lot
- Restoration history timeline
- Export reports as CSV; print / save as PDF for certificates and performance reports
- CSS-only virtual gallery with rotation and day/evening lighting
- Curator's recommendations with editorial collections
- Dark mode toggle with persisted preference
- Fully responsive layout with hamburger navigation and dropdown menus
- Toast notifications, smooth transitions, image fallbacks and accessible markup

---

## 📄 Pages / Routes

| Route | Page |
| --- | --- |
| `#/home` | Home |
| `#/antiques` | Antique listing with filters |
| `#/antique/:id` | Antique detail & bidding |
| `#/valuation` | Expert valuation |
| `#/bidding` | Live bidding room |
| `#/dashboard/collector` | Collector dashboard |
| `#/dashboard/seller` | Seller dashboard |
| `#/authenticity` | Authenticity verification |
| `#/certificates` | Certificates |
| `#/gallery` | Virtual gallery |
| `#/curators` | Curator's picks |
| `#/about` | About us |

---

## 🛠️ Technologies Used

- **HTML5** — semantic structure, accessible forms and sections
- **CSS3** — custom properties, grid/flexbox, media queries, animations, print styles, CSS-only 3D gallery
- **JavaScript (ES6+)** — arrays/objects, hash router, event delegation, `localStorage`, DOM rendering
- **Google Fonts** — Cormorant Garamond + Lora
- **Font Awesome 6** — icons
- Optional frameworks were intentionally avoided so the code stays readable and dependency-free.

### Design system
| Token | Colour |
| --- | --- |
| Warm Brown | `#8B6B4A` |
| Cream | `#F5EDE6` |
| Gold | `#D4A574` |
| Dark | `#2D1B12` |

---

## 📁 Project Structure

```
Antiquue-House-System/
├── index.html          # App shell: navigation, main outlet, footer, modal/toast roots
├── styles.css          # Complete design system, components, responsive + print styles
├── data.js             # Seed data: antiques, users, bids, valuations, certificates
├── views.js            # Renderers: home, listing, detail, valuation, bidding
├── views2.js           # Renderers: dashboards, verification, gallery, curator, about
├── script.js           # State, persistence, router, filters, auth, bidding, events
├── screenshots/        # Desktop and mobile captures
├── PROJECT_REPORT.md   # 1–2 page project report
└── README.md
```

### Data model (JavaScript only)
- `antiques[]` — id, name, category, era, origin, condition, description, history, provenance, prices, images, sellerId… (12 seeded lots)
- `bids[]` — id, antiqueId, bidderId, bidderName, amount, timestamp, status
- `valuations[]` — id, antiqueId, expert, estimate range, confidence, date, notes
- `certificates[]` — id, antiqueId, certificate number, verifier, date, status, report
- `users[]` — id, name, email, password, role, joined
- Everything is persisted under the `antiqueAuction.v1` key in `localStorage`.

---

## ▶️ Run Locally

1. Download / clone this repository.
2. Open `index.html` directly in a browser, **or** serve it:

   ```bash
   python -m http.server 8000
   # then visit http://localhost:8000
   ```

3. No installation, npm packages or database configuration is needed.

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Collector | `demo@antiqueauction.com` | `demo123` |
| Seller | `seller@antiqueauction.com` | `seller123` |

You can also use the **Demo Collector / Demo Seller** buttons in the sign-in dialog, or browse dashboards in demo mode without signing in.

> To reset all demo data, clear the `antiqueAuction.v1` key from your browser's local storage (or use DevTools → Application → Local Storage).

---

## 🌐 Deployment

**GitHub Pages:** push the repo → Settings → Pages → Deploy from a branch → `main` / `root`.
**Netlify:** drag-and-drop the project folder, or connect the repo with build command empty and publish directory `.`.
**Vercel:** import the repo as a static project; no build command required.

---

## 📸 Screenshots

Screenshots are in the [`screenshots/`](screenshots/) folder:

1. `01-home.png` — Home page
2. `02-antiques.png` — Antique listing with filters
3. `03-antique-detail.png` — Antique detail
4. `04-live-bidding.png` — Live bidding
5. `05-collector-dashboard.png` — Collector dashboard
6. `06-certificate.png` — Certificate of authenticity
7. `07-virtual-gallery.png` — Virtual gallery
8. `08-dark-mode.png` — Dark mode
9. `09-mobile-home.png` — Mobile view (full page)

---

## 📤 Submission Links

> Replace the placeholders below with your own links before submitting.

- **GitHub Repository:** https://github.com/Sayantika-sam/Antique_auction.git
- **Live Website (GitHub Pages, once enabled):** `https://sayantika-sam.github.io/Antique_auction/`
- **YouTube Demo:** `https://www.youtube.com/watch?v=YOUR_VIDEO_ID`
- **Blog Post:** `https://www.freeinternships.in/blog/`

---

## 🎓 Learning Outcomes

Building this project practised semantic HTML, component-style CSS architecture, vanilla JavaScript state management, hash-based client-side routing, localStorage persistence, form validation, filtering/sorting algorithms, simulated financial logic, responsive design and print-ready document generation.

---

*Developed as a frontend internship project for **Data Alcott Systems** · Free Web Development Internship Online · Task WD-AUC-005.*
