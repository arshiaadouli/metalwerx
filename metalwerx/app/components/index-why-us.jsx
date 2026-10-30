import { NotchedProjectCard } from "@/components/ui/notched-project-card";
import { Reveal } from "@/components/ui/reveal";

// The photo cards between the ticker and the commercial section. The copy,
// photos and links are in the CMS (see lib/cms.js). The photos sit in black
// and white until a card is hovered or focused, so photos from different
// sources still look like one set.
export default function IndexWhyUs({ heading, intro, reasons }) {
  return (
    <section id="why-us" className="bg-surface font-montserrat text-ink">
      <div className="mx-auto w-full max-w-7xl px-6 pt-20 sm:pt-24">
        <Reveal as="header" className="text-center">
          <h2 className="font-oswald text-2xl font-semibold uppercase tracking-[0.2em] text-ink-cherry sm:text-3xl">
            {heading}
          </h2>
          {intro && (
            <p className="mx-auto mt-4 max-w-2xl text-sm tracking-wide text-ink-soft sm:text-base">
              {intro}
            </p>
          )}
        </Reveal>
        {/* Each row of cards plays left to right. */}
        <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {reasons.map(({ title, description, image, href }, i) => (
            <Reveal as="li" key={title} step={i % 3}>
              {/* The notch is painted in the section's background colour. */}
              <NotchedProjectCard
                href={href}
                title={title}
                description={description}
                image={image?.src}
                imageAlt={image?.alt}
                monochrome
                surface="var(--surface)"
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
