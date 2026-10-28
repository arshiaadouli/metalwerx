import Link from "next/link";
import { ArrowRight, Check, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { CtaBand, Photo, ServiceHero } from "./sections";
import { getServices, getServicesPage } from "./services";

// The copy and photos come from the CMS (see services.js).
export async function generateMetadata() {
  const { seo } = await getServicesPage();
  return { title: seo.title, description: seo.description };
}

export default async function ServicesPage() {
  const [{ hero, cta }, services] = await Promise.all([getServicesPage(), getServices()]);

  return (
    <main className="flex-1 bg-surface font-montserrat text-ink">
      <ServiceHero
        image={hero.image}
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Services" }]}
        icon={Recycle}
        eyebrow={hero.eyebrow}
        title={hero.title}
        lede={hero.lede}
        actions={[hero.cta]}
      />

      <section aria-label="Services" className="bg-surface">
        <div className="mx-auto w-full max-w-7xl space-y-20 px-6 py-20 sm:space-y-28 sm:py-24">
          {services.map((service, i) => (
            <ServiceRow key={service.slug} service={service} index={i} />
          ))}
        </div>
      </section>

      <CtaBand {...cta} />
    </main>
  );
}

// The photo and text swap sides on every other row from lg up. The id is the
// anchor that links from before the service pages existed still point to.
function ServiceRow({ service, index }) {
  const { slug, anchor, title, icon: Icon, lede, image, overview } = service;
  const href = `/services/${slug}`;
  return (
    <article
      id={anchor}
      aria-labelledby={`${anchor}-title`}
      className="grid scroll-mt-8 items-center gap-10 lg:grid-cols-2 lg:gap-16"
    >
      <Reveal variant="fade" className={cn(index % 2 === 1 && "lg:order-last")}>
        <Photo
          image={image}
          sizes="(min-width: 80rem) 38rem, (min-width: 64rem) 46vw, calc(100vw - 3rem)"
          className="block aspect-4/3 w-full rounded-2xl object-cover"
        />
      </Reveal>

      <Reveal step={1}>
        <p className="flex items-center gap-3 font-oswald text-sm uppercase tracking-[0.3em] text-ink-cherry">
          <Icon aria-hidden="true" className="size-5" />
          {String(index + 1).padStart(2, "0")}
        </p>
        <h2 id={`${anchor}-title`} className="mt-3 font-bebas-neue text-5xl tracking-wide sm:text-6xl">
          {title}
        </h2>
        <div className="mt-4 h-1 w-16 bg-cherry" />
        <p className="mt-6 leading-7 text-ink-soft">{lede}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {overview.features.map((feature, i) => (
            <Reveal
              as="li"
              key={feature.title}
              variant="slide"
              step={i}
              className="flex items-center gap-3 text-sm text-ink-soft"
            >
              <Check aria-hidden="true" strokeWidth={2.5} className="size-5 shrink-0 text-ink-cherry" />
              {feature.title}
            </Reveal>
          ))}
        </ul>
        <Button
          asChild
          size="lg"
          className="mt-8 gap-2 font-oswald uppercase tracking-[0.15em] transition-all duration-300 hover:gap-4"
        >
          <Link href={href} title={title}>
            Learn More
            <span className="sr-only"> about {title}</span>
            <ArrowRight aria-hidden="true" className="size-5" />
          </Link>
        </Button>
      </Reveal>
    </article>
  );
}
