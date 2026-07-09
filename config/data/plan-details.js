// Deep-dive content for individual plan pages (/plans/:id), extends the
// summary in plans.js with unique long-form copy per plan for SEO.
module.exports = {
  'office-lunch': {
    metaTitle: 'Office Lunch Delivery Subscription in Kolkata | Thali & More',
    metaDescription:
      'A daily home-style office lunch subscription delivered to your desk by 1 PM across New Town, Sector V, Salt Lake & Rajarhat. No more choosing between skipping lunch or ordering expensive food-app meals.',
    idealFor: [
      'Employees who currently skip lunch or eat the same 2-3 restaurant options on rotation',
      'Teams that want one reliable vendor instead of five people ordering from five different apps',
      'Anyone whose office pantry has a fridge and microwave but no real kitchen',
    ],
    sampleDay: {
      label: 'A typical Office Lunch day',
      items: ['Dal or kadhi', 'One seasonal sabzi', 'Steamed rice + 2 rotis', 'Salad and pickle'],
    },
    nutritionNote:
      'Portions are sized for a working lunch, not a heavy meal that leaves you sluggish through the afternoon. Oil is kept moderate and the plate is balanced across carbs, protein and fibre rather than being rice-heavy.',
    whyThisPlan:
      'Office Lunch exists for one specific problem: the 1-2 PM window where you either order something rushed and overpriced, or skip eating properly. It runs Monday-Saturday to match a typical office week, and stops there rather than bundling in a dinner you may not need on a workday.',
    faq: [
      {
        question: 'What if my office has a security check-in process for deliveries?',
        answer: 'Tell us your building/floor security process at signup. Our delivery partners are used to office reception drop-offs and will follow your building\'s check-in steps.',
      },
      {
        question: 'Can I pause Office Lunch for days I work from home?',
        answer: 'Yes, pause anytime from your account or via WhatsApp before 10 AM that day, with no penalty.',
      },
    ],
  },
  'lunch-only': {
    metaTitle: 'Daily Lunch-Only Meal Subscription in Kolkata | Thali & More',
    metaDescription:
      'A daily home-style lunch subscription for individuals, couples and PG residents, delivered to your home by 1 PM, 7 days a week. Includes weekends, unlike office-only plans.',
    idealFor: [
      'PG residents and individuals living alone without a kitchen',
      'Couples who eat lunch at home but manage dinner separately',
      'Anyone who wants one dependable home-style meal a day, every day including weekends',
    ],
    sampleDay: {
      label: 'A typical Lunch Only day',
      items: ['Seasonal dal', 'Sabzi rotation (2-3 vegetables across the week)', 'Steamed rice + 2 rotis', 'Salad and pickle'],
    },
    nutritionNote:
      'Because this is often someone\'s primary meal of the day, portions run slightly more generous than the Office Lunch plan, with a wider weekly vegetable rotation to avoid repetition.',
    whyThisPlan:
      'Lunch Only is built for people whose main gap is the midday meal specifically, not necessarily dinner too. It runs all 30 days of the month including weekends, since a PG resident or someone living alone doesn\'t stop needing lunch on a Saturday.',
    faq: [
      {
        question: 'I sometimes work from home and sometimes from office. Can delivery address change day to day?',
        answer: 'Yes. Update your delivery address by 10 AM on any given day via WhatsApp, and that day\'s lunch will go to the updated address.',
      },
      {
        question: 'Can I upgrade to Lunch + Dinner later without restarting my subscription?',
        answer: 'Yes, you can upgrade anytime from your account or by messaging us, and the new plan applies from your next billing cycle.',
      },
    ],
  },
  'lunch-dinner': {
    metaTitle: 'Lunch + Dinner Meal Subscription in Kolkata | Thali & More',
    metaDescription:
      'Two fresh home-style meals a day, delivered to your home or office across New Town, Sector V, Salt Lake & Rajarhat. Our most-subscribed plan for professionals and families.',
    idealFor: [
      'Working professionals and couples who want to stop cooking entirely on weekdays',
      'Families where both adults work full-time',
      'Anyone currently relying on food-delivery apps for both meals and finding it expensive and inconsistent',
    ],
    sampleDay: {
      label: 'A typical Lunch + Dinner day',
      items: ['Lunch: dal, sabzi, rice, roti, salad & pickle', 'Dinner: a different sabzi or curry, jeera rice, roti, curd'],
    },
    nutritionNote:
      'Lunch and dinner menus are deliberately different from each other on the same day, and the weekly rotation avoids repeating a main dish within the same week.',
    whyThisPlan:
      'This is our most-subscribed plan because it solves the full day, not half of it. Once both meals are handled, cooking effectively disappears from a subscriber\'s daily routine on weekdays, with weekends included too.',
    faq: [
      {
        question: 'Can lunch and dinner go to two different addresses (e.g. office and home)?',
        answer: 'Yes, this is one of the most common requests on this plan. Set your office address for lunch and home address for dinner at signup, or update it anytime.',
      },
      {
        question: 'Is the dinner menu just a repeat of lunch?',
        answer: 'No. Dinner uses a different main dish from lunch on the same day, so you are not eating the same sabzi twice in one day.',
      },
    ],
  },
  'high-protein': {
    metaTitle: 'Healthy High Protein Meal Plan in Kolkata | Thali & More',
    metaDescription:
      'A macro-balanced, high-protein vegetarian meal subscription with 25-30g protein per meal, built with a nutritionist for active lifestyles. Delivered daily across New Town, Sector V, Salt Lake & Rajarhat.',
    idealFor: [
      'Gym-goers and fitness-focused eaters who track protein intake',
      'Vegetarians who find it hard to hit protein targets through home cooking alone',
      'Anyone who wants portion-controlled, low-oil meals without giving up home-style flavour',
    ],
    sampleDay: {
      label: 'A typical High Protein day',
      items: ['Lunch: paneer or sprouts-based sabzi, dal, millet or rice, salad', 'Dinner: egg or soy-based curry (vegetarian options available), sauteed greens, roti'],
    },
    nutritionNote:
      'Every meal targets 25-30g of protein through a combination of paneer, sprouts, legumes, and optional eggs, cooked with grilled or steamed methods rather than deep-frying, with a nutrition breakdown included with every delivery.',
    whyThisPlan:
      'Most "diet food" in Kolkata is either restaurant-style grilled chicken salads or bland boiled meals. This plan tries to hit real macro targets while still tasting like something you would choose to eat daily, not just tolerate.',
    faq: [
      {
        question: 'Is the High Protein plan fully vegetarian?',
        answer: 'Yes, it is vegetarian by default with paneer, sprouts, legumes and millets as the main protein sources. Eggs can be added as an optional protein source if you request it.',
      },
      {
        question: 'Do you provide the exact macro breakdown, not just "high protein" as a label?',
        answer: 'Yes. Every High Protein meal is delivered with an approximate protein, carb and fat breakdown so you can log it against your daily targets.',
      },
    ],
  },
};
