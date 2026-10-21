import Link from "next/link";
import { ArrowRight } from "lucide-react";
import IndexFaq from "@/app/components/index-faq";
import { metalCode } from "@/lib/metals";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Container, CtaBand, Details, PageHeader, RackBay, Steps } from "@/app/services/sections";
import { MaterialBay } from "./material-bay";
import { getMaterial, sellingSteps } from "./materials";

// The page for one material in materials.js. As with the service pages (see
// app/services/service-page.jsx), each has its own folder, such as
// app/what-we-buy/copper/page.jsx, rather than one [slug] route: with no params
// to read, every page is static and opens instantly from a link.

// The header photo is also the preview image when the page is shared.
export function materialMetadata(slug) {
  const { seo, image } = getMaterial(slug);
  return pageMetadata({
    path: `/what-we-buy/${slug}`,
    title: seo.title,
    description: seo.description,
    image: { url: `${image.url}&w=1200`, alt: image.alt },
  });
}

export function MaterialPage({ slug }) {
  const material = getMaterial(slug);
  const related = material.related.map(getMaterial);

  return (
    <main id="main" className="flex-1 bg-ground text-ink">
      <PageHeader
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "What We Buy", href: "/what-we-buy" },
          { name: material.title },
        ]}
        title={material.heading}
        lede={material.lede}
        actions={[
          { text: "Get a quote", href: "/contact-us" },
          { text: "How it works", href: "#how-it-works" },
        ]}
        aside={<RackBay slug={slug} code={metalCode(slug)} name={material.title} size="lg" />}
        image={material.image}
      />
      <Overview code={metalCode(slug)} {...material.overview} />
      <Steps {...(material.steps ?? sellingSteps)} />
      <Details {...material.details} />
      <IndexFaq {...material.faq} className="border-t border-rule" />
      <Related materials={related} />
      <CtaBand {...material.cta} />
    </main>
  );
}

// The overview beside the grades the yard sorts the material into, each on
// its own punched aluminium tag stamped with the material's code.
function Overview({ code, heading, paragraphs, gradesTitle = "Grades We Buy", grades }) {
  return (
    <section aria-labelledby="overview" className="border-b border-rule pt-6 pb-20 sm:pt-8 sm:pb-28">
      <Container className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <h2 id="overview" className="type-heading max-w-[18ch] text-ink">
            {heading}
          </h2>
          <div className="mt-6 max-w-[62ch] space-y-5 text-ink-soft">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-ink pt-6">
          <h3 id="grades" className="scroll-mt-24 type-subheading text-ink">
            {gradesTitle}
          </h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {grades.map(({ title, text }) => (
              <GradeTag key={title} code={code} title={title} text={text} />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

// The ink each metal's code is stamped in, the darkest tone of the metal,
// which reads at 4.5:1 or better on the tag in both themes. A code of two
// metals ("Cu Fe" for motors) stamps each in its own ink.
const CODE_INK = {
  Cu: "text-cu",
  CuZn: "text-brass",
  Al: "text-al",
  SS: "text-ss",
  Pb: "text-pb",
  Fe: "text-fe",
};

// A hang tag's outline: square at the foot, its top corners cut off. The face
// is cut 2 - √2 px smaller than the edge it sits in, so the 1px aluminium edge
// runs evenly round the cut corners too.
function tagOutline(cut) {
  return `polygon(${cut}px 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% 100%, 0 100%, 0 ${cut}px)`;
}
const TAG_EDGE = { clipPath: tagOutline(12) };
const TAG_FACE = { clipPath: tagOutline(12 - (2 - Math.SQRT2)) };

// A grade on its own hang tag: the eyelet punched at the top, showing the page
// through it, then the code stamped in its metal's ink, the grade and what
// goes in it.
function GradeTag({ code, title, text }) {
  return (
    <li style={TAG_EDGE} className="bg-tag-rule p-px">
      <div style={TAG_FACE} className="relative flex h-full flex-col bg-tag px-5 pt-8 pb-6 text-tag-ink sm:px-6">
        <span
          aria-hidden="true"
          className="absolute top-2.5 left-1/2 size-[1.125rem] -translate-x-1/2 rounded-full border-4 border-tag-rule bg-ground shadow-[inset_0_1px_2px_rgb(0_0_0/0.3)]"
        />
        <p aria-hidden="true" className="flex gap-x-1.5 type-code text-3xl">
          {code.split(" ").map((symbol) => (
            <span key={symbol} className={cn(CODE_INK[symbol] ?? "text-tag-ink")}>
              {symbol}
            </span>
          ))}
        </p>
        <h4 className="mt-4 text-lg leading-snug font-bold [font-stretch:104%] text-tag-ink">{title}</h4>
        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-tag-ink-soft">{text}</p>
      </div>
    </li>
  );
}

// Three more materials, in their bays on the rack field, each carrying its
// bundle across to its own page.
function Related({ materials }) {
  return (
    <section aria-labelledby="related" className="on-rack bg-rack text-rack-ink">
      <Container className="grid gap-10 py-16 sm:gap-12 sm:py-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:py-24">
        <div>
          <h2 id="related" className="type-heading text-rack-ink">
            We also buy
          </h2>
          <p className="mt-4">
            <Link
              href="/what-we-buy"
              className="inline-flex min-h-11 items-center gap-2 font-bold text-rack-ink underline hover:no-underline"
            >
              Everything we buy
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 sm:gap-x-7">
          {materials.map(({ slug, title, summary }) => (
            <MaterialBay key={slug} slug={slug} title={title} summary={summary} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
