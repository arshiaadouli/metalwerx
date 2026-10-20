import { Recycle } from "lucide-react";
import { NotchedProjectCard } from "@/components/ui/notched-project-card";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { CtaBand, ServiceHero, Steps } from "@/app/services/sections";
import { getMaterial, groups, overviewImage, sellingSteps } from "./materials";

export const metadata = {
  title: "What We Buy",
  description:
    "Metal Werx in Hallam buys copper, brass, aluminium, stainless steel, lead and batteries, wire, motors, alloy wheels, car parts, old machinery and unwanted cars. Weighed and paid by bank transfer.",
};

export default function WhatWeBuyPage() {
  return (
    <main className="flex-1 bg-surface font-montserrat text-ink">
      <ServiceHero
        image={overviewImage}
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "What We Buy" }]}
        icon={Recycle}
        eyebrow="What we buy"
        title="What We Buy"
        lede="Copper, brass, aluminium, stainless steel, lead, old cars and machinery. If it's metal, chances are we'll buy it. Bring it to our Hallam yard, or we'll come to you."
        actions={[
          { text: "Get a Quote", href: "/contact-us" },
          { text: "How It Works", href: "#how-it-works", outline: true },
        ]}
      />

      {groups.map((group, i) => (
        <Group key={group.id} {...group} className={cn(i > 0 && "border-t border-line")} />
      ))}

      <Steps {...sellingSteps} />

      <CtaBand
        heading="Not Sure What It's Worth?"
        text="Tell us what you've got and we'll give you a price."
        cta={{ text: "Get a Quote", href: "/contact-us" }}
      />
    </main>
  );
}

// The section's id and each card's are the anchors that links from before the
// material pages existed still point to.
function Group({ id, title, intro, slugs, className }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-8 bg-surface", className)}
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-24">
        <Reveal>
          <h2 id={`${id}-title`} className="font-bebas-neue text-5xl tracking-wide sm:text-6xl">
            {title}
          </h2>
          <div className="mt-4 h-1 w-16 bg-cherry" />
          <p className="mt-6 max-w-3xl leading-7 text-ink-soft">{intro}</p>
        </Reveal>

        {/* Each row of cards plays left to right. */}
        <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {slugs.map(getMaterial).map(({ slug, anchor, title, summary, image }, i) => (
            <Reveal as="li" key={slug} id={anchor} step={i % 3} className="scroll-mt-8">
              {/* The notch is painted in the section's background colour. */}
              <NotchedProjectCard
                href={`/what-we-buy/${slug}`}
                title={title}
                description={summary}
                image={`${image.url}&w=960`}
                imageAlt={image.alt}
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
