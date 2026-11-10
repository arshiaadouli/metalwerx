// The pages a blog post links to where it first mentions them: a material's
// page for the metals the yard buys, and a service's for scrap bins and
// pickups. The patterns are matched against the post's text, most specific
// first, so "aluminium wheels" goes to the wheels page and a bare "aluminium"
// to the mixed aluminium one. A post links each page once, and at most
// MAX_LINKS pages, so the links read as pointers rather than ads.
// shortcut: the slugs are written here rather than read from the CMS, like the
// redirects in next.config.mjs; a material renamed there needs its line changed.
const MENTIONS = [
  [/\b(?:aluminium|alloy) (?:wheels?|rims?)\b/i, "/what-we-buy/aluminium-wheels"],
  [/\bstainless(?: steel)?\b/i, "/what-we-buy/stainless-steel"],
  [/\belectric motors?\b/i, "/what-we-buy/electric-motors"],
  [/\bair[- ]?con(?:ditioner)?s?\b/i, "/what-we-buy/ac-units"],
  [/\bcompressors?\b/i, "/what-we-buy/black-compressors"],
  [/\bcopper\b/i, "/what-we-buy/copper"],
  [/\bbrass\b/i, "/what-we-buy/brass"],
  [/\baluminium\b/i, "/what-we-buy/alloy-mix"],
  [/\bsteel\b/i, "/what-we-buy/hms-steel"],
  [/\bengines?\b/i, "/what-we-buy/white-engines"],
  [/\bscrap(?: metal)? bins?\b/i, "/services/bin-hire"],
  [/\bpick-?ups?\b/i, "/services/pickup-and-collection"],
];

export const MAX_LINKS = 3;

// Splits each paragraph into strings and { text, href } links, linking the
// first mention of up to `max` pages across the whole post.
export function linkMentions(paragraphs, max = MAX_LINKS) {
  const pending = new Map(MENTIONS);
  let linked = 0;
  return paragraphs.map((paragraph) => {
    const parts = [];
    let rest = paragraph;
    while (linked < max) {
      // The earliest mention of a page not yet linked; on a tie, the more
      // specific pattern, which comes first.
      let first = null;
      for (const [pattern, href] of pending) {
        const match = pattern.exec(rest);
        if (match && (!first || match.index < first.index)) {
          first = { index: match.index, text: match[0], href, pattern };
        }
      }
      if (!first) break;
      parts.push(rest.slice(0, first.index), { text: first.text, href: first.href });
      rest = rest.slice(first.index + first.text.length);
      pending.delete(first.pattern);
      linked += 1;
    }
    parts.push(rest);
    return parts.filter((part) => part !== "");
  });
}
