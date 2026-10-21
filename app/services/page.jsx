import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { serviceMorph } from "./morph";
import { Container, CtaBand, PageHeader, Photo } from "./sections";
import { overviewImage, services } from "./services";

// The header photo is also the preview image when the page is shared.
export const metadata = pageMetadata({
  path: "/services",
  title: "Services",
  description:
    "Scrap metal bin hire, pickup and collection, and commercial recycling from Metal Werx in Hallam, for homes, farms and businesses across Melbourne's south-east.",
  image: { url: `${overviewImage.url}&w=1200`, alt: overviewImage.alt },
});

// The services as a catalogue: one row each on a single rail, then the band
// that closes the page. Each row's photo is the one its page opens on, so it
// carries across when the row is followed.
export default function ServicesPage() {
  return (
    <main id="main" className="flex-1">
      <PageHeader
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Services" }]}
        title="Scrap Metal Recycling Services"
        lede="Bring your scrap to our Hallam yard, or let us come to you. We hire out scrap bins, collect bulk loads and look after businesses with metal to recycle every week."
        actions={[{ text: "Get a Quote", href: "/contact-us" }]}
        image={overviewImage}
      />

      <section aria-label="Services">
        <Container>
          <div className="divide-y divide-rule border-t-2 border-ink">
            {services.map((service, i) => (
              <ServiceRow key={service.slug} service={service} flip={i % 2 === 1} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        heading="Not Sure Which You Need?"
        text="Tell us what you've got and we'll point you to the right service."
        cta={{ text: "Get in Touch", href: "/contact-us" }}
      />
    </main>
  );
}

// The photo and text swap sides on every other row from lg up. The id is the
// anchor that links from before the service pages existed (such as the home
// page's in Strapi) still land on. The photo morphs into the service page's
// header only on the navigation its own link starts (serviceMorph), so the
// other rows stay put.
function ServiceRow({ service, flip }) {
  const { slug, anchor, title, lede, image, overview } = service;
  const morph = serviceMorph(slug);
  return (
    <article
      id={anchor}
      aria-labelledby={`${anchor}-title`}
      className="grid scroll-mt-24 gap-8 py-12 sm:gap-10 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20"
    >
      <ViewTransition name={morph.name} share={morph.share} default="none">
        <Photo
          image={image}
          sizes="(min-width: 82.5rem) 37.25rem, (min-width: 64rem) calc(50vw - 4rem), (min-width: 40rem) calc(100vw - 4rem), calc(100vw - 2.5rem)"
          className={cn("aspect-[4/3] w-full rounded-[2px]", flip && "lg:order-last")}
        />
      </ViewTransition>

      <div>
        <h2 id={`${anchor}-title`} className="type-heading text-ink">
          {title}
        </h2>
        <p className="mt-4 max-w-[52ch] type-lede text-ink-soft">{lede}</p>

        {/* What comes with the service, ruled like a spec sheet. */}
        <ul className="mt-8 grid border-t border-rule sm:grid-cols-2">
          {overview.features.map(({ icon: Icon, title: feature }) => (
            <li
              key={feature}
              className="flex items-start gap-3 border-b border-rule py-3.5 font-semibold text-ink sm:odd:pr-6 sm:even:pl-6"
            >
              <Icon aria-hidden="true" strokeWidth={1.75} className="mt-[0.1875rem] size-5 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <Button asChild variant="outline" className="mt-8">
          <Link href={`/services/${slug}`} transitionTypes={morph.types}>
            Learn more
            <span className="sr-only"> about {title}</span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
