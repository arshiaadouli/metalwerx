import Link from "next/link";
import {
  Car,
  ChevronRight,
  Container as ContainerIcon,
  Factory,
  FilePenLine,
  Handshake,
  Phone,
  Recycle,
  Truck,
} from "lucide-react";

import { Container, SectionHeading } from "@/app/services/sections";

// The icon choices in Strapi's Service component, by the value Strapi stores.
const icons = {
  handshake: Handshake,
  truck: Truck,
  "file-pen": FilePenLine,
  recycle: Recycle,
  car: Car,
  factory: Factory,
  container: ContainerIcon,
  phone: Phone,
};

// The ways in for businesses, as a band on the sunk ground, ruled off above and
// below so it holds in the dark theme too, where sunk and ground sit close: the
// heading on the left, and each service a full-width row with its icon on a
// small rack plate. The copy and links come from the Home Page in Strapi (see
// lib/pages.js).
export default function IndexCommercial({ heading, intro, services }) {
  return (
    <section
      id="commercial"
      aria-labelledby="commercial-heading"
      className="scroll-mt-24 border-y border-rule bg-sunk py-20 sm:py-28"
    >
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <SectionHeading id="commercial-heading" title={heading} intro={intro} className="max-w-[34rem]" />
        <ul className="border-t-2 border-ink">
          {services.map(({ title, href, icon }) => {
            const Icon = icons[icon] ?? Recycle;
            return (
              <li key={title} className="border-b border-rule">
                <Link href={href} className="group flex items-center gap-5 py-5 sm:gap-7 sm:py-7">
                  <span className="grid size-12 shrink-0 place-items-center rounded-[2px] bg-rack text-rack-ink sm:size-14">
                    <Icon aria-hidden="true" strokeWidth={1.75} className="size-6 sm:size-7" />
                  </span>
                  <span className="min-w-0 flex-1 type-subheading text-ink underline decoration-transparent decoration-1 underline-offset-[0.18em] transition-[text-decoration-color] duration-150 ease-out-expo group-hover:decoration-current group-focus-visible:decoration-current sm:text-[1.625rem]">
                    {title}
                  </span>
                  <ChevronRight
                    aria-hidden="true"
                    strokeWidth={2}
                    className="size-6 shrink-0 text-ink-muted transition-[color,translate] duration-150 ease-out-expo group-hover:translate-x-1 group-hover:text-ink group-focus-visible:text-ink"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
