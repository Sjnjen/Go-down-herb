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
  'm-ndaaweeh': 100  // Ndaa Weeh T-Shirt (3 types)
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
