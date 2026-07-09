// Per-page SEO metadata: title, description, canonical path, OG image
// Kept separate from route/content data so it's easy to audit & update for SEO.

const site = require('./site');

const suffix = ` | ${site.name}`;
// NOTE: SVG used as a self-contained placeholder (no image-conversion tooling in this environment).
// Swap for a branded 1200x630 JPG/PNG before production launch for full social-platform compatibility.
const defaultOgImage = '/images/og/thali-and-more-og.svg';

const pages = {
  home: {
    title: `${site.name} | Healthy Home-Style Meal Subscriptions in New Town, Sector V & Salt Lake`,
    description:
      'Freshly prepared, healthy home-style meals delivered daily to New Town, Sector V, Salt Lake & Rajarhat. No cooking, no daily ordering. Just subscribe. Start your 7-day trial at ₹599.',
    path: '/',
  },
  about: {
    title: `About Us: From Corporate Catering to Your Daily Table${suffix}`,
    description:
      'Thali & More started as a trusted corporate catering kitchen in Mahishbathan and now delivers healthy, home-style meal subscriptions across New Town, Sector V, Salt Lake & Rajarhat.',
    path: '/about',
  },
  plans: {
    title: `Meal Subscription Plans & Pricing${suffix}`,
    description:
      'Compare Office Lunch, Lunch Only, Lunch + Dinner and High Protein plans. Transparent monthly pricing, flexible pausing, and a 7-day trial for ₹599.',
    path: '/plans',
  },
  howItWorks: {
    title: `How It Works: Subscribe in 3 Simple Steps${suffix}`,
    description:
      'Choose your plan, subscribe online in under 2 minutes, and get fresh home-style meals delivered daily. See exactly how Thali & More works.',
    path: '/how-it-works',
  },
  menu: {
    title: `Weekly Menu: Daily Rotating Home-Style Meals${suffix}`,
    description:
      'Explore our rotating weekly menu of balanced, home-style vegetarian meals, fresh daily and never frozen, prepared in our hygienic Mahishbathan kitchen.',
    path: '/menu',
  },
  whyChooseUs: {
    title: `Why Choose Us: Fresh, Reliable, Corporate-Grade Quality${suffix}`,
    description:
      'No frozen food. No missed deliveries. See why working professionals, PG residents and families across New Town & Sector V trust Thali & More every day.',
    path: '/why-choose-us',
  },
  testimonials: {
    title: `Customer Reviews: 1,200+ Happy Subscribers${suffix}`,
    description:
      'Read real reviews from working professionals and families in New Town, Sector V, Salt Lake and Rajarhat who switched to Thali & More meal subscriptions.',
    path: '/testimonials',
  },
  faq: {
    title: `Frequently Asked Questions${suffix}`,
    description:
      'Answers to common questions about pausing subscriptions, delivery areas, vegetarian menus, dinner plans, and payments at Thali & More.',
    path: '/faq',
  },
  contact: {
    title: `Contact Us: New Town, Sector V, Salt Lake & Rajarhat${suffix}`,
    description:
      'Get in touch with Thali & More for meal subscription queries, corporate catering, or support. Call, WhatsApp, or send us a message. We reply fast.',
    path: '/contact',
  },
  notFound: {
    title: `Page Not Found${suffix}`,
    description: 'The page you are looking for could not be found.',
    path: '/404',
  },
};

function buildMeta(key) {
  const page = pages[key];
  return {
    ...page,
    url: `${site.url}${page.path}`,
    ogImage: `${site.url}${defaultOgImage}`,
    siteName: site.name,
  };
}

module.exports = { pages, buildMeta };
