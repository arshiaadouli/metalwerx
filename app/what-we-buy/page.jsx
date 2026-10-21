import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { CtaBand, Container, PageHeader, SectionHeading, Steps } from "@/app/services/sections";
import { MaterialBay } from "./material-bay";
import { getMaterial, groups, overviewImage, sellingSteps } from "./materials";

// The header photo is also the preview image when the page is shared.
export const metadata = pageMetadata({
  path: "/what-we-buy",
  title: "What We Buy",
  description:
    "Metal Werx in Hallam buys copper, brass, aluminium, stainless steel, lead and batteries, wire, motors, alloy wheels, car parts, old machinery and unwanted cars. Weighed and paid by bank transfer.",
  image: { url: `${overviewImage.url}&w=1200`, alt: overviewImage.alt },
});

export default function WhatWeBuyPage() {
  return (
    <main id="main" className="flex-1 bg-ground text-ink">
      <PageHeader
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "What We Buy" }]}
        title="What We Buy"
        lede="Copper, brass, aluminium, stainless steel, lead, old cars and machinery. If it's metal, chances are we'll buy it. Bring it to our Hallam yard, or we'll come to you."
        actions={[
          { text: "Get a quote", href: "/contact-us" },
          { text: "How it works", href: "#how-it-works" },
        ]}
        image={overviewImage}
      />

      {groups.map((group, i) => (
        <Group key={group.id} {...group} className={cn(i > 0 && "border-t border-rack-rule")} />
      ))}

      <Steps {...sellingSteps} />

      <CtaBand
        heading="Not Sure What It's Worth?"
        text="Tell us what you've got and we'll give you a price."
        cta={{ text: "Get a price", href: "/contact-us" }}
      />
    </main>
  );
}

// One group of the catalogue on the rack field: its name and intro on the
// upright, its materials in bays beside it. The section's id is where the
// footer's Ferrous and Non-Ferrous links land, flush under the sticky header;
// each bay's id is the anchor that links from before the material pages
// existed still point to.
function Group({ id, title, intro, slugs, className }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("on-rack scroll-mt-16 bg-rack text-rack-ink lg:scroll-mt-18", className)}
    >
      <Container className="grid gap-10 py-16 sm:gap-12 sm:py-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:py-24">
        <SectionHeading
          id={`${id}-title`}
          title={title}
          intro={intro}
          onRack
          className="lg:sticky lg:top-28 lg:self-start"
        />
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 sm:gap-x-7 sm:gap-y-12">
          {slugs.map(getMaterial).map(({ slug, anchor, title, summary }) => (
            <MaterialBay key={slug} id={anchor} slug={slug} title={title} summary={summary} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
