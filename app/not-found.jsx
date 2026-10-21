import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

import { Container } from "@/app/services/sections";
import { Button } from "@/components/ui/button";
import { YARD } from "@/lib/yard";

const description = "This page doesn't exist yet or has moved.";

export const metadata = {
  title: "Page not found",
  description,
};

// Where to go from here, most likely first.
const ways = [
  { name: "Back to home", href: "/" },
  { name: "What we buy", href: "/what-we-buy" },
  { name: "Services", href: "/services" },
  { name: "Contact us", href: "/contact-us" },
];

// Shown for any URL without a page, including the navbar and footer links to
// pages still to be built. Posts that don't exist get app/blogs/[slug]/not-found.jsx.
//
// The page is laid out like a material page's header, but its rack bay is
// empty. On wide screens the two columns and the four links share one grid
// (equal halves, 4rem gaps), so the third link lines up under the bay, and the
// bay and the Call button stand on the same line, as stock sits on its arm.
export default function NotFound() {
  return (
    <main id="main" className="flex-1 pt-10 pb-20 sm:pt-14 sm:pb-24 lg:pt-16 lg:pb-28">
      <Container className="grid gap-y-10 sm:gap-y-12 lg:grid-cols-2 lg:items-end lg:gap-x-16 lg:gap-y-16">
        <div>
          <h1 className="type-title text-ink">Page not found</h1>
          <p className="mt-5 max-w-[58ch] type-lede text-ink-soft sm:mt-6">{description}</p>
          <div className="mt-8">
            <Button asChild size="lg">
              <a href={YARD.phoneHref} className="tabular">
                <Phone aria-hidden="true" />
                Call {YARD.phone}
              </a>
            </Button>
          </div>
        </div>

        <EmptyBay />

        <nav aria-label="Other pages" className="lg:col-span-2">
          <ul className="grid border-t-2 border-ink sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-16">
            {ways.map(({ name, href }) => (
              <li key={href} className="border-b border-rule lg:border-b-0">
                <Link
                  href={href}
                  className="group flex items-center justify-between gap-3 py-4 text-lg font-bold text-ink lg:w-fit lg:justify-start lg:py-5"
                >
                  <span className="underline-offset-[0.22em] group-hover:underline">{name}</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-5 shrink-0 text-ink-muted transition-colors duration-150 ease-out-expo group-hover:text-ink"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </main>
  );
}

// A rack bay with nothing on its arm, the same size as the bay beside a
// material page's title, with the stamped code where the metal's would be.
// Below lg it runs the full width, so it is lower: a long shelf, and on phones
// low enough that the ways onward stay on the first screen.
// Decorative: the heading says the same thing in words.
function EmptyBay() {
  return (
    <div aria-hidden="true" className="on-rack rounded-[2px] bg-rack px-6 pt-8 pb-5 text-rack-ink">
      <div className="mx-auto aspect-[5/2] max-w-[22rem] sm:aspect-[3/1] lg:aspect-[220/150]" />
      <div className="mt-0.5 h-1.5 rounded-[1px] bg-rack-arm" />
      <p className="mt-3 type-code text-3xl text-rack-ink-soft">404</p>
    </div>
  );
}
