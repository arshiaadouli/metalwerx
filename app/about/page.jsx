import Link from "next/link";
import { Breadcrumbs, Container, CtaBand, Photo } from "@/app/services/sections";
import { pageMetadata } from "@/lib/seo";

// The preview shows the same excavator photo as the page (the default).
export const metadata = pageMetadata({
  path: "/about",
  title: "About Us",
  description:
    "Metal Werx is a scrap metal recycling yard in Hallam, VIC. We buy ferrous and non-ferrous metals, car bodies and batteries, hire out bins and pick up loads.",
});

// Free stock photos (Unsplash License, no credit required). A url takes a
// width on the end, which Photo adds for each size in its srcset.
const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=70`;

// "An excavator working on a pile of scrap metal", also on the services page:
// https://unsplash.com/photos/an-excavator-working-on-a-pile-of-scrap-metal-lp6CBQSr1Ek
const image = {
  url: unsplash("photo-1722695694560-f452b0919d3a"),
  alt: "An excavator's grapple lifting a bundle of scrap metal in a scrap yard",
  title: "Excavator sorting scrap metal",
};

const title = "Giving Scrap Metal a Second Life.";

const paragraphs = [
  "Metal Werx is a scrap metal recycling yard in Hallam, in Melbourne's south-east. We buy ferrous and non-ferrous metals, car bodies and batteries from homes, farms and businesses.",
  "Bring your scrap to the yard, hire a bin, or have us pick it up. Whether it's a ute-load of offcuts or an old car, we'll give you a fair price and send the metal on for recycling, giving it a second life instead of a spot in landfill.",
];

const name = "Metal Werx";
const tagline = "Scrap Metal Recycling | Hallam VIC";

// What the yard does, listed as plain lines rather than figures: only claims
// the site already makes elsewhere. "Free car removal" is still to be
// confirmed by the yard (see PRODUCT.md).
const stats = [
  { value: "Ferrous", label: "and non-ferrous metals" },
  { value: "Free", label: "car removal" },
  { value: "Cash", label: "for scrap" },
  { value: "Bin hire", label: "and pickups" },
];

// The photos are the same stock as the material pages (aluminium cans, car
// parts, unwanted cars), each with alt text saying what it shows.
const highlights = [
  {
    title: "Your Trusted Scrap Metal Recycler",
    description:
      "At Metal Werx, we specialize in providing top-notch scrap metal recycling services. Our dedicated team is committed to helping you turn your scrap into cash while supporting sustainable practices.",
    ctaText: "Talk to us",
    ctaHref: "/contact-us",
    // https://unsplash.com/photos/a-bunch-of-cars-that-are-sitting-in-the-dirt-GcBoM7B40Ck
    imageUrl: unsplash("photo-1719242513425-f5eed99b282f"),
    imageAlt: "An overgrown wrecking yard with old cars behind a wire fence and a green sedan out front",
  },
  {
    title: "Competitive Pricing",
    description:
      "We offer competitive prices that reflect the true value of your scrap metal. Enjoy honest and transparent transactions with every visit.",
    ctaText: "Get a price",
    ctaHref: "/contact-us",
    // https://unsplash.com/photos/crushed-assorted-beverage-cans-lot-k1tUxfs8JYY
    imageUrl: unsplash("photo-1561503412-852800622772"),
    imageAlt: "A bale of crushed aluminium drink cans in mixed colours",
  },
  {
    title: "Effortless Recycling Experience",
    description:
      "Experience a seamless recycling process with our efficient drop-off services, making it easier than ever to dispose of your metal waste responsibly.",
    ctaText: "Plan a drop-off",
    ctaHref: "/contact-us",
    // https://unsplash.com/photos/pile-of-old-car-engines-and-parts-G-Fno_v4alo
    imageUrl: unsplash("photo-1767340078189-4258fbb7bd7c"),
    imageAlt: "Used car engines piled together, still fitted with their hoses and wiring",
  },
];

const ctaPrompt = "Ready to turn your scrap into cash?";
const cta = { text: "Get a Quote", href: "/contact-us" };

// The line under the prompt says how the yard pays, since "cash" is a figure
// of speech: Victorian dealers pay by bank transfer. The ID rule stays on one
// line, so the band breaks between the sentences.
const ctaText = (
  <>
    We weigh each grade and pay you by bank transfer. <span className="whitespace-nowrap">Bring photo ID.</span>
  </>
);

// The page reads like a stockist's catalogue entry for the yard itself: the
// story under the title, the photo plate, then each list on its own ink rail.
// From xl up the text sits in the right-hand column, in line with the
// footer's columns, and each heading, the title included, stands beside it.
export default function AboutPage() {
  return (
    <main id="main" className="flex-1">
      <header className="pt-8 pb-20 sm:pt-10 sm:pb-28">
        <Container>
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About" }]} />
          <div className="mt-10 sm:mt-14 xl:grid xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:gap-x-16">
            <h1 className="max-w-[18ch] type-title text-ink">{title}</h1>
            <div className="mt-8 max-w-[40rem] sm:mt-10 xl:mt-0 xl:pt-1.5">
              <p className="type-lede text-ink-soft">{paragraphs[0]}</p>
              <p className="mt-5 text-ink-soft">{paragraphs[1]}</p>
              {/* The sign-off under the story, on its own hairline. */}
              <p className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-t border-rule pt-4">
                <span className="font-bold text-ink">{name}</span>
                <span className="text-[0.9375rem] text-ink-muted">{tagline}</span>
              </p>
            </div>
          </div>
          <Photo
            image={image}
            sizes="(min-width: 82.5rem) 78.5rem, (min-width: 40rem) calc(100vw - 4rem), calc(100vw - 2.5rem)"
            priority
            className="mt-14 aspect-[16/9] w-full rounded-[2px] object-[50%_65%] sm:mt-20 sm:aspect-[21/9]"
          />
        </Container>
      </header>

      <CatalogueSection id="what-we-do" heading="What we do">
        {stats.map(({ value, label }) => (
          <li key={value} className="border-b border-rule py-4 text-lg sm:py-5 sm:text-xl">
            <span className="font-bold text-ink">{value}</span> <span className="text-ink-soft">{label}</span>
          </li>
        ))}
      </CatalogueSection>

      <CatalogueSection id="why-choose" heading="Why choose Metal Werx">
        {highlights.map((highlight) => (
          <Highlight key={highlight.title} {...highlight} />
        ))}
      </CatalogueSection>

      <CtaBand heading={ctaPrompt} text={ctaText} cta={cta} />
    </main>
  );
}

// A heading and its list. Under xl the heading sits above the list's ink
// rail; from xl the rail runs under both, with the heading beside the list.
function CatalogueSection({ id, heading, children }) {
  return (
    <section aria-labelledby={id} className="pb-20 sm:pb-28">
      <Container>
        <div className="xl:grid xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:gap-x-16 xl:border-t-2 xl:border-ink">
          <h2 id={id} className="scroll-mt-24 type-heading text-ink xl:pt-5">
            {heading}
          </h2>
          <ul className="mt-8 border-t-2 border-ink xl:mt-0 xl:border-t-0">{children}</ul>
        </div>
      </Container>
    </section>
  );
}

// One highlight: a small photo beside its title, the copy and its link. On a
// phone the photo is a thumbnail beside the title, with the copy below both.
function Highlight({ title, description, ctaText, ctaHref, imageUrl, imageAlt }) {
  return (
    <li className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-5 gap-y-4 border-b border-rule py-6 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-x-8 sm:py-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <Photo
        image={{ url: imageUrl, alt: imageAlt, title }}
        sizes="(min-width: 64rem) 15rem, (min-width: 40rem) 13rem, 7.5rem"
        className="aspect-[4/3] w-full rounded-[2px]"
      />
      <div className="contents sm:block">
        <h3 className="self-center type-subheading text-ink">{title}</h3>
        <div className="col-span-2 sm:mt-3">
          <p className="max-w-[60ch] text-ink-soft">{description}</p>
          <Link
            href={ctaHref}
            className="mt-2 inline-flex min-h-11 items-center font-bold text-ink underline decoration-1 underline-offset-[0.22em] transition-colors duration-150 ease-out-expo hover:decoration-transparent"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </li>
  );
}
