// The yard's Google Maps listing and its Facebook page, for the footer's icons
// and the contact page. Every directions link on the site opens the listing
// too. The listing is its full google.com/maps address, not the listing's
// maps.app.goo.gl share link, which redirects to it (SEO audits flag links
// that redirect). Left empty, the Facebook links go nowhere and the Google
// Maps links search for the address.
const GOOGLE_MAPS_LISTING =
  "https://www.google.com/maps/place/METAL+WERX/@-38.0154151,145.2588361,17z/data=!4m6!3m5!1s0x6ad66bf3dc192045:0x1390bccb001e8c06!8m2!3d-38.0154151!4d145.2588361!16s%2Fg%2F11nxnrt636";
const FACEBOOK_PAGE = "https://www.facebook.com/werxmetal";

// The yard's contact details, in one place for the header, footer, contact
// page and every call to action. The phone and email were confirmed by the
// owner on 2026-10-20.
export const YARD = {
  name: "Metal Werx Scrap Metal Recycling",
  phone: "0470 131 025",
  phoneHref: "tel:+61470131025",
  email: "info@metalwerx.com.au",
  emailHref: "mailto:info@metalwerx.com.au",
  address: "131 Wedgewood Rd, Hallam VIC 3803",
  addressShort: "131 Wedgewood Rd, Hallam",
  mapsHref:
    GOOGLE_MAPS_LISTING || "https://www.google.com/maps/search/?api=1&query=131+Wedgewood+Rd+Hallam+VIC+3803",
  facebookHref: FACEBOOK_PAGE || "#",
  // The address in parts and the listing's pin, for search engines.
  street: "131 Wedgewood Rd",
  suburb: "Hallam",
  state: "VIC",
  postcode: "3803",
  geo: { latitude: -38.0154151, longitude: 145.2588361 },
  // Google's embeddable map of the listing, for the home and contact pages.
  // It's the address Google sends maps?q=…&output=embed to, used directly,
  // since that redirect itself refuses to load in a frame.
  mapEmbedSrc:
    "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sMETAL+WERX,+131+Wedgewood+Rd,+Hallam+VIC+3803!6i15",
  // Opening hours haven't been supplied yet. Until they are, the site says to
  // call ahead instead of showing hours. Fill this in as a list of
  // { days, time } rows, one per line of the yard's hours, and the contact
  // page and footer list them.
  hours: null,
};
