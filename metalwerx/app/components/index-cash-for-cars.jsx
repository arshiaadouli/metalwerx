import Link from "next/link";
import {
  BadgeDollarSign,
  Car,
  CircleCheck,
  Handshake,
  MessageSquareText,
  PhoneCall,
  Scale,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HowItWorks } from "@/components/ui/how-it-works";
import { Reveal } from "@/components/ui/reveal";
import { photoProps } from "@/lib/photo";

// The icons a step can name (see the CMS (see lib/cms.js)).
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

// The copy, photo and steps are in the CMS (see lib/cms.js).
export default function IndexCashForCars({ heading, subheading, body, image, steps, cta }) {
  return (
    <section id="cash-for-cars" className="bg-surface font-montserrat text-ink">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Half the page beside the text from lg. */}
          {image && (
            <Reveal variant="fade">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                {...photoProps(image.src, "(min-width: 64rem) 50vw, 100vw")}
                alt={image.alt}
                title={image.title}
                loading="lazy"
                className="block aspect-4/3 w-full rounded-lg object-cover object-center"
              />
            </Reveal>
          )}

          <Reveal step={1}>
            <h2 className="font-bebas-neue text-5xl tracking-wide text-ink">{heading}</h2>
            {subheading && (
              <p className="mt-1 font-bebas-neue text-4xl tracking-wide text-ink-cherry sm:text-5xl">
                {subheading}
              </p>
            )}
            {body && <p className="mt-6 max-w-xl leading-7 text-ink-soft">{body}</p>}
          </Reveal>
        </div>

        <HowItWorks
          className="mt-16 sm:mt-20"
          steps={steps.map(({ icon, ...step }) => {
            const Icon = icons[icon] ?? CircleCheck;
            return {
              ...step,
              icon: <Icon aria-hidden="true" strokeWidth={1.75} className="size-6" />,
            };
          })}
        />

        {cta && (
          <Reveal className="mt-12 flex justify-center">
            <Button asChild size="lg" className="font-oswald uppercase tracking-[0.15em]">
              <Link href={cta.href} title={cta.text}>
                {cta.text}
              </Link>
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
