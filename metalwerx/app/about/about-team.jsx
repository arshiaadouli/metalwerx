"use client";

import Image from "next/image";
import { MotionConfig, motion } from "framer-motion";
import { Mail } from "lucide-react";

import { revealVariants } from "./about-section";

// The About page's team cards: a square portrait, the person's name and role,
// and an email link. Like the highlight cards above, each blurs and drops in,
// one after another, the first time it scrolls into view. Props:
//   heading   the section's h2
//   intro     a line under the heading
//   members   { name, role, email, photo: { src, alt } }, one per person;
//             names must be unique
export default function AboutTeam({ heading, intro, members }) {
  return (
    // reducedMotion="user" drops the slides for visitors who ask for less motion;
    // the fades still play.
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby="our-team"
        className="bg-panel px-6 pb-16 font-montserrat sm:pb-24"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="our-team"
            className="mb-4 font-bebas-neue text-3xl tracking-wide text-ink sm:text-4xl"
          >
            {heading}
          </h2>
          <p className="mb-8 max-w-3xl text-sm leading-relaxed text-ink-soft sm:text-base">
            {intro}
          </p>
          {/* Two across only from lg up: any narrower and an email address
              doesn't fit beside the portrait. On a phone the portrait sits
              above the name for the same reason. */}
          <ul className="grid gap-6 lg:grid-cols-2">
            {members.map(({ name, role, email, photo }, i) => (
              <motion.li
                key={name}
                custom={i}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col items-start gap-5 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:gap-6"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={400}
                  height={400}
                  className="size-28 shrink-0 rounded-xl sm:size-32"
                />
                <div>
                  <h3 className="mb-1 font-bebas-neue text-3xl tracking-wide text-ink sm:text-4xl">
                    {name}
                  </h3>
                  {role && (
                    <p className="mb-3 font-oswald text-xs uppercase tracking-[0.3em] text-ink-cherry">
                      {role}
                    </p>
                  )}
                  <a
                    href={`mailto:${email}`}
                    title={`Email ${name}`}
                    className="inline-flex items-center gap-2 font-medium text-ink-soft underline-offset-4 transition-colors hover:text-ink-cherry hover:underline"
                  >
                    <Mail aria-hidden="true" className="size-4 shrink-0 text-ink-cherry" />
                    {email}
                  </a>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </MotionConfig>
  );
}
