"use client";

import Link from "next/link";
import { cva } from "class-variance-authority";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { photoProps } from "@/lib/photo";
import { cn } from "@/lib/utils";

// GradientCard from 21st.dev (gradient-card), ported to JSX and the Metal Werx
// theme. Props:
//   gradient        "cherry" | "orange" | "gray" | "purple" | "green"; the
//                   tint of the shade over the photo
//   title, description
//   ctaText, ctaHref  the link at the bottom
//   imageUrl        the card's background photo, a path in public/ (see
//                   lib/photo.js); it's decorative, so it has no alt text
//   className?, ref?, and any other <div> props
// The original tucks a cut-out graphic into one corner of a pastel card. Here
// the photo covers the whole card instead, and the gradient becomes a shade
// rising from the bottom so the text over it stays readable. The original's
// badge pill is left out.

// Text over a photo stays light in both themes, so the shades are the same in
// light and dark and the text uses the fixed palette, not the theme colours.
const shadeVariants = cva("absolute inset-0 bg-linear-to-t", {
  variants: {
    gradient: {
      cherry: "from-clinker via-oxblood/85 to-oxblood/10",
      orange: "from-orange-950 via-orange-950/80 to-orange-950/10",
      gray: "from-carbon via-carbon/80 to-carbon/10",
      purple: "from-purple-950 via-purple-950/80 to-purple-950/10",
      green: "from-emerald-950 via-emerald-950/80 to-emerald-950/10",
    },
  },
  defaultVariants: {
    gradient: "gray",
  },
});

// The card lifts on hover and the photo zooms in behind it.
const cardAnimation = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.03, y: -4 },
};

const imageAnimation = {
  rest: { scale: 1 },
  hover: { scale: 1.08 },
};

function GradientCard({
  ref,
  className,
  gradient,
  title,
  description,
  ctaText,
  ctaHref,
  imageUrl,
  ...props
}) {
  return (
    // reducedMotion="user" drops the lift and zoom for visitors who ask for less motion.
    <MotionConfig reducedMotion="user">
      <motion.div
        ref={ref}
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="h-full"
      >
        <div
          className={cn(
            "relative flex h-full min-h-112 w-full flex-col overflow-hidden rounded-2xl border border-line bg-carbon p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg",
            className,
          )}
          {...props}
        >
          {imageUrl && (
            // Three to a row from lg, otherwise the full width.
            <motion.img
              {...photoProps(imageUrl, "(min-width: 64rem) 33vw, 100vw")}
              alt=""
              title={title}
              loading="lazy"
              variants={imageAnimation}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="pointer-events-none absolute inset-0 size-full object-cover"
            />
          )}
          <div aria-hidden="true" className={shadeVariants({ gradient })} />

          <div className="relative z-10 flex grow flex-col">
            {/* mt-auto drops the text to the bottom, over the darkest part of the shade. */}
            <div className="mt-auto pt-24">
              {/* Bebas Neue only ships weight 400, so no font-bold (it would be faux bold). */}
              <h3 className="mb-3 font-bebas-neue text-3xl leading-tight tracking-wide text-chrome">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-aluminium sm:text-base">{description}</p>

              <Link
                href={ctaHref}
                title={ctaText}
                className="group mt-6 inline-flex w-fit items-center gap-2 rounded-sm font-oswald text-sm uppercase tracking-[0.15em] text-chrome outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
              >
                {ctaText}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 text-cherry-bright transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </MotionConfig>
  );
}

export { GradientCard, shadeVariants };
