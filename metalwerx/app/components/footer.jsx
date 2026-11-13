import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { cacheLife } from "next/cache";
import {
  abnLookupUrl,
  business,
  formattedAddress,
  openingHours,
  telHref,
} from "@/lib/business";
import { socialLinks } from "./social-links";

// The site footer, from Footer2 on shadcnblocks.com: the logo, a line about the
// yard, its address, phone and email and its social links, four columns of
// links, then the copyright line and the legal links. The yard's details are
// in lib/business.js, as on /contact-us and in the structured data, so every
// page names its address, phone and email. As in the navbar, the Opening Hours
// link waits for the hours to be filled in there.

const contactLinks = [
  {
    icon: <MapPin />,
    label: "Visit the yard",
    value: formattedAddress,
    href: business.mapsUrl,
    external: true,
  },
  { icon: <Phone />, label: "Call us", value: business.phone.display, href: telHref },
  { icon: <Mail />, label: "Email us", value: business.email, href: `mailto:${business.email}` },
];

const sections = [
  {
    title: "What We Buy",
    links: [
      { name: "Ferrous Metals", href: "/what-we-buy#ferrous" },
      { name: "Non-Ferrous Metals", href: "/what-we-buy#non-ferrous" },
      { name: "Air Conditioners", href: "/what-we-buy/ac-units" },
      { name: "Aluminium Engines", href: "/what-we-buy/white-engines" },
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
    ],
  },
  {
    title: "Visit Us",
    links: [
      ...(openingHours.length > 0 ? [{ name: "Opening Hours", href: "/contact-us#hours" }] : []),
      { name: "Find Us", href: "/contact-us#location" },
      { name: "Areas We Cover", href: "/areas" },
      { name: "Get a Quote", href: "/contact-us" },
    ],
  },
];

const legalLinks = [
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
];

// Cache Components fails the prerender on a bare new Date(), so the year is
// cached and refreshed daily.
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default function Footer() {
  return (
    <footer className="border-t py-16 font-montserrat">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          <div className="col-span-2 mb-8 lg:mb-0">
            <Link href="/" title={business.fullName} className="inline-flex items-center">
              {/* Display size; logo.png is 4726×985, the same 4.8:1 ratio. */}
              <Image
                src="/logo.png"
                alt={business.fullName}
                title={business.fullName}
                width={192}
                height={40}
                className="h-10 w-auto light:brightness-0"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm font-medium text-muted-foreground">
              Scrap metal recycling in Hallam, in Melbourne&apos;s south-east, for homes, farms
              and businesses. We buy ferrous and non-ferrous metals.
            </p>
            <address className="mt-6 not-italic">
              <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                {contactLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      title={link.external ? `${link.label} (opens in a new tab)` : link.label}
                      {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                      className="inline-flex items-start gap-3 transition-colors hover:text-foreground focus-visible:text-foreground [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0"
                    >
                      {link.icon}
                      <span>
                        <span className="sr-only">{link.label}: </span>
                        {link.value}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </address>
            <ul className="mt-6 flex gap-3">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    title={`${link.name} (opens in a new tab)`}
                    className="grid size-10 place-items-center rounded-lg border text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground [&_svg]:size-5"
                  >
                    {link.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              {/* h2, not h3: the footer follows pages whose only heading is the h1. */}
              <h2 className="mb-4 font-oswald text-sm font-semibold uppercase tracking-[0.15em]">
                {section.title}
              </h2>
              <ul className="space-y-4 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.name} className="font-medium">
                    <Link
                      href={link.href}
                      title={link.name}
                      className="transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t pt-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center">
          <p>
            © <CurrentYear /> {business.fullName}. All rights reserved.
            <br />
            {business.legalName} · ABN{" "}
            <a
              href={abnLookupUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View on ABN Lookup (opens in a new tab)"
              className="underline transition-colors hover:text-foreground"
            >
              {business.abn}
            </a>
            {business.dealerRegistration && (
              <> · Second-hand dealer registration {business.dealerRegistration}</>
            )}
          </p>
          <ul className="flex gap-4">
            {legalLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  title={link.name}
                  className="underline transition-colors hover:text-foreground"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
