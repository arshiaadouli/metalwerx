import { business } from "./business";

// The Open Graph fields every page shares, for link previews on social media
// and in chat apps. The root layout sets them; a page that sets openGraph
// itself replaces the layout's whole object (Next merges metadata shallowly),
// so it spreads these in first and overrides what it needs, such as images.
// Pages without their own og:title and og:description get their title and
// description.
export const openGraph = {
  siteName: business.fullName,
  locale: "en_AU",
  type: "website",
  // Each page's own URL, resolved against metadataBase like the canonical.
  url: "./",
  // The home page hero's photo (see business-json-ld.jsx). Swap in a photo of
  // the real yard once there is one.
  images: [
    {
      url: "/images/unsplash/photo-1722695694560-f452b0919d3a.jpg",
      width: 2400,
      height: 1600,
      alt: "An excavator's grapple lifting a bundle of scrap metal in a scrap yard",
    },
  ],
};
