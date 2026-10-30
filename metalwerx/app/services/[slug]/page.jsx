import Link from "next/link";
import { notFound } from "next/navigation";
import IndexFaq from "@/app/components/index-faq";
import { NotchedProjectCard } from "@/components/ui/notched-project-card";
import { Reveal } from "@/components/ui/reveal";
import { CtaBand, Details, ServiceHero, Steps } from "../sections";
import { getService, getServices } from "../services";

// The page for one service, written in the CMS (see ../services.js).

// The whole page must be static HTML, so search engines get the copy in the
// first response, and it opens instantly from a link. The build fails if
// anything here would need a request.
export const ensureStatic = "navigation";

// A click waits for the prerendered page rather than streaming it in, so each
// page's HTML has its content inline (see ../../what-we-buy/[slug]/page.jsx).
export const instant = false;

// Every service is prerendered at build time, and one added in the CMS later
// on its first visit. Any other slug is a 404.
export async function generateStaticParams() {
  const services = await getServices();
  return services.map(({ slug }) => ({ slug }));
}

// The header photo is also the preview image when the page is shared.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service not found" };
  const { seo, image } = service;
  return {
    title: seo.title,
    description: seo.description,
    openGraph: { images: [{ url: image.url, alt: image.alt }] },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const services = await getServices();
  const service = services.find((other) => other.slug === slug);
  if (!service) notFound();
  const others = services.filter((other) => other !== service);

  return (
    <main className="flex-1 bg-surface font-montserrat text-ink">
      <ServiceHero
        image={service.image}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.title },
        ]}
        icon={service.icon}
        eyebrow="Services"
        title={service.heading}
        lede={service.lede}
        actions={[
          { text: "Get a Quote", href: "/contact-us" },
          { text: "How It Works", href: "#how-it-works", outline: true },
        ]}
      />
      <Overview {...service.overview} />
      <Steps {...service.steps} />
      <Details {...service.details} />
      {/* The home page's FAQ section, which has no top padding of its own. */}
      <div className="border-t border-line bg-surface pt-20 sm:pt-24">
        <IndexFaq heading="Frequently Asked Questions" {...service.faq} />
      </div>
      <OtherServices services={others} />
      <CtaBand {...service.cta} />
    </main>
  );
}

function Overview({ heading, paragraphs, features }) {
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

        <ul className="grid gap-6 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, text }, i) => (
            <Reveal
              as="li"
              key={title}
              step={1 + (i % 2)}
              className="rounded-2xl border border-line bg-panel p-6 sm:p-8"
            >
              <Icon aria-hidden="true" strokeWidth={1.75} className="size-10 text-ink-cherry" />
              <h3 className="mt-6 font-oswald text-lg uppercase tracking-[0.15em]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function OtherServices({ services }) {
  return (
    <section aria-labelledby="other-services" className="bg-panel">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-24">
        <Reveal as="header" className="text-center">
          <h2
            id="other-services"
            className="font-oswald text-2xl font-semibold uppercase tracking-[0.2em] text-ink-cherry sm:text-3xl"
          >
            More Services
          </h2>
        </Reveal>
        <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {services.map(({ slug, title, summary, image }, i) => (
            <Reveal as="li" key={slug} step={i % 2}>
              {/* The notch is painted in the section's background colour. */}
              <NotchedProjectCard
                href={`/services/${slug}`}
                title={title}
                description={summary}
                image={image.url}
                imageAlt={image.alt}
                sizes="(min-width: 40rem) 50vw, 100vw"
                monochrome
                surface="var(--panel)"
              />
            </Reveal>
          ))}
        </ul>
        <p className="mt-14 text-center">
          <Link
            href="/services"
            title="All services"
            className="font-oswald text-sm uppercase tracking-[0.2em] text-ink-cherry underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
          >
            All services
          </Link>
        </p>
      </div>
    </section>
  );
}
