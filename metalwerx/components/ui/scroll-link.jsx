"use client";

import { animate } from "framer-motion";

// Eases the page to the element with this id rather than leaving it to the
// browser: native smooth scrolling can't be slowed down or given an easing
// curve. Stops at the target's scroll-margin-top, as a plain #anchor jump
// would. Call it from an in-page link's onClick; the plain #anchor still does
// the jump before hydration. Like the home hero's crossfade, this ignores the
// reduced-motion preference, which Windows reports whenever its animation
// effects are switched off.
export function scrollToSection(event, id) {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();

  // Hand the page back as soon as the visitor scrolls for themselves.
  let controls;
  const removeListeners = () => {
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
  };
  const stop = () => {
    controls?.stop();
    removeListeners();
  };
  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });

  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  controls = animate(
    window.scrollY,
    window.scrollY + target.getBoundingClientRect().top - margin,
    {
      duration: 1.2,
      ease: [0.65, 0, 0.35, 1], // ease-in-out cubic
      onUpdate: (y) => window.scrollTo({ top: y, behavior: "instant" }),
      onComplete: removeListeners,
    },
  );
}

// An in-page link (href="#id") that eases the page down to its target instead
// of jumping. Any other prop goes to the <a>, so it works as a Button's asChild.
export function ScrollLink({ href, onClick, ...props }) {
  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) scrollToSection(event, href.slice(1));
      }}
      {...props}
    />
  );
}
