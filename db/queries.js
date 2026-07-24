// Data access layer for the corporate ordering system. Kept as plain SQL
// via the shared pg pool (config/db.js) rather than an ORM, to match the
// rest of this codebase's minimal-dependency style.
const { query } = require('../config/db');

// ---------- Cafeterias ----------

exports.getActiveCafeterias = async () => {
  const { rows } = await query('SELECT id, name FROM cafeterias WHERE is_active = true ORDER BY sort_order, id');
  return rows;
};

exports.getAllCafeterias = async () => {
  const { rows } = await query('SELECT * FROM cafeterias ORDER BY sort_order, id');
  return rows;
};

exports.createCafeteria = async (name) => {
  const { rows } = await query(
    'INSERT INTO cafeterias (name, sort_order) VALUES ($1, COALESCE((SELECT MAX(sort_order) + 1 FROM cafeterias), 0)) RETURNING *',
    [name]
  );
  return rows[0];
};

exports.updateCafeteria = async (id, { name, is_active }) => {
  const { rows } = await query(
    'UPDATE cafeterias SET name = $1, is_active = $2 WHERE id = $3 RETURNING *',
    [name, is_active, id]
  );
  return rows[0];
};

exports.deleteCafeteria = async (id) => {
  await query('DELETE FROM cafeterias WHERE id = $1', [id]);
};

// ---------- Menu items ----------

exports.getActiveMenuItemsByCategory = async (category) => {
  const { rows } = await query(
    'SELECT * FROM menu_items WHERE category = $1 AND is_active = true ORDER BY sort_order, id',
    [category]
  );
  return rows;
};

exports.getAllMenuItems = async () => {
  const { rows } = await query('SELECT * FROM menu_items ORDER BY category, sort_order, id');
  return rows;
};

exports.getMenuItemById = async (id) => {
  const { rows } = await query('SELECT * FROM menu_items WHERE id = $1', [id]);
  return rows[0];
};

exports.createMenuItem = async ({ category, name, description, variants }) => {
  const { rows } = await query(
    `INSERT INTO menu_items (category, name, description, variants, sort_order)
     VALUES ($1, $2, $3, $4, COALESCE((SELECT MAX(sort_order) + 1 FROM menu_items WHERE category = $1), 0))
     RETURNING *`,
    [category, name, description, JSON.stringify(variants)]
  );
  return rows[0];
};

exports.updateMenuItem = async (id, { name, description, variants, is_active }) => {
  const { rows } = await query(
    `UPDATE menu_items SET name = $1, description = $2, variants = $3, is_active = $4, updated_at = now()
     WHERE id = $5 RETURNING *`,
    [name, description, JSON.stringify(variants), is_active, id]
  );
  return rows[0];
};

exports.deleteMenuItem = async (id) => {
  await query('DELETE FROM menu_items WHERE id = $1', [id]);
};

// ---------- Bookings ----------

// Atomically issues the next booking code for the given year, e.g.
// THM-2026-000001. Safe under concurrent requests: the UPDATE branch of
// ON CONFLICT takes a row lock, so two simultaneous bookings can't collide.
exports.nextBookingCode = async (year) => {
  const { rows } = await query(
    `INSERT INTO booking_sequence (year, last_number) VALUES ($1, 1)
     ON CONFLICT (year) DO UPDATE SET last_number = booking_sequence.last_number + 1
     RETURNING last_number`,
    [year]
  );
  const number = String(rows[0].last_number).padStart(6, '0');
  return `THM-${year}-${number}`;
};

exports.findBookingByIdempotencyKey = async (key) => {
  if (!key) return null;
  const { rows } = await query('SELECT * FROM bookings WHERE idempotency_key = $1', [key]);
  return rows[0] || null;
};

exports.createBooking = async (booking) => {
  const { rows } = await query(
    `INSERT INTO bookings
       (booking_code, cafeteria_id, cafeteria_name, customer_name, phone, email, company,
        special_instructions, items, estimated_total, idempotency_key)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      booking.bookingCode, booking.cafeteriaId, booking.cafeteriaName, booking.customerName,
      booking.phone, booking.email, booking.company, booking.specialInstructions || null,
      JSON.stringify(booking.items), booking.estimatedTotal, booking.idempotencyKey || null,
    ]
  );
  return rows[0];
};

exports.getAllBookings = async () => {
  const { rows } = await query('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 200');
  return rows;
};

exports.updateBookingStatus = async (id, status) => {
  const { rows } = await query('UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
  return rows[0];
};
