import { cn } from "@/lib/utils";

// A photo from the Home Page in Strapi (`image` is { src, alt, title } from
// lib/pages.js), on a square-cornered plate. A plain <img> rather than
// next/image, as elsewhere on the site, so no next.config remotePatterns entry
// is needed for Strapi uploads or pasted addresses. Unsplash addresses take a
// width on the end, so for those the browser picks a size from `widths` (with
// `sizes`, as in the <img> attribute) instead of loading the full-size photo
// for a small plate. Anything else, such as a Strapi upload, loads as given.
//
// The photos are stock from several sources, so they are graded into the
// site's palette: an overlay in the rack colour, blended by colour, keeps each
// photo's lights and darks and gives it the rack's red-black. `gradeClassName`
// styles the overlay, for instance to fade it out on hover. `className` sizes
// the plate.
export function HomePhoto({ image, widths, sizes, className, gradeClassName }) {
  const srcSet = unsplashSrcSet(image.src, widths);
  return (
    <span className={cn("relative isolate block overflow-hidden rounded-[2px] bg-sunk", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asWebp(image.src)}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={image.alt ?? ""}
        title={image.title || undefined}
        loading="lazy"
        decoding="async"
        className="size-full object-cover"
      />
      <span
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 bg-(--rack) mix-blend-color forced-colors:hidden", gradeClassName)}
      />
    </span>
  );
}

// An Unsplash address asks for WebP, which a crawler (no Accept header) would
// otherwise get as a JPEG; a browser that takes AVIF still gets AVIF. Strapi
// uploads are saved as WebP already, so anything else loads as given.
function asWebp(src) {
  const url = unsplashUrl(src);
  return url ? url.href : src;
}

function unsplashUrl(src) {
  let url;
  try {
    url = new URL(src);
  } catch {
    return undefined;
  }
  if (url.hostname !== "images.unsplash.com") return undefined;
  url.searchParams.set("fm", "webp");
  return url;
}

function unsplashSrcSet(src, widths) {
  const url = unsplashUrl(src);
  if (!url) return undefined;
  return widths
    .map((width) => {
      url.searchParams.set("w", String(width));
      return `${url.href} ${width}w`;
    })
    .join(", ");
}
