import { Recycle } from "lucide-react";
import { NotchedProjectCard } from "@/components/ui/notched-project-card";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { CtaBand, ServiceHero, Steps } from "@/app/services/sections";
import { getMaterials, getWhatWeBuyPage } from "./materials";

// The copy and photos come from the CMS (see materials.js).
export async function generateMetadata() {
  const { seo } = await getWhatWeBuyPage();
  return { title: seo.title, description: seo.description };
}

export default async function WhatWeBuyPage() {
  const [{ hero, groups, sellingSteps, cta }, materials] = await Promise.all([
    getWhatWeBuyPage(),
    getMaterials(),
  ]);
  const bySlug = new Map(materials.map((material) => [material.slug, material]));

  return (
    <main className="flex-1 bg-surface font-montserrat text-ink">
      <ServiceHero
        image={hero.image}
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "What We Buy" }]}
        icon={Recycle}
        eyebrow={hero.eyebrow}
        title={hero.title}
        lede={hero.lede}
        actions={[hero.cta, { text: "How It Works", href: "#how-it-works", outline: true }]}
      />

      {groups.map(({ slugs, ...group }, i) => (
        <Group
          key={group.id}
          {...group}
          materials={slugs.map((slug) => bySlug.get(slug)).filter(Boolean)}
          className={cn(i > 0 && "border-t border-line")}
        />
      ))}

      <Steps {...sellingSteps} />

      <CtaBand {...cta} />
    </main>
  );
}

// The section's id and each card's are the anchors that links from before the
// material pages existed still point to.
function Group({ id, title, intro, materials, className }) {
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
          {materials.map(({ slug, anchor, title, summary, image }, i) => (
            <Reveal as="li" key={slug} id={anchor} step={i % 3} className="scroll-mt-8">
              {/* The notch is painted in the section's background colour. */}
              <NotchedProjectCard
                href={`/what-we-buy/${slug}`}
                title={title}
                description={summary}
                image={image.url}
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
