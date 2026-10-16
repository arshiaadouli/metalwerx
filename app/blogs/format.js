// Blog dates are stored at midnight UTC, so format them in UTC to keep the
// day from shifting in time zones behind UTC.
export function formatDate(date, dateStyle = "long") {
  return new Intl.DateTimeFormat("en", { dateStyle, timeZone: "UTC" }).format(date);
}

// "YYYY-MM-DD", for <time dateTime>.
export function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

// A one-line summary for the meta description: whitespace collapsed, and cut
// at a word boundary so search results don't show half a word.
export function excerpt(text, maxLength = 155) {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= maxLength) return flat;
  const cut = flat.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const words = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return `${words.replace(/[\s,.;:!?–—-]+$/, "")}…`;
}

// Reading time at about 200 words a minute, never less than 1 minute.
export function readingStats(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return { words, minutes: Math.max(1, Math.round(words / 200)) };
}
