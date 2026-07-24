// Location landing pages, each entry has genuinely unique copy (not a
// find-replace template) to avoid thin/duplicate-content penalties.
// `testimonialMatch` filters config/data/testimonials.js by role substring.
// `geo` is an approximate locality centroid (not the kitchen address) used
// only to make per-location structured data geographically relevant.
module.exports = [
  {
    slug: 'new-town',
    name: 'New Town',
    metaTitle: 'Meal Subscription in New Town, Kolkata | Thali & More',
    metaDescription:
      'Daily home-style meal subscriptions delivered across New Town, Kolkata, including Action Area I, II & III. PG-friendly plans, 7-day trial at ₹599.',
    heroTagline: 'Home-style meals for New Town’s PG residents, IT workers & young families',
    ogImage: '/images/og/og-new-town.svg',
    geo: { lat: 22.5809, lng: 88.4610 },
    intro: [
      'New Town has grown fast, and so has the number of people living here without a home kitchen to fall back on: PG residents near Action Area I and II, young professionals renting near the Action Area III office belt, and families who moved in before the local food scene caught up.',
      'We deliver from our Mahishbathan kitchen, which sits just outside New Town, so your meal spends less time in transit and more time actually fresh. Most New Town deliveries are among the first out on our route each day.',
      'Because we are delivering into some of the busiest under-construction stretches of Action Area II and III, our riders already know the shortcuts and building access points that a first-time delivery partner would still be figuring out. That familiarity is why New Town deliveries rarely slip outside the promised window, even when road work or traffic near Eco Park backs things up.',
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
      {
        question: 'Do you deliver to gated societies and high-rises in New Town?',
        answer: 'Yes. Most of our New Town subscribers live in gated apartment complexes across Action Area I, II and III. Just share your flat and tower details when you subscribe, and our delivery team coordinates with security desks directly so you do not have to come down every day.',
      },
      {
        question: 'What if I work from a New Town office some days and from home on others?',
        answer: 'Tell us your split in advance, or update it week to week, and we will adjust the delivery address accordingly at no extra cost, as long as both locations fall within our New Town delivery zone.',
      },
    ],
    testimonialMatch: 'New Town',
  },
  {
    slug: 'sector-v',
    name: 'Sector V',
    metaTitle: 'Meal Subscription in Sector V, Salt Lake | Thali & More',
    metaDescription:
      'Corporate-grade lunch and dinner subscriptions for offices and professionals in Sector V, Salt Lake. Trusted for corporate catering. 7-day trial at ₹599.',
    heroTagline: 'The lunch subscription built for Sector V’s IT parks and business towers',
    ogImage: '/images/og/og-sector-v.svg',
    geo: { lat: 22.5744, lng: 88.4331 },
    intro: [
      'Sector V is where our kitchen already has a track record: we have run corporate catering for offices here for years before opening subscriptions to individuals. If your building already orders from us for a team lunch, this is the same food, just for your desk every day.',
      'Because Sector V is a dense corporate district, our delivery here runs on a tight, repeatable schedule that matches office lunch breaks rather than a loose residential delivery window.',
      'Since we already run bulk corporate lunches for teams in Technopolis, DLF IT Park and the Bengal Intelligent Park belt, our Sector V operations are built around delivering to hundreds of desks inside the same 30-45 minute lunch window, not a handful of scattered home addresses. That same operational discipline is what keeps individual subscriptions on time here too.',
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
      {
        question: 'Can I subscribe for lunch only, since I only eat at my desk during the day?',
        answer: 'Yes, our Office Lunch plan is built for exactly this. Most Sector V subscribers take lunch only on weekdays, and you can add dinner or weekend meals later if your routine changes.',
      },
      {
        question: 'My office already orders team lunches from you. Can I still get an individual subscription?',
        answer: 'Yes, and it does not affect your team’s existing catering arrangement. Individual subscriptions are billed and delivered separately, even if your office building already has us catering a company event or daily bulk lunch.',
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
    ogImage: '/images/og/og-salt-lake.svg',
    geo: { lat: 22.5850, lng: 88.4159 },
    intro: [
      'Salt Lake (Bidhannagar) is one of Kolkata’s oldest planned townships, and a lot of our subscribers here are families and working couples who grew up eating a certain way and are not interested in switching to restaurant-style food every night.',
      'Our menu is built around that: home-style dal-sabzi-roti thalis rather than restaurant-heavy, oil-rich food, delivered across Salt Lake’s sectors on a consistent daily schedule.',
      'A number of our Salt Lake subscribers are senior citizens or people managing conditions like diabetes and high blood pressure, so oil and spice levels are adjustable on request rather than fixed at a restaurant-style default. If you need a lighter, less-oily thali, mention it once when you subscribe and every delivery follows that preference automatically.',
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
      {
        question: 'I live in an independent house, not a flat. Will your delivery partner be able to find it?',
        answer: 'Yes. Just share your house number and nearest cross-street when you subscribe, since Salt Lake’s sector-block-number addressing can confuse a first-time visitor, though our regular delivery partners already know the area well.',
      },
      {
        question: 'Can elderly parents living alone subscribe, in case they cannot always answer the door?',
        answer: 'Yes, this is a common request in Salt Lake. Let us know a preferred handover instruction, such as leaving the tiffin with a building caretaker or a specific time when someone will be home, and we will follow it consistently.',
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
    ogImage: '/images/og/og-rajarhat.svg',
    geo: { lat: 22.6203, lng: 88.4720 },
    intro: [
      'Rajarhat sits right next to our Mahishbathan kitchen, which is why it was one of the first areas we expanded into once corporate demand from nearby IT parks started spilling into individual requests from residents.',
      'A lot of Rajarhat is still newly built, which means many households and PGs here do not have a fully set-up kitchen yet, or simply prefer not to cook daily while settling in.',
      'Because Rajarhat is the closest delivery zone to our Mahishbathan kitchen, it is usually the very first stop on our route each day, for both lunch and dinner. If minimizing the time between our kitchen and your plate matters most to you, Rajarhat subscribers typically get their meals fresher and faster than almost anywhere else we deliver.',
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
      {
        question: 'My apartment complex is still being handed over, with construction nearby. Will that affect delivery?',
        answer: 'Generally no. We already deliver into several under-construction townships along Rajarhat Road, and our team will coordinate with your building’s temporary security or gate arrangements while construction is ongoing nearby.',
      },
      {
        question: 'I work at an IT park in Rajarhat but live in New Town. Can you deliver to both?',
        answer: 'Yes. Since Rajarhat and New Town are adjacent on our route, we can deliver lunch to your Rajarhat office and dinner to your New Town home on the same subscription, at no extra charge.',
      },
    ],
    testimonialMatch: 'Rajarhat',
  },
];
