import Link from "next/link";
import {
  BadgeDollarSign,
  Car,
  Check,
  CircleCheck,
  Handshake,
  MessageSquareText,
  Phone,
  PhoneCall,
  Scale,
  Truck,
} from "lucide-react";

import { Container } from "@/app/services/sections";
import { Button } from "@/components/ui/button";
import { YARD } from "@/lib/yard";
import { cn } from "@/lib/utils";
import { HomePhoto } from "./index-photo";

// The icon choices in Strapi's Step component, by the value Strapi stores.
const icons = {
  phone: PhoneCall,
  message: MessageSquareText,
  dollar: BadgeDollarSign,
  scale: Scale,
  truck: Truck,
  car: Car,
  handshake: Handshake,
  check: CircleCheck,
};

// Selling a car: the photo as a plate beside the heading, the steps numbered
// on one rail because their order matters, then the ways to start. The copy,
// photo, steps and link come from the Home Page in Strapi (see lib/pages.js).
// The photo is stock, so it stays uncaptioned, graded into the site's
// red-black like the other home page photos (see HomePhoto).
export default function IndexCashForCars({ heading, subheading, body, image, steps = [], cta }) {
  return (
    <section id="cash-for-cars" aria-labelledby="cash-for-cars-heading" className="scroll-mt-24 py-20 sm:py-28">
      <Container
        className={cn("grid gap-10 sm:gap-14", image && "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-16")}
      >
        {image && (
          <HomePhoto
            image={image}
            widths={[480, 640, 960, 1280, 1920]}
            sizes="(min-width: 82.5rem) 31rem, (min-width: 64rem) calc((100vw - 8rem) * 0.4167), (min-width: 40rem) calc(100vw - 4rem), calc(100vw - 2.5rem)"
            className="aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[4/5]"
          />
        )}

        <div>
          <hgroup>
            <h2 id="cash-for-cars-heading" className="type-heading text-ink">
              {heading}
            </h2>
            {subheading && <p className="type-heading text-ink-soft">{subheading}</p>}
          </hgroup>
          {body && <p className="mt-6 max-w-[56ch] type-lede text-ink-soft">{body}</p>}

          {steps.length > 0 && (
            <ol className="mt-12 grid gap-y-10 border-t-2 border-ink sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0">
              {steps.map(({ title, description, points = [], icon }, i) => {
                const Icon = icons[icon] ?? CircleCheck;
                return (
                  // From sm the steps share their rows (a subgrid), so the
                  // titles and the lists line up across the columns even when
                  // one title wraps, or only one step has a description.
                  <li key={title} className="pt-6 sm:row-span-4 sm:grid sm:grid-rows-subgrid">
                    <div className="flex items-center gap-3 sm:row-start-1 sm:justify-between">
                      <p className="type-code text-lg text-ink-muted">Step {i + 1}</p>
                      <Icon aria-hidden="true" strokeWidth={1.75} className="size-6 text-ink" />
                    </div>
                    <h3 className="mt-5 type-subheading text-ink sm:row-start-2">{title}</h3>
                    {description && <p className="mt-2 text-base text-ink-soft sm:row-start-3">{description}</p>}
                    {points.length > 0 && (
                      <ul className="mt-4 grid content-start gap-1.5 text-[0.9375rem] text-ink-soft sm:row-start-4">
                        {points.map((point) => (
                          <li key={point} className="flex gap-2.5">
                            <Check aria-hidden="true" strokeWidth={2.25} className="mt-1 size-4 shrink-0 text-ink" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild size="lg" className="max-sm:w-full">
              <a href={YARD.phoneHref} className="tabular">
                <Phone aria-hidden="true" />
                {/* Not "Call 0470…": the hero's button already says that. */}
                Call us on {YARD.phone}
              </a>
            </Button>
            {cta && (
              <Button asChild size="lg" variant="outline" className="max-sm:w-full">
                <Link href={cta.href}>
                  {cta.text}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
