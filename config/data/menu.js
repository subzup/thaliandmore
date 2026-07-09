// Weekly rotating menu shown on the Menu page
module.exports = {
  note: 'All meals are 100% vegetarian. Menu rotates weekly based on seasonal produce. Jain/no-onion-garlic option available on request.',
  week: [
    {
      day: 'Monday',
      lunch: { main: 'Yellow Dal Tadka', sides: ['Aloo Gobi', 'Steamed Rice', 'Roti (2)', 'Salad & Pickle'] },
      dinner: { main: 'Paneer Bhurji', sides: ['Mixed Veg', 'Jeera Rice', 'Roti (2)', 'Curd'] },
    },
    {
      day: 'Tuesday',
      lunch: { main: 'Chana Masala', sides: ['Bhindi Fry', 'Steamed Rice', 'Roti (2)', 'Salad & Pickle'] },
      dinner: { main: 'Veg Kofta Curry', sides: ['Sauteed Beans', 'Jeera Rice', 'Roti (2)', 'Curd'] },
    },
    {
      day: 'Wednesday',
      lunch: { main: 'Rajma Curry', sides: ['Lauki Sabzi', 'Steamed Rice', 'Roti (2)', 'Salad & Pickle'] },
      dinner: { main: 'Dum Aloo', sides: ['Palak Sabzi', 'Jeera Rice', 'Roti (2)', 'Curd'] },
    },
    {
      day: 'Thursday',
      lunch: { main: 'Moong Dal', sides: ['Cabbage Sabzi', 'Steamed Rice', 'Roti (2)', 'Salad & Pickle'] },
      dinner: { main: 'Paneer Butter Masala', sides: ['Sauteed Veggies', 'Jeera Rice', 'Roti (2)', 'Curd'] },
    },
    {
      day: 'Friday',
      lunch: { main: 'Kadhi Pakora', sides: ['Aloo Jeera', 'Steamed Rice', 'Roti (2)', 'Salad & Pickle'] },
      dinner: { main: 'Mix Veg Curry', sides: ['Bhindi Masala', 'Jeera Rice', 'Roti (2)', 'Curd'] },
    },
    {
      day: 'Saturday',
      lunch: { main: 'Chole Masala', sides: ['Seasonal Sabzi', 'Steamed Rice', 'Roti (2)', 'Salad & Pickle'] },
      dinner: { main: 'Veg Handi', sides: ['Sauteed Greens', 'Jeera Rice', 'Roti (2)', 'Curd'] },
    },
    {
      day: 'Sunday',
      lunch: { main: 'Special Sunday Thali', sides: ['Paneer Sabzi', 'Pulao', 'Roti (2)', 'Sweet Dish'] },
      dinner: { main: 'Light Khichdi', sides: ['Papad', 'Curd', 'Pickle'] },
    },
  ],
  highlights: [
    { icon: 'wheat', label: 'No Maida' },
    { icon: 'droplet', label: 'Cold-Pressed Oil' },
    { icon: 'leaf', label: '100% Vegetarian' },
    { icon: 'flame', label: 'Low Oil, Home-Style Cooking' },
  ],
};
