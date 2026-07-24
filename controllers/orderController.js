// Corporate meal ordering: cafeteria -> menu cart -> customer details -> booking.
// Prices are always recomputed server-side from the database, never trusted
// from the client, so a tampered cart payload can't under-charge or order
// items that don't exist/are disabled.
const { validationResult } = require('express-validator');
const site = require('../config/site');
const { buildMeta } = require('../config/seo');
const queries = require('../db/queries');
const { sendBookingEmails } = require('./bookingEmails');
const { generateCsrfToken } = require('../middleware/csrf');

exports.showOrderPage = async (req, res, next) => {
  try {
    const [cafeterias, mains, addons] = await Promise.all([
      queries.getActiveCafeterias(),
      queries.getActiveMenuItemsByCategory('main'),
      queries.getActiveMenuItemsByCategory('addon'),
    ]);

    res.render('pages/corporate-order', {
      site,
      meta: buildMeta('corporateOrder'),
      cafeterias,
      mains,
      addons,
      csrfToken: generateCsrfToken(req, res),
      layout: 'partials/layout-app',
    });
  } catch (err) {
    next(err);
  }
};

function wantsJson(req) {
  return req.xhr || req.headers.accept?.includes('application/json') || req.headers['content-type']?.includes('application/json');
}

exports.submitOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { cafeteriaId, items, name, phone, requiredTime, specialInstructions, idempotencyKey } = req.body;

  // A resubmission (double-tap, network retry) with the same idempotency key
  // returns the original booking instead of creating a second one.
  const existing = await queries.findBookingByIdempotencyKey(idempotencyKey);
  if (existing) {
    return res.json({ success: true, bookingCode: existing.booking_code, estimatedTotal: existing.estimated_total });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(422).json({ success: false, errors: [{ msg: 'Your cart is empty. Please select at least one item.' }] });
  }

  const cafeterias = await queries.getActiveCafeterias();
  const cafeteria = cafeterias.find((c) => c.id === Number(cafeteriaId));
  if (!cafeteria) {
    return res.status(422).json({ success: false, errors: [{ msg: 'Please select a valid cafeteria.' }] });
  }

  // Rebuild the cart from trusted DB data: look up each menu item, verify the
  // requested variant actually exists on it, and price the line ourselves.
  const lineItems = [];
  let estimatedTotal = 0;
  for (const line of items) {
    const menuItem = await queries.getMenuItemById(Number(line.menuItemId));
    if (!menuItem || !menuItem.is_active) continue;
    const variant = (menuItem.variants || []).find((v) => v.label === line.variantLabel);
    if (!variant) continue;
    const quantity = Math.max(0, Math.min(20, parseInt(line.quantity, 10) || 0));
    if (quantity === 0) continue;

    const lineTotal = variant.price * quantity;
    estimatedTotal += lineTotal;
    lineItems.push({
      name: menuItem.name,
      variant: variant.label,
      unitPrice: variant.price,
      quantity,
      lineTotal,
    });
  }

  if (lineItems.length === 0) {
    return res.status(422).json({ success: false, errors: [{ msg: 'Your cart is empty. Please select at least one item.' }] });
  }

  const bookingCode = await queries.nextBookingCode(new Date().getFullYear());
  const booking = await queries.createBooking({
    bookingCode,
    cafeteriaId: cafeteria.id,
    cafeteriaName: cafeteria.name,
    customerName: name,
    phone,
    requiredTime,
    specialInstructions,
    items: lineItems,
    estimatedTotal,
    idempotencyKey,
  });

  sendBookingEmails(booking).catch((err) => console.error('[ORDER] email dispatch failed:', err.message));

  return res.json({ success: true, bookingCode: booking.booking_code, estimatedTotal: booking.estimated_total });
};
