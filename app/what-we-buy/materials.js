import {
  BatteryFull,
  Cable,
  CarFront,
  Cog,
  CookingPot,
  Cylinder,
  Disc3,
  Layers,
  Recycle,
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
//   image      the header photo, also on the cards: { url, alt, title }
//   overview   { heading, paragraphs, gradesTitle?, grades: [{ title, text }] };
//              gradesTitle defaults to "Grades We Buy"
//   steps      { intro, items: [{ title, text }] }; the page's selling steps
//              unless the material has its own
//   details    { heading, intro, images: [main, inset?], lists: [{ title, kind, items }] };
//              kind "no" marks a list of things to leave out
//   faq        { intro, questions: [{ question, answer }] }
//   related    the slugs of the materials to suggest next
//   cta        the band at the foot: { heading, text, cta: { text, href } }
//
// The grades, what we take and what has to stay out are how scrap yards
// typically grade and accept metal. The yard should confirm they match how it
// actually works (tyres, household batteries and lead-acid batteries that are
// cracked especially), as with the service pages. The payment and ID answers
// follow Victoria's Scrap Metal Dealers Act 2016, as the home page FAQ does.

const icons = {
  "battery-full": BatteryFull,
  cable: Cable,
  "car-front": CarFront,
  cog: Cog,
  "cooking-pot": CookingPot,
  cylinder: Cylinder,
  "disc-3": Disc3,
  layers: Layers,
  recycle: Recycle,
  tractor: Tractor,
  wrench: Wrench,
  zap: Zap,
};
const icon = (name) => icons[name] ?? Recycle;

export async function getMaterials() {
  const { materials } = await getWhatWeBuyContent();
  return materials.map((material) => ({ ...material, icon: icon(material.icon) }));
}

export async function getMaterial(slug) {
  const materials = await getMaterials();
  return materials.find((material) => material.slug === slug) ?? null;
}

// The /what-we-buy page: { seo, hero, groups, sellingSteps, cta }. Each group
// is { id, title, intro, slugs }; the ids are where the footer's Ferrous and
// Non-Ferrous links land.
export async function getWhatWeBuyPage() {
  const { page } = await getWhatWeBuyContent();
  return page;
}
