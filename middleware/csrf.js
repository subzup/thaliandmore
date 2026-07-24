// Double-submit-cookie CSRF protection (no session store required). A random
// per-visitor cookie stands in for the "session identifier" csrf-csrf needs
// to bind tokens to a specific browser, since this app has no auth/session
// middleware for anonymous visitors.
const crypto = require('crypto');
const { doubleCsrf } = require('csrf-csrf');

if (!process.env.CSRF_SECRET) {
  console.warn('[CSRF] CSRF_SECRET is not set. Using a random secret that changes on every restart. Set CSRF_SECRET in production so tokens survive deploys/restarts.');
}
const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex');
const isProd = process.env.NODE_ENV === 'production';

function ensureVisitorId(req, res, next) {
  if (!req.cookies.visitor_id) {
    const id = crypto.randomBytes(16).toString('hex');
    res.cookie('visitor_id', id, { httpOnly: true, sameSite: 'lax', secure: isProd, maxAge: 365 * 24 * 60 * 60 * 1000 });
    req.cookies.visitor_id = id;
  }
  next();
}

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => CSRF_SECRET,
  getSessionIdentifier: (req) => req.cookies.visitor_id || 'anonymous',
  cookieName: isProd ? '__Host-thm.csrf-token' : 'thm.csrf-token',
  cookieOptions: { sameSite: 'lax', secure: isProd, path: '/' },
  // JSON fetch requests (the public order flow) send the token in a header;
  // traditional HTML form posts (the admin panel) send it as a hidden
  // `_csrf` field. Checking both is safe here, unlike an ambiguous cookie
  // fallback: either source still requires possessing the correct token.
  getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'] || (req.body && req.body._csrf),
});

module.exports = { ensureVisitorId, generateCsrfToken, doubleCsrfProtection };
