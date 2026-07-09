# Thali & More

Healthy home-style meal subscription website for New Town, Sector V, Salt Lake & Rajarhat. Node.js + Express + EJS.

## Setup

```bash
npm install
cp .env.example .env   # adjust values as needed
npm run dev             # nodemon, http://localhost:3000
npm start                # production
```

## Structure

```
app.js                  Express app entry point
routes/                 pages.js (page routes), api.js (lead capture), seo.js (sitemap.xml)
controllers/            pageController.js (renders views), leadController.js (form handling)
config/
  site.js               brand/business config (name, contact, whatsapp, nav)
  seo.js                per-page meta title/description/OG
  data/                 plans, menu, testimonials, faq, features, steps, why-us content
views/
  partials/             layout, navbar, footer, icon, forms, modals, floating buttons
  pages/                one EJS file per route
public/
  css/style.css         design system (tokens, components, responsive)
  js/main.js             nav, accordion, slider, counters, exit-intent, form AJAX
  images/                hero + OG SVG illustrations, favicon
storage/leads.json       lead submissions (trial/contact/newsletter), gitignored
```

## Notes

- Leads are appended to `storage/leads.json`. Swap `controllers/leadController.js` for a real CRM/email/Sheets integration before launch.
- The OG image (`public/images/og/thali-and-more-og.svg`) is a placeholder illustration. Replace with a branded 1200x630 JPG/PNG for full social-preview compatibility (some platforms don't render SVG `og:image`).
- `config/site.js` reads `WHATSAPP_NUMBER`, `CONTACT_PHONE_*`, `CONTACT_EMAIL`, `SITE_URL` from `.env`. Update these before deploying.
