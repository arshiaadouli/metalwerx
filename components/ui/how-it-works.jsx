import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

// A numbered run of steps, adapted from the "How It Works" block on 21st.dev:
// a row of numbered markers joined by a line, over a card per step with an
// icon, a title, an optional description and a list of points. The block's own
// heading and copy are left out, so the section around it supplies them.
// Props:
//   steps   [{ icon, title, description?, points }], where icon is a rendered
//           lucide icon
// Any other prop (id, className, ...) goes to the wrapping div.
// The markers only line up with the cards in the three-column layout, so they
// show from md up; below that each card names its own step.
export function HowItWorks({ steps, className, ...props }) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl", className)} {...props}>
      {/* Each marker but the last draws the line to the next one: half its own
          cell, the gap, and half the next cell. */}
      <Reveal aria-hidden="true" className="mb-8 hidden grid-cols-3 gap-x-6 md:grid lg:gap-x-8">
        {steps.map(({ title }, i) => (
          <div key={title} className="relative flex justify-center">
            {i < steps.length - 1 && (
              <span className="absolute top-1/2 left-1/2 h-0.5 w-[calc(100%+1.5rem)] -translate-y-1/2 bg-ink-muted/30 lg:w-[calc(100%+2rem)]" />
            )}
            <span className="relative flex size-10 items-center justify-center rounded-full bg-cherry pt-0.5 font-bebas-neue text-2xl text-chrome ring-4 ring-surface">
              {i + 1}
            </span>
          </div>
        ))}
      </Reveal>

      {/* Each card spans three rows of a subgrid, so the lists start level when
          one title wraps. */}
      <ol className="grid gap-6 md:grid-cols-3 md:gap-y-0 lg:gap-x-8">
        {steps.map((step, i) => (
          <StepCard key={step.title} number={i + 1} {...step} />
        ))}
      </ol>
    </div>
  );
}

// Only scale, shadow and border colour transition: Reveal animates the card's
// opacity, filter and transform inline, and a CSS transition on those would
// drag its entrance out.
function StepCard({ number, icon, title, description, points }) {
  return (
    <Reveal
      as="li"
      step={number - 1}
      className="row-span-3 grid grid-rows-subgrid gap-y-5 rounded-2xl border border-line bg-panel p-6 shadow-lg transition-[scale,box-shadow,border-color] duration-300 ease-in-out light:bg-white hover:border-cherry/50 hover:shadow-xl motion-safe:hover:scale-105"
    >
      <div className="flex size-12 items-center justify-center rounded-lg bg-well text-ink-cherry">
        {icon}
      </div>
      <div>
        <p className="font-oswald text-xs uppercase tracking-[0.3em] text-ink-cherry md:sr-only">
          Step {number}
        </p>
        <h3 className="font-bebas-neue text-3xl tracking-wide text-ink">{title}</h3>
        {description && <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p>}
      </div>
      <ul className="space-y-3">
        {points.map((point) => (
          <li key={point} className="flex items-center gap-3 text-sm text-ink-soft">
            <span
              aria-hidden="true"
              className="flex size-4 shrink-0 items-center justify-center rounded-full bg-cherry/20"
            >
              <span className="size-2 rounded-full bg-cherry" />
            </span>
            {point}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
