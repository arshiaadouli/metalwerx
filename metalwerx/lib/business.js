// Metal Werx's business details, shown in the footer, on /about and /contact-us,
// and in the structured data in app/components/business-json-ld.jsx. The legal
// details are from the ABN Lookup record for ABN 19 650 365 067 (extracted
// 29 Oct 2026). The name, address, phone number, website and hours are the
// ones the business gave on 29 Oct 2026. The email and suburbs served are
// still placeholders: the yard's real details still need to be added here.
// The same details are also typed into public/llms.txt and, in the CMS, the
// privacy policy, terms and home page FAQ, so a change here needs making
// there too.
export const business = {
  name: "Metal Werx",
  fullName: "Metal Werx Scrap Metal Recycling",
  legalName: "Metal Werx Pty Ltd",
  entityType: "Australian private company",
  abn: "19 650 365 067",
  acn: "650 365 067",
  // The ABN and GST registration both start on this date.
  registeredSince: "2021-05-20",
  url: "https://metalwerx.com.au",
  phone: { display: "0470 131 025", international: "+61 470 131 025" },
  email: "info@metalwerx.com.au",
  address: {
    street: "131 Wedgewood Rd",
    locality: "Hallam",
    region: "VIC",
    postcode: "3803",
    country: "AU",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Metal+Werx+Scrap+Metal+Recycling",
  // Opening hours, one entry per run of days with the same hours, in 24-hour
  // time, from the yard's Google Maps listing (29 Oct 2026). A day left out
  // reads as closed in the structured data.
  hours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:30",
    },
    { days: ["Saturday"], opens: "08:00", closes: "15:00" },
  ],
  // Shown under the hours.
  hoursNote: "Closed on Sundays.",
  // The suburbs the yard's bins, pickups and car towing cover. A placeholder
  // guess at the suburbs within about 15 km of the yard, until the business
  // gives its own list.
  areasServed: [
    "Beaconsfield",
    "Berwick",
    "Cranbourne",
    "Cranbourne North",
    "Dandenong",
    "Dandenong North",
    "Dandenong South",
    "Doveton",
    "Endeavour Hills",
    "Hallam",
    "Hampton Park",
    "Keysborough",
    "Lynbrook",
    "Lyndhurst",
    "Narre Warren",
    "Narre Warren North",
    "Narre Warren South",
    "Noble Park",
    "Rowville",
    "Springvale",
  ],

  // Still to come from the business. Each is left off the site, and out of the
  // structured data, until it's filled in here.
  // The second-hand dealer registration number from Consumer Affairs Victoria.
  dealerRegistration: null,
  // The yard's map position, from OpenStreetMap's match for the street address.
  // Swap in the position from its Google Business Profile once that exists.
  geo: { latitude: -38.01524, longitude: 145.25887 },
  // A photo of the yard itself for the structured data, in public/images, e.g.
  // "/images/yard.jpg". The site's other photos are all stock, so the
  // structured data uses the logo until there's one.
  photo: null,
};

export const abnLookupUrl = `https://abr.business.gov.au/ABN/View?abn=${business.abn.replaceAll(" ", "")}`;

// "131 Wedgewood Rd, Hallam VIC 3803"
export const formattedAddress = (({ street, locality, region, postcode }) =>
  `${street}, ${locality} ${region} ${postcode}`)(business.address);

// "+61 470 131 025" as "tel:+61470131025"
export const telHref = `tel:${business.phone.international.replaceAll(" ", "")}`;

// A map of the yard's street address, for an <iframe>. Google's keyless embed;
// swap in the embed link from the Google Business Profile once it exists. It
// searches the address rather than the name, which Maps doesn't know yet.
export const mapEmbedUrl = `https://www.google.com/maps?output=embed&q=${encodeURIComponent(formattedAddress)}`;

// "7:30 am" from "07:30"
const time = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
};

// The hours as [{ days: "Monday – Friday", times: "8:00 am – 5:30 pm" }], for
// display. A run of days reads as its first and last day.
export const openingHours = business.hours.map(({ days, opens, closes }) => ({
  days: days.length > 2 ? `${days[0]} – ${days.at(-1)}` : days.join(" & "),
  times: `${time(opens)} – ${time(closes)}`,
}));
