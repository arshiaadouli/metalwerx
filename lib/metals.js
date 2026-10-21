import { getMaterial, groups } from "@/app/what-we-buy/materials";

// How the site sorts what the yard buys by metal: each material's code (its
// chemical symbol, or SS for stainless steel), and the six bays of the home
// page rack. The copy itself stays in app/what-we-buy/materials.js; this only
// says which metal each thing is made of.

export const METAL_CODES = {
  copper: "Cu",
  brass: "CuZn",
  aluminium: "Al",
  "aluminium-wheels": "Al",
  "stainless-steel": "SS",
  lead: "Pb",
  "pvc-wire": "Cu",
  "electric-motors": "Cu Fe",
  "unwanted-cars": "Fe",
  "scrap-car-parts": "Fe",
  "scrap-machinery": "Fe",
};

export function metalCode(slug) {
  return METAL_CODES[slug] ?? "Fe";
}

// The home page rack, one bay per metal. A bay with a slug opens that
// material's grades; the steel bay lists the ferrous group instead. `also`
// names the materials made mostly of the bay's metal.
const BAYS = [
  { id: "copper", code: "Cu", slug: "copper", bundle: "copper", also: ["pvc-wire", "electric-motors"] },
  { id: "brass", code: "CuZn", slug: "brass", bundle: "brass" },
  { id: "aluminium", code: "Al", slug: "aluminium", bundle: "aluminium", also: ["aluminium-wheels"] },
  { id: "stainless", code: "SS", slug: "stainless-steel", bundle: "stainless-steel" },
  { id: "lead", code: "Pb", slug: "lead", bundle: "lead" },
  { id: "steel", code: "Fe", group: "ferrous", bundle: "steel" },
];

// The bays with everything the rack's grade tag shows, read from the materials.
// Plain data, so a Server Component can hand it to the client-side rack.
export function getRackBays() {
  return BAYS.map((bay) => {
    if (bay.group) {
      const group = groups.find((g) => g.id === bay.group);
      return {
        id: bay.id,
        code: bay.code,
        bundle: bay.bundle,
        name: "Steel, cars and machinery",
        summary: group.intro,
        listTitle: "We buy",
        list: group.slugs.map((slug) => {
          const { title, summary } = getMaterial(slug);
          return { title, text: summary, href: `/what-we-buy/${slug}` };
        }),
        href: `/what-we-buy#${group.id}`,
        linkText: "See steel, cars and machinery",
        also: [],
      };
    }
    const material = getMaterial(bay.slug);
    return {
      id: bay.id,
      code: bay.code,
      bundle: bay.bundle,
      name: material.title,
      summary: material.summary,
      listTitle: material.overview.gradesTitle ?? "Grades we buy",
      list: material.overview.grades.map(({ title, text }) => ({ title, text })),
      href: `/what-we-buy/${material.slug}`,
      linkText: `See ${material.title.toLowerCase()} grades`,
      also: (bay.also ?? []).map((slug) => {
        const { title } = getMaterial(slug);
        return { title, href: `/what-we-buy/${slug}` };
      }),
    };
  });
}
