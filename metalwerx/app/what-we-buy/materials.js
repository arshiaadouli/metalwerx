import {
  AirVent,
  Anvil,
  BatteryFull,
  Cable,
  CarFront,
  Cog,
  CookingPot,
  Cylinder,
  Disc3,
  Engine,
  Layers,
  Recycle,
  Refrigerator,
  Shapes,
  Tractor,
  Wrench,
  Zap,
} from "lucide-react";
import { getWhatWeBuyContent } from "@/lib/cms";

// The materials for /what-we-buy and each material's page, /what-we-buy/<slug>.
// They're written in the CMS (see lib/cms.js), which names each icon; here the
// names become lucide icons.
//
// Each material:
//   slug       its page, /what-we-buy/<slug>
//   anchor     its card's id on /what-we-buy, where links from before the pages
//              existed still land
//   title      the short name, for menus, cards and the breadcrumb
//   heading    the page's h1
//   icon       in the pill above the h1
//   summary    one line, for the cards linking to it
//   seo        { title, description }
//   lede       under the h1
//   image      the header photo, also on the cards: { src, alt, title }
//   overview   { heading, paragraphs, gradesTitle?, grades: [{ title, text }] };
//              gradesTitle defaults to "Grades We Buy"
//   steps      { intro, items: [{ title, text }] }; the page's selling steps
//              unless the material has its own
//   details    { heading, intro, images: [main, inset?], lists: [{ title, kind, items }] };
//              kind "no" marks a list of things to leave out
//   faq        { intro, questions: [{ question, answer }] }
//   related    the slugs of the materials to suggest next
//   cta        the band at the foot: { heading, text, buttonText, buttonHref, image },
//              image being the photo behind it (see bandPhotos)
//
// The grades, what we take and what has to stay out are how scrap yards
// typically grade and accept metal. The yard should confirm they match how it
// actually works (the HMS thicknesses, what counts as alloy extrusion or alloy
// mix, and the white engine and black compressor trade names especially), as
// with the service pages. The payment and ID answers follow Victoria's scrap
// metal laws (the Second-Hand Dealers and Pawnbrokers Act 1989), as the home
// page FAQ does: see consumer.vic.gov.au/scrapmetal.

const icons = {
  "air-vent": AirVent,
  anvil: Anvil,
  "battery-full": BatteryFull,
  cable: Cable,
  "car-front": CarFront,
  cog: Cog,
  "cooking-pot": CookingPot,
  cylinder: Cylinder,
  "disc-3": Disc3,
  engine: Engine,
  layers: Layers,
  recycle: Recycle,
  refrigerator: Refrigerator,
  shapes: Shapes,
  tractor: Tractor,
  wrench: Wrench,
  zap: Zap,
};
const icon = (name) => icons[name] ?? Recycle;

// The photo behind each page's closing band, from public/images: a different
// one on each page, the service pages included, and none that's already shown
// higher up it (in the header, the details or the related cards). Where no
// photo of the material is left, it's the yard the band asks you to bring it
// to. The CMS doesn't hold these, so a material added there gets the default.
const unsplash = (id) => `/images/unsplash/${id}.jpg`;
const pexels = (id) => `/images/pexels/${id}.jpg`;
const bandPhotos = {
  copper: unsplash("photo-1536094627107-abf98dedaa8f"), // cutting up scrap with a torch
  brass: unsplash("photo-1764114440880-9bdbfe570a4d"), // offcuts and swarf
  "alloy-extrusion": unsplash("photo-1758609554573-81474880be44"), // a bin of aluminium signs
  "alloy-mix": pexels("10628555"), // a mound of mixed scrap
  "aluminium-wheels": unsplash("photo-1719242513425-f5eed99b282f"), // old cars in a junkyard
  "stainless-steel": unsplash("photo-1598302936625-6075fbd98dd7"), // grinding steel
  "hms-steel": pexels("33842119"), // a rusty roll-off bin
  "electric-motors": unsplash("photo-1767340078189-4258fbb7bd7c"), // old engines
  "black-compressors": pexels("36397858"), // a crane's grab loading scrap
  "ac-units": unsplash("photo-1722695694560-f452b0919d3a"), // excavator sorting scrap
  "white-engines": unsplash("photo-1723365316514-8509dea457f2"), // motorbike parts
};
const pageBandPhoto = unsplash("photo-1575704497240-17622d90265f"); // old tractor, for /what-we-buy
const defaultBandPhoto = unsplash("photo-1722695694560-f452b0919d3a"); // excavator sorting scrap

export async function getMaterials() {
  const { materials } = await getWhatWeBuyContent();
  return materials.map((material) => ({
    ...material,
    icon: icon(material.icon),
    cta: { ...material.cta, image: bandPhotos[material.slug] ?? defaultBandPhoto },
  }));
}

export async function getMaterial(slug) {
  const materials = await getMaterials();
  return materials.find((material) => material.slug === slug) ?? null;
}

// The /what-we-buy page: { seo, hero, priceFactors, groups, sellingSteps, cta }.
// priceFactors is { heading?, intro, items: [{ title, text }] }. Each group is
// { id, title, intro, slugs }; the ids are where the footer's Ferrous and
// Non-Ferrous links land.
export async function getWhatWeBuyPage() {
  const { page } = await getWhatWeBuyContent();
  return { ...page, cta: { ...page.cta, image: pageBandPhoto } };
}
