// Renders deep-dive SEO landing pages for individual plans (/plans/:id)
const site = require('../config/site');
const { buildDynamicMeta } = require('../config/seo');
const data = require('../config/data');

exports.show = (req, res, next) => {
  const plan = data.plans.find((p) => p.id === req.params.id);
  const details = data.planDetails[req.params.id];
  if (!plan || !details) return next();

  res.render('pages/plan-detail', {
    site,
    meta: buildDynamicMeta({
      title: details.metaTitle,
      description: details.metaDescription,
      path: `/plans/${plan.id}`,
    }),
    plan,
    details,
    otherPlans: data.plans.filter((p) => p.id !== plan.id),
  });
};
