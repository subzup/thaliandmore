require('dotenv').config();

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const expressLayouts = require('express-ejs-layouts');

const pageRoutes = require('./routes/pages');
const apiRoutes = require('./routes/api');
const seoRoutes = require('./routes/seo');
const locationRoutes = require('./routes/locations');
const blogRoutes = require('./routes/blog');
const pageController = require('./controllers/pageController');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'partials/layout');

// Security & performance middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // relaxed for Google Fonts/CDN scroll libs; tighten with a nonce policy before production launch
  })
);
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static assets (1 day cache, bump in production with cache-busted filenames)
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// Routes
app.use('/', seoRoutes);
app.use('/api', apiRoutes);
app.use('/', locationRoutes);
app.use('/', blogRoutes);
app.use('/', pageRoutes);

// 404 handler
app.use(pageController.notFound);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const site = require('./config/site');
  res.status(500).render('pages/500', {
    site,
    meta: { title: `Server Error | ${site.name}`, description: 'Something went wrong.', path: '/500', url: site.url, ogImage: `${site.url}/images/og/thali-and-more-og.svg` },
  });
});

app.listen(PORT, () => {
  console.log(`Thali & More running at http://localhost:${PORT}`);
});
