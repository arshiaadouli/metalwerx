"use client";

import { useRef } from "react";
import Link from "next/link";
import { MotionConfig } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

// AboutSection3 from 21st.dev (about-section), ported to JSX and the Metal Werx
// theme. Props:
//   eyebrow         small label above the photo
//   image           { src, alt, title }; cropped to a 5:2 cut-out shape, so a
//                   wide landscape photo works best
//   stats           four { value, label }: the first two sit under the photo,
//                   the third is the large one in the notch cut out of the
//                   photo's bottom-right corner (from lg up), the fourth
//                   sits beside it
//   title           the headline, revealed word by word
//   paragraphs      string[]; side by side from md up
//   name, tagline   the sign-off in the right-hand column
//   ctaPrompt       a line above the button
//   cta             { text, href }
//   className?      string
// The original's social icon links are left out: the yard has no social pages
// yet, and lucide-react 1.x ships no brand icons to draw them with.

// Steps play in animationNum order, each 0.4s after the one before.
const revealVariants = {
  visible: (i) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay: i * 0.4, duration: 0.5 },
  }),
  hidden: {
    filter: "blur(10px)",
    y: -20,
    opacity: 0,
  },
};

// The same, without the drop, for the photo.
const fadeVariants = {
  visible: (i) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay: i * 0.4, duration: 0.5 },
  }),
  hidden: {
    filter: "blur(10px)",
    opacity: 0,
  },
};

export default function AboutSection({
  eyebrow,
  image,
  stats,
  title,
  paragraphs,
  name,
  tagline,
  ctaPrompt,
  cta,
  className,
}) {
  const sectionRef = useRef(null);
  const [first, second, featured, fourth] = stats;
  // once: the headline only plays on mount, so replaying the rest each time the
  // section scrolls back into view would leave it out of step.
  const reveal = { timelineRef: sectionRef, customVariants: revealVariants, once: true };
  // The sign-off follows the paragraphs, which take steps 6 onwards.
  const signOffStep = 6 + paragraphs.length;

  return (
    // reducedMotion="user" drops the slides for visitors who ask for less motion;
    // the fades still play.
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        className={cn("bg-panel px-6 py-16 font-montserrat text-ink sm:py-24", className)}
      >
        <div className="mx-auto max-w-6xl">
          <div className="relative">
            {/* Sits in the strip the cut-out leaves along the photo's top edge. */}
            <div className="absolute -top-3 left-0 z-10 flex items-center gap-2 sm:-top-2 md:top-0 lg:top-4">
              <span aria-hidden="true" className="text-xl text-ink-cherry motion-safe:animate-spin">
                ✱
              </span>
              <TimelineContent
                as="p"
                animationNum={0}
                {...reveal}
                className="font-oswald text-sm uppercase tracking-[0.3em] text-ink-soft"
              >
                {eyebrow}
              </TimelineContent>
            </div>

            <TimelineContent
              as="figure"
              animationNum={1}
              timelineRef={sectionRef}
              customVariants={fadeVariants}
              once
            >
              <svg
                role="img"
                aria-label={image.alt}
                className="w-full"
                width="100%"
                height="100%"
                viewBox="0 0 100 40"
              >
                {/* SVG has no title attribute; this element gives the photo its hover tooltip. */}
                <title>{image.title}</title>
                <defs>
                  <clipPath id="about-section-photo" clipPathUnits="objectBoundingBox">
                    <path d="M0.0998072 1H0.422076H0.749756C0.767072 1 0.774207 0.961783 0.77561 0.942675V0.807325C0.777053 0.743631 0.791844 0.731953 0.799059 0.734076H0.969813C0.996268 0.730255 1.00088 0.693206 0.999875 0.675159V0.0700637C0.999875 0.0254777 0.985045 0.00477707 0.977629 0H0.902473C0.854975 0 0.890448 0.138535 0.850165 0.138535H0.0204424C0.00408849 0.142357 0 0.180467 0 0.199045V0.410828C0 0.449045 0.0136283 0.46603 0.0204424 0.469745H0.0523086C0.0696245 0.471019 0.0735527 0.497877 0.0733523 0.511146V0.915605C0.0723903 0.983121 0.090588 1 0.0998072 1Z" />
                  </clipPath>
                </defs>
                <image
                  clipPath="url(#about-section-photo)"
                  preserveAspectRatio="xMidYMid slice"
                  width="100%"
                  height="100%"
                  href={image.src}
                />
              </svg>
            </TimelineContent>

            <div className="flex flex-wrap items-center justify-between py-3 text-sm lg:justify-start">
              <TimelineContent
                as="div"
                animationNum={2}
                {...reveal}
                className="flex flex-wrap gap-x-4"
              >
                <div className="mb-2 flex items-center gap-2 text-xs sm:text-base">
                  <span className="font-bold text-ink-cherry">{first.value}</span>
                  <span className="text-ink-soft">{first.label}</span>
                  <span aria-hidden="true" className="text-ink-muted">|</span>
                </div>
                <div className="mb-2 flex items-center gap-2 text-xs sm:text-base">
                  <span className="font-bold text-ink-cherry">{second.value}</span>
                  <span className="text-ink-soft">{second.label}</span>
                </div>
              </TimelineContent>

              {/* From lg up, sits in the notch at the photo's bottom-right corner. */}
              <div className="right-0 bottom-16 flex flex-row-reverse gap-4 lg:absolute lg:flex-col lg:gap-0">
                {/* Bebas Neue only ships weight 400, so no font-bold (it would be faux bold). */}
                <TimelineContent
                  as="div"
                  animationNum={3}
                  {...reveal}
                  className="mb-2 flex items-center gap-2 font-bebas-neue text-2xl tracking-wide sm:text-3xl lg:text-4xl"
                >
                  <span className="text-ink-cherry">{featured.value}</span>
                  <span className="text-ink-soft">{featured.label}</span>
                </TimelineContent>
                <TimelineContent
                  as="div"
                  animationNum={4}
                  {...reveal}
                  className="mb-2 flex items-center gap-2 text-xs sm:text-base"
                >
                  <span className="font-bold text-ink-cherry">{fourth.value}</span>
                  <span className="text-ink-soft">{fourth.label}</span>
                  <span aria-hidden="true" className="text-ink-muted lg:hidden">|</span>
                </TimelineContent>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h1 className="mb-8 font-bebas-neue text-4xl leading-[1.1] tracking-wide text-ink sm:text-5xl md:text-6xl">
                {/* Starts just after the last stat (step 4, at 1.6s). */}
                <VerticalCutReveal
                  splitBy="words"
                  staggerDuration={0.1}
                  staggerFrom="first"
                  reverse
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 30,
                    delay: 1.8,
                  }}
                >
                  {title}
                </VerticalCutReveal>
              </h1>

              <TimelineContent
                as="div"
                animationNum={5}
                {...reveal}
                className="grid gap-8 text-ink-soft md:grid-cols-2"
              >
                {paragraphs.map((paragraph, i) => (
                  <TimelineContent
                    key={paragraph}
                    as="p"
                    animationNum={6 + i}
                    {...reveal}
                    className="text-sm leading-relaxed sm:text-base"
                  >
                    {paragraph}
                  </TimelineContent>
                ))}
              </TimelineContent>
            </div>

            <div className="text-right">
              <TimelineContent
                as="p"
                animationNum={signOffStep}
                {...reveal}
                className="mb-1 font-bebas-neue text-4xl tracking-wide text-ink-cherry"
              >
                {name}
              </TimelineContent>
              <TimelineContent
                as="p"
                animationNum={signOffStep + 1}
                {...reveal}
                className="mb-8 text-sm text-ink-soft"
              >
                {tagline}
              </TimelineContent>
              <TimelineContent
                as="p"
                animationNum={signOffStep + 2}
                {...reveal}
                className="mb-6 font-medium text-ink"
              >
                {ctaPrompt}
              </TimelineContent>
              <TimelineContent
                as="div"
                animationNum={signOffStep + 3}
                {...reveal}
                className="flex justify-end"
              >
                <Button
                  asChild
                  size="lg"
                  className="gap-2 font-oswald uppercase tracking-[0.15em] transition-all duration-300 hover:gap-4"
                >
                  <Link href={cta.href} title={cta.text}>
                    {cta.text}
                    <ArrowRight aria-hidden="true" className="size-5" />
                  </Link>
                </Button>
              </TimelineContent>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
