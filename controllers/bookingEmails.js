// Admin notification email for corporate meal bookings, sent via the shared
// Resend client (config/email.js). There's no customer email on file (the
// booking form only collects name/phone), so confirmation happens by phone,
// not email.
const email = require('../config/email');

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

async function sendAdminEmail(booking) {
  const items = typeof booking.items === 'string' ? JSON.parse(booking.items) : booking.items;
  await email.send({
    to: email.NOTIFY_EMAIL,
    subject: `New Meal Booking: ${booking.booking_code}`,
    html: `
      <h2>New Corporate Meal Booking</h2>
      <p><strong>Booking ID:</strong> ${booking.booking_code}</p>
      <p><strong>Customer:</strong> ${booking.customer_name}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <p><strong>Cafeteria:</strong> ${booking.cafeteria_name}</p>
      <p><strong>Required By:</strong> ${booking.required_time}</p>
      ${itemsTable(items)}
      <p style="margin-top:12px;"><strong>Estimated Total: ${formatRupees(booking.estimated_total)}</strong></p>
      ${booking.special_instructions ? `<p><strong>Special Instructions:</strong> ${booking.special_instructions}</p>` : ''}
      <p><strong>Submitted:</strong> ${new Date(booking.created_at).toLocaleString('en-IN')}</p>
    `,
  });
}

exports.sendBookingEmails = async (booking) => {
  await sendAdminEmail(booking);
};
