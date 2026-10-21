import Link from "next/link";
import { Phone, Plus } from "lucide-react";

import { YARD } from "@/lib/yard";
import { cn } from "@/lib/utils";

// Questions and answers: the heading beside them, then one answer open at a
// time. On the home page they come from the Home Page in Strapi (see
// lib/pages.js); the service and material pages pass their own.
//
// Native <details>, not the Radix accordion: a closed answer stays in the HTML,
// where search engines read it, and find-in-page opens it. The shared name
// keeps one open at a time. Where the browser supports ::details-content and
// interpolate-size, the answer slides open; elsewhere it opens at once.
export default function IndexFaq({ heading = "Frequently asked questions", intro, questions, className }) {
  return (
    <section id="faq" aria-labelledby="faq-heading" className={cn("scroll-mt-24 py-20 sm:py-28", className)}>
      <div className="mx-auto grid w-full max-w-[82.5rem] gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <header className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="faq-heading" className="type-heading text-ink">
            {heading}
          </h2>
          {intro && <p className="mt-3 max-w-[40ch] type-lede text-ink-soft">{intro}</p>}
          {/* "Ring us on", so the link doesn't repeat the header's number or a
              "Call 0470…" button elsewhere on the page word for word. */}
          <p className="mt-8 text-base text-ink-soft">
            Still have a question?{" "}
            <a
              href={YARD.phoneHref}
              className="tabular inline-flex items-center gap-1.5 font-bold text-ink underline hover:no-underline"
            >
              <Phone aria-hidden="true" className="size-4" />
              Ring us on {YARD.phone}
            </a>{" "}
            or{" "}
            <Link href="/contact-us" className="font-bold text-ink underline hover:no-underline">
              send us a message
            </Link>
            .
          </p>
        </header>

        <div className="border-t-2 border-ink">
          {questions.map(({ question, answer }) => (
            <details
              key={question}
              name="faq"
              className="group border-b border-rule [interpolate-size:allow-keywords] details-content:h-0 details-content:overflow-clip details-content:transition-[height,content-visibility] details-content:transition-discrete details-content:duration-200 details-content:ease-out-expo open:details-content:h-auto motion-reduce:details-content:transition-none"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-ink transition-colors duration-150 hover:text-ink-soft [&::-webkit-details-marker]:hidden">
                <h3 className="text-lg leading-snug font-bold [font-stretch:104%] sm:text-xl">{question}</h3>
                {/* The plus turns into a cross as its answer opens. */}
                <Plus
                  aria-hidden="true"
                  strokeWidth={2}
                  className="mt-[0.2em] size-5 shrink-0 text-ink-muted transition-transform duration-200 ease-out-expo group-open:rotate-45 group-open:text-ink"
                />
              </summary>
              <div className="max-w-[62ch] pr-10 pb-6 text-base leading-7 text-ink-soft">{answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
