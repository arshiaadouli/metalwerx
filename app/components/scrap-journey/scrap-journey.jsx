"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, Phone } from "lucide-react";

import { Container } from "@/app/services/sections";
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

// The scrap journey under the home page rack: a pinned stage where scrolling
// flies a camera over a galvanised model of the yard (./world), following one
// load of scrap from the customer's driveway to new metal, with each step's
// copy beside it. The copy is server-rendered for search engines and screen
// readers; the 3D world loads in the browser only. Without WebGL the steps
// show as a plain list, and without JavaScript the same markup falls back to
// one via NOSCRIPT_CSS. With reduced motion the camera cuts between the stops
// instead of flying.
//
// The page passes the hero's two CTAs, so the last step offers the same ones.

// Scroll length of the journey, in svh (stable while a phone's URL bar moves).
const TRACK_SVH = Math.round(TOTAL_WEIGHT * 100);
const SECTION_ID = "how-it-works";

// The site header is sticky (components/site/site-header.jsx): 64px tall on
// phones and 72px from lg, over its 1px rule. The stage pins just under it, so
// nothing on the stage sits behind the header.
const UNDER_HEADER = "[--journey-top:calc(4rem_+_1px)] lg:[--journey-top:calc(4.5rem_+_1px)]";

// The copy column and the controls line up with the page width (Container).
const PAGE = "mx-auto w-full max-w-[82.5rem] px-5 sm:px-8";

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
    // Where the stage pins, under the header; read again on resize.
    let pinTop = stickyTop(stage);

    const viewMode = (w) => (w >= 1024 ? "side" : "bottom");

    function readScroll() {
      const scrollable = section.offsetHeight - stage.offsetHeight;
      const top = section.getBoundingClientRect().top - pinTop;
      tauTarget = scrollable > 0 ? progressToTau(clamp(-top / scrollable)) : 0;
    }

    function jumpTo(i, behavior) {
      const scrollable = section.offsetHeight - stage.offsetHeight;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY - pinTop;
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
            host.animate?.([{ opacity: 0.25 }, { opacity: 1 }], { duration: 260, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
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
        pinTop = stickyTop(stage);
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
      <section id={SECTION_ID} aria-labelledby="journey-title" className="scroll-mt-24 bg-ground py-20 text-ink sm:py-28">
        <Container>
          <h2 id="journey-title" className="type-heading text-ink">
            How it works
          </h2>
          <ol className="mt-12 grid gap-x-8 gap-y-12 border-t-2 border-ink sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.id} id={`journey-${step.id}`} className="pt-6">
                <StepCopy step={step} index={i} primaryCta={primaryCta} secondaryCta={secondaryCta} compact />
              </li>
            ))}
          </ol>
        </Container>
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
        className={cn("group/journey relative scroll-mt-(--journey-top) bg-ground text-ink", UNDER_HEADER)}
        style={{ height: `calc(${TRACK_SVH}svh + 100dvh - var(--journey-top))` }}
      >
        <noscript>
          <style>{NOSCRIPT_CSS}</style>
        </noscript>

        <div
          ref={stageRef}
          data-stage
          className="sticky top-(--journey-top) h-[calc(100dvh_-_var(--journey-top))] overflow-hidden"
        >
          {/* What shows until the 3D world has drawn its first frame: the
              page ground, which the world's own background matches. */}
          <div aria-hidden="true" data-backdrop className="absolute inset-0 bg-ground" />
          <div
            ref={hostRef}
            aria-hidden="true"
            data-canvas
            className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-out-expo group-data-[mode=live]/journey:opacity-100"
          />
          {/* Scrims fade the model into the page ground under the copy: along
              the bottom on narrow screens, on the left on wide ones. */}
          <div
            aria-hidden="true"
            data-scrim
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-ground from-40% via-ground/85 via-55% to-transparent to-75% lg:bg-linear-to-r lg:from-ground lg:from-0% lg:via-ground/85 lg:via-35% lg:to-transparent lg:to-58%"
          />

          <h2 id="journey-title" className="sr-only type-heading text-ink">
            How selling your scrap to Metal Werx works
          </h2>

          <ol data-steps className="absolute inset-0 mx-auto max-w-[82.5rem]">
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
                  "absolute inset-x-0 bottom-0 px-5 pb-[calc(4.5rem_+_env(safe-area-inset-bottom))] will-change-[opacity,transform] sm:px-8",
                  "lg:inset-x-auto lg:top-1/2 lg:bottom-auto lg:left-0 lg:w-[min(38rem,46vw)] lg:-translate-y-1/2 lg:pb-0",
                  i > 0 && "opacity-0"
                )}
              >
                <StepCopy step={step} index={i} primaryCta={primaryCta} secondaryCta={secondaryCta} />
              </li>
            ))}
          </ol>

          {/* The route rail: one stop per step; a click takes the journey there. */}
          <div data-rail className={cn("pointer-events-none absolute inset-0", PAGE)}>
            <nav
              aria-label="Journey steps"
              className="pointer-events-auto absolute top-1/2 right-5 hidden -translate-y-1/2 flex-col md:flex sm:right-8"
            >
              <span aria-hidden="true" className="absolute inset-y-[1.375rem] right-[0.3125rem] w-px bg-rule" />
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
                  className="group/dot relative flex h-11 cursor-pointer items-center justify-end gap-3 pl-3"
                >
                  <span className="pointer-events-none translate-x-1 rounded-[2px] bg-ground px-2 py-0.5 type-meta text-ink opacity-0 transition-[opacity,translate] duration-150 ease-out-expo group-hover/dot:translate-x-0 group-hover/dot:opacity-100 group-focus-visible/dot:translate-x-0 group-focus-visible/dot:opacity-100 group-aria-[current=step]/dot:translate-x-0 group-aria-[current=step]/dot:opacity-100">
                    {step.label}
                  </span>
                  <span className="size-2.5 rounded-[1px] bg-ground shadow-[inset_0_0_0_1.5px_var(--ink)] transition-[background-color,box-shadow,scale] duration-150 ease-out-expo group-hover/dot:bg-ink group-aria-[current=step]/dot:scale-125 group-aria-[current=step]/dot:bg-action group-aria-[current=step]/dot:shadow-none" />
                </button>
              ))}
            </nav>
          </div>

          {/* Progress along the journey, under the header's rule. */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5">
            <div ref={barRef} className="h-full origin-left bg-action" style={{ transform: "scaleX(0)" }} />
          </div>

          <div data-skip className={cn("pointer-events-none absolute inset-x-0 top-0 z-10", PAGE)}>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="pointer-events-auto absolute top-4 right-5 h-11 bg-ground sm:top-5 sm:right-8"
            >
              <a href="#after-journey">
                Skip the tour
                <ArrowDown aria-hidden="true" />
              </a>
            </Button>
          </div>

          <div ref={hintRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-x-0 bottom-8 hidden lg:block", PAGE)}>
            <p className="flex items-center gap-2 type-meta text-ink-muted">
              <ArrowDown className="size-4" />
              Scroll to follow your scrap
            </p>
          </div>
        </div>
      </section>
      <div id="after-journey" className={cn("scroll-mt-(--journey-top)", UNDER_HEADER)} />
    </>
  );
}

// A step's copy. Its eyebrow ("Step 1 · Call ahead") reads as a line under
// the title: the step, then its name. compact is for the plain list.
function StepCopy({ step, index, primaryCta, secondaryCta, compact = false }) {
  const last = index === steps.length - 1;
  const [number, name] = step.eyebrow?.split(" · ") ?? [`Step ${index + 1}`, step.label];
  return (
    <article>
      <h3 className={cn("text-ink", compact ? "type-subheading" : "type-heading max-w-[18ch]")}>{step.title}</h3>
      <p className="mt-2 flex flex-wrap items-baseline gap-x-2.5 type-meta">
        <span className="text-ink">
          {number}
          <span className="sr-only">:</span>
        </span>
        {name && <span className="text-ink-muted">{name}</span>}
      </p>
      <p className={cn("mt-4 max-w-[46ch] text-ink-soft", compact ? "text-base" : "type-lede")}>{step.body}</p>
      {step.tags?.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {step.tags.map((tag) => (
            <li key={tag} className="rounded-[2px] bg-sunk px-2.5 py-1 type-meta text-ink-soft">
              {tag}
            </li>
          ))}
        </ul>
      )}
      {step.actions?.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          {step.actions.map((action) => {
            const call = action.href.startsWith("tel:");
            const Anchor = action.href.startsWith("/") ? Link : "a";
            return (
              <Button key={action.href} asChild variant={call ? "default" : "outline"} className="max-sm:w-full">
                <Anchor href={action.href} title={action.text} className={call ? "tabular" : undefined}>
                  {call && <Phone aria-hidden="true" />}
                  {action.text}
                </Anchor>
              </Button>
            );
          })}
        </div>
      )}
      {last && (primaryCta || secondaryCta) && (
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          {primaryCta && (
            <Button asChild variant="outline" className="max-sm:w-full">
              <Link href={primaryCta.href}>
                {primaryCta.text}
              </Link>
            </Button>
          )}
          {secondaryCta && (
            <Button asChild variant="quiet" className="max-sm:w-full">
              <Link href={secondaryCta.href}>
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

// How far below the top of the viewport the stage pins (its sticky top).
function stickyTop(stage) {
  return parseFloat(getComputedStyle(stage).top) || 0;
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
  const sectionTop = section.getBoundingClientRect().top + window.scrollY - stickyTop(stage);
  return sectionTop + tauToProgress(tau) * scrollable;
}

// Without JavaScript nothing moves, so the pinned stage becomes a plain list
// on the page ground, laid out like the static one: the heading, a 2px ink
// rail, then the steps.
const NOSCRIPT_CSS = `
#${SECTION_ID}{height:auto!important;padding:5rem 0}
#${SECTION_ID} [data-stage]{position:static;height:auto;overflow:visible;max-width:82.5rem;margin:0 auto;padding:0 1.25rem}
#${SECTION_ID} [data-backdrop],#${SECTION_ID} [data-canvas],#${SECTION_ID} [data-scrim],#${SECTION_ID} [data-rail],#${SECTION_ID} [data-skip],#${SECTION_ID} [aria-hidden="true"]{display:none}
#${SECTION_ID} h2{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto;clip-path:none;white-space:normal}
#${SECTION_ID} [data-steps]{position:static;display:grid;gap:3rem;max-width:none;margin-top:3rem;padding-top:1.5rem;border-top:2px solid var(--ink)}
#${SECTION_ID} [data-copy]{position:static;opacity:1;translate:none;width:auto;padding:0}
@media (min-width:40rem){#${SECTION_ID} [data-stage]{padding:0 2rem}}
@media (min-width:64rem){#${SECTION_ID} [data-steps]{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:2rem}}
`;
