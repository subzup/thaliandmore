-- Corporate meal ordering schema. Run once against a fresh database via
-- `npm run db:migrate` (see db/migrate.js), then `npm run db:seed` to load
-- the initial cafeterias and menu items.

CREATE TABLE IF NOT EXISTS cafeterias (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- category: 'main' (thalis, biryanis, combos) or 'addon' (extra items).
-- variants holds one or more { label, price } pairs so items like "Veg Thali"
-- (₹80 / ₹90) can carry multiple priced options without a schema change.
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  category VARCHAR(20) NOT NULL DEFAULT 'main',
  name VARCHAR(150) NOT NULL,
  description TEXT,
  variants JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tracks the last-used booking number per year so codes reset annually
-- (THM-2026-000001, THM-2027-000001, ...) with atomic increments under
-- concurrent bookings via the INSERT ... ON CONFLICT DO UPDATE pattern.
CREATE TABLE IF NOT EXISTS booking_sequence (
  year INTEGER PRIMARY KEY,
  last_number INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  booking_code VARCHAR(20) UNIQUE NOT NULL,
  cafeteria_id INTEGER REFERENCES cafeterias(id),
  cafeteria_name VARCHAR(150) NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  required_time VARCHAR(10) NOT NULL,
  special_instructions TEXT,
  items JSONB NOT NULL,
  estimated_total INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'New',
  idempotency_key VARCHAR(100) UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Superseded by a simpler flow: no customer email/company, replaced with the
-- time the food is required by. Safe no-ops on a fresh database.
ALTER TABLE bookings DROP COLUMN IF EXISTS email;
ALTER TABLE bookings DROP COLUMN IF EXISTS company;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS required_time VARCHAR(10) NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items (category, sort_order);
