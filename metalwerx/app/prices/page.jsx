import Link from "next/link";
import { BadgeDollarSign } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { getPrices } from "@/lib/cms";
import { cn } from "@/lib/utils";
import { CtaBand, ServiceHero } from "@/app/services/sections";
import { getMaterials, getWhatWeBuyPage } from "@/app/what-we-buy/materials";
import { priceAmount, priceDate, units } from "./format";

// The average the yard pays for each material, set in the CMS's Prices (see
// lib/cms.js). The materials are grouped as on /what-we-buy, with its header
// photo and closing band; a material with no price yet asks for a quote. What
// moves a price from the average is on /what-we-buy#price-factors.

// The closing band's photo, so it's not the same as /what-we-buy's.
const bandPhoto = "/images/unsplash/photo-1561503412-852800622772.jpg"; // crushed aluminium cans

// Until a price is set in the CMS, the description says how prices are worked
// out instead of promising figures the page doesn't have.
export async function generateMetadata() {
  const prices = await getPrices();
  return {
    title: "Scrap Metal Prices in Hallam",
    description: prices.some((price) => priceAmount(price))
      ? "The average Metal Werx in Hallam pays per tonne for copper, brass, aluminium, alloy wheels, stainless steel, HMS steel, electric motors, compressors, air conditioners and aluminium engines."
      : "How Metal Werx in Hallam prices copper, brass, aluminium, stainless steel, HMS steel, motors, compressors, air conditioners and engines: by grade, cleanliness and weight. Ask us for a quote.",
  };
}

export default async function PricesPage() {
  const [{ hero, groups, cta }, materials, prices] = await Promise.all([
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

  // The day the newest price was set.
  const priced = prices.filter((price) => priceAmount(price));
  const asOf = priced.length
    ? new Date(Math.max(...priced.map((price) => Date.parse(price.updatedAt))))
    : null;

  return (
    <main className="flex-1 bg-surface font-montserrat text-ink">
      <ServiceHero
        image={hero.image}
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Scrap Prices" }]}
        icon={BadgeDollarSign}
        eyebrow="Scrap Prices"
        title="Scrap Metal Prices"
        lede="The average we pay at our Hallam yard, per tonne. Prices follow the metals market, and what you're paid depends on the grade, how clean it is and how much you bring."
        actions={[
          { text: "Get a Quote", href: "/contact-us" },
          { text: "What We Buy", href: "/what-we-buy", outline: true },
        ]}
      />

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
        <div className="mx-auto w-full max-w-7xl px-6 py-12 text-sm leading-6 text-ink-soft">
          {asOf && (
            <p className="font-oswald text-xs uppercase tracking-[0.2em] text-ink">
              Prices as of{" "}
              <time dateTime={asOf.toISOString()}>{priceDate(asOf)}</time>
            </p>
          )}
          <p className={cn("max-w-3xl", asOf && "mt-3")}>
            Prices are averages in Australian dollars, a guide that can change without notice. We
            confirm the price when your scrap is graded and weighed at the yard.{" "}
            <Link
              href="/what-we-buy#price-factors"
              title="What affects the price"
              className="text-ink-cherry underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
            >
              See what affects the price
            </Link>
          </p>
        </div>
      </section>

      <CtaBand {...cta} image={bandPhoto} />
    </main>
  );
}

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
