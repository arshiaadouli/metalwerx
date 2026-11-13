import Link from "next/link";
import { MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { business, formattedAddress, telHref } from "@/lib/business";
import { CtaBand, ServiceHero } from "@/app/services/sections";
import { bandPhoto, heroPhoto, suburbs } from "./suburbs";

// Every suburb the yard covers (see ./suburbs.js), A to Z, each with the drive
// to the yard, and a link for those with a page of their own.

export const metadata = {
  title: "Areas We Cover in South-East Melbourne",
  description: `Scrap metal bin hire and pickups in ${suburbs.length} suburbs across Melbourne's south-east, from our ${business.address.locality} yard. Find yours for the distance and the drive.`,
};

export default function AreasPage() {
  return (
    <main className="flex-1 bg-surface font-montserrat text-ink">
      <ServiceHero
        image={heroPhoto}
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Areas We Cover" }]}
        icon={MapPin}
        eyebrow="South-East Melbourne"
        title="Areas We Cover"
        lede={`From our yard in ${business.address.locality}, we drop off bins and pick up scrap across Melbourne's south-east. Find your suburb for the distance, the drive and directions to the yard.`}
        actions={[
          { text: "Get a Quote", href: "/contact-us" },
          { text: "Find Your Suburb", href: "#suburbs", outline: true },
        ]}
      />

      {/* The hero's "Find Your Suburb" button jumps here. */}
      <section id="suburbs" aria-labelledby="suburbs-title" className="scroll-mt-8 bg-surface">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-24">
          <Reveal>
            <h2 id="suburbs-title" className="font-bebas-neue text-5xl tracking-wide sm:text-6xl">
              Find Your Suburb
            </h2>
            <div className="mt-4 h-1 w-16 bg-cherry" />
            <p className="mt-6 max-w-3xl leading-7 text-ink-soft">
              The {suburbs.length} suburbs we cover, each with the drive from its centre to our yard
              at {formattedAddress}, outside peak hour. Those in bold have a page of their own. Not
              on the list?{" "}
              <a
                href={telHref}
                title={`Call ${business.name}`}
                className="font-semibold text-ink-cherry underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
              >
                Call us
              </a>{" "}
              and ask.
            </p>
          </Reveal>

          {/* Columns rather than a grid, so the names read A to Z down each one. */}
          <Reveal as="ul" step={1} className="mt-12 gap-x-10 sm:columns-2 lg:columns-3">
            {suburbs.map(({ slug, name, km, minutes, local }) => {
              const Row = local ? Link : "div";
              return (
                <li key={slug} className="break-inside-avoid border-b border-line">
                  <Row
                    {...(local && { href: `/areas/${slug}`, title: `Scrap metal recycling in ${name}` })}
                    className="group flex items-baseline justify-between gap-4 py-3 focus-visible:outline-none"
                  >
                    <span
                      className={
                        local
                          ? "font-semibold transition-colors group-hover:text-ink-cherry group-focus-visible:text-ink-cherry group-focus-visible:underline"
                          : "text-ink-soft"
                      }
                    >
                      {name}
                    </span>
                    <span className="shrink-0 text-sm text-ink-muted tabular-nums">
                      {km} km · {minutes} min
                    </span>
                  </Row>
                </li>
              );
            })}
          </Reveal>
        </div>
      </section>

      <CtaBand
        heading="Got Scrap to Shift?"
        text="Tell us your suburb and what you have, and we'll get back to you with a quote."
        buttonText="Get a Quote"
        buttonHref="/contact-us"
        image={bandPhoto}
      />
    </main>
  );
}
