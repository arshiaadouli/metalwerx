import "server-only";
import { cacheLife } from "next/cache";
import { fetchStrapi, uploadedImage } from "./strapi";

// The photos and the logo on the pages whose copy is still in the code (the
// header and footer, About, Services, What We Buy and each material) are Site
// Images in Strapi. The code names each one by its key, such as "logo" or
// "scrap-copper-wire", and Strapi holds the upload, its alt text and title, and
// the stock photo page it came from. Swapping a photo or fixing its alt text
// is an edit in Strapi, not a code change.
//
// All of them come in one request, cached for an hour like the page copy (see
// lib/pages.js), so the pages are prerendered with the photos already in the
// HTML and an edit shows up within the hour without a redeploy.
async function getSiteImages() {
  "use cache";
  cacheLife("hours");
  const images = {};
  for (let page = 1; ; page++) {
    const { data, meta } = await fetchStrapi("site-images", {
      populate: { image: true },
      pagination: { page, pageSize: 100 },
    });
    for (const { key, image, alt, title } of data) {
      const attributes = uploadedImage(image);
      if (attributes) images[key] = { ...attributes, alt, title: title ?? undefined };
    }
    if (page >= meta.pagination.pageCount) break;
  }
  return images;
}

// The Site Image with this key, as { src, srcSet, width, height, alt, title }.
// A key that isn't in Strapi stops the page from rendering, rather than
// quietly leaving the photo out.
export async function getSiteImage(key) {
  const image = (await getSiteImages())[key];
  if (!image) {
    throw new Error(`Strapi has no Site Image with the key "${key}". Add one in the Content Manager.`);
  }
  return image;
}
