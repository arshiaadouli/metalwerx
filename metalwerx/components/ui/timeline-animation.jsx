"use client";

import { motion, useInView } from "framer-motion";

// TimelineContent from 21st.dev (timeline-animation), ported to JSX. Renders
// `as` (any HTML tag, default div) as a motion element that plays its
// "visible" variant once timelineRef scrolls into view. Props:
//   animationNum     position in the sequence, passed to the variants as
//                    `custom` so each step can delay itself (i * 0.5s here)
//   timelineRef      ref to the element that triggers the sequence, usually
//                    the section that holds every step
//   customVariants?  { hidden, visible } to replace the default blur-in
//   once?            play only the first time it comes into view; otherwise
//                    it hides again on leaving and replays on return
// Any other prop (href, target, ...) goes to the element itself.

const defaultSequenceVariants = {
  visible: (i) => ({
    filter: "blur(0px)",
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.5, duration: 0.5 },
  }),
  hidden: {
    filter: "blur(20px)",
    y: 0,
    opacity: 0,
  },
};

export const TimelineContent = ({
  children,
  animationNum,
  timelineRef,
  className,
  as = "div",
  customVariants,
  once = false,
  ...props
}) => {
  const isInView = useInView(timelineRef, { once });
  const MotionComponent = motion[as];

  return (
    <MotionComponent
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={animationNum}
      variants={customVariants || defaultSequenceVariants}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
