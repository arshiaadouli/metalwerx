import { local } from "./local.js";

// The suburbs the yard covers: the list on /areas, each suburb's page at
// /areas/<slug>, the "Areas We Cover" band (app/components/areas-served.jsx),
// the sitemap and the structured data's areaServed. On 11 Nov 2026 the
// business gave Hallam, Bayswater, Boronia, Lilydale, Dandenong South and
// Pakenham, and "all of the south-east Melbourne suburbs". Here that's every
// suburb of the Casey, Greater Dandenong, Monash, Kingston, Frankston and Knox
// council areas (bar Burwood, which is mostly Whitehorse's, and Moorabbin
// Airport), Cardinia's Beaconsfield, Officer, Officer South and Pakenham, and
// Lilydale. Adding or removing a row adds or removes the suburb everywhere.
//
// Google's spam policies count many near-identical pages for nearby places as
// doorway pages, so a suburb only gets a page of its own with copy of its own
// in ./local.js: the six the business named and the four the SEO audit named
// (Dandenong, Narre Warren, Berwick and Cranbourne). The rest are listed on
// /areas without one.
//
// Each suburb:
//   name, postcode
//   council   who gives the permit for a bin on the street
//   km        the drive to the yard from the middle of the suburb
//   minutes   that drive outside peak hour, rounded up to five minutes
//   via       the roads that carry most of it, to finish "mostly on ..."
//   lat, lng  the middle of the suburb, to find the suburbs near it
//
// The drives were routed on OpenStreetMap (with OSRM) on 11 Nov 2026, and the
// councils are the ones on each suburb's Wikipedia page. For a new row,
// Google Maps' directions to the yard give the km, minutes and roads.
const rows = [
  { name: "Ashwood", postcode: "3147", council: "Monash City Council", km: 24, minutes: 25, via: "Huntingdale Road and the Monash Freeway", lat: -37.8667, lng: 145.1022 },
  { name: "Aspendale", postcode: "3195", council: "Kingston City Council", km: 20, minutes: 25, via: "Springvale Road, Hutton Road and the Dandenong Bypass", lat: -38.0219, lng: 145.1024 },
  { name: "Aspendale Gardens", postcode: "3195", council: "Kingston City Council", km: 17, minutes: 20, via: "Springvale Road, Hutton Road and the Dandenong Bypass", lat: -38.0221, lng: 145.1198 },
  { name: "Bangholme", postcode: "3175", council: "Greater Dandenong City Council", km: 14, minutes: 15, via: "the Dandenong Bypass and the Princes Highway", lat: -38.0453, lng: 145.1702 },
  { name: "Bayswater", postcode: "3153", council: "Knox City Council", km: 26, minutes: 25, via: "the Mountain Highway, EastLink (a toll road) and the Monash Freeway", lat: -37.8454, lng: 145.2648 },
  { name: "Beaconsfield", postcode: "3807", council: "Cardinia Shire Council or Casey City Council, depending on the street", km: 14, minutes: 20, via: "the Princes Highway", lat: -38.0403, lng: 145.3831 },
  { name: "Berwick", postcode: "3806", council: "Casey City Council", km: 11, minutes: 15, via: "the Princes Highway", lat: -38.0404, lng: 145.3481 },
  { name: "Blind Bight", postcode: "3980", council: "Casey City Council", km: 27, minutes: 30, via: "the South Gippsland Highway and Hallam Road", lat: -38.2142, lng: 145.3378 },
  { name: "Bonbeach", postcode: "3196", council: "Kingston City Council", km: 23, minutes: 25, via: "Thompsons Road, the Western Port Highway and the South Gippsland Freeway", lat: -38.0631, lng: 145.1276 },
  { name: "Boronia", postcode: "3155", council: "Knox City Council", km: 23, minutes: 25, via: "Ferntree Gully Road, Stud Road and the Monash Freeway", lat: -37.8563, lng: 145.286 },
  { name: "Botanic Ridge", postcode: "3977", council: "Casey City Council", km: 20, minutes: 20, via: "Ballarto Road, the Western Port Highway and the South Gippsland Freeway", lat: -38.1414, lng: 145.2566 },
  { name: "Braeside", postcode: "3195", council: "Kingston City Council", km: 15, minutes: 20, via: "Lower Dandenong Road, Cheltenham Road and the Dandenong Bypass", lat: -37.9889, lng: 145.1177 },
  { name: "Cannons Creek", postcode: "3977", council: "Casey City Council", km: 25, minutes: 30, via: "Fisheries Road, the South Gippsland Highway and Hallam Road", lat: -38.2115, lng: 145.3113 },
  { name: "Carrum", postcode: "3197", council: "Kingston City Council", km: 21, minutes: 20, via: "Thompsons Road, the Western Port Highway and the South Gippsland Freeway", lat: -38.0767, lng: 145.128 },
  { name: "Carrum Downs", postcode: "3201", council: "Frankston City Council", km: 18, minutes: 20, via: "Hall Road, the Western Port Highway and the South Gippsland Freeway", lat: -38.1003, lng: 145.1789 },
  { name: "Chadstone", postcode: "3148", council: "Monash City Council", km: 23, minutes: 20, via: "the Monash Freeway", lat: -37.8823, lng: 145.1001 },
  { name: "Chelsea", postcode: "3196", council: "Kingston City Council", km: 19, minutes: 25, via: "Springvale Road, Hutton Road and the Dandenong Bypass", lat: -38.0497, lng: 145.1214 },
  { name: "Chelsea Heights", postcode: "3196", council: "Kingston City Council", km: 17, minutes: 20, via: "Springvale Road, Hutton Road and the Dandenong Bypass", lat: -38.0395, lng: 145.1328 },
  { name: "Cheltenham", postcode: "3192", council: "Kingston City Council or Bayside City Council, depending on the street", km: 22, minutes: 25, via: "the Nepean Highway, Lower Dandenong Road and the Dandenong Bypass", lat: -37.9634, lng: 145.0616 },
  { name: "Clarinda", postcode: "3169", council: "Kingston City Council", km: 20, minutes: 25, via: "the Dingley Bypass and the Dandenong Bypass", lat: -37.9431, lng: 145.106 },
  { name: "Clayton", postcode: "3168", council: "Monash City Council", km: 20, minutes: 20, via: "Wellington Road and the Monash Freeway", lat: -37.9158, lng: 145.1314 },
  { name: "Clayton South", postcode: "3169", council: "Kingston City Council", km: 21, minutes: 20, via: "Centre Road, Springvale Road and the Monash Freeway", lat: -37.932, lng: 145.1245 },
  { name: "Clyde", postcode: "3978", council: "Casey City Council", km: 20, minutes: 25, via: "Berwick-Cranbourne Road, Clyde Road and the Princes Highway", lat: -38.1326, lng: 145.3381 },
  { name: "Clyde North", postcode: "3978", council: "Casey City Council", km: 18, minutes: 20, via: "Bells Road, the Princes Freeway and the Princes Highway", lat: -38.0949, lng: 145.3628 },
  { name: "Cranbourne", postcode: "3977", council: "Casey City Council", km: 12, minutes: 15, via: "the South Gippsland Highway and Hallam Road", lat: -38.1087, lng: 145.2834 },
  { name: "Cranbourne East", postcode: "3977", council: "Casey City Council", km: 14, minutes: 20, via: "Narre Warren-Cranbourne Road, Pound Road and Hallam Road", lat: -38.1081, lng: 145.3056 },
  { name: "Cranbourne North", postcode: "3977", council: "Casey City Council", km: 10, minutes: 15, via: "Narre Warren-Cranbourne Road, Pound Road and Hallam Road", lat: -38.0775, lng: 145.2989 },
  { name: "Cranbourne South", postcode: "3977", council: "Casey City Council", km: 22, minutes: 20, via: "Browns Road, the Western Port Highway and the South Gippsland Freeway", lat: -38.1578, lng: 145.2624 },
  { name: "Cranbourne West", postcode: "3977", council: "Casey City Council", km: 12, minutes: 15, via: "Evans Road and Hallam Road", lat: -38.1022, lng: 145.2517 },
  { name: "Dandenong", postcode: "3175", council: "Greater Dandenong City Council", km: 6, minutes: 10, via: "Lonsdale Street and the Princes Highway", lat: -37.9875, lng: 145.2148 },
  { name: "Dandenong North", postcode: "3175", council: "Greater Dandenong City Council", km: 9, minutes: 10, via: "the Monash Freeway", lat: -37.9558, lng: 145.2143 },
  { name: "Dandenong South", postcode: "3175", council: "Greater Dandenong City Council", km: 8, minutes: 10, via: "Pound Road West and the South Gippsland Freeway", lat: -38.028, lng: 145.2209 },
  { name: "Devon Meadows", postcode: "3977", council: "Casey City Council", km: 19, minutes: 25, via: "the South Gippsland Highway and Hallam Road", lat: -38.162, lng: 145.3025 },
  { name: "Dingley Village", postcode: "3172", council: "Kingston City Council", km: 16, minutes: 20, via: "Centre Dandenong Road, Cheltenham Road and the Dandenong Bypass", lat: -37.9756, lng: 145.1256 },
  { name: "Doveton", postcode: "3177", council: "Casey City Council", km: 5, minutes: 10, via: "Power Road and the Princes Highway", lat: -37.9888, lng: 145.2386 },
  { name: "Edithvale", postcode: "3196", council: "Kingston City Council", km: 17, minutes: 20, via: "Springvale Road, Hutton Road and the Dandenong Bypass", lat: -38.0376, lng: 145.1149 },
  { name: "Endeavour Hills", postcode: "3802", council: "Casey City Council", km: 8, minutes: 10, via: "Heatherton Road and the Monash Freeway", lat: -37.9703, lng: 145.2563 },
  { name: "Eumemmerring", postcode: "3177", council: "Casey City Council", km: 3, minutes: 5, via: "the Princes Highway", lat: -37.9985, lng: 145.2469 },
  { name: "Ferntree Gully", postcode: "3156", council: "Knox City Council", km: 19, minutes: 20, via: "Ferntree Gully Road, Stud Road and the Monash Freeway", lat: -37.8841, lng: 145.2817 },
  { name: "Frankston", postcode: "3199", council: "Frankston City Council", km: 26, minutes: 25, via: "EastLink (a toll road), Thompsons Road and the Western Port Highway", lat: -38.1457, lng: 145.1264 },
  { name: "Frankston North", postcode: "3200", council: "Frankston City Council", km: 21, minutes: 25, via: "Frankston-Dandenong Road, Thompsons Road and the Western Port Highway", lat: -38.1229, lng: 145.161 },
  { name: "Frankston South", postcode: "3199", council: "Frankston City Council", km: 30, minutes: 30, via: "the Frankston Freeway, EastLink (a toll road) and Thompsons Road", lat: -38.1765, lng: 145.1296 },
  { name: "Glen Waverley", postcode: "3150", council: "Monash City Council", km: 19, minutes: 20, via: "Springvale Road and the Monash Freeway", lat: -37.8816, lng: 145.1682 },
  { name: "Hallam", postcode: "3803", council: "Casey City Council", km: 3, minutes: 5, via: "the Princes Highway and Hallam South Road", lat: -38.0075, lng: 145.2689 },
  { name: "Hampton Park", postcode: "3976", council: "Casey City Council", km: 5, minutes: 10, via: "Hallam Road", lat: -38.0367, lng: 145.259 },
  { name: "Harkaway", postcode: "3806", council: "Casey City Council", km: 11, minutes: 15, via: "Ernst Wanke Road and Belgrave-Hallam Road", lat: -38.0003, lng: 145.3417 },
  { name: "Heatherton", postcode: "3202", council: "Kingston City Council", km: 19, minutes: 20, via: "the Dingley Bypass and the Dandenong Bypass", lat: -37.9561, lng: 145.0932 },
  { name: "Highett", postcode: "3190", council: "Kingston City Council or Bayside City Council, depending on the street", km: 24, minutes: 30, via: "the Nepean Highway, Lower Dandenong Road and the Dandenong Bypass", lat: -37.9504, lng: 145.0398 },
  { name: "Hughesdale", postcode: "3166", council: "Monash City Council", km: 26, minutes: 25, via: "Warrigal Road and the Monash Freeway", lat: -37.8995, lng: 145.0812 },
  { name: "Huntingdale", postcode: "3166", council: "Monash City Council", km: 21, minutes: 20, via: "North Road, Wellington Road and the Monash Freeway", lat: -37.9077, lng: 145.1085 },
  { name: "Junction Village", postcode: "3977", council: "Casey City Council", km: 16, minutes: 20, via: "the South Gippsland Highway and Hallam Road", lat: -38.1363, lng: 145.2969 },
  { name: "Keysborough", postcode: "3173", council: "Greater Dandenong City Council", km: 11, minutes: 15, via: "the Dandenong Bypass and the Princes Highway", lat: -38.0054, lng: 145.1674 },
  { name: "Knoxfield", postcode: "3180", council: "Knox City Council", km: 17, minutes: 20, via: "Stud Road and the Monash Freeway", lat: -37.8898, lng: 145.2496 },
  { name: "Langwarrin", postcode: "3910", council: "Frankston City Council", km: 21, minutes: 20, via: "Cranbourne-Frankston Road, the Western Port Highway and the South Gippsland Freeway", lat: -38.1546, lng: 145.1974 },
  { name: "Langwarrin South", postcode: "3911", council: "Frankston City Council", km: 29, minutes: 30, via: "Baxter-Tooradin Road, the Western Port Highway and the South Gippsland Freeway", lat: -38.1891, lng: 145.1911 },
  { name: "Lilydale", postcode: "3140", council: "Yarra Ranges Council", km: 40, minutes: 40, via: "the Maroondah Highway, EastLink (a toll road) and the Monash Freeway", lat: -37.7577, lng: 145.3524 },
  { name: "Lynbrook", postcode: "3975", council: "Casey City Council", km: 7, minutes: 10, via: "Hallam Road", lat: -38.0559, lng: 145.2561 },
  { name: "Lyndhurst", postcode: "3975", council: "Casey City Council or Greater Dandenong City Council, depending on the street", km: 10, minutes: 15, via: "the Western Port Highway and the South Gippsland Freeway", lat: -38.0705, lng: 145.2425 },
  { name: "Lysterfield", postcode: "3156", council: "Knox City Council or Yarra Ranges Council, depending on the street", km: 18, minutes: 20, via: "Wellington Road, Stud Road and the Monash Freeway", lat: -37.9349, lng: 145.3018 },
  { name: "Lysterfield South", postcode: "3156", council: "Casey City Council", km: 11, minutes: 15, via: "Power Road and the Monash Freeway", lat: -37.9525, lng: 145.2669 },
  { name: "Mentone", postcode: "3194", council: "Kingston City Council", km: 20, minutes: 25, via: "Lower Dandenong Road, Cheltenham Road and the Dandenong Bypass", lat: -37.9814, lng: 145.069 },
  { name: "Moorabbin", postcode: "3189", council: "Kingston City Council", km: 24, minutes: 25, via: "the Dingley Bypass and the Dandenong Bypass", lat: -37.9415, lng: 145.0578 },
  { name: "Mordialloc", postcode: "3195", council: "Kingston City Council", km: 18, minutes: 20, via: "Governor Road, Hutton Road and the Dandenong Bypass", lat: -37.9994, lng: 145.0961 },
  { name: "Mount Waverley", postcode: "3149", council: "Monash City Council", km: 21, minutes: 20, via: "the Monash Freeway", lat: -37.8784, lng: 145.1285 },
  { name: "Mulgrave", postcode: "3170", council: "Monash City Council", km: 17, minutes: 20, via: "Wellington Road and the Monash Freeway", lat: -37.9262, lng: 145.1723 },
  { name: "Narre Warren", postcode: "3805", council: "Casey City Council", km: 6, minutes: 10, via: "the Princes Highway", lat: -38.018, lng: 145.3058 },
  { name: "Narre Warren North", postcode: "3804", council: "Casey City Council", km: 9, minutes: 10, via: "Heatherton Road, Hallam North Road and Belgrave-Hallam Road", lat: -37.9813, lng: 145.3129 },
  { name: "Narre Warren South", postcode: "3805", council: "Casey City Council", km: 7, minutes: 10, via: "Pound Road and Hallam Road", lat: -38.0544, lng: 145.3029 },
  { name: "Noble Park", postcode: "3174", council: "Greater Dandenong City Council", km: 10, minutes: 15, via: "Railway Parade and the Princes Highway", lat: -37.9695, lng: 145.1767 },
  { name: "Noble Park North", postcode: "3174", council: "Greater Dandenong City Council", km: 12, minutes: 15, via: "Brady Road and the Monash Freeway", lat: -37.9513, lng: 145.1908 },
  { name: "Notting Hill", postcode: "3168", council: "Monash City Council", km: 18, minutes: 20, via: "Ferntree Gully Road and the Monash Freeway", lat: -37.9056, lng: 145.1456 },
  { name: "Oakleigh", postcode: "3166", council: "Monash City Council", km: 22, minutes: 25, via: "the Princes Highway, Wellington Road and the Monash Freeway", lat: -37.9007, lng: 145.0957 },
  { name: "Oakleigh East", postcode: "3166", council: "Monash City Council", km: 21, minutes: 20, via: "the Princes Highway, Wellington Road and the Monash Freeway", lat: -37.8996, lng: 145.1057 },
  { name: "Oakleigh South", postcode: "3167", council: "Monash City Council or Kingston City Council, depending on the street", km: 23, minutes: 25, via: "Centre Road and the Monash Freeway", lat: -37.9248, lng: 145.0922 },
  { name: "Officer", postcode: "3809", council: "Cardinia Shire Council", km: 17, minutes: 20, via: "the Princes Freeway and the Princes Highway", lat: -38.0602, lng: 145.4099 },
  { name: "Officer South", postcode: "3809", council: "Cardinia Shire Council", km: 22, minutes: 25, via: "Cardinia Road, the Princes Freeway and the Princes Highway", lat: -38.0978, lng: 145.4218 },
  { name: "Pakenham", postcode: "3810", council: "Cardinia Shire Council", km: 26, minutes: 25, via: "the Princes Freeway and the Princes Highway", lat: -38.0792, lng: 145.4833 },
  { name: "Parkdale", postcode: "3195", council: "Kingston City Council", km: 20, minutes: 25, via: "Governor Road, Hutton Road and the Dandenong Bypass", lat: -37.9919, lng: 145.0813 },
  { name: "Patterson Lakes", postcode: "3197", council: "Kingston City Council", km: 19, minutes: 20, via: "Thompsons Road, the Western Port Highway and the South Gippsland Freeway", lat: -38.0694, lng: 145.1432 },
  { name: "Pearcedale", postcode: "3912", council: "Casey City Council or Mornington Peninsula Shire Council, depending on the street", km: 27, minutes: 25, via: "the Western Port Highway and the South Gippsland Freeway", lat: -38.2016, lng: 145.2422 },
  { name: "Rowville", postcode: "3178", council: "Knox City Council", km: 13, minutes: 15, via: "Stud Road and the Monash Freeway", lat: -37.9239, lng: 145.2448 },
  { name: "Sandhurst", postcode: "3977", council: "Frankston City Council", km: 15, minutes: 15, via: "Thompsons Road, the Western Port Highway and the South Gippsland Freeway", lat: -38.0844, lng: 145.2012 },
  { name: "Scoresby", postcode: "3179", council: "Knox City Council", km: 15, minutes: 15, via: "EastLink (a toll road) and the Monash Freeway", lat: -37.9026, lng: 145.2183 },
  { name: "Seaford", postcode: "3198", council: "Frankston City Council", km: 24, minutes: 25, via: "EastLink (a toll road), Thompsons Road and the Western Port Highway", lat: -38.1048, lng: 145.1384 },
  { name: "Skye", postcode: "3977", council: "Frankston City Council", km: 15, minutes: 15, via: "Hall Road, the Western Port Highway and the South Gippsland Freeway", lat: -38.1051, lng: 145.2162 },
  { name: "Springvale", postcode: "3171", council: "Greater Dandenong City Council", km: 15, minutes: 20, via: "Heatherton Road and the Monash Freeway", lat: -37.9456, lng: 145.158 },
  { name: "Springvale South", postcode: "3172", council: "Greater Dandenong City Council", km: 14, minutes: 15, via: "the Dandenong Bypass and the Princes Highway", lat: -37.9709, lng: 145.1479 },
  { name: "The Basin", postcode: "3154", council: "Knox City Council", km: 25, minutes: 30, via: "Ferntree Gully Road, Stud Road and the Monash Freeway", lat: -37.8557, lng: 145.3214 },
  { name: "Tooradin", postcode: "3980", council: "Casey City Council or Cardinia Shire Council, depending on the street", km: 27, minutes: 30, via: "the South Gippsland Highway and Hallam Road", lat: -38.2138, lng: 145.3817 },
  { name: "Upper Ferntree Gully", postcode: "3156", council: "Knox City Council or Yarra Ranges Council, depending on the street", km: 23, minutes: 25, via: "the Burwood Highway, Ferntree Gully Road and Stud Road", lat: -37.8967, lng: 145.3099 },
  { name: "Wantirna", postcode: "3152", council: "Knox City Council", km: 22, minutes: 20, via: "EastLink (a toll road) and the Monash Freeway", lat: -37.8523, lng: 145.226 },
  { name: "Wantirna South", postcode: "3152", council: "Knox City Council", km: 19, minutes: 20, via: "EastLink (a toll road) and the Monash Freeway", lat: -37.8738, lng: 145.2217 },
  { name: "Warneet", postcode: "3980", council: "Casey City Council", km: 29, minutes: 30, via: "Warneet Road, the South Gippsland Highway and Hallam Road", lat: -38.2214, lng: 145.3117 },
  { name: "Waterways", postcode: "3195", council: "Kingston City Council", km: 15, minutes: 20, via: "Hutton Road and the Dandenong Bypass", lat: -38.0148, lng: 145.1305 },
  { name: "Wheelers Hill", postcode: "3150", council: "Monash City Council", km: 16, minutes: 20, via: "Wellington Road and the Monash Freeway", lat: -37.9103, lng: 145.1895 },
];

// slug is the suburb's page: "dandenong-south" for /areas/dandenong-south.
// local is that page's own paragraphs, and only a suburb with them has a page.
export const suburbs = rows.map((row) => {
  const slug = row.name.toLowerCase().replaceAll(" ", "-");
  return { ...row, slug, local: local[slug] };
});

export const getSuburb = (slug) => suburbs.find((suburb) => suburb.slug === slug) ?? null;

// Kilometres between the middles of two suburbs.
// shortcut: treats the map as flat, fine within one city; use the haversine
// formula if the list ever reaches past Melbourne.
const apart = (a, b) => Math.hypot((a.lat - b.lat) * 111, (a.lng - b.lng) * 88);

// The n suburbs closest to one, nearest first.
export function nearby(suburb, n) {
  return suburbs
    .filter((other) => other !== suburb)
    .toSorted((a, b) => apart(suburb, a) - apart(suburb, b))
    .slice(0, n);
}

// The header photo of /areas and the suburb pages, and the photo behind their
// closing band, from public/images (see lib/photo.js).
export const heroPhoto = {
  src: "/images/unsplash/photo-1723709525972-e5b1af84a839.jpg",
  alt: "A hook-lift truck with its crane raised beside a row of green roll-off bins outside a recycling shed",
  title: "Hook-lift truck and bins",
};
export const bandPhoto = "/images/unsplash/photo-1756753142721-6017ff7b7e11.jpg"; // grapple truck
