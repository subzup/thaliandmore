const express = require('express');
const router = express.Router();
const site = require('../config/site');
const { pages } = require('../config/seo');
const data = require('../config/data');

// Dynamically generated sitemap.xml so new static AND data-driven pages
// (locations, plan details, blog posts) are picked up automatically.
router.get('/sitemap.xml', (req, res) => {
  const staticUrls = Object.values(pages)
    .filter((p) => p.path !== '/404' && p.path !== '/locations' && p.path !== '/blog')
    .map((p) => ({ path: p.path, priority: p.path === '/' ? '1.0' : '0.8' }));

  const locationUrls = [
    { path: '/locations', priority: '0.7' },
    ...data.locations.map((loc) => ({ path: `/locations/${loc.slug}`, priority: '0.8' })),
  ];

  const planUrls = data.plans.map((p) => ({ path: `/plans/${p.id}`, priority: '0.8' }));

  const blogUrls = [
    { path: '/blog', priority: '0.6' },
    ...data.blog.map((post) => ({ path: `/blog/${post.slug}`, priority: '0.6' })),
  ];

  const all = [...staticUrls, ...locationUrls, ...planUrls, ...blogUrls];

  const urls = all
    .map(
      (p) => `  <url>
    <loc>${site.url}${p.path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

module.exports = router;
