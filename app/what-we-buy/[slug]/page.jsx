import Link from "next/link";
import { notFound } from "next/navigation";
import IndexFaq from "@/app/components/index-faq";
import { NotchedProjectCard } from "@/components/ui/notched-project-card";
import { Reveal } from "@/components/ui/reveal";
import { CtaBand, Details, ServiceHero, Steps } from "@/app/services/sections";
import { getMaterial, getMaterials } from "../materials";

// The page for one material, written in the CMS (see ../materials.js).

// The whole page must be static HTML, so search engines get the copy in the
// first response, and it opens instantly from a link. The build fails if
// anything here would need a request.
export const ensureStatic = "navigation";

// One App Shell serves every link to a material, and it can't hold the page,
// which depends on the slug. Reading the slug inside <Suspense> would make the
// click instant, but then each page's HTML has its content in a hidden block
// that a script reveals, which crawlers without JavaScript may not index. So
// a click waits for the prerendered page instead.
export const instant = false;

// Every material is prerendered at build time, and one added in the CMS later
// on its first visit. Any other slug is a 404.
export async function generateStaticParams() {
  const materials = await getMaterials();
  return materials.map(({ slug }) => ({ slug }));
}

// The header photo is also the preview image when the page is shared.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const material = await getMaterial(slug);
  if (!material) return { title: "Material not found" };
  const { seo, image } = material;
  return {
    title: seo.title,
    description: seo.description,
    openGraph: { images: [{ url: image.url, alt: image.alt }] },
  };
}

export default async function MaterialPage({ params }) {
  const { slug } = await params;
  const materials = await getMaterials();
  const material = materials.find((other) => other.slug === slug);
  if (!material) notFound();
  const related = material.related
    .map((relatedSlug) => materials.find((other) => other.slug === relatedSlug))
    .filter(Boolean);

  return (
    <main className="flex-1 bg-surface font-montserrat text-ink">
      <ServiceHero
        image={material.image}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "What We Buy", href: "/what-we-buy" },
          { name: material.title },
        ]}
        icon={material.icon}
        eyebrow="What We Buy"
        title={material.heading}
        lede={material.lede}
        actions={[
          { text: "Get a Quote", href: "/contact-us" },
          { text: "How It Works", href: "#how-it-works", outline: true },
        ]}
      />
      <Overview {...material.overview} />
      <Steps {...material.steps} />
      <Details {...material.details} />
      {/* The home page's FAQ section, which has no top padding of its own. */}
      <div className="border-t border-line bg-surface pt-20 sm:pt-24">
        <IndexFaq heading="Frequently Asked Questions" {...material.faq} />
      </div>
      {related.length > 0 && <Related materials={related} />}
      <CtaBand {...material.cta} />
    </main>
  );
}

// The overview beside the grades the yard sorts the material into.
function Overview({ heading, paragraphs, gradesTitle = "Grades We Buy", grades }) {
  return (
    <section aria-labelledby="overview" className="bg-surface">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <Reveal>
          <p className="font-oswald text-sm uppercase tracking-[0.3em] text-ink-cherry">Overview</p>
          <h2 id="overview" className="mt-2 font-bebas-neue text-5xl tracking-wide sm:text-6xl">
            {heading}
          </h2>
          <div className="mt-4 h-1 w-16 bg-cherry" />
          <div className="mt-8 space-y-5 leading-7 text-ink-soft">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>

        <div>
          <Reveal
            as="h3"
            id="grades"
            step={1}
            className="font-oswald text-sm uppercase tracking-[0.3em] text-ink-cherry"
          >
            {gradesTitle}
          </Reveal>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {grades.map(({ title, text }, i) => (
              <Reveal
                as="li"
                key={title}
                step={1 + (i % 2)}
                className="rounded-2xl border border-line bg-panel p-6 sm:p-8"
              >
                <div aria-hidden="true" className="h-1 w-10 bg-cherry" />
                <h4 className="mt-5 font-oswald text-lg uppercase tracking-[0.15em]">{title}</h4>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Related({ materials }) {
  return (
    <section aria-labelledby="related" className="bg-panel">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-24">
        <Reveal as="header" className="text-center">
          <h2
            id="related"
            className="font-oswald text-2xl font-semibold uppercase tracking-[0.2em] text-ink-cherry sm:text-3xl"
          >
            We Also Buy
          </h2>
        </Reveal>
        <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map(({ slug, title, summary, image }, i) => (
            <Reveal as="li" key={slug} step={i % 3}>
              {/* The notch is painted in the section's background colour. */}
              <NotchedProjectCard
                href={`/what-we-buy/${slug}`}
                title={title}
                description={summary}
                image={image.url}
                imageAlt={image.alt}
                monochrome
                surface="var(--panel)"
              />
            </Reveal>
          ))}
        </ul>
        <p className="mt-14 text-center">
          <Link
            href="/what-we-buy"
            title="Everything we buy"
            className="font-oswald text-sm uppercase tracking-[0.2em] text-ink-cherry underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
          >
            Everything we buy
          </Link>
        </p>
      </div>
    </section>
  );
}
