"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { photoProps } from "@/lib/photo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CutTitle, Enter } from "@/components/ui/enter";
import { scrollToSection } from "@/components/ui/scroll-link";

// AnimatedHero from 21st.dev (animated-hero-section-1), ported to JSX and the
// Metal Werx theme. Props:
//   backgroundImages    [{ src, alt, title }]; with more than one, the photos
//                       crossfade every `interval` ms (default 5000)
//   eyebrow?            small label above the title
//   title, description  string
//   ctaButton           { text, href } or { text, onClick }
//   secondaryCta?       same shape as ctaButton
//   logo?, navLinks?    [{ label, href }], topRightAction?
//                       an overlaid header; leave them out when the page
//                       already has a navbar
//   nextSectionId?      id of the section below; adds a chevron at the
//                       bottom that scrolls down to it
//   className?          string
// Server Components can't pass functions to this Client Component, so use
// href there; onClick only works when the caller is itself a Client Component.

const buttonClassName = "font-oswald uppercase tracking-[0.15em]";

const glassButtonClassName =
  "border border-chrome/20 bg-chrome/10 text-chrome backdrop-blur-sm transition-colors hover:bg-chrome/20";

export const AnimatedHero = ({
  backgroundImages,
  interval = 5000,
  logo,
  navLinks = [],
  topRightAction,
  eyebrow,
  title,
  description,
  ctaButton,
  secondaryCta,
  nextSectionId,
  className,
}) => {
  const hasHeader = logo || navLinks.length > 0 || topRightAction;
  const [activeImage, setActiveImage] = useState(0);

  // Keyed on activeImage, so picking a photo from the dots restarts the timer.
  // This runs even for visitors who ask for less motion: a crossfade doesn't
  // move anything, and Windows reports that preference whenever its animation
  // effects are switched off.
  useEffect(() => {
    if (backgroundImages.length < 2) return;
    const timer = setTimeout(
      () => setActiveImage((i) => (i + 1) % backgroundImages.length),
      interval
    );
    return () => clearTimeout(timer);
  }, [activeImage, backgroundImages.length, interval]);

  return (
    // reducedMotion="user" drops the slide-ins for visitors who ask for less motion.
    <MotionConfig reducedMotion="user">
      <section
        className={cn(
          "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-carbon font-montserrat text-chrome",
          className
        )}
      >
        <div className="absolute inset-0 z-0">
          {/* Every photo stays mounted so the next one is already loaded when it fades in.
              The faded-out ones are hidden from screen readers. */}
          {backgroundImages.map((image, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={image.src}
              {...photoProps(image.src)}
              alt={image.alt}
              title={image.title}
              aria-hidden={i !== activeImage}
              className={cn(
                "absolute inset-0 size-full object-cover object-center transition-opacity duration-1000 ease-in-out",
                i === activeImage ? "opacity-100" : "opacity-0"
              )}
            />
          ))}
          {/* Darkest behind the left-aligned copy, so the photo shows through on the right. */}
          <div className="absolute inset-0 bg-carbon/60" />
          <div className="absolute inset-0 bg-linear-to-r from-carbon/90 via-carbon/40 to-transparent" />
        </div>

        {backgroundImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {backgroundImages.map((image, i) => (
              <button
                key={image.src}
                type="button"
                aria-label={`Show photo ${i + 1} of ${backgroundImages.length}`}
                aria-current={i === activeImage}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 motion-reduce:transition-none",
                  i === activeImage
                    ? "w-8 bg-chrome"
                    : "w-2 bg-chrome/40 hover:bg-chrome/70"
                )}
              />
            ))}
          </div>
        )}

        {/* Sits above the photo dots. MotionConfig stops the bob for visitors who ask for less motion. */}
        {nextSectionId && (
          <motion.a
            href={`#${nextSectionId}`}
            aria-label="Scroll to the next section"
            title="Scroll to the next section"
            onClick={(event) => scrollToSection(event, nextSectionId)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-12 left-1/2 z-20 flex size-11 -translate-x-1/2 items-center justify-center rounded-full text-chrome/70 transition-colors hover:text-chrome focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown aria-hidden="true" strokeWidth={1.75} className="size-8" />
            </motion.span>
          </motion.a>
        )}

        {hasHeader && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-0 z-20 flex h-20 w-full items-center justify-between px-6 md:px-12"
          >
            <div className="flex items-center gap-2">{logo}</div>
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  title={link.label}
                  className="font-oswald text-sm uppercase tracking-[0.15em] text-chrome/80 transition-colors hover:text-chrome"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="hidden md:block">{topRightAction}</div>
          </motion.header>
        )}

        {/* Plays on load, one step after another, like every page header (see
            components/ui/enter.jsx). */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start justify-center px-6 py-24 text-left">
          {/* cherry-bright rather than the blog's cherry: plain cherry is too dim over the photo. */}
          {eyebrow && (
            <Enter
              as="p"
              step={0}
              className="font-oswald text-sm uppercase tracking-[0.3em] text-cherry-bright"
            >
              {eyebrow}
            </Enter>
          )}
          {/* Bebas Neue only ships weight 400, so no font-bold (it would be faux bold). */}
          <h1 className="mt-3 max-w-4xl font-bebas-neue text-6xl leading-none tracking-wide sm:text-7xl lg:text-8xl">
            <CutTitle step={1}>{title}</CutTitle>
          </h1>
          <Enter as="p" step={2} className="mt-6 max-w-2xl text-lg leading-8 text-aluminium">
            {description}
          </Enter>
          <Enter step={3} className="mt-10 flex flex-wrap items-center gap-4">
            <HeroButton cta={ctaButton} className={buttonClassName} />
            {secondaryCta && (
              <HeroButton
                cta={secondaryCta}
                className={cn(buttonClassName, glassButtonClassName)}
              />
            )}
          </Enter>
        </div>
      </section>
    </MotionConfig>
  );
};

// A link when the CTA has an href, otherwise a button that calls onClick.
const HeroButton = ({ cta, className }) =>
  cta.href ? (
    <Button asChild size="lg" className={className}>
      <Link href={cta.href} title={cta.text}>
        {cta.text}
      </Link>
    </Button>
  ) : (
    <Button size="lg" className={className} onClick={cta.onClick}>
      {cta.text}
    </Button>
  );
