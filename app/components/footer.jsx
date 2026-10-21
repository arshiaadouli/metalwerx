import { cacheLife } from "next/cache";
import { SiteFooter } from "@/components/site/site-footer";

// Only pages that exist: no links to /prices or /terms until they're built,
// since a link that redirects is flagged by SEO audits. Every page carries the
// header too, so no link here repeats a header link's text or the page's own
// CTAs ("Get a quote"): each link's text is unique on the page, as SEO audits
// check.
const footer = {
  logo: {
    src: "/logo.webp",
    alt: "Metal Werx Scrap Metal Recycling",
    // Display size; logo.webp is 576×120 (3× this), the same 4.8:1 ratio,
    // served as is (see the header's logo in navbar.jsx).
    width: 192,
    height: 40,
  },
  description:
    "Scrap metal recycling for homes, farms and businesses. We buy ferrous and non-ferrous metals, car bodies and batteries.",
  sections: [
    {
      title: "What we buy",
      links: [
        { name: "Ferrous metals", href: "/what-we-buy#ferrous" },
        { name: "Non-ferrous metals", href: "/what-we-buy#non-ferrous" },
        { name: "Car bodies", href: "/what-we-buy/unwanted-cars" },
        { name: "Batteries", href: "/what-we-buy/lead" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Scrap bin hire", href: "/services/bin-hire" },
        { name: "Scrap collection", href: "/services/pickup-and-collection" },
        { name: "Business recycling", href: "/services/commercial-recycling" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Metal Werx", href: "/about" },
        { name: "Our blog", href: "/blogs" },
        { name: "Contact the yard", href: "/contact-us" },
      ],
    },
    {
      title: "Visit us",
      links: [
        { name: "Opening hours", href: "/contact-us#hours" },
        { name: "Find us", href: "/contact-us#location" },
        { name: "Request a quote", href: "/contact-us" },
      ],
    },
  ],
  legalLinks: [{ name: "Privacy Policy", href: "/privacy-policy" }],
};

// Cache Components fails the prerender on a bare new Date(), so the year is
// cached and refreshed daily.
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default function Footer() {
  return (
    <SiteFooter
      {...footer}
      copyright={
        <>
          © <CurrentYear /> Metal Werx Scrap Metal Recycling. All rights reserved.
        </>
      }
    />
  );
}
