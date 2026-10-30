import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";

// The questions and answers are in the CMS (see lib/cms.js).
export default function IndexFaq({ heading, intro, questions }) {
  return (
    <section id="faq" className="bg-surface font-montserrat text-ink">
      <div className="mx-auto w-full max-w-3xl px-6 pb-20 sm:pb-24">
        <Reveal as="header" className="text-center">
          <h2 className="font-oswald text-2xl font-semibold uppercase tracking-[0.2em] text-ink-cherry sm:text-3xl">
            {heading}
          </h2>
          {intro && (
            <p className="mx-auto mt-4 max-w-2xl text-sm tracking-wide text-ink-soft sm:text-base">
              {intro}
            </p>
          )}
        </Reveal>

        {/* The questions slide in one by one, like the Contact page's links. */}
        <Accordion type="single" collapsible className="mt-12 border-t border-line">
          {questions.map(({ question, answer }, i) => (
            <Reveal key={question} variant="slide" step={i}>
              <AccordionItem value={question} className="border-line">
                <AccordionTrigger className="gap-6 py-5 text-left text-base font-semibold text-ink hover:text-ink-cherry hover:no-underline focus-visible:text-ink-cherry focus-visible:underline focus-visible:outline-none data-[state=open]:text-ink-cherry sm:text-lg [&>svg]:size-5 [&>svg]:text-ink-muted">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 pr-11 text-sm leading-7 text-ink-soft sm:text-base sm:leading-7">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            </Reveal>
          ))}
        </Accordion>

        <Reveal as="p" className="mt-10 text-center text-sm text-ink-soft sm:text-base">
          Still have a question?{" "}
          <Link
            href="/contact-us"
            title="Contact Us"
            className="font-semibold text-ink-cherry underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
          >
            Get in touch
          </Link>
          .
        </Reveal>
      </div>
    </section>
  );
}
