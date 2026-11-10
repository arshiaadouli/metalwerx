import AboutSection from "./about-section";
import AboutBusinessDetails from "./about-business-details";
import AboutHighlights from "./about-highlights";
import AboutTeam from "./about-team";

export const metadata = {
  title: "About Us",
  description:
    "Metal Werx is a scrap metal recycling yard in Hallam, VIC. We buy ferrous and non-ferrous metals, car bodies and batteries, hire out bins and pick up loads.",
};

// "An excavator working on a pile of scrap metal", also in the home page hero,
// free under the Unsplash License:
// https://unsplash.com/photos/an-excavator-working-on-a-pile-of-scrap-metal-lp6CBQSr1Ek
const image = {
  src: "/images/unsplash/photo-1722695694560-f452b0919d3a.jpg",
  alt: "An excavator sorting a pile of scrap metal",
  title: "Excavator sorting scrap metal",
};

// Only claims the site already makes elsewhere. Swap in real figures, such as
// years in business or tonnes recycled, once the yard has them.
const stats = [
  { value: "Ferrous", label: "and non-ferrous metals" },
  { value: "Free", label: "car removal" },
  { value: "Same-day", label: "bank transfer" },
  { value: "Bin hire", label: "and pickups" },
];

const paragraphs = [
  "Metal Werx is a scrap metal recycling yard in Hallam, in Melbourne's south-east. We buy ferrous and non-ferrous metals, car bodies and batteries from homes, farms and businesses.",
  "Bring your scrap to the yard, hire a bin, or have us pick it up. Whether it's a ute-load of offcuts or an old car, we'll give you a fair price and keep the metal out of landfill.",
];

// Free stock photos saved in public/images (see lib/photo.js), also used in the
// navbar's What We Buy menu, cropped by each card to fill its background.
const unsplash = (id) => `/images/unsplash/${id}.jpg`;

const highlights = [
  {
    gradient: "cherry",
    title: "Your Trusted Scrap Metal Recycler",
    description:
      "At Metal Werx, we specialize in providing top-notch scrap metal recycling services. Our dedicated team is committed to getting you paid for your scrap while supporting sustainable practices.",
    ctaText: "Talk to us",
    ctaHref: "/contact-us",
    // https://unsplash.com/photos/a-bunch-of-cars-that-are-sitting-in-the-dirt-GcBoM7B40Ck
    imageUrl: unsplash("photo-1719242513425-f5eed99b282f"),
    imageAlt:
      "A scrap yard of old cars and boats behind a wire fence, with a small excavator and a green vintage sedan in front",
  },
  {
    gradient: "gray",
    title: "Competitive Pricing",
    description:
      "We offer competitive prices that reflect the true value of your scrap metal. Enjoy honest and transparent transactions with every visit.",
    ctaText: "Get a quote",
    ctaHref: "/contact-us",
    // https://unsplash.com/photos/crushed-assorted-beverage-cans-lot-k1tUxfs8JYY
    imageUrl: unsplash("photo-1561503412-852800622772"),
    imageAlt: "A bale of crushed aluminium drink cans",
  },
  {
    gradient: "orange",
    title: "Effortless Recycling Experience",
    description:
      "Experience a seamless recycling process with our efficient drop-off services, making it easier than ever to dispose of your metal waste responsibly.",
    ctaText: "Plan a drop-off",
    ctaHref: "/contact-us",
    // https://unsplash.com/photos/pile-of-old-car-engines-and-parts-G-Fno_v4alo
    imageUrl: unsplash("photo-1767340078189-4258fbb7bd7c"),
    imageAlt: "A pile of old car engines and parts",
  },
];

// The names and emails are the ones the business gave on 29 Oct 2026, the roles
// on 30 Oct. The portraits in public/images/team are illustrated avatars drawn
// by AI, not likenesses: swap in real photos (square, at least 400px) once
// there are some.
const team = [
  {
    name: "Mahdi Amiri",
    role: "Owner",
    email: "mahdi@metalwerx.com.au",
    photo: {
      src: "/images/team/mahdi-amiri.svg",
      alt: "Illustrated avatar of Mahdi Amiri",
    },
  },
  {
    name: "Hakim Mirzaei",
    role: "Co-Founder",
    email: "hakim@metalwerx.com.au",
    photo: {
      src: "/images/team/hakim-mirzaei.svg",
      alt: "Illustrated avatar of Hakim Mirzaei",
    },
  },
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
        ctaPrompt="Ready to get paid for your scrap?"
        cta={{ text: "Get a Quote", href: "/contact-us" }}
      />

      <AboutHighlights heading="Why choose Metal Werx" cards={highlights} />

      <AboutTeam
        heading="Our Team"
        intro="Questions about a load, a car or a bin? Email either of us directly."
        members={team}
      />

      <AboutBusinessDetails />
    </main>
  );
}
