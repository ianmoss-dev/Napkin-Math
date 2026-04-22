export const SUBSCRIPTIONS = [
  // Streaming Video
  { id: 'netflix_std',    name: 'Netflix (Standard)',  category: 'Streaming Video',        price: 17.99 },
  { id: 'netflix_ads',    name: 'Netflix (with ads)',  category: 'Streaming Video',        price: 7.99 },
  { id: 'amazon_prime',   name: 'Amazon Prime',        category: 'Streaming Video',        price: 14.99 },
  { id: 'disney',         name: 'Disney+',             category: 'Streaming Video',        price: 15.99 },
  { id: 'hulu',           name: 'Hulu',                category: 'Streaming Video',        price: 18.99 },
  { id: 'max',            name: 'Max (HBO)',            category: 'Streaming Video',        price: 16.99 },
  { id: 'appletv',        name: 'Apple TV+',           category: 'Streaming Video',        price: 12.99 },
  { id: 'paramount',      name: 'Paramount+',          category: 'Streaming Video',        price: 10.99 },
  { id: 'peacock',        name: 'Peacock',             category: 'Streaming Video',        price: 10.99 },
  { id: 'espn_fox',       name: 'ESPN/Fox One',        category: 'Streaming Video',        price: 40.00 },
  { id: 'youtube_tv',     name: 'YouTube TV',          category: 'Streaming Video',        price: 72.99 },

  // Music & Audio
  { id: 'spotify',        name: 'Spotify',             category: 'Music & Audio',          price: 11.99 },
  { id: 'apple_music',    name: 'Apple Music',         category: 'Music & Audio',          price: 10.99 },
  { id: 'amazon_music',   name: 'Amazon Music',        category: 'Music & Audio',          price: 13.00 },
  { id: 'audible',        name: 'Audible',             category: 'Music & Audio',          price: 14.95 },
  { id: 'siriusxm',       name: 'SiriusXM',            category: 'Music & Audio',          price: 9.99 },

  // Fitness & Wellness
  { id: 'gym',            name: 'Gym membership',      category: 'Fitness & Wellness',     price: 40.00 },
  { id: 'peloton',        name: 'Peloton',             category: 'Fitness & Wellness',     price: 44.00 },
  { id: 'noom',           name: 'Noom / WW',           category: 'Fitness & Wellness',     price: 16.00 },
  { id: 'calm',           name: 'Calm / Headspace',    category: 'Fitness & Wellness',     price: 12.99 },

  // Shopping & Convenience
  { id: 'costco',         name: 'Costco',              category: 'Shopping & Convenience', price: 6.25 },
  { id: 'walmart_plus',   name: 'Walmart+',            category: 'Shopping & Convenience', price: 12.95 },
  { id: 'instacart',      name: 'Instacart+',          category: 'Shopping & Convenience', price: 9.99 },
  { id: 'dashpass',       name: 'DashPass',            category: 'Shopping & Convenience', price: 9.99 },
  { id: 'uber_one',       name: 'Uber One',            category: 'Shopping & Convenience', price: 9.99 },

  // Productivity & Tech
  { id: 'icloud',         name: 'iCloud+',             category: 'Productivity & Tech',    price: 9.99 },
  { id: 'google_one',     name: 'Google One',          category: 'Productivity & Tech',    price: 2.99 },
  { id: 'ms365',          name: 'Microsoft 365',       category: 'Productivity & Tech',    price: 9.99 },
  { id: 'adobe',          name: 'Adobe CC',            category: 'Productivity & Tech',    price: 59.99 },
  { id: 'dropbox',        name: 'Dropbox',             category: 'Productivity & Tech',    price: 9.99 },
  { id: '1password',      name: '1Password',           category: 'Productivity & Tech',    price: 3.99 },
  { id: 'chatgpt',        name: 'ChatGPT Plus',        category: 'Productivity & Tech',    price: 20.00 },
  { id: 'claude',         name: 'Claude Pro',          category: 'Productivity & Tech',    price: 20.00 },
  { id: 'gemini',         name: 'Gemini Advanced',     category: 'Productivity & Tech',    price: 19.99 },
  { id: 'vpn',            name: 'VPN',                 category: 'Productivity & Tech',    price: 5.00 },

  // Credit Card Annual Fees
  { id: 'cc_chase_pref',  name: 'Chase Sapphire Preferred ($95/yr)',  category: 'Credit Card Fees', price: 7.92 },
  { id: 'cc_chase_res',   name: 'Chase Sapphire Reserve ($550/yr)',   category: 'Credit Card Fees', price: 45.83 },
  { id: 'cc_amex_gold',   name: 'Amex Gold ($325/yr)',                category: 'Credit Card Fees', price: 27.08 },
  { id: 'cc_amex_plat',   name: 'Amex Platinum ($695/yr)',            category: 'Credit Card Fees', price: 57.92 },
  { id: 'cc_other',       name: 'Other card fee',                     category: 'Credit Card Fees', price: 0 },

  // Gaming
  { id: 'xbox',           name: 'Xbox Game Pass',      category: 'Gaming',                 price: 14.99 },
  { id: 'psplus',         name: 'PlayStation Plus',    category: 'Gaming',                 price: 17.99 },
  { id: 'nintendo',       name: 'Nintendo Online',     category: 'Gaming',                 price: 3.33 },

  // News & Reading
  { id: 'nyt',            name: 'New York Times',      category: 'News & Reading',         price: 25.00 },
  { id: 'kindle_unltd',   name: 'Kindle Unlimited',   category: 'News & Reading',         price: 11.99 },

  // Other
  { id: 'dating',         name: 'Dating apps',         category: 'Other',                  price: 30.00 },
  { id: 'linkedin',       name: 'LinkedIn Premium',    category: 'Other',                  price: 39.99 },
  { id: 'duolingo',       name: 'Duolingo Plus',       category: 'Other',                  price: 6.99 },
];

export const CATEGORIES = [...new Set(SUBSCRIPTIONS.map(s => s.category))];
