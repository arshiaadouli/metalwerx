import { YARD } from "@/lib/yard";

// The site's address, for canonical links, share previews, the sitemap and
// robots.txt. SITE_URL sets it. Without it, on Vercel it's the production
// domain (the custom domain once one is added to the project), so previews
// point search engines at the live pages too. Anywhere else, the dev server
// included, it's the live site, so a build can never send crawlers to
// localhost.
export const SITE_URL =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://metawerx.vercel.app");

// "An excavator working on a pile of scrap metal", the About page's photo,
// cropped to the 1200×630 that link previews show:
// https://unsplash.com/photos/an-excavator-working-on-a-pile-of-scrap-metal-lp6CBQSr1Ek
const DEFAULT_IMAGE = {
  url: "https://images.unsplash.com/photo-1722695694560-f452b0919d3a?auto=format&fit=crop&q=70&w=1200&h=630",
  width: 1200,
  height: 630,
  alt: "An excavator's grapple lifting a bundle of scrap metal in a scrap yard",
};

// What every page's share preview has in common. The root layout sets it too,
// for pages that don't call pageMetadata (the 404).
export const OPEN_GRAPH = {
  siteName: "Metal Werx",
  locale: "en_AU",
  type: "website",
  images: [DEFAULT_IMAGE],
};

// A page's title and description, its canonical link (path, such as
// "/contact-us"), and its preview when it's shared. Next copies the title, with
// " | Metal Werx", and the description into the preview and the X card. image
// is { url, width, height, alt }, else the excavator photo; openGraph adds to
// the preview, such as a post's type and date.
export function pageMetadata({ path, title, description, image, openGraph }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...OPEN_GRAPH,
      url: path,
      ...(image && { images: [image] }),
      ...openGraph,
    },
  };
}

// The yard as a local business, for the JSON-LD on the home and contact
// pages: what search engines show in a map listing. RecyclingCenter is
// schema.org's LocalBusiness type for a recycling yard. The image is the logo,
// as every photo on the site is stock and must not pass as the yard. Opening
// hours go in once YARD.hours is filled in.
export const LOCAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": "RecyclingCenter",
  "@id": `${SITE_URL}/#business`,
  name: YARD.name,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  telephone: YARD.phoneHref.replace("tel:", ""),
  email: YARD.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: YARD.street,
    addressLocality: YARD.suburb,
    addressRegion: YARD.state,
    postalCode: YARD.postcode,
    addressCountry: "AU",
  },
  geo: { "@type": "GeoCoordinates", ...YARD.geo },
  hasMap: YARD.mapsHref,
  areaServed: "Melbourne's south-east",
  sameAs: [YARD.facebookHref, YARD.mapsHref].filter((href) => href.startsWith("http")),
};
