// Renders the locations index and individual location landing pages
const site = require('../config/site');
const { buildDynamicMeta, buildMeta } = require('../config/seo');
const data = require('../config/data');

exports.index = (req, res) => {
  res.render('pages/locations-index', {
    site,
    meta: buildMeta('locationsIndex'),
    locations: data.locations,
  });
};

exports.show = (req, res, next) => {
  const location = data.locations.find((loc) => loc.slug === req.params.slug);
  if (!location) return next();

  const testimonials = data.testimonials.filter((t) => t.role.includes(location.testimonialMatch));

  res.render('pages/location', {
    site,
    meta: buildDynamicMeta({
      title: location.metaTitle,
      description: location.metaDescription,
      path: `/locations/${location.slug}`,
    }),
    location,
    testimonials,
    otherLocations: data.locations.filter((loc) => loc.slug !== location.slug),
    plans: data.plans,
  });
};
