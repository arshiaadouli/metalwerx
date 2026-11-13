import { CtaBand } from "@/app/services/sections";
import AboutSection from "./about-section";
import AboutBusinessDetails from "./about-business-details";
import AboutHighlights from "./about-highlights";
import AboutStory from "./about-story";
import AboutTeam from "./about-team";

export const metadata = {
  title: "About Us",
  description:
    "Metal Werx is a scrap metal recycling yard in Hallam, VIC. We buy ferrous and non-ferrous metals, hire out bins and pick up loads.",
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
  { value: "Mon–Sat", label: "at the Hallam yard" },
  { value: "Same-day", label: "bank transfer" },
  { value: "Bin hire", label: "and pickups" },
];

const paragraphs = [
  "Metal Werx is a scrap metal recycling yard in Hallam, in Melbourne's south-east. We buy ferrous and non-ferrous metals from homes, farms and businesses.",
  "Bring your scrap to the yard, hire a bin, or have us pick it up. Whether it's a handful of pipe or a ute-load of offcuts, we'll give you a fair price and keep the metal out of landfill.",
];

// Free stock photos saved in public/images (see lib/photo.js), cropped by each
// card to fill its background.
const unsplash = (id) => `/images/unsplash/${id}.jpg`;
const pexels = (id) => `/images/pexels/${id}.jpg`;

// The three ways to sell, each linking to the page that covers it in full. As
// with the stats, the cards only say what those pages already say.
const highlights = [
  {
    gradient: "cherry",
    title: "Bring It to the Yard",
    description:
      "Load the car, ute or trailer and drive in. Selling takes a few minutes, and small loads are welcome.",
    ctaText: "What we buy",
    ctaHref: "/what-we-buy",
    imageUrl: unsplash("photo-1536094627107-abf98dedaa8f"),
    imageAlt: "A worker in a hard hat cutting up scrap metal with a gas torch as sparks fly",
  },
  {
    gradient: "gray",
    title: "Hire a Bin or Book a Pickup",
    description:
      "Too much to carry? We drop a scrap bin at your site and take it away when it's full, or bring the truck and crew to load heavy scrap for you.",
    ctaText: "Our services",
    ctaHref: "/services",
    imageUrl: pexels("33842119"),
    imageAlt:
      "A long, rusty blue roll-off bin on brick paving in front of a dark corrugated metal wall",
  },
  {
    gradient: "orange",
    title: "Recycling for Business",
    description:
      "Workshops, builders and manufacturers get bins sized to their output, swaps on a set day or on call, and a weigh ticket with every load.",
    ctaText: "Commercial recycling",
    ctaHref: "/services/commercial-recycling",
    imageUrl: unsplash("photo-1598302936625-6075fbd98dd7"),
    imageAlt:
      "A worker in a welding helmet and leather gloves cuts a steel beam with an angle grinder, sending out a spray of sparks",
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

      <AboutStory />

      <AboutHighlights heading="Three Ways to Sell Your Scrap" cards={highlights} />

      <AboutTeam
        heading="Our Team"
        intro="Questions about a load, a bin or a pickup? Email either of us directly."
        members={team}
      />

      <AboutBusinessDetails />

      {/* A photo that isn't shown higher up the page: copper strip and wire. */}
      <CtaBand
        heading="Got Scrap to Sell?"
        text="Tell us what you've got and we'll give you a price."
        buttonText="Get a Quote"
        buttonHref="/contact-us"
        image={pexels("5279344")}
      />
    </main>
  );
}
