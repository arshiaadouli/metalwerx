"use client";

import { useEffect, useEffectEvent, useImperativeHandle, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

// VerticalCutReveal from 21st.dev (danielpetho/vertical-cut-reveal), ported to
// JSX. Splits a string into pieces and slides each one up into view out of its
// own overflow-hidden box. Props:
//   children            the text, as a string
//   splitBy?            "words" (default), "characters", "lines", or any
//                       other string to split on
//   staggerDuration?    seconds between pieces (default 0.2)
//   staggerFrom?        "first" (default), "last", "center", "random", or the
//                       index of the piece to start from
//   reverse?            drop the pieces in from above instead
//   transition?         framer-motion transition for each piece; its delay
//                       holds back the whole reveal
//   autoStart?          start on mount (default true); otherwise call
//                       ref.current.startAnimation()
//   ref?                gets { startAnimation, reset }
//   onStart?, onComplete?, onClick?
//   containerClassName?, wordLevelClassName?, elementLevelClassName?
// Screen readers get the text once, from a visually hidden copy.

// Splits by grapheme, so emoji and accented letters stay whole.
const splitIntoCharacters = (text) => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
};

export function VerticalCutReveal({
  children,
  reverse = false,
  transition = {
    type: "spring",
    stiffness: 190,
    damping: 22,
  },
  splitBy = "words",
  staggerDuration = 0.2,
  staggerFrom = "first",
  containerClassName,
  wordLevelClassName,
  elementLevelClassName,
  onClick,
  onStart,
  onComplete,
  autoStart = true,
  ref,
  ...props
}) {
  const text = typeof children === "string" ? children : children?.toString() || "";
  // Starting as true is enough to autoStart: the pieces still mount hidden and
  // animate in from there.
  const [isAnimating, setIsAnimating] = useState(autoStart);

  // Each word holds the pieces that animate: its characters, or the whole word
  // (or line) when splitting more coarsely.
  const words = useMemo(() => {
    if (splitBy === "characters") {
      const parts = text.split(" ");
      return parts.map((part, i) => ({
        characters: splitIntoCharacters(part),
        needsSpace: i !== parts.length - 1,
      }));
    }
    const parts =
      splitBy === "words"
        ? text.split(" ")
        : splitBy === "lines"
          ? text.split("\n")
          : text.split(splitBy);
    return parts.map((part, i) => ({
      characters: [part],
      needsSpace: i !== parts.length - 1,
    }));
  }, [text, splitBy]);

  const total = words.reduce((sum, word) => sum + word.characters.length, 0);

  const getStaggerDelay = (index) => {
    if (staggerFrom === "first") return index * staggerDuration;
    if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;
    if (staggerFrom === "center") {
      return Math.abs(Math.floor(total / 2) - index) * staggerDuration;
    }
    if (staggerFrom === "random") {
      return Math.abs(Math.floor(Math.random() * total) - index) * staggerDuration;
    }
    return Math.abs(staggerFrom - index) * staggerDuration;
  };

  useImperativeHandle(ref, () => ({
    startAnimation: () => {
      setIsAnimating(true);
      onStart?.();
    },
    reset: () => setIsAnimating(false),
  }));

  // An effect event, so it runs once on mount even when the parent passes a new
  // onStart on every render.
  const onMount = useEffectEvent(() => {
    if (autoStart) onStart?.();
  });
  useEffect(() => {
    onMount();
  }, []);

  const variants = {
    hidden: { y: reverse ? "-100%" : "100%" },
    visible: (i) => ({
      y: 0,
      transition: {
        ...transition,
        delay: (transition?.delay || 0) + getStaggerDelay(i),
      },
    }),
  };

  return (
    <span
      className={cn(
        containerClassName,
        "flex flex-wrap whitespace-pre-wrap",
        splitBy === "lines" && "flex-col"
      )}
      onClick={onClick}
      {...props}
    >
      <span className="sr-only">{text}</span>

      {words.map((word, wordIndex) => {
        const previousCharsCount = words
          .slice(0, wordIndex)
          .reduce((sum, w) => sum + w.characters.length, 0);

        return (
          <span
            key={wordIndex}
            aria-hidden="true"
            className={cn("inline-flex overflow-hidden", wordLevelClassName)}
          >
            {word.characters.map((char, charIndex) => (
              <span
                key={charIndex}
                className={cn(elementLevelClassName, "relative whitespace-pre-wrap")}
              >
                <motion.span
                  custom={previousCharsCount + charIndex}
                  initial="hidden"
                  animate={isAnimating ? "visible" : "hidden"}
                  variants={variants}
                  onAnimationComplete={
                    wordIndex === words.length - 1 &&
                    charIndex === word.characters.length - 1
                      ? onComplete
                      : undefined
                  }
                  className="inline-block"
                >
                  {char}
                </motion.span>
              </span>
            ))}
            {word.needsSpace && <span> </span>}
          </span>
        );
      })}
    </span>
  );
}
