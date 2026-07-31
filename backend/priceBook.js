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
  'm-black': 100,
  'm-white': 100,
  'm-leaf': 100
};

// Flat delivery fees. "bolt" is intentionally left out - that method
// is distance-based and is routed to WhatsApp for a manual quote instead
// of being charged automatically at checkout.
const DELIVERY_RATES = {
  courierguy: 145,
  postnet: 110,
  pickup:0
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

module.exports = { getHerbPrice, getMerchPrice, getDeliveryFee, DELIVERY_RATES };

