import { AnimatedHero } from "@/components/ui/animated-hero-section-1";

// The copy and photos are in the CMS (see lib/cms.js).
// The site navbar sits above the hero, so it gets no logo or navLinks of its own.
// 73px is the navbar's height, so the hero fills the rest of the first screen.
export default function IndexHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  backgroundImages,
}) {
  return (
    <AnimatedHero
      className="min-h-[calc(100svh-73px)]"
      backgroundImages={backgroundImages}
      eyebrow={eyebrow}
      title={title}
      description={description}
      ctaButton={primaryCta}
      secondaryCta={secondaryCta}
      nextSectionId="ticker"
    />
  );
}
