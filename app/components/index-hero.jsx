import Link from "next/link";
import { Phone } from "lucide-react";

import { getMaterial, groups } from "@/app/what-we-buy/materials";
import { Button } from "@/components/ui/button";
import { Carousel_003 } from "@/components/ui/skiper49";
import { getRackBays } from "@/lib/metals";
import { YARD } from "@/lib/yard";
import HomeRack from "./home-rack";

// The home page's first screen: the headline and the ways to sell, then the
// rack of every metal the yard buys with the picked metal's grade tag. The
// copy, buttons and photos come from the Home Page in Strapi (see
// lib/pages.js); the rack's grades come from app/what-we-buy/materials.js.
// Under the rack, the hero photos lead a coverflow slideshow, followed by the
// photo of each thing the yard buys, moving on every 4 seconds. They run
// uncaptioned: they are stock, not the yard itself.

// The slideshow's photos, at slide size (a slide is at most 264px wide).
// Strapi uploads come with a srcSet of Strapi's smaller copies; a pasted
// Unsplash address takes a width instead. The material photos take a width on
// the end, so they get a srcSet of their own. Both photo hosts are asked for
// WebP, which a crawler (no Accept header) would otherwise get as a JPEG;
// Unsplash still sends AVIF to a browser that takes it. Strapi uploads are
// saved as WebP already.
function slideshowPhotos(backgroundImages) {
  const hero = backgroundImages.map(({ src, srcSet, alt }) => ({ src: atSlideSize(src), srcSet, alt }));
  const materials = groups
    .flatMap((group) => group.slugs)
    .map((slug) => {
      const { image } = getMaterial(slug);
      return {
        src: `${image.url}&w=720&fm=webp`,
        srcSet: [480, 720, 960].map((w) => `${image.url}&w=${w}&fm=webp ${w}w`).join(", "),
        alt: image.alt,
      };
    });
  return [...hero, ...materials];
}

function atSlideSize(src) {
  try {
    const url = new URL(src);
    if (url.hostname !== "images.unsplash.com") return src;
    url.searchParams.set("w", "720");
    url.searchParams.set("fm", "webp");
    return url.href;
  } catch {
    return src;
  }
}
export default function IndexHero({
  eyebrow,
  title,
  description,
  primaryCta,
  // The Home Page's secondaryCta isn't shown: in Strapi it links to /prices,
  // which isn't built, and SEO audits flag a link that redirects or 404s.
  backgroundImages = [],
  ticker = [],
}) {
  return (
    <>
      <section aria-labelledby="hero-title" className="pt-9 pb-10 sm:pt-16 sm:pb-14">
        <div className="mx-auto grid w-full max-w-[82.5rem] gap-6 px-5 sm:gap-8 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12">
          <h1 id="hero-title" className="type-display max-w-[14ch] text-ink">
            {title}
          </h1>
          <div className="lg:pb-2">
            <p className="max-w-[40ch] type-lede text-ink-soft">{description}</p>
            <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-7 sm:gap-3">
              <Button asChild size="lg" className="max-sm:w-full">
                <a href={YARD.phoneHref} className="tabular">
                  <Phone aria-hidden="true" />
                  Call {YARD.phone}
                </a>
              </Button>
              {primaryCta && (
                <Button asChild size="lg" variant="outline" className="max-sm:w-full">
                  <Link href={primaryCta.href}>
                    {primaryCta.text}
                  </Link>
                </Button>
              )}
            </div>
            <ul className="mt-5 grid gap-1.5 text-[0.9375rem] text-ink-muted">
              <li>
                {eyebrow ?? YARD.name},{" "}
                <a href={YARD.mapsHref} className="text-ink underline hover:no-underline">
                  {YARD.addressShort}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* <HomeRack bays={getRackBays()} ticker={ticker} /> */}

      <section aria-label="Photos of scrap metal" className="overflow-hidden py-12 sm:py-16">
        <div className="flex w-full justify-center">
          <Carousel_003
            images={slideshowPhotos(backgroundImages)}
            showPagination
            showNavigation
            loop
            autoplay
            label="Photos of scrap metal"
          />
        </div>
      </section>
    </>
  );
}
