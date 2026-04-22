export const SUBSCRIPTIONS = [
  // Streaming Video
  { id: 'netflix_std',    name: 'Netflix (Standard)',  category: 'Streaming Video',        price: 19.99 },
  { id: 'netflix_ads',    name: 'Netflix (with ads)',  category: 'Streaming Video',        price: 8.99 },
  { id: 'amazon_prime',   name: 'Amazon Prime',        category: 'Streaming Video',        price: 14.99 },
  { id: 'disney',         name: 'Disney+ Premium',     category: 'Streaming Video',        price: 18.99 },
  { id: 'hulu',           name: 'Hulu Premium',        category: 'Streaming Video',        price: 18.99 },
  { id: 'max',            name: 'Max Standard',        category: 'Streaming Video',        price: 16.99 },
  { id: 'appletv',        name: 'Apple TV+',           category: 'Streaming Video',        price: 12.99 },
  { id: 'paramount',      name: 'Paramount+ Essential', category: 'Streaming Video',       price: 8.99 },
  { id: 'peacock',        name: 'Peacock Premium',     category: 'Streaming Video',        price: 10.99 },
  { id: 'espn_fox',       name: 'ESPN Unlimited',      category: 'Streaming Video',        price: 29.99 },
  { id: 'youtube_tv',     name: 'YouTube TV',          category: 'Streaming Video',        price: 82.99 },

  // Music & Audio
  { id: 'spotify',        name: 'Spotify Premium',     category: 'Music & Audio',          price: 12.99 },
  { id: 'apple_music',    name: 'Apple Music',         category: 'Music & Audio',          price: 10.99 },
  { id: 'amazon_music',   name: 'Amazon Music Unlimited', category: 'Music & Audio',       price: 11.99 },
  { id: 'audible',        name: 'Audible',             category: 'Music & Audio',          price: 14.95 },
  { id: 'siriusxm',       name: 'SiriusXM',            category: 'Music & Audio',          price: 11.99 },

  // Fitness & Wellness
  { id: 'gym',            name: 'Gym membership',      category: 'Fitness & Wellness',     price: 40.00 },
  { id: 'peloton',        name: 'Peloton',             category: 'Fitness & Wellness',     price: 44.00 },
  { id: 'noom',           name: 'Noom / WW',           category: 'Fitness & Wellness',     price: 16.00 },
  { id: 'calm',           name: 'Calm / Headspace',    category: 'Fitness & Wellness',     price: 12.99 },

  // Shopping & Convenience
  { id: 'costco',         name: 'Costco Gold Star',    category: 'Shopping & Convenience', price: 5.42 },
  { id: 'walmart_plus',   name: 'Walmart+',            category: 'Shopping & Convenience', price: 12.95 },
  { id: 'instacart',      name: 'Instacart+',          category: 'Shopping & Convenience', price: 9.99 },
  { id: 'dashpass',       name: 'DashPass',            category: 'Shopping & Convenience', price: 9.99 },
  { id: 'uber_one',       name: 'Uber One',            category: 'Shopping & Convenience', price: 9.99 },

  // Productivity & Tech
  { id: 'icloud',         name: 'iCloud+',             category: 'Productivity & Tech',    price: 9.99 },
  { id: 'google_one',     name: 'Google One',          category: 'Productivity & Tech',    price: 2.99 },
  { id: 'ms365',          name: 'Microsoft 365',       category: 'Productivity & Tech',    price: 9.99 },
  { id: 'adobe',          name: 'Adobe Creative Cloud', category: 'Productivity & Tech',   price: 69.99 },
  { id: 'dropbox',        name: 'Dropbox',             category: 'Productivity & Tech',    price: 9.99 },
  { id: '1password',      name: '1Password',           category: 'Productivity & Tech',    price: 3.99 },
  { id: 'chatgpt',        name: 'ChatGPT Plus',        category: 'Productivity & Tech',    price: 20.00 },
  { id: 'claude',         name: 'Claude Pro',          category: 'Productivity & Tech',    price: 20.00 },
  { id: 'gemini',         name: 'Google AI Pro',       category: 'Productivity & Tech',    price: 19.99 },
  { id: 'vpn',            name: 'VPN',                 category: 'Productivity & Tech',    price: 5.00 },

  // Credit Card Annual Fees
  { id: 'cc_chase_pref',  name: 'Chase Sapphire Preferred ($95/yr)',  category: 'Credit Card Fees', price: 7.92 },
  { id: 'cc_chase_res',   name: 'Chase Sapphire Reserve ($795/yr)',   category: 'Credit Card Fees', price: 66.25 },
  { id: 'cc_amex_gold',   name: 'Amex Gold ($325/yr)',                category: 'Credit Card Fees', price: 27.08 },
  { id: 'cc_amex_plat',   name: 'Amex Platinum ($895/yr)',            category: 'Credit Card Fees', price: 74.58 },
  { id: 'cc_other',       name: 'Other card fee',                     category: 'Credit Card Fees', price: 0 },

  // Gaming
  { id: 'xbox',           name: 'Xbox Game Pass',      category: 'Gaming',                 price: 14.99 },
  { id: 'psplus',         name: 'PlayStation Plus',    category: 'Gaming',                 price: 17.99 },
  { id: 'nintendo',       name: 'Nintendo Switch Online', category: 'Gaming',              price: 1.67 },

  // News & Reading
  { id: 'nyt',            name: 'New York Times',      category: 'News & Reading',         price: 25.00 },
  { id: 'kindle_unltd',   name: 'Kindle Unlimited',   category: 'News & Reading',         price: 11.99 },

  // Other
  { id: 'dating',         name: 'Dating apps',         category: 'Other',                  price: 30.00 },
  { id: 'linkedin',       name: 'LinkedIn Premium',    category: 'Other',                  price: 39.99 },
  { id: 'duolingo',       name: 'Duolingo Plus',       category: 'Other',                  price: 6.99 },
];

export const CATEGORIES = [...new Set(SUBSCRIPTIONS.map(s => s.category))];
