import { cacheLife } from "next/cache";
import { Footer2 } from "@/components/ui/shadcnblocks-com-footer2";

// As in the navbar, only / and /blogs exist so far; the other links are
// placeholders for pages still to be built.
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
        { name: "Car Bodies", href: "/what-we-buy#cars" },
        { name: "Batteries", href: "/what-we-buy#batteries" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Bin Hire", href: "/services#bin-hire" },
        { name: "Pickup & Collection", href: "/services#collection" },
        { name: "Commercial Recycling", href: "/services#commercial" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blogs" },
        { name: "Scrap Prices", href: "/prices" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Visit Us",
      links: [
        { name: "Opening Hours", href: "/contact#hours" },
        { name: "Find Us", href: "/contact#location" },
        { name: "Get a Quote", href: "/contact" },
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
