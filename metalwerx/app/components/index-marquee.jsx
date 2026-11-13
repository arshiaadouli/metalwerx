import Link from "next/link";
import Marquee from "react-fast-marquee";
import { Recycle } from "lucide-react";
import { getMaterials } from "@/app/what-we-buy/materials";

// A scrolling band of what the yard buys, between the hero and the commercial
// section. The items are the ticker in the CMS (see lib/cms.js). An item links
// to the material with that title, and "Aluminium", which has three pages, to
// the one its old page redirects to (see next.config.mjs). An item that isn't
// a material is plain text, so the band never links to a page that isn't there.
// Cherry and chrome are fixed palette colours, so the band looks the same in
// both themes.
export default async function IndexMarquee({ items }) {
  const materials = await getMaterials();
  const pages = new Map([
    ["aluminium", "/what-we-buy/alloy-mix"],
    ...materials.map(({ title, slug }) => [title.toLowerCase(), `/what-we-buy/${slug}`]),
  ]);
  const label = (item, props) => {
    const href = pages.get(item.toLowerCase());
    return href ? (
      <Link href={href} {...props}>
        {item}
      </Link>
    ) : (
      item
    );
  };

  return (
    <div
      id="ticker"
      className="bg-cherry font-oswald text-base font-medium uppercase tracking-[0.2em] text-chrome sm:text-lg"
    >
      {/* The marquee repeats its items and renders nothing until it mounts, so
          this list is the one search engines, screen readers and the Tab key
          get. It shows while one of its links has keyboard focus. */}
      <ul className="sr-only flex flex-wrap justify-center focus-within:not-sr-only">
        {items.map((item) => (
          <li key={item}>{label(item, { className: "block p-3" })}</li>
        ))}
      </ul>
      {/* h-14 holds the marquee's space until it mounts, so the page doesn't
          jump. It pauses while hovered, so its links can be clicked; they're
          kept out of the tab order because the list above has them. */}
      <div aria-hidden="true" className="flex h-14 items-center">
        <Marquee autoFill pauseOnHover speed={40}>
          {items.map((item) => (
            <span key={item} className="flex items-center gap-6 pr-6">
              {label(item, { tabIndex: -1, className: "underline-offset-4 hover:underline" })}
              <Recycle strokeWidth={1.75} className="size-4 text-chrome/60" />
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
