import { Reveal } from "@/components/ui/reveal";
import { business, telHref } from "@/lib/business";

// The suburbs the yard's bins, pickups and towing cover (see lib/business.js),
// as a band on /contact-us and the service pages. It renders nothing until the
// list is filled in.
export default function AreasServed() {
  const { areasServed } = business;
  if (areasServed.length === 0) return null;

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
            Areas We Cover
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm tracking-wide text-ink-soft sm:text-base">
            From our yard in Hallam, we drop off bins, pick up scrap and tow cars across these
            suburbs in Melbourne&apos;s south-east. Not on the list?{" "}
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
          {areasServed.map((suburb) => (
            <li
              key={suburb}
              className="rounded-full border border-line bg-panel px-4 py-2 text-sm font-medium text-ink"
            >
              {suburb}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
