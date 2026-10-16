import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

// "Rustic Remnants: Frontal View of the Abandoned Holden on the Farm" by Matthew
// Fleming, free under the Unsplash License:
// https://unsplash.com/photos/an-old-rusty-car-sitting-in-the-grass-bFXkEbds6bg
const carImageUrl =
  "https://images.unsplash.com/photo-1645216755684-c946ce202427?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D";

const steps = [
  { title: "Get in Touch", points: ["Via website", "Via telephone", "Via email"] },
  { title: "Get the Best Price", points: ["Top prices", "All makes and models", "Any condition"] },
  { title: "We Pick Up Your Car", points: ["Paid on the spot", "Quick removal", "Reliable service"] },
];

export default function IndexCashForCars() {
  return (
    <section id="cash-for-cars" className="bg-white font-montserrat text-carbon">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16">
        {/* A background image, as in the hero, so no next.config remotePatterns entry is needed. */}
        <div
          role="img"
          aria-label="A rusted old Holden sedan sitting in the grass on a farm"
          className="aspect-4/3 w-full bg-cover bg-center lg:aspect-4/5 rounded-lg"
          style={{ backgroundImage: `url(${carImageUrl})` }}
        />

        <div>
          <h2 className="font-bebas-neue text-5xl tracking-wide text-carbon">Cash for Cars</h2>
          <p className="mt-1 font-bebas-neue text-4xl tracking-wide text-cherry sm:text-5xl">
            Get Top Dollar for Old Cars
          </p>
          <p className="mt-6 max-w-xl leading-7 text-graphite">
            Got an old, damaged or unwanted car taking up space? We buy cars, utes, vans and trucks
            in any condition, running or not. Tell us what you have, we&apos;ll give you a fair
            price, and we&apos;ll tow it away for free. It&apos;s as simple as 1-2-3.
          </p>

          {/* Each step spans two rows of a subgrid, so the red headers stay the same
              height when one title wraps. */}
          <ol className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0">
            {steps.map((step, i) => (
              <li key={step.title} className="row-span-2 grid grid-rows-subgrid gap-y-5">
                <div className="flex flex-col justify-center rounded-t-2xl bg-cherry px-4 py-5 text-center text-chrome">
                  <p className="font-bebas-neue text-3xl tracking-wide">Step {i + 1}</p>
                  <p className="mt-1 text-sm font-semibold">{step.title}</p>
                </div>
                <ul className="space-y-4 px-2">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm text-graphite">
                      <CircleCheck aria-hidden="true" className="size-5 shrink-0 text-steel" />
                      {point}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex justify-center">
            <Button asChild size="lg" className="font-oswald uppercase tracking-[0.15em]">
              <Link href="/contact">Get a Free Quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
