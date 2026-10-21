import { ArrowUpRight, Phone } from "lucide-react";

import { Breadcrumbs, Container } from "@/app/services/sections";
import { FacebookIcon } from "@/components/site/brand-icons";
import { JsonLd } from "@/components/site/json-ld";
import { YardMap } from "@/components/site/yard-map";
import { Button } from "@/components/ui/button";
import { LOCAL_BUSINESS, pageMetadata } from "@/lib/seo";
import { YARD } from "@/lib/yard";
import { cn } from "@/lib/utils";
import { ContactForm } from "./contact-form";

export const metadata = pageMetadata({
  path: "/contact-us",
  title: "Contact Us",
  description:
    "Get a quote for your scrap metal, book a pickup or hire a bin. Call, email or send Metal Werx a message.",
});

// The contact page: the three ways to reach the yard, a message form that
// hands off to the visitor's email app, then the yard's opening hours (#hours)
// and where to find it (#location), which the header and footer link to. Every contact detail comes from lib/yard.js.

export default function ContactUsPage() {
  return (
    <main id="main" className="flex-1">
      <JsonLd data={LOCAL_BUSINESS} />
      <Container className="pt-8 pb-20 sm:pt-10 sm:pb-28">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact" }]} />
        <div className="mt-10 grid gap-16 sm:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start xl:gap-x-24">
          <div>
            <h1 className="type-title text-ink">Contact Our Hallam Scrap Yard</h1>
            <p className="mt-6 max-w-[40ch] type-lede text-pretty text-ink-soft">
              Need a quote for your scrap, a pickup or a bin? Get in touch and we&apos;ll get back to you.
            </p>
            <WaysToReach />
          </div>

          <section aria-labelledby="send-a-message" className="rounded-[2px] bg-sunk px-5 py-8 sm:p-8 lg:p-10">
            <h2 id="send-a-message" className="type-heading text-ink">
              Send a message
            </h2>
            <p className="mt-3 max-w-[48ch] text-pretty text-ink-soft">
              Tell us what scrap you have and we&apos;ll get back to you with a quote.
            </p>
            <ContactForm />
          </section>
        </div>
      </Container>

      <div className="border-t border-rule">
        <Container className="grid gap-16 py-16 sm:py-20 lg:grid-cols-2 lg:gap-x-16 lg:py-24">
          <OpeningHours />
          <Location />
        </Container>
      </div>
    </main>
  );
}

// Call, email, visit or follow, on one rail. The phone is the page's main
// action. Google Maps needs no row of its own: the directions links open it.
function WaysToReach() {
  return (
    <section aria-labelledby="get-in-touch" className="mt-12 sm:mt-14">
      <h2 id="get-in-touch" className="sr-only">
        Get in touch
      </h2>
      <dl className="border-t-2 border-ink">
        <Way label="Call us">
          <Button asChild size="lg" className="h-16 w-full px-8 text-2xl sm:w-auto">
            <a href={YARD.phoneHref} className="tabular">
              <Phone aria-hidden="true" />
              <span className="sr-only">Call </span>
              {YARD.phone}
            </a>
          </Button>
          <p className="mt-3 text-[0.9375rem] text-ink-soft">
            {YARD.hours ? (
              <a href="#hours" className="font-bold text-ink underline hover:no-underline">
                See our opening hours
              </a>
            ) : (
              "Call ahead for today's opening hours."
            )}
          </p>
        </Way>
        <Way label="Email us">
          <a
            href={YARD.emailHref}
            className="text-xl font-bold [overflow-wrap:anywhere] text-ink underline hover:no-underline sm:text-2xl"
          >
            {YARD.email}
          </a>
        </Way>
        <Way label="Visit the yard">
          <AddressLines className="text-xl font-bold text-ink sm:text-2xl" />
          <p className="mt-3">
            <TextLink href={YARD.mapsHref} title={`Directions to ${YARD.address}`} external>
              Get directions
              <ArrowUpRight aria-hidden="true" className="size-[1.125rem]" />
            </TextLink>
          </p>
        </Way>
        <Way label="Follow us">
          <TextLink href={YARD.facebookHref} external>
            <FacebookIcon aria-hidden="true" className="size-5" />
            Metal Werx on Facebook
            <ArrowUpRight aria-hidden="true" className="size-[1.125rem]" />
          </TextLink>
        </Way>
      </dl>
    </section>
  );
}

// The yard's address as it goes on an envelope: the street, then the suburb,
// state and postcode, so the postcode never wraps onto a line of its own.
function AddressLines({ className }) {
  const [street, ...locality] = YARD.address.split(", ");
  return (
    <address className={cn("not-italic", className)}>
      <span className="block">{street}</span>
      {locality.length > 0 && <span className="block">{locality.join(", ")}</span>}
    </address>
  );
}

function Way({ label, children }) {
  return (
    <div className="border-b border-rule py-6">
      <dt className="type-meta text-ink-muted">{label}</dt>
      <dd className="mt-3">{children}</dd>
    </div>
  );
}

function TextLink({ href, title, external = false, children }) {
  return (
    <a
      href={href}
      title={title}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="inline-flex min-h-11 items-center gap-1.5 font-bold text-ink underline hover:no-underline"
    >
      {children}
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}

// The yard hasn't supplied its hours yet (YARD.hours is null), so this says to
// call ahead. Once they're filled in, they list here as a table.
function OpeningHours() {
  return (
    <section id="hours" aria-labelledby="hours-heading" className="scroll-mt-24">
      <h2 id="hours-heading" className="type-heading text-ink">
        Opening hours
      </h2>
      {YARD.hours ? (
        <table aria-labelledby="hours-heading" className="mt-6 w-full max-w-sm border-t-2 border-ink text-left">
          <tbody>
            {YARD.hours.map(({ days, time }) => (
              <tr key={days} className="border-b border-rule">
                <th scope="row" className="py-3 pr-6 align-baseline leading-snug font-bold text-ink">
                  {days}
                </th>
                <td className="tabular py-3 text-right align-baseline leading-snug whitespace-nowrap text-ink-soft">
                  {time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-3 max-w-[30ch] type-lede text-pretty text-ink">
          Call ahead for today&apos;s opening hours.
        </p>
      )}
      <Button asChild size="lg" className="mt-8">
        <a href={YARD.phoneHref} className="tabular">
          <Phone aria-hidden="true" />
          Call us on {YARD.phone}
        </a>
      </Button>
    </section>
  );
}

// The yard's address and directions, then Google's map of it. The button
// doesn't say "Get directions" like the link under Visit the yard, so the two
// don't share link text.
function Location() {
  return (
    <section id="location" aria-labelledby="location-heading" className="scroll-mt-24">
      <h2 id="location-heading" className="type-heading text-ink">
        Find the yard
      </h2>
      <AddressLines className="mt-4 text-xl font-bold text-ink sm:text-2xl" />
      <Button asChild size="lg" variant="outline" className="mt-8">
        <a href={YARD.mapsHref} title={`Directions to ${YARD.address}`} target="_blank" rel="noopener noreferrer">
          Open in Google Maps
          <ArrowUpRight aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </Button>
      <YardMap className="mt-8 aspect-[4/3]" />
    </section>
  );
}
