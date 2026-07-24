// Loads the initial cafeterias and menu items. Safe to re-run: it only
// inserts rows that don't already exist by name. Run via `npm run db:seed`.
require('dotenv').config();
const { getPool } = require('../config/db');

const CAFETERIAS = ['Smartworks Victoria Park', 'Smartworks Mediasitti'];

const MENU_ITEMS = [
  {
    category: 'main',
    name: 'Veg Thali',
    description: 'Rice (300g), Dal Fry / Dal Tadka, Veg Curry, Special Veg, Salad / Papad',
    variants: [{ label: 'Regular', price: 80 }, { label: 'Large', price: 90 }],
  },
  {
    category: 'main',
    name: 'Mini Veg Thali',
    description: 'Rice (200g), Dal Fry / Dal Tadka, Veg Curry, Salad',
    variants: [{ label: 'Regular', price: 55 }],
  },
  {
    category: 'main',
    name: 'Non Veg Thali',
    description: 'Rice (300g), Dal Fry / Dal Tadka, Veg Curry, Salad, Chicken Dish or Fish Curry',
    variants: [{ label: 'Regular', price: 110 }, { label: 'Large', price: 120 }],
  },
  { category: 'main', name: 'Chicken Biryani', description: '', variants: [{ label: 'Regular', price: 110 }] },
  { category: 'main', name: 'Veg Biryani', description: '', variants: [{ label: 'Regular', price: 80 }] },
  { category: 'main', name: 'Chinese Combo (Veg)', description: '', variants: [{ label: 'Regular', price: 80 }] },
  { category: 'main', name: 'Chinese Combo (Non Veg)', description: '', variants: [{ label: 'Regular', price: 110 }] },
  { category: 'addon', name: 'Rice', description: '', variants: [{ label: 'Regular', price: 20 }] },
  { category: 'addon', name: 'Dal', description: '', variants: [{ label: 'Regular', price: 20 }] },
  { category: 'addon', name: 'Veg Curry', description: '', variants: [{ label: 'Regular', price: 25 }] },
  { category: 'addon', name: 'Special Veg', description: '', variants: [{ label: 'Regular', price: 35 }] },
  { category: 'addon', name: 'Chicken Dish', description: '', variants: [{ label: 'Regular', price: 70 }, { label: 'Large', price: 80 }] },
  { category: 'addon', name: 'Fish Curry', description: '', variants: [{ label: 'Regular', price: 70 }] },
  { category: 'addon', name: 'Roti', description: '', variants: [{ label: 'Regular', price: 7 }] },
];

async function main() {
  const pool = getPool();

  for (let i = 0; i < CAFETERIAS.length; i++) {
    const exists = await pool.query('SELECT id FROM cafeterias WHERE name = $1', [CAFETERIAS[i]]);
    if (exists.rows.length) continue;
    await pool.query('INSERT INTO cafeterias (name, sort_order) VALUES ($1, $2)', [CAFETERIAS[i], i]);
  }

  for (let i = 0; i < MENU_ITEMS.length; i++) {
    const item = MENU_ITEMS[i];
    const exists = await pool.query('SELECT id FROM menu_items WHERE name = $1', [item.name]);
    if (exists.rows.length) continue;
    await pool.query(
      `INSERT INTO menu_items (category, name, description, variants, sort_order)
       VALUES ($1, $2, $3, $4, $5)`,
      [item.category, item.name, item.description, JSON.stringify(item.variants), i]
    );
  }

  console.log('Seed complete:', CAFETERIAS.length, 'cafeterias,', MENU_ITEMS.length, 'menu items checked.');
  await pool.end();
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
