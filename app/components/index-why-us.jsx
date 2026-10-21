import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container, SectionHeading } from "@/app/services/sections";
import { HomePhoto } from "./index-photo";

// Why choose the yard, as photo plates under one rail: a row to swipe through
// on a phone, two columns from sm and three from lg. Each plate links to its
// page as a whole. The copy, photos and links come from the Home Page in Strapi
// (see lib/pages.js). The photos are stock from several sources, so they are
// graded into the site's red-black (see HomePhoto), taking their own colour
// back when the plate is hovered or focused.
export default function IndexWhyUs({ heading, intro, reasons }) {
  return (
    <section id="why-us" aria-labelledby="why-us-heading" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <SectionHeading id="why-us-heading" title={heading} intro={intro} />
        {/* On a phone the row runs out to the screen edges and snaps each plate
            to the page margin; the next plate peeking in shows there's more. */}
        <div className="mt-12 border-t-2 border-ink">
          <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 pt-8 pb-5 [scrollbar-width:thin] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 sm:overflow-visible sm:px-0 sm:pt-10 sm:pb-0 lg:grid-cols-3 lg:gap-x-8">
            {reasons.map((reason) => (
              <Reason key={reason.title} {...reason} />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

// The title's link stretches over the whole plate (its ::after), which also
// carries the focus ring. The arrow sits in a square cut from the photo's
// corner, in the page colour; it overhangs the photo by a pixel so no sliver of
// the photo's edge shows beside it.
function Reason({ title, description, image, href }) {
  return (
    <li className="group relative w-[82%] max-w-[22rem] shrink-0 snap-start sm:w-auto sm:max-w-none">
      <div className="relative aspect-[3/2]">
        {image ? (
          <HomePhoto
            image={image}
            widths={[480, 640, 960, 1280]}
            sizes="(min-width: 82.5rem) 25rem, (min-width: 64rem) calc((100vw - 8rem) / 3), (min-width: 40rem) calc((100vw - 5.5rem) / 2), min(82vw, 22rem)"
            className="size-full [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out-expo motion-safe:group-focus-within:[&_img]:scale-[1.04] motion-safe:group-hover:[&_img]:scale-[1.04]"
            gradeClassName="transition-opacity duration-300 ease-out-expo group-focus-within:opacity-0 group-hover:opacity-0"
          />
        ) : (
          <span className="block size-full rounded-[2px] bg-sunk" />
        )}
        {href && (
          <span
            aria-hidden="true"
            className="absolute -right-px -bottom-px grid size-[calc(3rem+1px)] place-items-center bg-ground"
          >
            <ArrowRight
              strokeWidth={2}
              className="size-5 text-ink-muted transition-[color,translate] duration-200 ease-out-expo group-focus-within:translate-x-0.5 group-focus-within:text-ink group-hover:translate-x-0.5 group-hover:text-ink"
            />
          </span>
        )}
      </div>
      <h3 className="mt-5 type-subheading text-ink">
        {href ? (
          <Link
            href={href}
            className="underline decoration-transparent decoration-1 underline-offset-[0.18em] transition-[text-decoration-color] duration-150 ease-out-expo after:absolute after:inset-0 hover:decoration-current focus-visible:decoration-current focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus"
          >
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      <p className="mt-2 text-base text-ink-soft">{description}</p>
    </li>
  );
}
