// Handles lead-generation form submissions: trial signup, contact form, newsletter.
// Leads are appended to storage/leads.json (JSON line store). Swap this for a
// CRM/email integration (e.g. nodemailer, HubSpot, Google Sheets) in production.
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const LEADS_FILE = path.join(__dirname, '..', 'storage', 'leads.json');

function readLeads() {
  try {
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function appendLead(entry) {
  const record = { ...entry, createdAt: new Date().toISOString() };

  // Always log the lead so it's captured in platform logs (e.g. `vercel logs`)
  // even when the write below fails, since serverless platforms like Vercel
  // ship a read-only filesystem outside /tmp.
  console.log('[LEAD]', JSON.stringify(record));

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
exports.trialSignup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (wantsJson(req)) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    return res.redirect(`/?error=${encodeURIComponent('Please fill all fields correctly.')}#trial`);
  }

  const { name, phone, locality, plan } = req.body;
  appendLead({ type: 'trial', name, phone, locality, plan: plan || 'Not specified' });

  if (wantsJson(req)) {
    return res.json({ success: true, message: "Thanks! We'll call you within a few hours to start your trial." });
  }
  return res.redirect('/?success=trial#trial');
};

// POST /api/contact: Contact page form
exports.contactSubmit = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (wantsJson(req)) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    return res.redirect(`/contact?error=${encodeURIComponent('Please fill all required fields correctly.')}`);
  }

  const { name, phone, email, location, message } = req.body;
  appendLead({ type: 'contact', name, phone, email, location, message });

  if (wantsJson(req)) {
    return res.json({ success: true, message: "Message received! Our team will reach out shortly." });
  }
  return res.redirect('/contact?success=1');
};

// POST /api/newsletter: footer / referral banner newsletter capture
exports.newsletterSubmit = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  const { email } = req.body;
  appendLead({ type: 'newsletter', email });
  return res.json({ success: true, message: 'Subscribed! Watch your inbox for healthy eating tips & offers.' });
};
