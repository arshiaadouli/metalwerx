import Link from "next/link";
import { Car, Container, Factory, FilePenLine, Handshake, Phone, Recycle, Truck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

// The icons a service can name (see the CMS (see lib/cms.js)).
const icons = {
  handshake: Handshake,
  truck: Truck,
  "file-pen": FilePenLine,
  recycle: Recycle,
  car: Car,
  factory: Factory,
  container: Container,
  phone: Phone,
};

// The copy and links are in the CMS (see lib/cms.js).
export default function IndexCommercial({ heading, intro, services }) {
  return (
    <section id="commercial" className="bg-surface font-montserrat text-ink">
      <div className="mx-auto w-full max-w-7xl px-6 pt-20 sm:pt-24">
        <Reveal as="header" className="text-center">
          <h2 className="font-oswald text-2xl font-semibold uppercase tracking-[0.2em] text-ink-cherry sm:text-3xl">
            {heading}
          </h2>
          {intro && (
            <p className="mx-auto mt-4 max-w-2xl text-sm tracking-wide text-ink-soft sm:text-base">
              {intro}
            </p>
          )}
        </Reveal>
        <ul className="mt-14 grid gap-12 sm:grid-cols-3">
          {services.map(({ title, href, icon }, i) => {
            const Icon = icons[icon] ?? Recycle;
            return (
              <Reveal as="li" key={title} step={i % 3}>
                <Link
                  href={href}
                  title={title}
                  className="group flex flex-col items-center gap-5 text-center focus-visible:outline-none"
                >
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.75}
                    className="size-16 text-ink-cherry transition-transform group-hover:-translate-y-1 group-focus-visible:-translate-y-1"
                  />
                  <span className="font-oswald text-lg uppercase tracking-[0.3em] text-ink transition-colors group-hover:text-ink-cherry group-focus-visible:text-ink-cherry group-focus-visible:underline">
                    {title}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
