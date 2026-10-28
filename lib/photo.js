import { getImageProps } from "next/image";

// The site's photos are files in public/images, saved at up to 2400px on the
// long side: free stock photos (Unsplash and Pexels licenses, no credit
// required) in public/images/unsplash and public/images/pexels, named by their
// id on the source site.

// The src, srcSet and sizes for a plain <img> of a photo in public/. Next's
// image optimizer resizes it to each width in the srcset, and `sizes` (as in
// the <img> attribute) tells the browser how wide it shows, so it downloads
// the smallest copy that fills the space.
export function photoProps(src, sizes = "100vw") {
  const { props } = getImageProps({ src, alt: "", fill: true, sizes });
  return { src: props.src, srcSet: props.srcSet, sizes: props.sizes };
}
