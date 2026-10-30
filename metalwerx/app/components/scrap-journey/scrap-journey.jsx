"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { steps } from "./steps";
import {
  STOP_COUNT,
  TAU_END,
  TOTAL_WEIGHT,
  clamp,
  copyOpacity,
  nearestStop,
  progressToTau,
  smoothstep,
  stopMid,
  tauToProgress,
} from "./world/timeline";

// The scrap journey above the home page hero: a pinned stage where scrolling
// flies a camera through a miniature 3D yard (./world), following one load of
// scrap from the customer's driveway to new metal, with each step's copy beside
// it. The copy is server-rendered for search engines and screen readers; the 3D
// world loads in the browser only. Without WebGL the steps show as a plain
// list, and without JavaScript the same markup falls back to one via
// NOSCRIPT_CSS. With reduced motion the camera cuts between the stops instead
// of flying.
//
// The page passes the hero's two CTAs, so the last step offers the same ones.

// Scroll length of the journey, in svh (stable while a phone's URL bar moves).
const TRACK_SVH = Math.round(TOTAL_WEIGHT * 100);
const SECTION_ID = "how-it-works";
const pad = (n) => String(n).padStart(2, "0");

const buttonClassName = "font-oswald uppercase tracking-[0.15em]";

export default function ScrapJourney({ primaryCta, secondaryCta }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const hostRef = useRef(null);
  const copyRefs = useRef([]);
  const dotRefs = useRef([]);
  const barRef = useRef(null);
  const hintRef = useRef(null);
  const jumpRef = useRef(() => {});
  const [mode, setMode] = useState("loading"); // loading | live | static

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const host = hostRef.current;
    if (!section || !stage || !host) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let world = null;
    let stopped = false;
    let raf = 0;
    let resizeFrame = 0;
    let visible = true;
    let tauTarget = 0;
    let tauNow = 0;
    let lastTime = performance.now();
    let idleFor = 0;
    let skip = 0;
    let shownStop = -1;
    let activeDot = -1;
    let slowStreak = 0;
    let sampleCount = 0;
    let sampleSum = 0;

    const viewMode = (w) => (w >= 1024 ? "side" : "bottom");

    function readScroll() {
      const scrollable = section.offsetHeight - stage.offsetHeight;
      const top = section.getBoundingClientRect().top;
      tauTarget = scrollable > 0 ? progressToTau(clamp(-top / scrollable)) : 0;
    }

    function jumpTo(i, behavior) {
      const scrollable = section.offsetHeight - stage.offsetHeight;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: sectionTop + tauToProgress(stopMid(i)) * scrollable,
        behavior: behavior ?? (reduce ? "auto" : "smooth"),
      });
    }
    jumpRef.current = jumpTo;

    function paint(tau) {
      for (let i = 0; i < STOP_COUNT; i++) {
        const el = copyRefs.current[i];
        if (!el) continue;
        const o = copyOpacity(i, tau);
        el.style.opacity = o.toFixed(3);
        // Drift up into place, then on up out of it.
        el.style.transform = reduce ? "none" : `translate3d(0, ${((1 - o) * (tau < stopMid(i) ? 22 : -22)).toFixed(1)}px, 0)`;
        el.style.pointerEvents = o > 0.5 ? "auto" : "none";
      }
      const near = nearestStop(tau);
      if (near !== activeDot) {
        activeDot = near;
        dotRefs.current.forEach((dot, k) => {
          if (!dot) return;
          if (k === near) dot.setAttribute("aria-current", "step");
          else dot.removeAttribute("aria-current");
        });
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${(tau / TAU_END).toFixed(4)})`;
      if (hintRef.current) hintRef.current.style.opacity = (1 - smoothstep(tau / 0.35)).toFixed(3);
    }

    function tick(now) {
      raf = 0;
      const dt = Math.min(0.1, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;
      const before = tauNow;
      tauNow += (tauTarget - tauNow) * (reduce ? 1 : 1 - Math.exp(-dt * 6.5));
      if (Math.abs(tauTarget - tauNow) < 1e-4) tauNow = tauTarget;
      const moving = tauNow !== before;
      idleFor = moving ? 0 : idleFor + dt;
      paint(tauNow);

      if (world) {
        if (reduce) {
          // No flying: each stop shows as a still that fades in when it changes.
          const stop = nearestStop(tauNow);
          if (stop !== shownStop) {
            shownStop = stop;
            world.frame({ tau: stopMid(stop), time: 0, dt: 0 });
            host.animate?.([{ opacity: 0.25 }, { opacity: 1 }], { duration: 260, easing: "ease-out" });
          }
        } else if (moving || idleFor < 1.5 || ++skip % 3 === 0) {
          // Once settled, the lamps and machines tick over at a third of the
          // frame rate to save battery.
          world.frame({ tau: tauNow, time: now / 1000, dt });
          if (moving && dt > 0) {
            sampleSum += dt;
            sampleCount++;
            if (sampleCount >= 45) {
              slowStreak = sampleSum / sampleCount > 1 / 38 ? slowStreak + 1 : 0;
              if (slowStreak >= 2) {
                world.degrade();
                slowStreak = 0;
              }
              sampleSum = 0;
              sampleCount = 0;
            }
          }
        }
      }
      if (visible && !stopped) raf = requestAnimationFrame(tick);
    }

    function wake() {
      if (!raf && visible && !stopped) {
        lastTime = performance.now();
        raf = requestAnimationFrame(tick);
      }
    }

    const onScroll = () => {
      readScroll();
      wake();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) wake();
      },
      { rootMargin: "200px 0px" }
    );

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        readScroll();
        world?.resize(stage.clientWidth, stage.clientHeight, viewMode(stage.clientWidth));
        wake();
      });
    });

    const themeObserver = new MutationObserver(() => {
      world?.setTheme(currentTheme());
      shownStop = -1;
      wake();
    });

    function stop() {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      world?.dispose();
      world = null;
      if (process.env.NODE_ENV !== "production") delete window.__scrapJourney;
    }

    function fallBack() {
      stop();
      setMode("static");
    }

    readScroll();
    tauNow = tauTarget;
    paint(tauNow);
    window.addEventListener("scroll", onScroll, { passive: true });
    io.observe(section);
    ro.observe(stage);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    (async () => {
      if (!hasWebGL()) {
        fallBack();
        return;
      }
      try {
        const { createWorld } = await import("./world/create-world");
        if (stopped) return;
        const created = await createWorld(host, {
          theme: currentTheme(),
          quality: pickQuality(),
          mode: viewMode(stage.clientWidth),
        });
        if (stopped) {
          created.dispose();
          return;
        }
        world = created;
        world.resize(stage.clientWidth, stage.clientHeight, viewMode(stage.clientWidth));
        readScroll();
        tauNow = tauTarget;
        world.frame({ tau: reduce ? stopMid(nearestStop(tauNow)) : tauNow, time: performance.now() / 1000, dt: 0 });
        shownStop = reduce ? nearestStop(tauNow) : -1;
        setMode("live");
        wake();
        if (process.env.NODE_ENV !== "production") {
          window.__scrapJourney = { world, jumpTo, tau: () => tauNow, scrollFor: (t) => scrollForTau(section, stage, t) };
        }
      } catch (err) {
        console.warn("[scrap-journey] the 3D world could not start", err);
        if (!stopped) fallBack();
      }
    })();

    return stop;
  }, []);

  if (mode === "static") {
    return (
      <section id={SECTION_ID} aria-labelledby="journey-title" className="bg-surface font-montserrat text-ink">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 id="journey-title" className="font-bebas-neue text-5xl tracking-wide text-ink sm:text-6xl">
            How It Works
          </h2>
          <ol className="mt-12 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.id} id={`journey-${step.id}`}>
                <StepCopy step={step} index={i} primaryCta={primaryCta} secondaryCta={secondaryCta} />
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        ref={sectionRef}
        id={SECTION_ID}
        aria-labelledby="journey-title"
        data-mode={mode}
        className="group/journey relative bg-surface font-montserrat text-ink"
        style={{ height: `calc(${TRACK_SVH}svh + 100dvh)` }}
      >
        <noscript>
          <style>{NOSCRIPT_CSS}</style>
        </noscript>

        <div ref={stageRef} data-stage className="sticky top-0 h-dvh overflow-hidden">
          {/* What shows until the 3D world has drawn its first frame. */}
          <div
            aria-hidden="true"
            data-backdrop
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_42%,var(--well),var(--surface)_72%)]"
          />
          <div
            ref={hostRef}
            aria-hidden="true"
            data-canvas
            className="absolute inset-0 opacity-0 transition-opacity duration-700 group-data-[mode=live]/journey:opacity-100"
          />
          {/* Scrims keep the copy readable over the scene: along the bottom on
              narrow screens, on the left on wide ones. */}
          <div
            aria-hidden="true"
            data-scrim
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-surface from-25% via-surface/70 via-45% to-transparent to-70% lg:bg-linear-to-r lg:from-surface/95 lg:from-0% lg:via-surface/60 lg:via-30% lg:to-transparent lg:to-55%"
          />

          <h2 id="journey-title" className="sr-only">
            How selling your scrap to Metal Werx works
          </h2>

          <ol data-steps className="absolute inset-0 mx-auto max-w-7xl">
            {steps.map((step, i) => (
              <li
                key={step.id}
                id={`journey-${step.id}`}
                ref={(el) => {
                  copyRefs.current[i] = el;
                }}
                data-copy
                onFocus={(event) => {
                  // Tabbing into a step that has faded out brings the journey to it.
                  if (Number(event.currentTarget.style.opacity || 1) < 0.5) jumpRef.current(i, "auto");
                }}
                className={cn(
                  "absolute inset-x-0 bottom-0 px-6 pb-[calc(4.5rem+env(safe-area-inset-bottom))] will-change-[opacity,transform]",
                  "lg:inset-x-auto lg:top-1/2 lg:bottom-auto lg:left-0 lg:w-[min(36rem,44vw)] lg:-translate-y-1/2 lg:pb-0",
                  i > 0 && "opacity-0"
                )}
              >
                <StepCopy step={step} index={i} primaryCta={primaryCta} secondaryCta={secondaryCta} />
              </li>
            ))}
          </ol>

          {/* The route rail: one dot per step; a click takes the journey there. */}
          <nav
            aria-label="Journey steps"
            className="absolute top-1/2 right-4 z-10 hidden -translate-y-1/2 flex-col gap-1 md:flex lg:right-6"
          >
            {steps.map((step, i) => (
              <button
                key={step.id}
                type="button"
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                onClick={() => jumpRef.current(i)}
                aria-label={`Step ${i + 1}: ${step.label}`}
                aria-current={i === 0 ? "step" : undefined}
                className="group/dot flex cursor-pointer items-center justify-end gap-3 rounded-full py-2 pl-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="pointer-events-none translate-x-1 font-oswald text-xs uppercase tracking-[0.15em] text-ink-soft opacity-0 transition duration-300 group-hover/dot:translate-x-0 group-hover/dot:opacity-100 group-aria-[current=step]/dot:translate-x-0 group-aria-[current=step]/dot:text-ink group-aria-[current=step]/dot:opacity-100">
                  {step.label}
                </span>
                <span className="size-2.5 rounded-full bg-ink-muted/60 ring-cherry/25 transition duration-300 group-hover/dot:bg-ink group-aria-[current=step]/dot:scale-125 group-aria-[current=step]/dot:bg-cherry group-aria-[current=step]/dot:ring-4" />
              </button>
            ))}
          </nav>

          {/* Progress along the journey. */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-cherry/15">
            <div ref={barRef} className="h-full origin-left scale-x-0 bg-cherry" />
          </div>

          <a
            href="#after-journey"
            data-skip
            className="absolute top-4 right-4 z-10 inline-flex items-center gap-2 rounded-full border border-input bg-surface/80 px-4 py-2 font-oswald text-xs uppercase tracking-[0.15em] text-ink-soft backdrop-blur-sm transition-colors hover:border-cherry hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:right-6"
          >
            Skip the tour
            <ArrowDown aria-hidden="true" className="size-3.5" />
          </a>

          <div
            ref={hintRef}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-oswald text-xs uppercase tracking-[0.25em] text-ink-muted lg:flex"
          >
            Scroll to follow your scrap
            <span className="relative h-8 w-5 rounded-full border-2 border-ink-muted/60">
              <span className="absolute top-1.5 left-1/2 h-2 w-1 -translate-x-1/2 animate-bounce rounded-full bg-cherry motion-reduce:animate-none" />
            </span>
          </div>
        </div>
      </section>
      <div id="after-journey" />
    </>
  );
}

function StepCopy({ step, index, primaryCta, secondaryCta }) {
  const last = index === steps.length - 1;
  return (
    <article>
      <p className="font-mono text-xs tracking-[0.2em] text-ink-muted">
        {pad(index + 1)} / {pad(steps.length)}
      </p>
      <p className="mt-3 font-oswald text-sm uppercase tracking-[0.3em] text-ink-cherry">{step.eyebrow}</p>
      {/* Bebas Neue only ships weight 400, so no font-bold (it would be faux bold). */}
      <h3 className="mt-2 font-bebas-neue text-5xl leading-[0.95] tracking-wide text-ink sm:text-6xl xl:text-7xl">
        {step.title}
      </h3>
      <p className="mt-4 max-w-[46ch] text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">{step.body}</p>
      {step.tags?.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {step.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-cherry/45 bg-surface/70 px-3 py-1 font-oswald text-xs uppercase tracking-[0.15em] text-ink backdrop-blur-sm"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
      {step.actions?.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {step.actions.map((action, k) => (
            <Button key={action.href} asChild size="lg" variant={k === 0 ? "default" : "outline"} className={buttonClassName}>
              <a href={action.href} title={action.text}>
                {action.text}
              </a>
            </Button>
          ))}
        </div>
      )}
      {last && (primaryCta || secondaryCta) && (
        <div className="mt-7 flex flex-wrap items-center gap-3">
          {primaryCta && (
            <Button asChild size="lg" className={buttonClassName}>
              <Link href={primaryCta.href} title={primaryCta.text}>
                {primaryCta.text}
              </Link>
            </Button>
          )}
          {secondaryCta && (
            <Button asChild size="lg" variant="outline" className={buttonClassName}>
              <Link href={secondaryCta.href} title={secondaryCta.text}>
                {secondaryCta.text}
              </Link>
            </Button>
          )}
        </div>
      )}
    </article>
  );
}

function currentTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

// Phones and small or low-memory devices get fewer pixels, smaller shadow maps
// and fewer lamps. The world also steps down by itself if frames run slow.
function pickQuality() {
  const coarse = matchMedia("(pointer: coarse)").matches;
  const small = Math.min(screen.width, screen.height) < 768;
  const memory = navigator.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const dpr = window.devicePixelRatio || 1;
  const low = coarse || small || memory <= 4 || cores <= 4;
  return low
    ? { tier: "low", dpr: Math.min(dpr, 1.5), antialias: dpr < 1.5, shadows: true, shadowMapSize: 1024, maxLights: 3, maxPixels: 1.3e6 }
    : { tier: "high", dpr: Math.min(dpr, 2), antialias: true, shadows: true, shadowMapSize: 2048, maxLights: 8, maxPixels: 2.6e6 };
}

// For QA in development: the window.scrollY that shows tau.
function scrollForTau(section, stage, tau) {
  const scrollable = section.offsetHeight - stage.offsetHeight;
  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  return sectionTop + tauToProgress(tau) * scrollable;
}

// Without JavaScript nothing moves, so the pinned stage becomes a plain list.
const NOSCRIPT_CSS = `
#${SECTION_ID}{height:auto!important}
#${SECTION_ID} [data-stage]{position:static;height:auto;overflow:visible}
#${SECTION_ID} [data-backdrop],#${SECTION_ID} [data-canvas],#${SECTION_ID} [data-scrim],#${SECTION_ID} nav,#${SECTION_ID} [data-skip],#${SECTION_ID} [aria-hidden="true"]{display:none}
#${SECTION_ID} [data-steps]{position:static;display:grid;gap:3rem;padding:5rem 1.5rem}
#${SECTION_ID} [data-copy]{position:static;opacity:1;translate:none;width:auto;padding:0}
`;
