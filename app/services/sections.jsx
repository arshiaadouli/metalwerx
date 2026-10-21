import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowDown, Check, ChevronRight, Phone, X } from "lucide-react";
import { Bundle } from "@/components/metal/metal";
import { JsonLd } from "@/components/site/json-ld";
import { Button } from "@/components/ui/button";
import { ScrollLink } from "@/components/ui/scroll-link";
import { SITE_URL } from "@/lib/seo";
import { YARD } from "@/lib/yard";
import { cn } from "@/lib/utils";

// The pieces /services, the service pages, /what-we-buy and the material pages
// share. Sections follow the stockist's catalogue: a heading, a hairline rail,
// then the content; the dark rack field is kept for the stock itself.

// The widths the browser can pick from. Every photo url in services.js and
// what-we-buy/materials.js takes a width on the end.
const WIDTHS = [640, 960, 1280, 1920, 2560];

// A stock photo with a srcset. `sizes` is how wide it shows, as in the <img>
// attribute. A plain <img> rather than next/image, as elsewhere on the site,
// so no next.config remotePatterns entry is needed for the photo hosts.
// `priority` is for a photo on the first screen.
//
// Both hosts take the format on the end too: AVIF for the browsers that can
// show it, WebP in the <img> for the rest and for crawlers, which send no
// Accept header and would otherwise get a JPEG. The <picture> is the box that
// `className` sizes (and that a ViewTransition names); the <img> fills it and
// takes its object-position, so a className can still set the crop.
export function Photo({ image, sizes, className, priority = false }) {
  const srcSet = (format) => WIDTHS.map((width) => `${image.url}&w=${width}&fm=${format} ${width}w`).join(", ");
  return (
    <picture className={cn("block overflow-hidden bg-sunk", className)}>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <img
        src={`${image.url}&w=1280&fm=webp`}
        srcSet={srcSet("webp")}
        sizes={sizes}
        alt={image.alt}
        title={image.title || undefined}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className="size-full object-cover [object-position:inherit]"
      />
    </picture>
  );
}

// The page width every section lines up to.
export function Container({ className, children }) {
  return <div className={cn("mx-auto w-full max-w-[82.5rem] px-5 sm:px-8", className)}>{children}</div>;
}

// A section heading with its optional intro, over the hairline rail that
// starts the section's content.
export function SectionHeading({ id, title, intro, className, onRack = false }) {
  return (
    <header className={cn("max-w-3xl", className)}>
      <h2 id={id} className={cn("type-heading", onRack ? "text-rack-ink" : "text-ink")}>
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-3 type-lede", onRack ? "text-rack-ink-soft" : "text-ink-soft")}>{intro}</p>
      )}
    </header>
  );
}

// The trail from the home page to this one. It also goes in the page as a
// schema.org BreadcrumbList, which search engines show in place of the URL in
// results; the current page, the last crumb, needs no address of its own.
export function Breadcrumbs({ items }) {
  const list = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, href }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      ...(href && { item: new URL(href, SITE_URL).href }),
    })),
  };
  return (
    <nav aria-label="Breadcrumb">
      <JsonLd data={list} />
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 type-meta text-ink-muted">
        {items.map(({ name, href }, i) => (
          <li key={name} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight aria-hidden="true" className="size-3.5" />}
            {href ? (
              <Link href={href} className="underline-offset-[0.22em] hover:text-ink hover:underline">
                {name}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// The rack bay a material sits in: its bundle on an arm, with its code and
// name stamped below. The bundle shares a view-transition name with every
// other bay for the same material, so it carries across from a card to the
// material's page.
export function RackBay({ slug, code, name, size = "md", className }) {
  return (
    <div className={cn("on-rack rounded-[2px] bg-rack px-6 pt-8 pb-5 text-rack-ink", className)}>
      <ViewTransition name={`metal-${slug}`} share="metal-morph" default="none">
        <div className={cn("mx-auto", size === "lg" ? "max-w-[22rem]" : "max-w-[15rem]")}>
          <Bundle slug={slug} />
        </div>
      </ViewTransition>
      <div aria-hidden="true" className="mt-0.5 h-1.5 rounded-[1px] bg-rack-arm" />
      <p className="mt-3 flex items-baseline gap-2.5">
        <span className={cn("type-code", size === "lg" ? "text-3xl" : "text-2xl")}>{code}</span>
        <span className="text-[0.9375rem] font-semibold text-rack-ink-soft">{name}</span>
      </p>
    </div>
  );
}

// The page header for a service or a material. Props:
//   breadcrumbs   [{ name, href? }]; the last, with no href, is this page
//   title, lede
//   actions       [{ text, href, variant? }]; the first is the main action
//   aside?        what stands beside the title: a RackBay for a material
//   image?        { url, alt, title }: the wide photo under the header
//   imageName?    a view-transition name shared with the cards for this page
export function PageHeader({ breadcrumbs, title, lede, actions = [], aside, image, imageName }) {
  return (
    <header className="pt-8 pb-14 sm:pt-10 sm:pb-20">
      <Container>
        <Breadcrumbs items={breadcrumbs} />
        <div className={cn("mt-10 grid gap-10 sm:mt-14", aside && "lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-end lg:gap-16")}>
          <div>
            <h1 className="type-title max-w-[16ch] text-ink">{title}</h1>
            <p className="mt-6 max-w-[58ch] type-lede text-ink-soft">{lede}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={YARD.phoneHref} className="tabular">
                  <Phone aria-hidden="true" />
                  Call {YARD.phone}
                </a>
              </Button>
              {actions.map(({ text, href, variant = "outline" }) => {
                // An in-page action such as "How it works" scrolls itself: a
                // Link to the #anchor the address already ends in does nothing,
                // so a second click wouldn't move the page.
                const inPage = href.startsWith("#");
                const ActionLink = inPage ? ScrollLink : Link;
                return (
                  <Button key={href} asChild size="lg" variant={variant}>
                    <ActionLink href={href} title={text}>
                      {text}
                      {inPage && <ArrowDown aria-hidden="true" />}
                    </ActionLink>
                  </Button>
                );
              })}
            </div>
          </div>
          {aside}
        </div>
        {image && <HeaderPhoto image={image} name={imageName} />}
      </Container>
    </header>
  );
}

// The wide photo under a page header. With a name, it carries across from the
// card that linked here.
function HeaderPhoto({ image, name }) {
  const photo = (
    <Photo
      image={image}
      sizes="(min-width: 82.5rem) 78.5rem, calc(100vw - 2.5rem)"
      priority
      className="mt-12 aspect-[16/9] w-full rounded-[2px] sm:mt-16 sm:aspect-[21/9]"
    />
  );
  if (!name) return photo;
  return (
    <ViewTransition name={name} share="metal-morph" default="none">
      {photo}
    </ViewTransition>
  );
}

// The closing band: the page's call to action, the phone number and the yard.
// It stays on the page ground, so it doesn't run into the footer's rack field
// below it. cta is { text, href }. Its call button reads "Call us on", so it
// doesn't repeat the page header's "Call 0470…" word for word.
export function CtaBand({ heading, text, cta }) {
  return (
    <section aria-labelledby="cta-band" className="border-t border-rule">
      <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
        <div>
          <h2 id="cta-band" className="type-heading text-ink">
            {heading}
          </h2>
          <p className="mt-3 max-w-[48ch] type-lede text-ink-soft">{text}</p>
        </div>
        <div className="flex flex-col gap-4 lg:items-end">
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={YARD.phoneHref} className="tabular">
                <Phone aria-hidden="true" />
                Call us on {YARD.phone}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={cta.href}>
                {cta.text}
              </Link>
            </Button>
          </div>
          <p className="text-[0.9375rem] text-ink-soft">
            Or bring it to the yard at{" "}
            <a href={YARD.mapsHref} className="text-ink underline hover:no-underline">
              {YARD.addressShort}
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}

// A sequence of steps, numbered because the order matters, on one rail.
// The hero's "How it works" button jumps here.
export function Steps({ heading = "How it works", intro, items }) {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <SectionHeading id="how-it-works-heading" title={heading} intro={intro} />
        <ol className="mt-12 grid gap-x-8 gap-y-10 border-t-2 border-ink pt-0 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ title, text }, i) => (
            <li key={title} className="pt-6">
              <p className="type-code text-lg text-ink-muted">Step {i + 1}</p>
              <h3 className="mt-6 type-subheading text-ink">{title}</h3>
              <p className="mt-2 text-base text-ink-soft">{text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

// A list of things to bring (a tick) or to leave out (a cross, kind "no").
export function ItemList({ title, kind, items }) {
  const no = kind === "no";
  const Icon = no ? X : Check;
  return (
    <div>
      <h3 className="type-subheading text-ink">{title}</h3>
      <ul className="mt-4 border-t border-rule">
        {items.map((item) => (
          <li key={item} className="flex gap-3 border-b border-rule py-3 text-base text-ink-soft">
            <Icon
              aria-hidden="true"
              strokeWidth={2.25}
              className={cn("mt-1 size-[1.125rem] shrink-0", no ? "text-ink-muted" : "text-ink")}
            />
            <span className={cn(no && "text-ink-muted")}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Up to two photos beside the lists: the second overlaps the first's
// bottom-right corner, framed in the page colour. With none, the text has the
// row to itself.
export function Details({ heading, intro, images = [], lists }) {
  const [main, inset] = images;
  return (
    <section aria-labelledby="details" className="border-t border-rule py-20 sm:py-28">
      <Container className={cn("grid gap-14 lg:gap-20", main && "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start")}>
        {main && (
          <div className={cn("relative", inset && "pr-10 pb-10 sm:pr-16 sm:pb-16")}>
            <Photo
              image={main}
              sizes="(min-width: 82.5rem) 30rem, (min-width: 64rem) 38vw, calc(100vw - 5rem)"
              className="aspect-[4/5] w-full rounded-[2px]"
            />
            {inset && (
              <Photo
                image={inset}
                sizes="(min-width: 64rem) 16rem, 50vw"
                className="absolute right-0 bottom-0 aspect-square w-1/2 rounded-[2px] border-[6px] border-ground sm:border-8"
              />
            )}
          </div>
        )}
        <div>
          <SectionHeading id="details" title={heading} intro={intro} />
          <div className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-10">
            {lists.map((list) => (
              <ItemList key={list.title} {...list} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// TRANSITIONAL: the previous header's name and props, so pages not rebuilt yet
// keep rendering during the redesign. Delete once nothing imports it.
export function ServiceHero({ image, breadcrumbs, title, lede, actions = [] }) {
  return (
    <PageHeader
      breadcrumbs={breadcrumbs}
      title={title}
      lede={lede}
      actions={actions.map(({ text, href }) => ({ text, href }))}
      image={image}
    />
  );
}
