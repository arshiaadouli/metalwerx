import { abnLookupUrl, business, formattedAddress } from "@/lib/business";

// The About page's legal details: who runs the yard, its ABN and ACN, its GST
// registration and, once it's filled in, its second-hand dealer registration
// with Consumer Affairs Victoria, all from lib/business.js.
// The date is parsed as midnight UTC, so it's formatted in UTC to keep the day.
const since = new Date(business.registeredSince);
const formatSince = (options) =>
  new Intl.DateTimeFormat("en-AU", { ...options, timeZone: "UTC" }).format(since);
// "20 May 2021" and "May 2021"
const registered = formatSince({ day: "numeric", month: "long", year: "numeric" });
const registeredMonth = formatSince({ month: "long", year: "numeric" });

const details = [
  { term: "Trading as", value: business.name },
  { term: "Legal name", value: business.legalName },
  {
    term: "ABN",
    value: (
      <a
        href={abnLookupUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="View on ABN Lookup (opens in a new tab)"
        className="underline transition-colors hover:text-ink-cherry"
      >
        {business.abn}
      </a>
    ),
  },
  { term: "ACN", value: business.acn },
  { term: "Entity type", value: business.entityType },
  { term: "GST", value: `Registered since ${registered}` },
  ...(business.dealerRegistration
    ? [{ term: "Dealer registration", value: business.dealerRegistration }]
    : []),
  { term: "Yard", value: formattedAddress },
];

export default function AboutBusinessDetails() {
  return (
    <section
      aria-labelledby="business-details"
      className="bg-panel px-6 pb-16 font-montserrat sm:pb-24"
    >
      <div className="mx-auto max-w-6xl rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2
          id="business-details"
          className="mb-4 font-bebas-neue text-3xl tracking-wide text-ink sm:text-4xl"
        >
          Business details
        </h2>
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-ink-soft sm:text-base">
          {business.name} is run by {business.legalName}, an {business.entityType}{" "}
          that has held an ABN and been registered for GST since{" "}
          {registeredMonth}.
        </p>
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {details.map(({ term, value }) => (
            <div key={term}>
              <dt className="mb-1 font-oswald text-xs uppercase tracking-[0.15em] text-ink-muted">
                {term}
              </dt>
              <dd className="font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
