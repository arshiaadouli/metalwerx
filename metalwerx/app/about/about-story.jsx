import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { business } from "@/lib/business";

// The About page's long read: who sells to the yard, what it buys and how it's
// priced, what it turns away and where the metal goes, beside what every
// seller can count on. Each claim is one the site already makes on its service,
// material and price pages or in the blog; only the wording is this page's own.
// A change to how the yard works needs making here as well as in the CMS.
const link =
  "font-semibold text-ink-cherry underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none";

const promises = [
  {
    title: "Every kilo weighed",
    text: "Your metal is sorted by grade and each grade is weighed on its own, so you're paid the right price for every kilo.",
  },
  {
    title: "Paid the same day",
    text: "Payment is by bank transfer on the day your scrap is weighed. Bring your BSB and account number.",
  },
  {
    title: "By the book",
    text: "Victorian law has scrap dealers record photo ID from every seller and bans cash payments. We do both on every sale: it makes stolen metal much harder to sell, which protects honest sellers too.",
  },
  {
    title: "Straight answers",
    text: "If a load is graded lower than you expected, we'll show you why, so you know for next time.",
  },
];

export default function AboutStory() {
  const { street, locality } = business.address;

  return (
    <section
      aria-labelledby="how-we-work"
      className="bg-panel pb-16 font-montserrat text-ink sm:pb-24"
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal
          as="h2"
          id="how-we-work"
          className="mb-6 font-bebas-neue text-3xl tracking-wide sm:text-4xl"
        >
          How We Do Business
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="max-w-2xl space-y-5 text-sm leading-relaxed text-ink-soft sm:text-base">
            <p>
              The people who sell to us are homeowners clearing out a shed, plumbers, electricians
              and air-con installers with a week&apos;s offcuts, builders and demolition crews,
              fabricators, mechanics and farmers. They bring their scrap to{" "}
              <Link href="/contact-us#location" title="Find Us" className={link}>
                our yard at {street}, {locality}
              </Link>
              , or we collect it from them.
            </p>
            <p>
              <Link href="/what-we-buy" title="What We Buy" className={link}>
                We buy
              </Link>{" "}
              copper, brass, aluminium, stainless steel and HMS steel, along with the things built
              from more than one metal: electric motors, compressors, air conditioners and
              aluminium engines. Every metal has its own price, and it moves with the metals
              market. We publish the averages we pay, per kilo and per tonne, on our{" "}
              <Link href="/prices" title="Scrap Prices" className={link}>
                prices page
              </Link>
              , and confirm yours once your load is graded and weighed.
            </p>
            <p>
              A few things we have to turn away, even when they&apos;re mostly metal: gas bottles,
              drums with fuel or oil in them, fridges and air conditioners that still hold gas,
              and anything contaminated with asbestos. Some are dangerous to crush or cut, and
              some are against the law to scrap as they are. Not sure about something? Send us a
              photo before you load it up.
            </p>
            <p>
              What we do buy doesn&apos;t stay scrap for long. Sorted by grade, the metal goes on
              to be melted down and made into new products, which takes far less energy than
              making metal from ore. And because metal doesn&apos;t wear out in the furnace, it can
              be recycled again and again.
            </p>
          </Reveal>

          <div>
            <Reveal
              as="h3"
              step={1}
              className="font-oswald text-sm uppercase tracking-[0.3em] text-ink-cherry"
            >
              What you can count on
            </Reveal>
            {/* Slides in row by row, like the lists on the service pages. */}
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {promises.map(({ title, text }, i) => (
                <Reveal key={title} variant="slide" step={i} className="py-5">
                  <dt className="font-oswald text-lg uppercase tracking-[0.15em]">{title}</dt>
                  <dd className="mt-2 text-sm leading-6 text-ink-soft">{text}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
