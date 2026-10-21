import { ViewTransition } from "react";
import Link from "next/link";
import { Bundle } from "@/components/metal/metal";
import { metalCode } from "@/lib/metals";
import { cn } from "@/lib/utils";

// One material in its bay on the rack field: its bundle of stock on an arm,
// the stamped code and name under it, then the line that says what it covers.
// /what-we-buy lists every material this way, and each material page lists
// three more under "We also buy".
//
// The name is the link, and it stretches over the whole bay, so the bay is one
// target with a short link name. Hovering lifts the stock off its arm and
// lights the arm, as picking a bay does on the home rack. The bundle shares its
// view-transition name with the RackBay in the material page's header, so it
// carries across into the header; a page may show each material's bay once.
// Render inside an `on-rack` section, as a child of a <ul>.
export function MaterialBay({ slug, title, summary, id, className }) {
  return (
    <li
      id={id}
      className={cn(
        "group/bay relative scroll-mt-24 transition-transform duration-150 ease-out-expo active:scale-[0.98]",
        className,
      )}
    >
      <ViewTransition name={`metal-${slug}`} share="metal-morph" default="none">
        <div className="transition-transform duration-150 ease-out-expo group-hover/bay:-translate-y-1">
          <Bundle slug={slug} />
        </div>
      </ViewTransition>
      <div
        aria-hidden="true"
        className="mt-0.5 h-1.5 rounded-[1px] bg-rack-arm transition-colors duration-150 ease-out-expo group-hover/bay:bg-rack-ink"
      />
      <h3 className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
        <span aria-hidden="true" className="type-code text-2xl text-rack-ink">
          {metalCode(slug)}
        </span>
        <Link
          href={`/what-we-buy/${slug}`}
          className="text-[1.0625rem] leading-tight font-bold [font-stretch:104%] text-rack-ink focus-visible:[outline:none] after:absolute after:inset-0 focus-visible:after:[outline:2px_solid_var(--focus)] focus-visible:after:outline-offset-8"
        >
          {title}
        </Link>
      </h3>
      <p className="mt-1.5 max-w-[34ch] text-[0.9375rem] leading-snug text-rack-ink-soft">{summary}</p>
    </li>
  );
}
