import Link from "next/link";
import { ArrowRight, Check, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CutTitle, Enter } from "@/components/ui/enter";
import { Reveal } from "@/components/ui/reveal";
import { ScrollLink } from "@/components/ui/scroll-link";
import { cn } from "@/lib/utils";

// The pieces /services, the service pages, /what-we-buy and the material pages
// share.

// The widths the browser can pick from. Every photo url in services.js and
// what-we-buy/materials.js takes a width on the end.
const WIDTHS = [640, 960, 1280, 1920, 2560];

// A stock photo with a srcset. `sizes` is how wide it shows, as in the <img>
// attribute. A plain <img> rather than next/image, as elsewhere on the site,
// so no next.config remotePatterns entry is needed for the photo hosts.
// `priority` is for a photo on the first screen.
export function Photo({ image, sizes, className, priority = false }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${image.url}&w=1280`}
      srcSet={WIDTHS.map((width) => `${image.url}&w=${width} ${width}w`).join(", ")}
      sizes={sizes}
      alt={image.alt}
      title={image.title}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={className}
    />
  );
}

// The page header: a photo across the full width, shaded on the left where the
// text sits. Props:
//   image         { url, alt, title }
//   breadcrumbs   [{ name, href? }]; the last, with no href, is this page
//   icon?, eyebrow  the pill above the title
//   title, lede
//   actions       [{ text, href, outline? }]
// Text over the photo stays light in both themes, so the shade and text use the
// fixed palette, not the theme colours.
export function ServiceHero({ image, breadcrumbs, icon: Icon, eyebrow, title, lede, actions = [] }) {
  return (
    // isolate keeps the photo and shade (-z-10) above the header's background.
    <header className="relative isolate overflow-hidden bg-carbon">
      <Photo
        image={image}
        sizes="100vw"
        priority
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-carbon via-carbon/85 to-carbon/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t from-carbon/80 to-transparent"
      />

      {/* Plays on load, one step after another (see components/ui/enter.jsx). */}
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28 lg:py-32">
        <Enter step={0}>
          <Breadcrumbs items={breadcrumbs} />
        </Enter>
        <Enter
          as="p"
          step={1}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-oswald text-xs uppercase tracking-[0.3em] text-white ring-1 ring-white/25 backdrop-blur-sm"
        >
          {Icon && <Icon aria-hidden="true" className="size-3.5" />}
          {eyebrow}
        </Enter>
        {/* Bebas Neue only ships weight 400, so no font-bold (it would be faux bold). */}
        <h1 className="mt-5 max-w-4xl font-bebas-neue text-6xl leading-none tracking-wide text-white sm:text-7xl lg:text-8xl">
          <CutTitle step={2}>{title}</CutTitle>
        </h1>
        <Enter step={3} className="mt-6 h-1 w-16 bg-cherry" />
        <Enter as="p" step={3} className="mt-8 max-w-2xl text-lg leading-8 text-chrome">
          {lede}
        </Enter>

        {/* An in-page link, like "How It Works", eases the page down to its
            section rather than jumping. */}
        {actions.length > 0 && (
          <Enter step={4} className="mt-10 flex flex-wrap gap-4">
            {actions.map(({ text, href, outline }) => {
              const ActionLink = href.startsWith("#") ? ScrollLink : Link;
              return (
                <Button
                  key={href}
                  asChild
                  size="lg"
                  variant={outline ? "outline" : "default"}
                  className={cn(
                    "font-oswald uppercase tracking-[0.15em]",
                    outline &&
                      "border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white",
                  )}
                >
                  <ActionLink href={href} title={text}>
                    {text}
                  </ActionLink>
                </Button>
              );
            })}
          </Enter>
        )}
      </div>
    </header>
  );
}

function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-oswald text-xs uppercase tracking-[0.2em] text-aluminium">
        {items.map(({ name, href }, i) => (
          <li key={name} className="flex items-center gap-2">
            {i > 0 && <ChevronRight aria-hidden="true" className="size-3.5 text-steel" />}
            {href ? (
              <Link
                href={href}
                title={name}
                className="transition-colors hover:text-white focus-visible:text-white focus-visible:underline focus-visible:outline-none"
              >
                {name}
              </Link>
            ) : (
              <span aria-current="page" className="text-white">
                {name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// The red band at the foot of the page. cta is { text, href }.
export function CtaBand({ heading, text, cta }) {
  return (
    <section
      aria-labelledby="cta-band"
      className="relative isolate overflow-hidden bg-linear-to-br from-cherry-dark via-ember to-clinker"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(135deg,transparent_0_24px,rgb(255_255_255/0.04)_24px_48px)]"
      />
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-8 px-6 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
        <Reveal>
          <h2 id="cta-band" className="font-bebas-neue text-5xl tracking-wide text-white sm:text-6xl">
            {heading}
          </h2>
          <p className="mt-3 max-w-xl text-lg leading-8 text-chrome">{text}</p>
        </Reveal>
        <Reveal step={1} className="shrink-0">
          <Button
            asChild
            size="lg"
            className="gap-2 bg-white font-oswald uppercase tracking-[0.15em] text-cherry-dark transition-all duration-300 hover:gap-4 hover:bg-chrome"
          >
            <Link href={cta.href} title={cta.text}>
              {cta.text}
              <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

// The hero's "How It Works" button jumps here.
export function Steps({ intro, items }) {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="bg-panel">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-24">
        <Reveal as="header" className="text-center">
          <h2
            id="how-it-works-heading"
            className="font-oswald text-2xl font-semibold uppercase tracking-[0.2em] text-ink-cherry sm:text-3xl"
          >
            How It Works
          </h2>
          {intro && (
            <p className="mx-auto mt-4 max-w-2xl text-sm tracking-wide text-ink-soft sm:text-base">
              {intro}
            </p>
          )}
        </Reveal>

        {/* The <ol> numbers the steps for screen readers, so the big numbers are hidden from them. */}
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ title, text }, i) => (
            <Reveal
              as="li"
              key={title}
              step={i}
              className="rounded-2xl border border-line bg-surface p-6 sm:p-8"
            >
              <span aria-hidden="true" className="font-bebas-neue text-7xl leading-none text-ink-cherry">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-oswald text-lg uppercase tracking-[0.15em]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

// Up to two photos beside the lists: the second overlaps the first's
// bottom-right corner, framed in the page colour. With none, the text has the
// row to itself.
export function Details({ heading, intro, images = [], lists }) {
  const [main, inset] = images;
  return (
    <section aria-labelledby="details" className="bg-surface">
      <div
        className={cn(
          "mx-auto grid w-full max-w-7xl items-center gap-14 px-6 py-20 sm:py-24 lg:gap-16",
          main && "lg:grid-cols-2",
        )}
      >
        {/* The inset photo follows the main one in. */}
        {main && (
          <div className={cn("relative", inset && "pr-12 pb-12 sm:pr-20 sm:pb-20")}>
            <Reveal variant="fade">
              <Photo
                image={main}
                sizes="(min-width: 80rem) 32rem, (min-width: 64rem) 40vw, calc(100vw - 6rem)"
                className="block aspect-4/3 w-full rounded-2xl object-cover lg:aspect-4/5"
              />
            </Reveal>
            {inset && (
              <Reveal step={2} className="absolute right-0 bottom-0 w-1/2">
                <Photo
                  image={inset}
                  sizes="(min-width: 64rem) 18rem, 50vw"
                  className="block aspect-square w-full rounded-2xl border-6 border-surface object-cover sm:border-8"
                />
              </Reveal>
            )}
          </div>
        )}

        <div>
          <Reveal>
            <h2 id="details" className="font-bebas-neue text-5xl tracking-wide sm:text-6xl">
              {heading}
            </h2>
            <div className="mt-4 h-1 w-16 bg-cherry" />
            <p className="mt-8 max-w-3xl leading-7 text-ink-soft">{intro}</p>
          </Reveal>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-8">
            {lists.map((list) => (
              <ItemList key={list.title} {...list} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ItemList({ title, kind, items }) {
  const Icon = kind === "no" ? X : Check;
  return (
    <div>
      <Reveal as="h3" className="font-oswald text-lg uppercase tracking-[0.15em]">
        {title}
      </Reveal>
      {/* Slides in item by item, like the Contact page's links. */}
      <ul className="mt-5 space-y-3">
        {items.map((item, i) => (
          <Reveal
            as="li"
            key={item}
            variant="slide"
            step={i}
            className="flex gap-3 text-sm leading-6 text-ink-soft"
          >
            <Icon
              aria-hidden="true"
              strokeWidth={2.5}
              className={cn(
                "mt-0.5 size-5 shrink-0",
                kind === "no" ? "text-ink-muted" : "text-ink-cherry",
              )}
            />
            {item}
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
