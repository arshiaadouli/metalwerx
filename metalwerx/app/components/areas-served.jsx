import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { nearby, suburbs } from "@/app/areas/suburbs";
import { business, telHref } from "@/lib/business";

// A band of the suburbs the yard's bins and pickups cover (see
// app/areas/suburbs.js), each linking to its page if it has one: on
// /contact-us and the service pages, the two dozen closest to the yard, A to
// Z; on a suburb's own page (`near`), the eight closest to it, nearest first.
// /areas lists them all.
const closest = suburbs
  .toSorted((a, b) => a.km - b.km)
  .slice(0, 24)
  .toSorted((a, b) => a.name.localeCompare(b.name));

export default function AreasServed({ near }) {
  const list = near ? nearby(near, 8) : closest;

  return (
    <section
      id="areas"
      aria-labelledby="areas-title"
      className="scroll-mt-8 border-t border-line bg-surface font-montserrat text-ink"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-24">
        <Reveal as="header" className="text-center">
          <h2
            id="areas-title"
            className="font-oswald text-2xl font-semibold uppercase tracking-[0.2em] text-ink-cherry sm:text-3xl"
          >
            {near ? `Near ${near.name}` : "Areas We Cover"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm tracking-wide text-ink-soft sm:text-base">
            {near
              ? `We cover the suburbs around ${near.name} too.`
              : "From our yard in Hallam, we drop off bins and pick up scrap across Melbourne's south-east, and these are the suburbs closest to us."}{" "}
            Not on the list?{" "}
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
        <Reveal as="ul" step={1} className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
          {list.map(({ slug, name, local }) => (
            <li key={slug}>
              {local ? (
                <Link
                  href={`/areas/${slug}`}
                  title={`Scrap metal recycling in ${name}`}
                  className="block rounded-full border border-line bg-panel px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-cherry hover:text-ink-cherry focus-visible:border-cherry focus-visible:text-ink-cherry focus-visible:outline-none"
                >
                  {name}
                </Link>
              ) : (
                <span className="block rounded-full border border-line px-4 py-2 text-sm text-ink-soft">
                  {name}
                </span>
              )}
            </li>
          ))}
        </Reveal>
        <Reveal as="p" step={2} className="mt-10 text-center">
          <Link
            href="/areas"
            title="Areas we cover"
            className="font-oswald text-sm uppercase tracking-[0.2em] text-ink-cherry underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
          >
            All {suburbs.length} suburbs
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
