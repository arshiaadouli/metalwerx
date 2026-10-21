import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import IndexFaq from "@/app/components/index-faq";
import { pageMetadata } from "@/lib/seo";
import { serviceMorph } from "./morph";
import { Container, CtaBand, Details, PageHeader, Photo, Steps } from "./sections";
import { getService, services } from "./services";

// The page for one service in services.js. Each has its own folder, such as
// app/services/bin-hire/page.jsx, rather than one app/services/[slug] route:
// with no params to read, every page is static and opens instantly from a link.

// The header photo is also the preview image when the page is shared.
export function serviceMetadata(slug) {
  const { seo, image } = getService(slug);
  return pageMetadata({
    path: `/services/${slug}`,
    title: seo.title,
    description: seo.description,
    image: { url: `${image.url}&w=1200`, alt: image.alt },
  });
}

// The header photo carries across from the row that linked here, on /services
// or another service's page, under the same name (see ./morph.js).
export function ServicePage({ slug }) {
  const service = getService(slug);
  const others = services.filter((other) => other !== service);

  return (
    <main id="main" className="flex-1">
      <PageHeader
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.title },
        ]}
        title={service.heading}
        lede={service.lede}
        actions={[
          { text: "Get a Quote", href: "/contact-us" },
          { text: "How It Works", href: "#how-it-works", variant: "quiet" },
        ]}
        image={service.image}
        imageName={serviceMorph(slug).name}
      />
      <Overview {...service.overview} />
      <Steps {...service.steps} />
      <Details {...service.details} />
      <IndexFaq heading="Frequently Asked Questions" {...service.faq} className="border-t border-rule" />
      <OtherServices services={others} />
      <CtaBand {...service.cta} />
    </main>
  );
}

// What the service is, then what comes with it as a two-by-two spec list,
// ruled into its four parts.
function Overview({ heading, paragraphs, features }) {
  return (
    <section aria-labelledby="overview" className="border-b border-rule pt-4 pb-20 sm:pt-8 sm:pb-28">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <h2 id="overview" className="type-heading text-ink">
            {heading}
          </h2>
          <div className="mt-6 max-w-[60ch] space-y-5 text-ink-soft">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <ul className="grid border-t-2 border-ink sm:grid-cols-2">
          {features.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4 border-b border-rule py-7 sm:odd:border-r sm:odd:pr-8 sm:even:pl-8"
            >
              <Icon aria-hidden="true" strokeWidth={1.5} className="size-7 text-ink" />
              <div>
                <h3 className="type-subheading text-ink">{title}</h3>
                <p className="mt-2 text-base text-ink-soft">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

// The other services, one photo row each. The whole row is the link's target,
// though only the title names it, so the photo keeps its own alt text.
function OtherServices({ services }) {
  return (
    <section aria-labelledby="other-services" className="border-t border-rule py-20 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <h2 id="other-services" className="type-heading text-ink">
            More Services
          </h2>
          <Link
            href="/services"
            className="font-bold text-ink underline transition-colors duration-150 ease-out-expo hover:text-ink-soft"
          >
            All services
          </Link>
        </div>

        <ul className="mt-10 grid border-t-2 border-ink sm:mt-12 lg:grid-cols-2 lg:gap-x-8">
          {services.map(({ slug, title, summary, image }) => (
            <OtherService key={slug} slug={slug} title={title} summary={summary} image={image} />
          ))}
        </ul>
      </Container>
    </section>
  );
}

// One row: the photo, then the title and summary. The link stretches over the
// whole row, and its focus ring outlines the row.
function OtherService({ slug, title, summary, image }) {
  const morph = serviceMorph(slug);
  return (
    <li className="group relative grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start gap-5 border-b border-rule py-6 last:border-b-0 sm:grid-cols-[17rem_minmax(0,1fr)] sm:gap-8 sm:py-8 lg:border-b-0">
      <ViewTransition name={morph.name} share={morph.share} default="none">
        <Photo image={image} sizes="(min-width: 40rem) 17rem, 40vw" className="aspect-[4/3] w-full rounded-[2px]" />
      </ViewTransition>
      <div>
        <h3 className="flex items-start justify-between gap-4 type-subheading text-ink">
          <Link
            href={`/services/${slug}`}
            transitionTypes={morph.types}
            className="underline-offset-[0.2em] after:absolute after:inset-0 after:rounded-[2px] group-hover:underline focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus"
          >
            {title}
          </Link>
          <ArrowRight
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-ink-muted transition-colors duration-150 ease-out-expo group-hover:text-ink"
          />
        </h3>
        <p className="mt-2 text-base text-ink-soft">{summary}</p>
      </div>
    </li>
  );
}
