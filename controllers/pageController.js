// Renders each public-facing page with its SEO meta + content data
const site = require('../config/site');
const { buildMeta } = require('../config/seo');
const data = require('../config/data');
const queries = require('../db/queries');

// Shared locals every page template needs
function baseLocals(metaKey) {
  return {
    site,
    meta: buildMeta(metaKey),
  };
}

exports.home = (req, res) => {
  res.render('pages/home', {
    ...baseLocals('home'),
    features: data.features,
    steps: data.steps,
    plans: data.plans,
    testimonials: data.testimonials.slice(0, 3),
    faq: data.faq.slice(0, 4),
    success: req.query.success === 'trial',
    error: req.query.error || null,
  });
};

exports.about = (req, res) => {
  res.render('pages/about', baseLocals('about'));
};

exports.plans = (req, res) => {
  res.render('pages/plans', {
    ...baseLocals('plans'),
    plans: data.plans,
  });
};

exports.howItWorks = (req, res) => {
  res.render('pages/how-it-works', {
    ...baseLocals('howItWorks'),
    steps: data.steps,
    plans: data.plans,
  });
};

// Same live catalog the admin panel and /corporate-order draw from, so this
// page never drifts out of sync with what's actually on offer or priced.
exports.menu = async (req, res, next) => {
  try {
    const [mains, addons] = await Promise.all([
      queries.getActiveMenuItemsByCategory('main'),
      queries.getActiveMenuItemsByCategory('addon'),
    ]);

    res.render('pages/menu', {
      ...baseLocals('menu'),
      mains,
      addons,
    });
  } catch (err) {
    next(err);
  }
};

exports.whyChooseUs = (req, res) => {
  res.render('pages/why-choose-us', {
    ...baseLocals('whyChooseUs'),
    whyUs: data.whyUs,
  });
};

exports.testimonials = (req, res) => {
  res.render('pages/testimonials', {
    ...baseLocals('testimonials'),
    testimonials: data.testimonials,
  });
};

exports.faq = (req, res) => {
  res.render('pages/faq', {
    ...baseLocals('faq'),
    faq: data.faq,
  });
};

exports.contact = (req, res) => {
  res.render('pages/contact', {
    ...baseLocals('contact'),
    success: req.query.success === '1',
    error: req.query.error || null,
  });
};

exports.corporateCateringServices = (req, res) => {
  const cateringTestimonial = data.testimonials.find((t) => t.name === 'Sourav Chatterjee');
  res.render('pages/corporate-catering-services', {
    ...baseLocals('corporateCateringServices'),
    cateringTestimonial,
  });
};


exports.notFound = (req, res) => {
  res.status(404).render('pages/404', baseLocals('notFound'));
};
