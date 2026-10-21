// The photo a service page opens on carries across from the row or card that
// linked to it: a <ViewTransition> named service-<slug> around the photo on
// both pages (on the service page, PageHeader's imageName). Each link to a
// service page tags its navigation with that service's transition type, and
// each photo morphs only on its own type. So only the photo that was followed
// morphs; the other service photos on the page stay where they are, rather
// than flying to their namesakes further down the next page.
//
//   const morph = serviceMorph(slug);
//   <ViewTransition name={morph.name} share={morph.share} default="none">…
//   <Link href={`/services/${slug}`} transitionTypes={morph.types}>…
export function serviceMorph(slug) {
  const type = `to-service-${slug}`;
  return {
    name: `service-${slug}`,
    share: { [type]: "metal-morph", default: "none" },
    types: [type],
  };
}
