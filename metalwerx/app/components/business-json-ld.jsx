import { suburbs } from "@/app/areas/suburbs";
import { business, telHref } from "@/lib/business";
import JsonLd from "./json-ld";
import { socialLinks } from "./social-links";

// Describes the yard to search engines as a schema.org RecyclingCenter (a kind
// of LocalBusiness), on every page from the root layout. Other markup refers to
// it by its @id. Check it with https://validator.schema.org/ or Google's Rich
// Results Test. The hours, map position and dealer registration are only
// included once they're filled in lib/business.js, and the image is the logo
// until there's a photo of the yard there. The area served is the suburbs
// with a page under /areas.
const { address, hours, geo, dealerRegistration } = business;

export const businessId = `${business.url}/#business`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RecyclingCenter",
  "@id": businessId,
  name: business.name,
  alternateName: business.fullName,
  legalName: business.legalName,
  taxID: business.abn,
  identifier: [
    { "@type": "PropertyValue", propertyID: "ABN", value: business.abn },
    { "@type": "PropertyValue", propertyID: "ACN", value: business.acn },
    ...(dealerRegistration
      ? [
          {
            "@type": "PropertyValue",
            propertyID: "Consumer Affairs Victoria second-hand dealer registration",
            value: dealerRegistration,
          },
        ]
      : []),
  ],
  foundingDate: business.registeredSince,
  url: business.url,
  logo: `${business.url}/logo.png`,
  image: `${business.url}${business.photo ?? "/logo.png"}`,
  description:
    "Scrap metal recycling yard in Hallam, in Melbourne's south-east, for homes, farms and businesses. Metal Werx buys ferrous and non-ferrous metals, and pays by bank transfer the same day.",
  telephone: telHref.slice("tel:".length),
  email: business.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: address.street,
    addressLocality: address.locality,
    addressRegion: address.region,
    postalCode: address.postcode,
    addressCountry: address.country,
  },
  ...(geo && { geo: { "@type": "GeoCoordinates", ...geo } }),
  ...(hours.length > 0 && {
    openingHoursSpecification: hours.map(({ days, opens, closes }) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days,
      opens,
      closes,
    })),
  }),
  areaServed: suburbs.map(({ name }) => name),
  hasMap: business.mapsUrl,
  sameAs: socialLinks.map((link) => link.href),
};

export default function BusinessJsonLd() {
  return <JsonLd data={jsonLd} />;
}
