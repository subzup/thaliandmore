// Location landing pages, each entry has genuinely unique copy (not a
// find-replace template) to avoid thin/duplicate-content penalties.
// `testimonialMatch` filters config/data/testimonials.js by role substring.
module.exports = [
  {
    slug: 'new-town',
    name: 'New Town',
    metaTitle: 'Meal Subscription in New Town, Kolkata | Thali & More',
    metaDescription:
      'Daily home-style meal subscriptions delivered across New Town, Kolkata, including Action Area I, II & III. PG-friendly plans, 7-day trial at ₹599.',
    heroTagline: 'Home-style meals for New Town’s PG residents, IT workers & young families',
    intro: [
      'New Town has grown fast, and so has the number of people living here without a home kitchen to fall back on: PG residents near Action Area I and II, young professionals renting near the Action Area III office belt, and families who moved in before the local food scene caught up.',
      'We deliver from our Mahishbathan kitchen, which sits just outside New Town, so your meal spends less time in transit and more time actually fresh. Most New Town deliveries are among the first out on our route each day.',
    ],
    landmarks: ['Action Area I, II & III', 'Eco Park vicinity', 'Rajarhat-New Town IT corridor', 'DLF IT Park & nearby business towers'],
    idealFor: ['PG residents without kitchen access', 'IT professionals working late shifts', 'Young families new to the area'],
    deliveryNote: 'Lunch by 1:00 PM and dinner by 8:00 PM across all New Town sectors and Action Areas.',
    distanceNote: 'Roughly 15-20 minutes from our Mahishbathan kitchen, among the shortest routes we run.',
    localFaq: [
      {
        question: 'Do you deliver inside PG accommodations in New Town?',
        answer: 'Yes. We regularly deliver to PGs and rented flats across Action Area I, II and III. Just share your building/flat number at signup so our delivery partner can reach you without calling every time.',
      },
      {
        question: 'I work in the New Town office belt. Can lunch reach my office instead of home?',
        answer: 'Yes, you can set your office address as the delivery location for lunch and your home address for dinner if the two differ. Just mention both while subscribing.',
      },
    ],
    testimonialMatch: 'New Town',
  },
  {
    slug: 'sector-v',
    name: 'Sector V',
    metaTitle: 'Meal Subscription in Sector V, Salt Lake | Thali & More',
    metaDescription:
      'Corporate-grade lunch and dinner subscriptions for offices and professionals in Sector V, Salt Lake. The same kitchen trusted for corporate catering. 7-day trial at ₹599.',
    heroTagline: 'The lunch subscription built for Sector V’s IT parks and business towers',
    intro: [
      'Sector V is where our kitchen already has a track record: we have run corporate catering for offices here for years before opening subscriptions to individuals. If your building already orders from us for a team lunch, this is the same food, just for your desk every day.',
      'Because Sector V is a dense corporate district, our delivery here runs on a tight, repeatable schedule that matches office lunch breaks rather than a loose residential delivery window.',
    ],
    landmarks: ['Sector V IT parks & business towers', 'Technopolis / DLF IT Park belt', 'Bengal Intelligent Park area', 'Karunamoyee crossing'],
    idealFor: ['Office employees ordering lunch daily', 'Teams wanting a reliable desk-lunch vendor', 'Professionals tired of food-app queues at lunch hour'],
    deliveryNote: 'Lunch delivered directly to office reception or desk by 1:00 PM on working days.',
    distanceNote: 'Sector V is one of our core delivery zones with dedicated mid-day delivery runs.',
    localFaq: [
      {
        question: 'Can our whole team in one office subscribe together?',
        answer: 'Yes, and it is common. Message us on WhatsApp with your office name and floor, and we will set up a consolidated delivery drop for your team along with individual billing per person.',
      },
      {
        question: 'Is this connected to your corporate catering service?',
        answer: 'Yes. Our subscription plans run out of the same kitchen and quality process we use for corporate catering contracts in Sector V, just packaged for individual daily delivery instead of bulk event catering.',
      },
    ],
    testimonialMatch: 'Sector V',
  },
  {
    slug: 'salt-lake',
    name: 'Salt Lake',
    metaTitle: 'Meal Subscription in Salt Lake, Kolkata | Thali & More',
    metaDescription:
      'Healthy home-style lunch and dinner subscriptions for families and professionals across Salt Lake (Bidhannagar) sectors. 7-day trial at ₹599.',
    heroTagline: 'Home-style thalis for Salt Lake families and working couples',
    intro: [
      'Salt Lake (Bidhannagar) is one of Kolkata’s oldest planned townships, and a lot of our subscribers here are families and working couples who grew up eating a certain way and are not interested in switching to restaurant-style food every night.',
      'Our menu is built around that: home-style dal-sabzi-roti thalis rather than restaurant-heavy, oil-rich food, delivered across Salt Lake’s sectors on a consistent daily schedule.',
    ],
    landmarks: ['Salt Lake Sectors I, II & III', 'City Centre I & II', 'Karunamoyee area', 'Central Park vicinity'],
    idealFor: ['Families wanting daily home-style meals', 'Working couples short on cooking time', 'Senior citizens who prefer light, home-style food'],
    deliveryNote: 'Lunch by 1:00 PM and dinner by 8:00 PM across all Salt Lake sectors.',
    distanceNote: 'A short hop from Sector V, so Salt Lake deliveries often ride the same route.',
    localFaq: [
      {
        question: 'Can you adjust spice levels or oil quantity for family orders?',
        answer: 'Yes. Many Salt Lake families ask for lighter oil or reduced spice, especially for senior citizens. Mention this when you subscribe or message us anytime to update your preference.',
      },
      {
        question: 'Do you deliver to independent houses, not just flats?',
        answer: 'Yes, we deliver to both independent houses and apartments across all Salt Lake sectors without any extra charge.',
      },
    ],
    testimonialMatch: 'Salt Lake',
  },
  {
    slug: 'rajarhat',
    name: 'Rajarhat',
    metaTitle: 'Meal Subscription in Rajarhat, Kolkata | Thali & More',
    metaDescription:
      'Daily meal subscriptions for Rajarhat’s growing residential and IT community. Home-style lunch and dinner delivered fresh. 7-day trial at ₹599.',
    heroTagline: 'Fresh daily meals for Rajarhat’s new residential and IT community',
    intro: [
      'Rajarhat sits right next to our Mahishbathan kitchen, which is why it was one of the first areas we expanded into once corporate demand from nearby IT parks started spilling into individual requests from residents.',
      'A lot of Rajarhat is still newly built, which means many households and PGs here do not have a fully set-up kitchen yet, or simply prefer not to cook daily while settling in.',
    ],
    landmarks: ['Rajarhat Chowmatha', 'Rajarhat-New Town corridor', 'Nearby IT parks and business campuses', 'Residential townships along Rajarhat Road'],
    idealFor: ['Residents in newly built homes without a set-up kitchen', 'IT park employees working out of Rajarhat campuses', 'Anyone who wants the shortest possible delivery time from our kitchen'],
    deliveryNote: 'Lunch by 1:00 PM and dinner by 8:00 PM, usually our fastest delivery window given the proximity to our kitchen.',
    distanceNote: 'Closest locality to our Mahishbathan kitchen, typically under 15 minutes.',
    localFaq: [
      {
        question: 'Since Rajarhat is close to your kitchen, can delivery times be more flexible?',
        answer: 'Being close by does help us keep delivery reliable, but we still run fixed lunch and dinner windows (1:00 PM / 8:00 PM) to keep the whole route on schedule for every locality.',
      },
      {
        question: 'Do you cover new residential townships still under development?',
        answer: 'In most cases yes. Message us your exact address on WhatsApp before subscribing and we will confirm coverage the same day.',
      },
    ],
    testimonialMatch: 'Rajarhat',
  },
];
