// This file is the SINGLE SOURCE OF TRUTH for prices on the server.
// The frontend also has its own copy (for display), but the backend
// NEVER trusts prices sent from the browser - it looks them up here.
// If you change a price on the website, change it here too.
const HERB_PRICES = {
  gdh: 150, // Go Down Herb (Ndaa)
  ugh: 200, // Underground Herb (Ndaa)
  sil: 250, // Silent Herb
  stc: 50,  // Running Stomach
  mps: 50,  // Go Down Mpesu
  oil: 200  // Anointed Go Down Oil
};

const MERCH_PRICES = {
  'm-clans':    100, // Go Down Clans (1 type)
  'm-black-1':  100, // Go Down Merchandise Black T-Shirt - Design 1 (2 types)
  'm-black-2':  100, // Go Down Merchandise Black T-Shirt - Design 2 (2 types)
  'm-white-1':  100, // Go Down Merchandise White T-Shirt - Design 1 (2 types)
  'm-white-2':  100, // Go Down Merchandise White T-Shirt - Design 2 (2 types)
  'm-godown':   100, // Go Down T-Shirt (1 type)
  'm-hands':    100, // Go Down T-Shirt Hands (1 type)
  'm-ikho':     100, // Ikho Verify (1 type)
  'm-itsaherb': 100, // It's A Herb T-Shirt (3 types)
  'm-ndaaweeh': 100, // Ndaa Weeh T-Shirt (3 types)

  // NEW: Hoodies & tees (added — see /mnt/user-data/outputs delivery notes)
  'm-hoodie-black-vision': 350, // Go Down Hoodie Black Vision (3 designs)
  'm-hoodie-white-vision': 350, // Go Down Hoodie White Vision (3 designs)
  'm-tee-white-vision':    250, // New High Quality Tee White Vision (1 design)
  'm-tee-black-vision':    250, // New High Quality Tee Black Vision (2 designs)

  // NEW: Hats (colour-only selection, no size/design types)
  'h-godown-cap': 100, // Go Down Cap (Green / Black / Pink / Blue)
  'h-ukho-cap':   100, // Ukhou Verify Cap (Green / Black / Pink / Blue)

  // NEW: Cups (colour-only selection, no size/design types)
  'c-stanley': 150, // Go Down Herbs Stanley Cup (White / Green / Purple)
  'c-flax':    150, // Flax Cup (Silver / Black / Gold / Blue / Red)

  // NEW: Heritage Specials (01 Sept - 30 Sept) — bundles of products already
  // sold individually on the site, priced as a single line item
  'special-1': 300, // Heritage Special No. 1 — 1 Underground Herb + 1+ Go Down Herbs + Running Stomach Cleanser
  'special-2': 300, // Heritage Special No. 2 — 2 Underground Herbs
  'special-3': 250  // Heritage Special No. 3 — 1 Go Down Herb + 1 Underground Herb
};

// Flat delivery fees. "bolt" is intentionally left out - that method
// is distance-based and is routed to WhatsApp for a manual quote instead
// of being charged automatically at checkout.
const DELIVERY_RATES = {
  courierguy: 145,
  postnet: 110,
  pudo: 80
};

function getHerbPrice(id) {
  return HERB_PRICES[id] ?? null;
}

function getMerchPrice(id) {
  return MERCH_PRICES[id] ?? null;
}

function getDeliveryFee(method) {
  return DELIVERY_RATES[method] ?? null;
}

module.exports = {
  getHerbPrice,
  getMerchPrice,
  getDeliveryFee,
  DELIVERY_RATES
};
