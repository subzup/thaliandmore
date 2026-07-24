// Single-password admin gate. Deliberately minimal: no user accounts, no
// roles, since there's exactly one admin today. If multi-user access is
// ever needed, this is the file to replace with real authentication.
const isProd = process.env.NODE_ENV === 'production';
const COOKIE_NAME = 'admin_session';

if (!process.env.ADMIN_PASSWORD) {
  console.warn('[ADMIN] ADMIN_PASSWORD is not set. The admin panel will reject all logins until it is configured.');
}

exports.requireAdmin = (req, res, next) => {
  if (req.signedCookies[COOKIE_NAME] === 'authenticated') return next();
  return res.redirect(`/admin/login?next=${encodeURIComponent(req.originalUrl)}`);
};

exports.checkPassword = (password) => {
  return !!process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD;
};

exports.logIn = (res) => {
  res.cookie(COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    signed: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 24 * 60 * 60 * 1000,
  });
};

exports.logOut = (res) => {
  res.clearCookie(COOKIE_NAME);
};
