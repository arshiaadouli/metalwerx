"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

// NotFoundGlitch from 21st.dev (be-ui-404-not-found), ported to JSX. A big
// status code that scrambles into place on load and splits into red and cyan
// copies on hover, with a title, a description and two links. Props:
//   code?                   the big text (default "404")
//   title?, description?
//   homeHref?, homeLabel?   the solid link (default "/", "Go home")
//   browseHref?, browseLabel?  the outlined link (default "/", "Browse pages")
//   className?              added to the outer <section>
// With reduced motion on, the code shows as-is and never splits.

const NOT_FOUND_DEFAULTS = {
  code: "404",
  title: "Page not found",
  description: "The page you are looking for does not exist or has been moved.",
  homeHref: "/",
  homeLabel: "Go home",
  browseHref: "/",
  browseLabel: "Browse pages",
};

function NotFoundStage({ className, children }) {
  return (
    <section
      className={cn(
        "flex min-h-[520px] w-full flex-col items-center justify-center gap-8 px-6 py-20 text-center",
        className,
      )}
    >
      {children}
    </section>
  );
}

function NotFoundActions({
  homeHref = NOT_FOUND_DEFAULTS.homeHref,
  homeLabel = NOT_FOUND_DEFAULTS.homeLabel,
  browseHref = NOT_FOUND_DEFAULTS.browseHref,
  browseLabel = NOT_FOUND_DEFAULTS.browseLabel,
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Link
        href={homeHref}
        title={homeLabel}
        className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-transform active:scale-[0.97]"
      >
        {homeLabel}
      </Link>

      <Link
        href={browseHref}
        title={browseLabel}
        className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-transform hover:bg-muted active:scale-[0.97]"
      >
        {browseLabel}
      </Link>
    </div>
  );
}

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?/\\";
const SCRAMBLE_MS = 700;
const TICK_MS = 45;

// Cycles random glyphs that settle left to right into the text.
function Scramble({ text }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reduce) return;

    const chars = text.split("");
    const start = performance.now();
    let raf = 0;
    let last = 0;

    const loop = (now) => {
      if (now - last >= TICK_MS) {
        last = now;

        const progress = Math.min((now - start) / SCRAMBLE_MS, 1);
        const settled = Math.floor(progress * chars.length);

        setDisplay(
          chars
            .map((ch, i) =>
              i < settled || ch === " "
                ? ch
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join(""),
        );
      }

      if (now - start < SCRAMBLE_MS) {
        raf = requestAnimationFrame(loop);
      } else {
        setDisplay(text);
      }
    };

    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, [text, reduce]);

  return <span className="tabular-nums">{reduce ? text : display}</span>;
}

export function NotFoundGlitch({
  className,
  code = NOT_FOUND_DEFAULTS.code,
  title = NOT_FOUND_DEFAULTS.title,
  description = NOT_FOUND_DEFAULTS.description,
  homeHref,
  homeLabel,
  browseHref,
  browseLabel,
}) {
  // The red and cyan copies screen-blend on the dark theme, but screen turns
  // them white on a white page, so the light theme multiplies instead.
  return (
    <NotFoundStage className={className}>
      <div className="group relative select-none font-mono font-bold leading-none tracking-tighter text-foreground [font-size:clamp(5rem,18vw,11rem)]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 text-[#ff0040] opacity-0 mix-blend-screen transition-[transform,opacity] duration-150 ease-out group-hover:translate-x-[3px] group-hover:opacity-70 motion-reduce:hidden light:mix-blend-multiply"
        >
          <Scramble text={code} />
        </span>

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 text-[#00e5ff] opacity-0 mix-blend-screen transition-[transform,opacity] duration-150 ease-out group-hover:-translate-x-[3px] group-hover:opacity-70 motion-reduce:hidden light:mix-blend-multiply"
        >
          <Scramble text={code} />
        </span>

        <h1 className="relative">
          <Scramble text={code} />
        </h1>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-semibold text-foreground">{title}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>

      <NotFoundActions
        homeHref={homeHref}
        homeLabel={homeLabel}
        browseHref={browseHref}
        browseLabel={browseLabel}
      />
    </NotFoundStage>
  );
}
