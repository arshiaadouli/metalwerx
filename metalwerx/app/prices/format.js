// How a price from getPrices (see lib/cms.js) reads on /prices, on the
// material cards and in each material page's header.

export const units = { kg: "per kg", tonne: "per tonne", each: "each" };

// "$10.50", "$3", or null with no price. Cents show only when there are some.
export function priceAmount({ price }) {
  if (price == null) return null;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
}

// "29 October 2026", the day a price was set (a Date or an ISO date), at the
// yard.
export function priceDate(date) {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Australia/Melbourne",
  });
}

// "Average $14,000 per tonne" for a card's badge, or null with no price. The
// prices in the CMS are averages, so everywhere they show says so.
export function priceBadge(price) {
  const amount = price && priceAmount(price);
  return amount ? `Average ${amount} ${units[price.unit]}` : null;
}
