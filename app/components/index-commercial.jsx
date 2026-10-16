import Link from "next/link";
import { FilePenLine, Handshake, Truck } from "lucide-react";

// As in the navbar, /services is a placeholder for a page still to be built.
const services = [
  { title: "Join Us", href: "/services#commercial", icon: Handshake },
  { title: "Arrange a Pick Up", href: "/services#collection", icon: Truck },
  { title: "Request a Bin", href: "/services#bin-hire", icon: FilePenLine },
];

// cherry rather than cherry-bright on this white section: bright red text on
// white falls short of WCAG AA contrast.
export default function IndexCommercial() {
  return (
    <section id="commercial" className="bg-white font-montserrat text-carbon">
      <div className="mx-auto w-full max-w-7xl px-6 pt-20 sm:pt-24">
        <header className="text-center">
          <h2 className="font-oswald text-2xl font-semibold uppercase tracking-[0.2em] text-cherry sm:text-3xl">
            Commercial and Industrial Customers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm tracking-wide text-graphite sm:text-base">
            We offer a range of services to make recycling your scrap more convenient and rewarding.
          </p>
        </header>
        <ul className="mt-14 grid gap-12 sm:grid-cols-3">
          {services.map(({ title, href, icon: Icon }) => (
            <li key={title}>
              <Link
                href={href}
                className="group flex flex-col items-center gap-5 text-center focus-visible:outline-none"
              >
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className="size-16 text-cherry transition-transform group-hover:-translate-y-1 group-focus-visible:-translate-y-1"
                />
                <span className="font-oswald text-lg uppercase tracking-[0.3em] text-carbon transition-colors group-hover:text-cherry group-focus-visible:text-cherry group-focus-visible:underline">
                  {title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
