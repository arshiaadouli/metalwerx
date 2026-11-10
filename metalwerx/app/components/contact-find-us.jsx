import { MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { business, formattedAddress, mapEmbedUrl, openingHours } from "@/lib/business";

// /contact-us's map and opening hours, the #location and #hours the navbar and
// footer link to. The hours only show once they're filled in lib/business.js.
export default function ContactFindUs() {
  return (
    <section
      id="location"
      aria-labelledby="location-title"
      className="scroll-mt-8 border-t border-line bg-panel font-montserrat text-ink"
    >
      <div className="mx-auto grid w-full max-w-7xl items-start gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <Reveal>
          <h2 id="location-title" className="font-bebas-neue text-5xl tracking-wide sm:text-6xl">
            Find Us
          </h2>
          <div className="mt-4 h-1 w-16 bg-cherry" />
          <address className="mt-8 flex gap-4 not-italic leading-7">
            <MapPin aria-hidden="true" strokeWidth={1.75} className="mt-1 size-6 shrink-0 text-ink-cherry" />
            <span>
              <span className="block font-semibold">{business.fullName}</span>
              <span className="block text-ink-soft">{formattedAddress}</span>
              <a
                href={business.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in Google Maps (opens in a new tab)"
                className="mt-2 inline-block font-oswald text-sm uppercase tracking-[0.15em] text-ink-cherry underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
              >
                Get directions
              </a>
            </span>
          </address>

          {openingHours.length > 0 && (
            <div id="hours" className="mt-12 scroll-mt-8">
              <h3 className="font-oswald text-sm uppercase tracking-[0.3em] text-ink-cherry">
                Opening Hours
              </h3>
              <dl className="mt-4 divide-y divide-line border-y border-line">
                {openingHours.map(({ days, times }) => (
                  <div key={days} className="flex justify-between gap-6 py-3">
                    <dt className="font-medium">{days}</dt>
                    <dd className="text-ink-soft tabular-nums">{times}</dd>
                  </div>
                ))}
              </dl>
              {business.hoursNote && (
                <p className="mt-3 text-sm text-ink-soft">{business.hoursNote}</p>
              )}
            </div>
          )}
        </Reveal>

        {/* Google's map of the address. It loads only when scrolled near. */}
        <Reveal step={1}>
          <iframe
            title={`Map of ${business.fullName}, ${formattedAddress}`}
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="block aspect-4/3 w-full rounded-2xl border border-line"
          />
        </Reveal>
      </div>
    </section>
  );
}
