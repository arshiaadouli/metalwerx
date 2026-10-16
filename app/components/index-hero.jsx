import { AnimatedHero } from "@/components/ui/animated-hero-section-1";

// Scrap yard photos, all free under the Unsplash License:
// https://unsplash.com/photos/an-excavator-working-on-a-pile-of-scrap-metal-lp6CBQSr1Ek
// https://unsplash.com/photos/a-large-metal-object-flying-through-the-air-e1RKLvWJk4I
// https://unsplash.com/photos/person-standing-near-metal-machien-l7LmUdkrANQ
// https://unsplash.com/photos/a-pile-of-old-metal-parts-sitting-on-top-of-each-other-WlHycHUQIvY
const unsplashPhoto = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2400&q=70`;

const backgroundImageUrls = [
  unsplashPhoto("1722695694560-f452b0919d3a"),
  unsplashPhoto("1722695510527-cc033e43be1b"),
  unsplashPhoto("1536094627107-abf98dedaa8f"),
  unsplashPhoto("1723365316514-8509dea457f2"),
];

// The site navbar sits above the hero, so it gets no logo or navLinks of its own.
// 73px is the navbar's height, so the hero fills the rest of the first screen.
export default function IndexHero() {
  return (
    <AnimatedHero
      className="min-h-[calc(100svh-73px)]"
      backgroundImageUrls={backgroundImageUrls}
      eyebrow="Metal Werx Scrap Metal Recycling"
      title="Turn Your Scrap Metal Into Cash"
      description="We buy ferrous and non-ferrous metals, car bodies and batteries. Bring your scrap to the yard, hire a bin, or book a pickup."
      ctaButton={{ text: "Get a Quote", href: "/contact" }}
      secondaryCta={{ text: "Scrap Prices", href: "/prices" }}
      nextSectionId="commercial"
    />
  );
}
