// Handles lead-generation form submissions: trial signup, contact form, newsletter.
// Leads are emailed via Resend (primary delivery) and also appended to
// storage/leads.json as a local backup, though that file won't persist on
// serverless platforms like Vercel, whose filesystem is read-only outside /tmp.
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const email = require('../config/email');

const LEADS_FILE = path.join(__dirname, '..', 'storage', 'leads.json');

const LEAD_LABELS = {
  trial: '7-Day Trial Signup',
  contact: 'Contact Form Message',
  newsletter: 'Newsletter Signup',
};

async function sendLeadEmail(record) {
  const rows = Object.entries(record)
    .filter(([key]) => key !== 'type')
    .map(([key, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#718096;text-transform:capitalize;">${key}</td><td style="padding:4px 0;font-weight:600;">${value}</td></tr>`)
    .join('');

  await email.send({
    to: email.NOTIFY_EMAIL,
    subject: `New ${LEAD_LABELS[record.type] || 'Lead'} | Thali & More`,
    html: `<h2>${LEAD_LABELS[record.type] || 'New Lead'}</h2><table>${rows}</table>`,
  });
}

function readLeads() {
  try {
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

async function appendLead(entry) {
  const record = { ...entry, createdAt: new Date().toISOString() };

  // Always log the lead so it's captured in platform logs (e.g. `vercel logs`)
  // as a backstop even when email delivery or the file write below fails.
  console.log('[LEAD]', JSON.stringify(record));

  await sendLeadEmail(record);

  try {
    const leads = readLeads();
    leads.push(record);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch (err) {
    console.error('[LEAD] could not persist to', LEADS_FILE, '-', err.message);
  }
}

function wantsJson(req) {
  return req.xhr || req.headers.accept?.includes('application/json') || req.headers['content-type']?.includes('application/json');
}

// POST /api/trial: 7-Day Trial signup (used by hero, popups, sticky CTA)
exports.trialSignup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (wantsJson(req)) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    return res.redirect(`/?error=${encodeURIComponent('Please fill all fields correctly.')}#trial`);
  }

  const { name, phone, locality, plan } = req.body;
  await appendLead({ type: 'trial', name, phone, locality, plan: plan || 'Not specified' });

  if (wantsJson(req)) {
    return res.json({ success: true, message: "Thanks! We'll call you within a few hours to start your trial." });
  }
  return res.redirect('/?success=trial#trial');
};

// POST /api/contact: Contact page form
exports.contactSubmit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (wantsJson(req)) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    return res.redirect(`/contact?error=${encodeURIComponent('Please fill all required fields correctly.')}`);
  }

  const { name, phone, email: emailAddr, location, message } = req.body;
  await appendLead({ type: 'contact', name, phone, email: emailAddr, location, message });

  if (wantsJson(req)) {
    return res.json({ success: true, message: "Message received! Our team will reach out shortly." });
  }
  return res.redirect('/contact?success=1');
};

// POST /api/newsletter: footer / referral banner newsletter capture
exports.newsletterSubmit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  const { email: emailAddr } = req.body;
  await appendLead({ type: 'newsletter', email: emailAddr });
  return res.json({ success: true, message: 'Subscribed! Watch your inbox for healthy eating tips & offers.' });
};
