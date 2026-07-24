// Admin panel: bookings list/status, and CRUD for cafeterias + menu items.
// Deliberately simple server-rendered forms, no client-side framework, since
// this is an internal tool used by one admin rather than a public surface.
const site = require('../config/site');
const queries = require('../db/queries');
const { checkPassword, logIn, logOut } = require('../middleware/adminAuth');
const { generateCsrfToken } = require('../middleware/csrf');

function adminLocals(req, res, extra) {
  return {
    site,
    csrfToken: generateCsrfToken(req, res),
    layout: 'partials/layout-app',
    noIndex: true,
    meta: {
      title: `Admin | ${site.name}`,
      description: 'Internal admin panel.',
      url: `${site.url}/admin`,
      ogImage: `${site.url}/images/og/thali-and-more-og.svg`,
    },
    ...extra,
  };
}

// ---------- Auth ----------

exports.showLogin = (req, res) => {
  res.render('pages/admin-login', adminLocals(req, res, { error: req.query.error || null, next: req.query.next || '/admin' }));
};

exports.submitLogin = (req, res) => {
  const { password, next } = req.body;
  if (!checkPassword(password)) {
    return res.redirect(`/admin/login?error=${encodeURIComponent('Incorrect password.')}`);
  }
  logIn(res);
  res.redirect(next && next.startsWith('/admin') ? next : '/admin');
};

exports.logout = (req, res) => {
  logOut(res);
  res.redirect('/admin/login');
};

// ---------- Bookings ----------

exports.showBookings = async (req, res, next) => {
  try {
    const bookings = await queries.getAllBookings();
    res.render('pages/admin-bookings', adminLocals(req, res, { bookings, updated: req.query.updated === '1' }));
  } catch (err) {
    next(err);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    await queries.updateBookingStatus(Number(req.params.id), req.body.status);
    res.redirect('/admin?updated=1');
  } catch (err) {
    next(err);
  }
};

// ---------- Cafeterias ----------

exports.showCafeterias = async (req, res, next) => {
  try {
    const cafeterias = await queries.getAllCafeterias();
    res.render('pages/admin-cafeterias', adminLocals(req, res, { cafeterias }));
  } catch (err) {
    next(err);
  }
};

exports.createCafeteria = async (req, res, next) => {
  try {
    const name = (req.body.name || '').trim();
    if (name) await queries.createCafeteria(name);
    res.redirect('/admin/cafeterias');
  } catch (err) {
    next(err);
  }
};

exports.updateCafeteria = async (req, res, next) => {
  try {
    const name = (req.body.name || '').trim();
    const is_active = req.body.is_active === 'on';
    await queries.updateCafeteria(Number(req.params.id), { name, is_active });
    res.redirect('/admin/cafeterias');
  } catch (err) {
    next(err);
  }
};

exports.deleteCafeteria = async (req, res, next) => {
  try {
    await queries.deleteCafeteria(Number(req.params.id));
    res.redirect('/admin/cafeterias');
  } catch (err) {
    next(err);
  }
};

// ---------- Menu items ----------

function parseVariants(body) {
  // Form fields: variantLabel[], variantPrice[] (parallel arrays; a single
  // variant posts as plain strings rather than one-item arrays).
  const labels = [].concat(body.variantLabel || []);
  const prices = [].concat(body.variantPrice || []);
  return labels
    .map((label, i) => ({ label: (label || '').trim(), price: parseInt(prices[i], 10) }))
    .filter((v) => v.label && Number.isFinite(v.price) && v.price >= 0);
}

exports.showMenu = async (req, res, next) => {
  try {
    const items = await queries.getAllMenuItems();
    res.render('pages/admin-menu', adminLocals(req, res, {
      mains: items.filter((i) => i.category === 'main'),
      addons: items.filter((i) => i.category === 'addon'),
    }));
  } catch (err) {
    next(err);
  }
};

exports.createMenuItem = async (req, res, next) => {
  try {
    const variants = parseVariants(req.body);
    if ((req.body.name || '').trim() && variants.length) {
      await queries.createMenuItem({
        category: req.body.category === 'addon' ? 'addon' : 'main',
        name: req.body.name.trim(),
        description: (req.body.description || '').trim(),
        variants,
      });
    }
    res.redirect('/admin/menu');
  } catch (err) {
    next(err);
  }
};

exports.updateMenuItem = async (req, res, next) => {
  try {
    const variants = parseVariants(req.body);
    await queries.updateMenuItem(Number(req.params.id), {
      name: (req.body.name || '').trim(),
      description: (req.body.description || '').trim(),
      variants,
      is_active: req.body.is_active === 'on',
    });
    res.redirect('/admin/menu');
  } catch (err) {
    next(err);
  }
};

exports.deleteMenuItem = async (req, res, next) => {
  try {
    await queries.deleteMenuItem(Number(req.params.id));
    res.redirect('/admin/menu');
  } catch (err) {
    next(err);
  }
};
