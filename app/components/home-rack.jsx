"use client";

import { useEffect, useRef, useState, ViewTransition } from "react";
import Link from "next/link";

import { Bundle } from "@/components/metal/metal";
import { cn } from "@/lib/utils";

// The home page rack: one bay per metal, each a bundle of that metal's stock
// seen end-on, and the grade tag of the picked bay standing out of the rack.
// It is a set of tabs (the bays) and their panel (the tag), so the arrow keys
// move between metals. The pick goes in the URL hash (/#brass), so a link can
// open the rack on any metal, without adding a history entry for every pick.
// Props:
//   bays   from getRackBays() in lib/metals.js
//   ticker the Home Page's ticker in Strapi, listed along the foot of the rack

export default function HomeRack({ bays, ticker = [] }) {
  const [picked, setPicked] = useState(bays[0].id);
  const tabRefs = useRef({});
  const panelRef = useRef(null);
  const bay = bays.find((b) => b.id === picked) ?? bays[0];

  // Open on the metal named in the hash, if there is one.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (bays.some((b) => b.id === id)) setPicked(id);
  }, [bays]);

  function pick(id, { focus = false } = {}) {
    setPicked(id);
    window.history.replaceState(window.history.state, "", `#${id}`);
    if (focus) tabRefs.current[id]?.focus();
  }

  // On a phone the tag sits under the rack, so bring it into view after a tap.
  function revealPanel() {
    const panel = panelRef.current;
    if (!panel || window.matchMedia("(min-width: 64rem)").matches) return;
    const { top, bottom } = panel.getBoundingClientRect();
    if (top < window.innerHeight - 120 && bottom > 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panel.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  function onKeyDown(event) {
    const i = bays.findIndex((b) => b.id === picked);
    const last = bays.length - 1;
    const next = {
      ArrowRight: i === last ? 0 : i + 1,
      ArrowDown: i === last ? 0 : i + 1,
      ArrowLeft: i === 0 ? last : i - 1,
      ArrowUp: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    pick(bays[next].id, { focus: true });
  }

  return (
    <section aria-labelledby="rack-heading" className="on-rack bg-rack text-rack-ink">
      <div className="mx-auto grid w-full max-w-[82.5rem] gap-10 px-5 pt-12 pb-10 sm:px-8 sm:pt-14 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-12">
        <div>
          <h2 id="rack-heading" className="type-heading text-rack-ink">
            What have you got?
          </h2>
          <p className="mt-2 text-base text-rack-ink-soft">Pick your metal to see the grades we buy.</p>

          <div
            role="tablist"
            aria-label="Metals we buy"
            onKeyDown={onKeyDown}
            className="mt-10 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-7 sm:gap-y-9"
          >
            {bays.map((b, i) => {
              const selected = b.id === picked;
              return (
                <button
                  key={b.id}
                  ref={(el) => {
                    tabRefs.current[b.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`rack-tab-${b.id}`}
                  aria-selected={selected}
                  aria-controls="rack-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => {
                    pick(b.id);
                    revealPanel();
                  }}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="group/bay animate-rack-in cursor-pointer text-left focus-visible:outline-offset-8"
                >
                  <ViewTransition name={`metal-${b.bundle}`} share="metal-morph" default="none">
                    <span
                      className={cn(
                        "block transition-transform duration-200 ease-out-expo",
                        selected ? "-translate-y-2" : "group-hover/bay:-translate-y-1",
                      )}
                    >
                      <Bundle slug={b.bundle} />
                    </span>
                  </ViewTransition>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 block h-1.5 rounded-[1px] transition-colors duration-200",
                      selected ? "bg-rack-ink" : "bg-rack-arm",
                    )}
                  />
                  <span className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                    <span className="type-code text-xl sm:text-2xl">{b.code}</span>
                    <span
                      className={cn(
                        "text-sm font-semibold transition-colors duration-200 sm:text-[0.9375rem]",
                        selected ? "text-rack-ink" : "text-rack-ink-soft",
                      )}
                    >
                      {b.name}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={panelRef}
          id="rack-panel"
          role="tabpanel"
          aria-labelledby={`rack-tab-${bay.id}`}
          className="relative scroll-mt-24 animate-tag-out [animation-delay:380ms] lg:mt-2"
        >
          {/* The wire the tag hangs from. */}
          <span aria-hidden="true" className="absolute -top-12 left-[2.125rem] hidden h-16 w-0.5 bg-linear-to-b from-rack-arm to-rack-ink-soft lg:block" />
          <div className="relative rounded-[3px] bg-tag pt-7 pr-6 pb-7 pl-16 text-tag-ink sm:pr-7">
            {/* The punched hole. */}
            <span aria-hidden="true" className="absolute top-8 left-6 size-[1.125rem] rounded-full bg-rack shadow-[inset_0_0_0_3px_var(--tag-rule)]" />
            <TagBody key={bay.id} bay={bay} />
          </div>
        </div>
      </div>

      {ticker.length > 0 && (
        <div className="border-t border-rack-rule">
          <ul className="mx-auto flex w-full max-w-[82.5rem] flex-wrap gap-x-5 gap-y-2 px-5 py-5 text-sm text-rack-ink-soft sm:px-8">
            {ticker.map((item) => (
              <li key={item} className="flex items-center gap-5">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-rack-arm" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

// The tag's contents for one bay. Keyed by bay, so each pick plays the swap.
function TagBody({ bay }) {
  return (
    <div className="animate-tag-swap">
      <p className="type-code text-6xl sm:text-7xl" style={{ color: CODE_INK[bay.id] }}>
        {bay.code}
      </p>
      <h3 className="mt-2 type-subheading text-tag-ink">{bay.name}</h3>
      <p className="mt-1 text-[0.9375rem] leading-snug text-tag-ink-soft">{bay.summary}</p>

      <h4 className="mt-6 type-meta text-tag-ink-muted">{bay.listTitle}</h4>
      <ul className="mt-2 border-t border-tag-rule">
        {bay.list.map((item) => (
          <li key={item.title} className="border-b border-tag-rule py-2.5">
            {item.href ? (
              <Link
                href={item.href}
                className="font-bold text-tag-ink underline-offset-[0.22em] hover:underline"
              >
                {item.title}
              </Link>
            ) : (
              <span className="font-bold text-tag-ink">{item.title}</span>
            )}
            <span className="mt-0.5 block text-sm leading-snug text-tag-ink-soft">{item.text}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-sm leading-relaxed text-tag-ink-soft">
        Weighed at our Hallam yard and paid by bank transfer. Bring photo ID.
      </p>
      <p className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <Link
          href={bay.href}
          className="font-bold text-tag-ink underline underline-offset-[0.22em] hover:no-underline"
        >
          {bay.linkText}
        </Link>
        {bay.also.length > 0 && (
          <span className="text-sm text-tag-ink-soft">
            Also{" "}
            {bay.also.map((item, i) => (
              <span key={item.href}>
                {i > 0 && " and "}
                <Link
                  href={item.href}
                  className="text-tag-ink underline underline-offset-[0.22em] hover:no-underline"
                >
                  {item.title}
                </Link>
              </span>
            ))}
          </span>
        )}
      </p>
    </div>
  );
}

// The code stamped on each tag, in the darkest tone of its metal, which still
// reads at 4.5:1 or better on the aluminium tag.
const CODE_INK = {
  copper: "#8E4A24",
  brass: "#7A5D16",
  aluminium: "#5F686F",
  stainless: "#4F6474",
  lead: "#48515A",
  steel: "#3C454D",
};
