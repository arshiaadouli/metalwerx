---
version: 1
slug: "app-page-jsx"
primary_target: "app/page.jsx"
related_targets: ["app/layout.jsx","app/about/page.jsx","app/contact-us/page.jsx","app/services/page.jsx","app/what-we-buy/page.jsx","app/blogs/page.jsx","app/blogs/[slug]/page.jsx","app/privacy-policy/page.jsx","app/not-found.jsx"]
---

# Metal Werx site (all pages)

## Scope and visitor mode

A redesign of every page in one new visual world, keeping all content, URLs, anchors, Strapi data shapes and features (including the light/dark toggle). Modes per surface: home, About, What We Buy (index and material pages) and Services (index and service pages) are Persuade; Contact is Operate; the blog index, blog posts and Privacy Policy are Read; the not-found and blog error pages are Operate.

## Audience, job and constraints

Locals with a load (homeowners, tradies, farmers) checking that the yard takes their metal, how it is graded and paid, then calling or driving to Hallam. User anti-goals: never too busy, never grungy. No new claims: free car removal and independence stay unclaimed in new copy; existing copy is not rewritten. Hours are not supplied, so no hours appear until the yard provides them.

## Chosen direction and memorable moment

Metal Grade Colour Codes: the stockist's rack. The memorable moment is the home page rack of metal cross-sections racking in once, with the copper bundle's grade tag standing out of it.

## Unresolved decisions

- Opening hours (supplied later by the yard).
- Whether the existing free-towing copy stays (the yard to confirm).
- `/prices` and `/terms` remain unbuilt.

- The scroll-driven 3D yard tour built in another session (`app/components/scrap-journey/`) stays on the home page, moved below the rack as the "how selling works" section and restyled into this world (user decision, 2026-10-20). Its copy adds claims PRODUCT.md hasn't confirmed (verified scales, a weighbridge, an indicative price per kilo); they are flagged for the yard, not repeated elsewhere.

## Direction contract

THESIS: Every metal the yard buys has its own code colour, cut end-on and named like a stockist's rack, so a local finds their metal, its grades and how they're paid at a glance. It refuses the category default: a dark excavator photo under condensed caps and a red accent.

OWN-WORLD: Graded between black and red, as the user pinned it after the contact page's glow: warm black grounds (dark by default) with a red glow from above, red-black rack fields lit the same way, and a deep red for the one action. Metal code colours (copper, brass, aluminium, stainless, lead, steel) appear only on cross-sections, grade tags and material headers. Archivo in three widths. Components: SVG bar-end cross-sections (pipe, round, hex, extrusion, I-beam, angle), punched grade tags carrying chemical codes, square-cornered flat plates, and hairline rack rails that each separate something real.

STORY: The visitor sees the yard takes their metal, learns it is graded and weighed, paid by bank transfer with photo ID, then calls or drives to Hallam; bins, pickups and commercial accounts follow for bigger loads.

FIRST VIEWPORT: A light nav with the logo, links and a copper Call button. The Strapi headline is set left at about 88px, with the description and Call and Get a quote actions beside it. Below runs a full-width graphite rack of six bundles (Cu, CuZn, Al, SS, Pb, Fe) that racks in once on load; copper is pre-picked, and its grade tag stands out of the rack with its grades, payment and ID rule and a link. Signature interaction: picking a bundle slides out its tag, and the pick is addressable. Motion grammar: one load moment, then only state feedback, with no per-section entrances.

FORM: Metal grade colour codes, #3 of my seven grounded candidates, taken from the safer re-roll hand on the user's delegation. seed: ada8a9e549cfb5ed

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
