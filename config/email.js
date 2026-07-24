// Shared Resend client used by both the general lead-capture forms
// (controllers/leadController.js) and the corporate order confirmations
// (controllers/bookingEmails.js).
const { Resend } = require('resend');
const site = require('./site');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const NOTIFY_EMAIL = process.env.LEAD_NOTIFICATION_EMAIL || site.contact.email;
// Resend's shared sandbox sender: works without verifying a domain. Once
// thaliandmore.in is verified in the Resend dashboard, switch this to
// something like `Thali & More <leads@thaliandmore.in>`.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Thali & More Leads <onboarding@resend.dev>';

// One-time diagnostic at process start so `vercel logs` can confirm which
// env vars actually reached this deployment, since misconfigured/stale env
// vars fail silently otherwise (the code just falls back to defaults).
console.log('[EMAIL] config: RESEND_API_KEY=%s, NOTIFY_EMAIL=%s, FROM_EMAIL=%s', resend ? 'set' : 'MISSING', NOTIFY_EMAIL, FROM_EMAIL);

async function send({ to, subject, html }) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not set, skipping send to', to);
    return { skipped: true };
  }
  // The Resend SDK resolves (rather than rejects) on API-level failures,
  // returning { error } instead of throwing, both cases must be checked.
  const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  if (error) {
    console.error('[EMAIL] Resend rejected send to', to, ':', error.message || JSON.stringify(error));
  }
  return { error };
}

module.exports = { send, NOTIFY_EMAIL, FROM_EMAIL };
