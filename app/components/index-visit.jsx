import { ArrowUpRight } from "lucide-react";

import { Container, SectionHeading } from "@/app/services/sections";
import { YardMap } from "@/components/site/yard-map";
import { Button } from "@/components/ui/button";
import { YARD } from "@/lib/yard";

// What happens when you bring a load in, from PRODUCT.md: graded and weighed
// metal by metal, photo ID, paid by bank transfer.
const STEPS = [
  {
    title: "Bring your load in",
    text: "Pull in with a car boot, ute or trailer of scrap. Sorted metal earns a better grade, but we take mixed loads too.",
  },
  {
    title: "We grade and weigh it",
    text: "We sort your scrap metal by metal, weigh each grade and pay it at its own rate, with a weigh ticket for the load.",
  },
  {
    title: "Show ID and get paid",
    text: "Show current photo ID, as Victorian law requires, and we pay you by bank transfer. Bring your BSB and account number.",
  },
];

// Where the yard is and how a visit goes, beside Google's map of it. The
// address isn't a link here: the hero's address and the footer's already
// open the map, and "Get directions" is this page's only link with that text.
export default function IndexVisit() {
  return (
    <section id="visit" aria-labelledby="visit-heading" className="scroll-mt-24 border-t border-rule py-20 sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="visit-heading"
            title="Find the yard in Hallam"
            intro={`Bring your scrap metal to ${YARD.address}, in Melbourne's south-east. We buy from homeowners, tradies, farmers and businesses.`}
          />
          <ol className="mt-10 border-t-2 border-ink">
            {STEPS.map(({ title, text }, i) => (
              <li key={title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] border-b border-rule py-5">
                <span aria-hidden="true" className="type-code text-lg text-ink-muted">
                  {i + 1}
                </span>
                <div>
                  <h3 className="type-subheading text-ink">{title}</h3>
                  <p className="mt-1.5 max-w-[52ch] text-base text-ink-soft">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[52ch] text-base text-ink-soft">
            {YARD.hours ? "Check our opening hours before you come." : "Call ahead for today's opening hours."} Too
            much to bring in? We pick up scrap and drop off bins across Melbourne&apos;s south-east.
          </p>
          <Button asChild size="lg" variant="outline" className="mt-8 max-sm:w-full">
            <a href={YARD.mapsHref} title={`Directions to ${YARD.address}`} target="_blank" rel="noopener noreferrer">
              Get directions
              <ArrowUpRight aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </Button>
        </div>
        <YardMap className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[28rem]" />
      </Container>
    </section>
  );
}
