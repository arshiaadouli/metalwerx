"use client";

import { MotionConfig, motion } from "framer-motion";

import { revealVariants } from "@/components/ui/about-section";
import { GradientCard } from "@/components/ui/gradient-card";

// The About page's row of photo cards. Each card blurs and drops in like the
// About section above it, one after another, the first time it scrolls into
// view. Props:
//   heading   a screen-reader-only h2, since the cards' titles are h3s
//   cards     GradientCard props, one object per card; titles must be unique
export default function AboutHighlights({ heading, cards }) {
  return (
    // reducedMotion="user" drops the slides for visitors who ask for less motion;
    // the fades still play.
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby="about-highlights"
        className="bg-panel px-6 pb-16 font-montserrat sm:pb-24"
      >
        <h2 id="about-highlights" className="sr-only">
          {heading}
        </h2>
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {cards.map((card, i) => (
            // Each card waits until it's 30% on screen, so stacked cards on a
            // phone reveal as they're reached rather than all at once.
            <motion.div
              key={card.title}
              custom={i}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <GradientCard {...card} />
            </motion.div>
          ))}
        </div>
      </section>
    </MotionConfig>
  );
}
