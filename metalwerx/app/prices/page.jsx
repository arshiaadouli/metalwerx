import Link from "next/link";
import { BadgeDollarSign } from "lucide-react";
import Faq from "@/app/components/faq";
import { Reveal } from "@/components/ui/reveal";
import { getPrices } from "@/lib/cms";
import { cn } from "@/lib/utils";
import { CtaBand, PriceFactors, ServiceHero } from "@/app/services/sections";
import { getMaterials, getWhatWeBuyPage } from "@/app/what-we-buy/materials";
import { lowerName, otherUnit, perKg, priceAmount, priceDate, priceText, units } from "./format";

// The average the yard pays for each material, set in the CMS's Prices (see
// lib/cms.js), per tonne and per kg. The materials are grouped as on
// /what-we-buy, with its header photo, its price factors and its closing band;
// a material with no price yet asks for a quote.

// The closing band's photo, so it's not the same as /what-we-buy's.
const bandPhoto = "/images/unsplash/photo-1561503412-852800622772.jpg"; // crushed aluminium cans

// What people check before they sell. The answers repeat what the selling
// steps on /what-we-buy and the service FAQs say in the CMS, so a change there
// needs making here too.
const faq = {
  heading: "Before You Sell",
  intro: "What to bring, how you're paid and how a load is graded.",
  questions: [
    {
      question: "Do I need ID to sell scrap metal?",
      answer:
        "Yes. Victorian law requires us to record photo ID from everyone who sells us scrap metal. A driver licence is easiest; if you don't have one, ask us what else we can accept before you come in.",
    },
    {
      question: "How and when am I paid?",
      answer:
        "By bank transfer, the same day your scrap is weighed. Scrap metal dealers in Victoria can't pay in cash, so bring your BSB and account number.",
    },
    {
      question: "Is there a minimum load?",
      answer:
        "Small loads are welcome at the yard: if it fits in a car, ute or trailer, bring it in. For a pickup, how much metal there is, what it is and how far we travel decide whether there's a charge, so ask us for a quote.",
    },
    {
      question: "How is my scrap graded?",
      answer:
        "We sort your metal by grade and weigh each grade on its own. Clean, sorted metal pays the most: plastic, rubber, oil and steel fittings left on lower the grade, and a metal mixed into a load of something cheaper is paid at the lower price.",
    },
  ],
};

// The day the newest price was set, or null with none.
function newestPriceDate(prices) {
  const dates = prices.filter((price) => price.price != null).map((price) => Date.parse(price.updatedAt));
  return dates.length ? new Date(Math.max(...dates)) : null;
}

// The description carries the three dearest prices, per kg, and the day they
// were set, so it updates with the price table. Until a price is set in the
// CMS, it says how prices are worked out instead of promising figures the page
// doesn't have.
export async function generateMetadata() {
  const [materials, prices] = await Promise.all([getMaterials(), getPrices()]);
  const names = new Map(materials.map(({ slug, title }) => [slug, lowerName(title)]));
  const dearest = prices
    .map((price) => ({ name: names.get(price.slug), kg: perKg(price) }))
    .filter(({ name, kg }) => name && kg)
    .sort((a, b) => b.kg.price - a.kg.price)
    .slice(0, 3);
  const asOf = newestPriceDate(prices);
  return {
    title: "Scrap Metal Prices Melbourne – Per Kg & Tonne",
    description: dearest.length
      ? `Scrap ${dearest.map(({ name, kg }) => `${name} ${priceAmount(kg)}/kg`).join(", ")} and more at our Hallam yard. Prices as of ${priceDate(asOf)}, paid by bank transfer.`
      : "How Metal Werx in Hallam prices copper, brass, aluminium, stainless steel, HMS steel, motors, compressors, air conditioners and engines: by grade, cleanliness and weight. Ask us for a quote.",
  };
}

export default async function PricesPage() {
  const [{ hero, priceFactors, groups, cta }, materials, prices] = await Promise.all([
    getWhatWeBuyPage(),
    getMaterials(),
    getPrices(),
  ]);
  const bySlug = new Map(materials.map((material) => [material.slug, material]));
  const priceBySlug = new Map(prices.map((price) => [price.slug, price]));
  const rows = (slugs) =>
    slugs
      .map((slug) => bySlug.get(slug))
      .filter(Boolean)
      .map((material) => ({ ...material, price: priceBySlug.get(material.slug) }));

  // A material in none of the /what-we-buy groups still gets a row, at the end.
  const grouped = new Set(groups.flatMap((group) => group.slugs));
  const others = materials.filter(({ slug }) => !grouped.has(slug)).map(({ slug }) => slug);
  const sections = [
    ...groups,
    ...(others.length ? [{ id: "other", title: "Other Materials", slugs: others }] : []),
  ];
  const asOf = newestPriceDate(prices);

  return (
    <main className="flex-1 bg-surface font-montserrat text-ink">
      <ServiceHero
        image={hero.image}
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Scrap Prices" }]}
        icon={BadgeDollarSign}
        eyebrow="Scrap Prices"
        title="Scrap Metal Prices"
        lede="The average we pay at our Hallam yard, per tonne and per kg. Prices follow the metals market, and what you're paid depends on the grade, how clean it is and how much you bring."
        actions={[
          { text: "Get a Quote", href: "/contact-us" },
          { text: "What We Buy", href: "/what-we-buy", outline: true },
        ]}
      >
        {asOf && (
          <p className="font-oswald text-sm uppercase tracking-[0.3em] text-aluminium">
            Prices updated <time dateTime={asOf.toISOString()}>{priceDate(asOf)}</time>
          </p>
        )}
      </ServiceHero>

      {sections.map(({ id, title, slugs }, i) => (
        <PriceTable
          key={id}
          id={id}
          title={title}
          rows={rows(slugs)}
          className={cn(i > 0 && "border-t border-line")}
        />
      ))}

      <section aria-label="About these prices" className="border-t border-line bg-panel">
        <p className="mx-auto w-full max-w-7xl px-6 py-12 text-sm leading-6 text-ink-soft">
          Prices are averages in Australian dollars, a guide that can change without notice. We
          confirm the price when your scrap is graded and weighed at the yard.
        </p>
      </section>

      {priceFactors.items.length > 0 && <PriceFactors {...priceFactors} />}

      {/* The home page's FAQ section, which has no top padding of its own. */}
      <div className="border-t border-line bg-surface pt-20 sm:pt-24">
        <Faq {...faq} />
      </div>

      <CtaBand {...cta} image={bandPhoto} />
    </main>
  );
}

// Each price as set in the CMS, with the same price in the other weight unit
// under it.
function PriceTable({ id, title, rows, className }) {
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
        </Reveal>

        <Reveal step={1}>
          <table className="mt-12 w-full text-left">
            <thead className="border-b-2 border-ink font-oswald text-xs uppercase tracking-[0.2em] text-ink-muted">
              <tr>
                <th scope="col" className="pb-3 font-normal">
                  Material
                </th>
                <th scope="col" className="pb-3 text-right font-normal">
                  Average Price
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ slug, title, icon: Icon, price }) => {
                const amount = price && priceAmount(price);
                const other = amount && otherUnit(price);
                return (
                  <tr key={slug} className="border-b border-line">
                    <th scope="row" className="py-5 pr-4 font-normal">
                      <Link
                        href={`/what-we-buy/${slug}`}
                        title={title}
                        className="group inline-flex items-center gap-3 font-oswald text-lg uppercase tracking-wide transition-colors hover:text-ink-cherry focus-visible:text-ink-cherry focus-visible:underline focus-visible:outline-none"
                      >
                        <Icon aria-hidden="true" className="size-5 shrink-0 text-cherry" />
                        {title}
                      </Link>
                    </th>
                    <td className="py-5 text-right">
                      {amount ? (
                        <>
                          <span className="font-bebas-neue text-3xl tracking-wide tabular-nums">
                            {amount}
                          </span>{" "}
                          <span className="text-sm text-ink-soft">{units[price.unit]}</span>
                          {other && (
                            <span className="block text-sm text-ink-muted tabular-nums">
                              {priceText(other)}
                            </span>
                          )}
                        </>
                      ) : (
                        <Link
                          href="/contact-us"
                          title="Ask for a quote"
                          className="font-oswald text-sm uppercase tracking-[0.15em] text-ink-cherry underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
                        >
                          Ask for a quote
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
