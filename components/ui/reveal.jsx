"use client";

import { MotionConfig, motion } from "framer-motion";

import { DURATION, EASE, STEP } from "@/components/ui/enter";

// Plays the site's entrance motion (see components/ui/enter.jsx) the first time
// it scrolls into view. Renders `as` (any HTML tag, default div) as a motion
// element; any other prop (id, className, ...) goes to the element. Props:
//   variant?   "rise" (default) blurs into focus as it rises, like the cards
//              on the About page; "fade" leaves out the rise, for photos;
//              "slide" slides in from the left, like the Contact page's links
//   step?      how many steps to hold back, to play a row of cards or a list
//              one after another
// It plays once its top is a tenth of the way up from the bottom of the screen,
// so something taller than the screen still reveals as it's reached.

// filter goes back to none at the end: a leftover blur(0px) would cut any
// backdrop blur inside off from what's behind it.
const variants = {
  rise: {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: (step) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: step * STEP, duration: DURATION, ease: EASE },
      transitionEnd: { filter: "none" },
    }),
  },
  fade: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: (step) => ({
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: step * STEP, duration: DURATION, ease: EASE },
      transitionEnd: { filter: "none" },
    }),
  },
  // A long list only staggers its first few items, so the rest don't lag.
  slide: {
    hidden: { opacity: 0, x: -12 },
    visible: (step) => ({
      opacity: 1,
      x: 0,
      transition: { delay: Math.min(step, 6) * 0.1, duration: 0.5, ease: EASE },
    }),
  },
};

export function Reveal({ as = "div", variant = "rise", step = 0, children, ...props }) {
  const MotionComponent = motion[as];

  return (
    // reducedMotion="user" drops the rise and slide for visitors who ask for
    // less motion; the fade and blur still play.
    <MotionConfig reducedMotion="user">
      <MotionComponent
        custom={step}
        variants={variants[variant]}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        {...props}
      >
        {children}
      </MotionComponent>
    </MotionConfig>
  );
}
