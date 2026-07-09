const express = require('express');
const router = express.Router();
const site = require('../config/site');
const { pages } = require('../config/seo');

// Dynamically generated sitemap.xml so new pages in config/seo.js are picked up automatically
router.get('/sitemap.xml', (req, res) => {
  const urls = Object.values(pages)
    .filter((p) => p.path !== '/404')
    .map(
      (p) => `  <url>
    <loc>${site.url}${p.path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p.path === '/' ? '1.0' : '0.8'}</priority>
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
