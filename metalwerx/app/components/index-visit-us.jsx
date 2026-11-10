import { Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { business, formattedAddress, telHref } from "@/lib/business";

// Where the yard is and how to reach it, in the page's text rather than only
// in the FAQ or on /contact-us, so search engines (and visitors) can tell from
// the home page that it's in Hallam. The details are in lib/business.js, as in
// the footer and the structured data.
const links = [
  {
    icon: MapPin,
    label: "Visit the yard",
    value: formattedAddress,
    href: business.mapsUrl,
    title: "Open in Google Maps (opens in a new tab)",
    external: true,
  },
  {
    icon: Phone,
    label: "Call us",
    value: business.phone.display,
    href: telHref,
    title: `Call ${business.name}`,
  },
  {
    icon: Mail,
    label: "Email us",
    value: business.email,
    href: `mailto:${business.email}`,
    title: `Email ${business.name}`,
  },
];

export default function IndexVisitUs() {
  return (
    <section id="visit" className="border-t border-line bg-surface font-montserrat text-ink">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-24">
        <Reveal as="header" className="text-center">
          <h2 className="font-oswald text-2xl font-semibold uppercase tracking-[0.2em] text-ink-cherry sm:text-3xl">
            Visit Our Hallam Yard
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm tracking-wide text-ink-soft sm:text-base">
            {business.fullName} is in Hallam, in Melbourne&apos;s south-east. Bring your scrap
            to the yard, or call or email us for a quote, a pickup or a bin.
          </p>
        </Reveal>

        <address className="not-italic">
          <ul className="mt-12 grid gap-4 sm:grid-cols-3">
            {links.map(({ icon: Icon, label, value, href, title, external }, i) => (
              <Reveal as="li" key={label} step={i}>
                <a
                  href={href}
                  title={title}
                  {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                  className="group flex h-full items-center gap-4 border border-line bg-panel p-5 transition-colors hover:border-cherry focus-visible:border-cherry focus-visible:outline-none"
                >
                  <Icon aria-hidden="true" strokeWidth={1.75} className="size-8 shrink-0 text-ink-cherry" />
                  <span className="min-w-0">
                    <span className="block font-oswald text-xs uppercase tracking-[0.2em] text-ink-muted">
                      {label}
                    </span>
                    <span className="mt-1 block break-words font-semibold text-ink transition-colors group-hover:text-ink-cherry group-focus-visible:text-ink-cherry">
                      {value}
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </address>
      </div>
    </section>
  );
}
