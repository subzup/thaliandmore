// Central brand/business config, single source of truth used across views & controllers
require('dotenv').config();

const siteUrl = process.env.SITE_URL || 'https://www.thaliandmore.in';

module.exports = {
  name: 'Thali & More',
  tagline: 'Healthy Home-Style Meals, Delivered Daily.',
  legalName: 'Thali & More Foods',
  url: siteUrl,
  locales: ['New Town', 'Sector V', 'Salt Lake', 'Rajarhat'],
  kitchen: {
    area: 'Mahishbathan',
    addressLine: 'Mahishbathan, Near New Town, Kolkata',
    addressRegion: 'West Bengal',
    postalCode: '700157',
    country: 'IN',
  },
  contact: {
    email: process.env.CONTACT_EMAIL || 'hello@thaliandmore.in',
    phoneDisplay: process.env.CONTACT_PHONE_DISPLAY || '+91 62910 43537',
    phoneHref: process.env.CONTACT_PHONE_HREF || '+916291043537',
  },
  whatsapp: {
    number: process.env.WHATSAPP_NUMBER || '916291043537',
    defaultMessage: "Hi Thali & More! I'd like to know more about your meal subscription plans.",
  },
  socials: {
    instagram: 'https://www.instagram.com/thaliandmore',
    facebook: 'https://www.facebook.com/thaliandmore',
    linkedin: 'https://www.linkedin.com/company/thaliandmore',
  },
  trial: {
    price: 599,
    days: 7,
    label: 'Start 7-Day Trial',
  },
  stats: {
    subscribers: 1200,
    mealsDelivered: 180000,
    avgRating: 4.8,
    reviewCount: 340,
    foundingMembersGoal: 100,
  },
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Plans', href: '/plans' },
    { label: 'Menu', href: '/menu' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Why Us', href: '/why-choose-us' },
    { label: 'About', href: '/about' },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
};
