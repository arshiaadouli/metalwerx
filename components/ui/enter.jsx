import { Fragment } from "react";

import { cn } from "@/lib/utils";

// The site's entrance motion, a blend of the About page (things blur into
// focus, the title cuts in word by word) and the Contact page (a gentle rise on
// a smooth ease). Page headers use Enter and CutTitle, which play on load in CSS
// (the reveal-* animations in app/globals.css), so they start with the first
// paint rather than waiting for the page's JavaScript. Everything below the
// header uses Reveal (components/ui/reveal.jsx), which plays the same rise as it
// scrolls into view.
//
// Steps play STEP seconds apart. Visitors who ask for less motion get the fade
// and blur without the movement.

export const STEP = 0.15;
// The same as the reveal-* animations in app/globals.css.
export const DURATION = 0.6;
export const EASE = [0.25, 0.1, 0.25, 1]; // the Contact page's smoothEase

// Seconds between the title's words, as on the About page.
const WORD_STAGGER = 0.05;

const delay = (seconds) => ({ animationDelay: `${seconds}s` });

// Rises into focus on load, `step` steps in. `fade` leaves out the rise, for
// photos. Renders `as` (default div); any other prop goes to the element.
export function Enter({ as: Tag = "div", step = 0, fade = false, className, style, ...props }) {
  return (
    <Tag
      className={cn(
        fade ? "animate-reveal-fade" : "animate-reveal-rise motion-reduce:animate-reveal-fade",
        className,
      )}
      style={{ ...delay(step * STEP), ...style }}
      {...props}
    />
  );
}

// The words of a page title, each dropping into view out of its own box like
// the About page's headline, starting `step` steps in. Goes inside the heading,
// so the heading's text is still the whole title for screen readers and search
// engines.
export function CutTitle({ children, step = 0 }) {
  const words = String(children).trim().split(/\s+/);
  return words.map((word, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span
        className="inline-block animate-reveal-cut motion-reduce:animate-none"
        style={delay(step * STEP + i * WORD_STAGGER)}
      >
        {word}
      </span>
    </Fragment>
  ));
}
