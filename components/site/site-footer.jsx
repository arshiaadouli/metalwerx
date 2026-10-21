import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { FacebookIcon, GoogleMapsIcon } from "@/components/site/brand-icons";
import { YARD } from "@/lib/yard";

// The yard's pages elsewhere, as icons under its contact details.
const SOCIAL = [
  { name: "Facebook", href: YARD.facebookHref, Icon: FacebookIcon },
  { name: "Google Maps", href: YARD.mapsHref, Icon: GoogleMapsIcon },
];

// The site footer, on the rack field. Props:
//   logo        { src, alt, width, height }; not a link, as the header's logo
//               already links home under the same alt text
//   description string
//   sections    [{ title, links: [{ name, href }] }]; four fit beside the yard's details
//   legalLinks  [{ name, href }]
//   copyright   node
export function SiteFooter({ logo, description, sections = [], legalLinks = [], copyright }) {
  return (
    <footer className="on-rack bg-rack text-rack-ink">
      <div className="mx-auto w-full max-w-[82.5rem] px-5 pt-16 pb-10 sm:px-8 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              unoptimized
              className="h-10 w-auto"
            />
            {description && <p className="mt-5 max-w-[42ch] text-[0.9375rem] text-rack-ink-soft">{description}</p>}
            {/* The hidden labels say what each icon shows. They also keep the
                number and email from repeating the header's and the contact
                page's link text word for word. <address> marks them as the
                business's contact details for local SEO checks. */}
            <address className="not-italic">
              <ul className="mt-8 grid gap-3 text-[0.9375rem]">
                <li>
                  <a
                    href={YARD.phoneHref}
                    className="tabular inline-flex items-center gap-3 text-2xl font-bold text-rack-ink [font-stretch:104%] hover:underline"
                  >
                    <Phone aria-hidden="true" className="size-5 text-rack-ink-soft" />
                    <span className="sr-only">Phone: </span>
                    {YARD.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={YARD.emailHref}
                    className="inline-flex items-center gap-3 text-rack-ink hover:underline"
                  >
                    <Mail aria-hidden="true" className="size-[1.125rem] text-rack-ink-soft" />
                    <span className="sr-only">Email: </span>
                    {YARD.email}
                  </a>
                </li>
                <li>
                  <a
                    href={YARD.mapsHref}
                    className="inline-flex items-center gap-3 text-rack-ink hover:underline"
                  >
                    <MapPin aria-hidden="true" className="size-[1.125rem] text-rack-ink-soft" />
                    <span className="sr-only">Address: </span>
                    {YARD.address}
                  </a>
                </li>
              </ul>
            </address>
            {/* The hidden names are the links' text, which no other link on a
                page repeats. */}
            <ul className="mt-6 flex gap-2">
              {SOCIAL.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    title={`Metal Werx on ${name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-11 place-items-center rounded-[2px] border border-rack-rule text-rack-ink-soft transition-colors hover:border-rack-ink-soft hover:text-rack-ink"
                  >
                    <Icon aria-hidden="true" className="size-5" />
                    <span className="sr-only">{name} (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {sections.slice(0, 4).map((section) => (
              <div key={section.title}>
                {/* h2, not h3: the footer follows pages whose only heading is the h1. */}
                <h2 className="text-[0.9375rem] font-bold text-rack-ink">{section.title}</h2>
                <ul className="mt-4 grid gap-2.5 text-[0.9375rem] text-rack-ink-soft">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="hover:text-rack-ink hover:underline">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-rack-rule pt-6 text-sm text-rack-ink-soft md:flex-row md:items-center md:justify-between">
          <p>{copyright}</p>
          {legalLinks.length > 0 && (
            <ul className="flex gap-5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="underline underline-offset-[0.22em] hover:text-rack-ink"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
