import AboutSection from "@/components/ui/about-section";

export const metadata = {
  title: "About Us",
  description:
    "Metal Werx is a scrap metal recycling yard in Hallam, VIC. We buy ferrous and non-ferrous metals, car bodies and batteries, hire out bins and pick up loads.",
};

// "An excavator working on a pile of scrap metal", also in the home page hero,
// free under the Unsplash License:
// https://unsplash.com/photos/an-excavator-working-on-a-pile-of-scrap-metal-lp6CBQSr1Ek
const image = {
  src: "https://images.unsplash.com/photo-1722695694560-f452b0919d3a?auto=format&fit=crop&w=2000&q=70",
  alt: "An excavator sorting a pile of scrap metal",
  title: "Excavator sorting scrap metal",
};

// Only claims the site already makes elsewhere. Swap in real figures, such as
// years in business or tonnes recycled, once the yard has them.
const stats = [
  { value: "Ferrous", label: "and non-ferrous metals" },
  { value: "Free", label: "car removal" },
  { value: "Cash", label: "for scrap" },
  { value: "Bin hire", label: "and pickups" },
];

const paragraphs = [
  "Metal Werx is a scrap metal recycling yard in Hallam, in Melbourne's south-east. We buy ferrous and non-ferrous metals, car bodies and batteries from homes, farms and businesses.",
  "Bring your scrap to the yard, hire a bin, or have us pick it up. Whether it's a ute-load of offcuts or an old car, we'll give you a fair price and keep the metal out of landfill.",
];

export default function AboutPage() {
  return (
    <main className="flex-1 bg-panel">
      <AboutSection
        eyebrow="Who we are"
        image={image}
        stats={stats}
        title="Giving Scrap Metal a Second Life."
        paragraphs={paragraphs}
        name="Metal Werx"
        tagline="Scrap Metal Recycling | Hallam VIC"
        ctaPrompt="Ready to turn your scrap into cash?"
        cta={{ text: "Get a Quote", href: "/contact-us" }}
      />
    </main>
  );
}
