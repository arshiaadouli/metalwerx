import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import AreasServed from "@/app/components/areas-served";
import ContactFindUs from "@/app/components/contact-find-us";
import BlogBody from "@/app/blogs/[slug]/blog-body";
import { Reveal } from "@/components/ui/reveal";
import { business, formattedAddress } from "@/lib/business";
import { CtaBand, ServiceHero } from "@/app/services/sections";
import { binPermits } from "../local";
import { bandPhoto, getSuburb, heroPhoto, suburbs } from "../suburbs";

// The page of a suburb with copy of its own in ../local.js: that copy, closed
// by its council's rules for a bin on the street, beside the drive to the yard
// from its row in ../suburbs.js, then the yard's map and hours and the suburbs
// around it. Any other suburb, or slug, is a 404.

// The whole page must be static HTML, so search engines get the copy in the
// first response, and it opens instantly from a link. The build fails if
// anything here would need a request.
export const ensureStatic = "navigation";

// A click waits for the prerendered page rather than streaming it in, so each
// page's HTML has its content inline (see ../../what-we-buy/[slug]/page.jsx).
export const instant = false;

// Every suburb with a page is prerendered at build time.
export function generateStaticParams() {
  return suburbs.filter(({ local }) => local).map(({ slug }) => ({ slug }));
}

// The yard's own suburb says the yard is there, not how far away it is.
const isYardSuburb = ({ name }) => name === business.address.locality;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const suburb = getSuburb(slug);
  if (!suburb?.local) return { title: "Area not found" };
  const { name, postcode, km, minutes } = suburb;
  return {
    title: `Scrap Metal Recycling ${name}`,
    description: isYardSuburb(suburb)
      ? `Scrap metal buyer in ${name}: our yard is at ${formattedAddress}. Bin hire and scrap pickups across ${name}, paid by bank transfer the same day.`
      : `Scrap metal buyer ${km} km from ${name}: about ${minutes} minutes' drive to our ${business.address.locality} yard. Bin hire and scrap pickups in ${name} ${postcode}.`,
  };
}

const linkClass =
  "font-oswald text-sm uppercase tracking-[0.15em] text-ink-cherry underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none";

export default async function SuburbPage({ params }) {
  const { slug } = await params;
  const suburb = getSuburb(slug);
  if (!suburb?.local) notFound();
  const { name, postcode, council, km, minutes, via, local } = suburb;

  const where = isYardSuburb(suburb)
    ? `Our yard is in ${name}, at ${business.address.street}.`
    : `Our ${business.address.locality} yard is about ${km} km from ${name}, around ${minutes} minutes' drive outside peak hour.`;
  // Google Maps' directions from the suburb to the yard's street address.
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${name} VIC ${postcode}`)}&destination=${encodeURIComponent(formattedAddress)}`;

  return (
    <main className="flex-1 bg-surface font-montserrat text-ink">
      <ServiceHero
        image={heroPhoto}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Areas We Cover", href: "/areas" },
          { name },
        ]}
        icon={MapPin}
        eyebrow={`${name} VIC ${postcode}`}
        title={`Scrap Metal Recycling in ${name}`}
        lede={`${where} Bring your scrap in, or have us drop off a bin or pick up a load in ${name}.`}
        actions={[
          { text: "Get a Quote", href: "/contact-us" },
          { text: "Getting Here", href: "#getting-here", outline: true },
        ]}
      />

      <section aria-labelledby="local-title" className="bg-surface">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <Reveal>
            <h2 id="local-title" className="font-bebas-neue text-5xl tracking-wide sm:text-6xl">
              Selling Scrap in {name}
            </h2>
            <div className="mt-4 h-1 w-16 bg-cherry" />
            <BlogBody paragraphs={[...local, binPermits[council]].filter(Boolean)} className="mt-8" />
          </Reveal>

          {/* The hero's "Getting Here" button jumps here. */}
          <Reveal
            as="aside"
            id="getting-here"
            aria-labelledby="getting-here-title"
            step={1}
            className="scroll-mt-8 self-start rounded-2xl border border-line bg-panel p-6 sm:p-8"
          >
            <p className="font-oswald text-sm uppercase tracking-[0.3em] text-ink-cherry">
              Getting Here
            </p>
            <h2
              id="getting-here-title"
              className="mt-2 font-bebas-neue text-4xl tracking-wide sm:text-5xl"
            >
              From {name} to Our Yard
            </h2>
            <p className="mt-6 leading-7 text-ink-soft">
              Our yard is at {formattedAddress}. From the centre of {name} it&apos;s about {km} km
              by road, around {minutes} minutes outside peak hour, mostly on {via}. Bring photo ID
              and your BSB and account number: we pay by bank transfer the same day.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              <li>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Directions from ${name} in Google Maps (opens in a new tab)`}
                  className={linkClass}
                >
                  Directions from {name}
                </a>
              </li>
              <li>
                <Link href="/prices" title="Scrap metal prices" className={linkClass}>
                  Scrap prices
                </Link>
              </li>
              <li>
                <Link href="/what-we-buy" title="What we buy" className={linkClass}>
                  What we buy
                </Link>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <ContactFindUs />
      <AreasServed near={suburb} />
      <CtaBand
        heading={`Got Scrap in ${name}?`}
        text="Tell us what you have and where it is, and we'll get back to you with a quote."
        buttonText="Get a Quote"
        buttonHref="/contact-us"
        image={bandPhoto}
      />
    </main>
  );
}
