// Customer confirmation + admin notification emails for corporate meal
// bookings, sent via the shared Resend client (config/email.js).
const email = require('../config/email');
const site = require('../config/site');

function formatRupees(n) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

function itemsTable(items) {
  const rows = items
    .map(
      (item) =>
        `<tr><td style="padding:4px 12px 4px 0;">${item.name} (${item.variant}) x${item.quantity}</td><td style="padding:4px 0;text-align:right;font-weight:600;">${formatRupees(item.lineTotal)}</td></tr>`
    )
    .join('');
  return `<table style="width:100%;border-collapse:collapse;">${rows}</table>`;
}

async function sendCustomerEmail(booking) {
  const items = typeof booking.items === 'string' ? JSON.parse(booking.items) : booking.items;
  await email.send({
    to: booking.email,
    subject: `Booking Received: ${booking.booking_code}`,
    html: `
      <h2>Thanks, your booking is in!</h2>
      <p><strong>Booking ID:</strong> ${booking.booking_code}</p>
      <p><strong>Cafeteria:</strong> ${booking.cafeteria_name}</p>
      ${itemsTable(items)}
      <p style="margin-top:12px;"><strong>Estimated Total: ${formatRupees(booking.estimated_total)}</strong></p>
      <p>Our team will confirm your order shortly. No online payment is required.</p>
      <p>Questions? Reach us at ${site.contact.phoneDisplay} or ${site.contact.email}.</p>
    `,
  });
}

async function sendAdminEmail(booking) {
  const items = typeof booking.items === 'string' ? JSON.parse(booking.items) : booking.items;
  await email.send({
    to: email.NOTIFY_EMAIL,
    subject: `New Meal Booking: ${booking.booking_code}`,
    html: `
      <h2>New Corporate Meal Booking</h2>
      <p><strong>Booking ID:</strong> ${booking.booking_code}</p>
      <p><strong>Customer:</strong> ${booking.customer_name} (${booking.company})</p>
      <p><strong>Phone:</strong> ${booking.phone} &middot; <strong>Email:</strong> ${booking.email}</p>
      <p><strong>Cafeteria:</strong> ${booking.cafeteria_name}</p>
      ${itemsTable(items)}
      <p style="margin-top:12px;"><strong>Estimated Total: ${formatRupees(booking.estimated_total)}</strong></p>
      ${booking.special_instructions ? `<p><strong>Special Instructions:</strong> ${booking.special_instructions}</p>` : ''}
      <p><strong>Submitted:</strong> ${new Date(booking.created_at).toLocaleString('en-IN')}</p>
    `,
  });
}

exports.sendBookingEmails = async (booking) => {
  await Promise.all([sendCustomerEmail(booking), sendAdminEmail(booking)]);
};
