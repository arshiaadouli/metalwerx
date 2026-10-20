import { cacheLife } from "next/cache";
import { Footer2 } from "@/components/ui/shadcnblocks-com-footer2";

// As in the navbar, /prices and /terms are placeholders for pages still to be
// built, as are the #hours and #location sections of /contact-us.
const footer = {
  logo: {
    url: "/",
    src: "/logo.png",
    alt: "Metal Werx Scrap Metal Recycling",
    // Display size; logo.png is 4726×985, the same 4.8:1 ratio.
    width: 192,
    height: 40,
  },
  description:
    "Scrap metal recycling for homes, farms and businesses. We buy ferrous and non-ferrous metals, car bodies and batteries.",
  sections: [
    {
      title: "What We Buy",
      links: [
        { name: "Ferrous Metals", href: "/what-we-buy#ferrous" },
        { name: "Non-Ferrous Metals", href: "/what-we-buy#non-ferrous" },
        { name: "Car Bodies", href: "/what-we-buy/unwanted-cars" },
        { name: "Batteries", href: "/what-we-buy/lead" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Bin Hire", href: "/services/bin-hire" },
        { name: "Pickup & Collection", href: "/services/pickup-and-collection" },
        { name: "Commercial Recycling", href: "/services/commercial-recycling" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blogs" },
        { name: "Scrap Prices", href: "/prices" },
        { name: "Contact", href: "/contact-us" },
      ],
    },
    {
      title: "Visit Us",
      links: [
        { name: "Opening Hours", href: "/contact-us#hours" },
        { name: "Find Us", href: "/contact-us#location" },
        { name: "Get a Quote", href: "/contact-us" },
      ],
    },
  ],
  legalLinks: [
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy-policy" },
  ],
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
    <Footer2
      {...footer}
      copyright={
        <>
          © <CurrentYear /> Metal Werx Scrap Metal Recycling. All rights reserved.
        </>
      }
    />
  );
}
