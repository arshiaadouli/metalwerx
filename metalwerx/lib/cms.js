import "server-only";
import { cacheTag } from "next/cache";
import { mediaPath } from "./media";

// The Payload CMS (metalwerx-payload) at CMS_URL holds the home page copy, the
// blog posts, the privacy policy, the terms and conditions, the services, the
// materials (What We Buy) and their prices. Their photos are files in its
// object storage, which the site serves at /media (see lib/media.js). Each
// read is cached and tagged: the CMS calls /api/revalidate with the tag after
// a change, and the cache also refreshes by itself every 15 minutes (the
// default cacheLife).
//
// Payload's JSON is passed on as it is, apart from three reshapes:
//   - a photo (an image upload and its imageTitle) becomes { src, alt, title }
//   - a list of { text } rows becomes a list of strings
//   - a link to another document becomes that document's slug

function cmsUrl() {
  const url = process.env.CMS_URL;
  if (!url) {
    throw new Error(
      "CMS_URL is not set. Point it at the Payload CMS, e.g. http://192.168.15.240:3001.",
    );
  }
  return url;
}

// GETs /api/<path> from the CMS's REST API and returns the parsed JSON.
async function fetchCms(path, query = {}) {
  const url = new URL(`/api/${path}`, cmsUrl());
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`The CMS returned ${res.status} for ${url.pathname}.`);
  return res.json();
}

// Uploads a photo sent with a contact form message (a File) to the CMS's
// message-photos collection and returns its id, for createMessage's photos.
// The CMS only takes it with the shared MESSAGES_SECRET.
export async function uploadMessagePhoto(file) {
  const url = new URL("/api/message-photos", cmsUrl());
  const body = new FormData();
  body.set("file", file, file.name);
  const res = await fetch(url, {
    method: "POST",
    headers: { "x-messages-secret": process.env.MESSAGES_SECRET ?? "" },
    body,
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) {
    throw new Error(`The CMS returned ${res.status} for ${url.pathname}: ${await res.text()}`);
  }
  const { doc } = await res.json();
  return doc.id;
}

// Saves a contact form message ({ name, phone, email, message, photos }) in
// the CMS's messages collection; photos are the ids uploadMessagePhoto
// returned. The CMS only takes it with the shared MESSAGES_SECRET.
export async function createMessage(message) {
  const url = new URL("/api/messages", cmsUrl());
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-messages-secret": process.env.MESSAGES_SECRET ?? "",
    },
    body: JSON.stringify(message),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    throw new Error(`The CMS returned ${res.status} for ${url.pathname}: ${await res.text()}`);
  }
}

// A media document as { src, alt, title }: src is the photo's path on this
// site (see lib/media.js), and title the tooltip where the photo is used,
// falling back to the photo's own.
function photo(media, title) {
  if (!media || typeof media !== "object") return null;
  return { src: mediaPath(media.url), alt: media.alt ?? "", title: title || media.title || undefined };
}

// A document or group with an image upload and its tooltip, with the photo in
// their place.
const withPhoto = ({ imageTitle, ...doc }) => ({ ...doc, image: photo(doc.image, imageTitle) });

// The photos of a list of image rows.
const photos = (items) => items.map((item) => photo(item.image, item.imageTitle));

// The strings of a list of { text } rows.
const texts = (rows) => rows.map((row) => row.text);

// The home page, in the shape the home page sections take (see app/page.jsx).
export async function getHomePage() {
  "use cache";
  cacheTag("cms:home-page");
  const { seo, hero, ticker, whyUs, commercial, cashForCars, faq } = await fetchCms(
    "globals/home-page",
    { depth: 1 },
  );
  return {
    seo,
    hero: { ...hero, backgroundImages: photos(hero.backgroundImages) },
    ticker: texts(ticker),
    whyUs: { ...whyUs, reasons: whyUs.reasons.map(withPhoto) },
    commercial,
    cashForCars: {
      ...withPhoto(cashForCars),
      steps: cashForCars.steps.map((step) => ({ ...step, points: texts(step.points) })),
    },
    faq,
  };
}

// Every blog post, newest first, as { id, title, date, updated, description,
// cover, paragraphs, text }: id is the slug, date a Date at midnight UTC,
// updated when it was last saved in the CMS, cover the cover photo or null,
// paragraphs the body, and text the whole body, for reading time.
export async function getPosts() {
  "use cache";
  cacheTag("cms:posts");
  const { docs } = await fetchCms("posts", { depth: 1, limit: 1000, sort: "-date" });
  return docs.map((post) => {
    const paragraphs = texts(post.body);
    return {
      id: post.slug,
      title: post.title,
      date: new Date(post.date),
      updated: new Date(post.updatedAt),
      description: post.description,
      cover: photo(post.cover),
      paragraphs,
      text: paragraphs.join("\n\n"),
    };
  });
}

// The privacy policy as stored: seo, hero, sections (each with topics made of
// content blocks) and cta. See app/components/legal-page.jsx.
export async function getPrivacyPolicy() {
  "use cache";
  cacheTag("cms:privacy-policy");
  return fetchCms("globals/privacy-policy", { depth: 0 });
}

// The terms and conditions, in the same shape as the privacy policy. See
// app/terms/page.jsx.
export async function getTerms() {
  "use cache";
  cacheTag("cms:terms");
  return fetchCms("globals/terms", { depth: 0 });
}

// The fields a service and a material share, in the shape the sections in
// app/services/sections.jsx take. Icons stay lucide names, such as
// "container"; app/services/services.js and app/what-we-buy/materials.js turn
// them into components.
function pageDoc(doc) {
  const { overview, details } = doc;
  return {
    ...withPhoto(doc),
    overview: { ...overview, paragraphs: texts(overview.paragraphs) },
    details: {
      ...details,
      images: photos(details.images),
      lists: details.lists.map((list) => ({ ...list, items: texts(list.items) })),
    },
  };
}

// The services, in their order on /services, and the /services page's header
// and closing band.
export async function getServicesContent() {
  "use cache";
  cacheTag("cms:services");
  const [{ docs }, page] = await Promise.all([
    fetchCms("services", { depth: 1, limit: 100, sort: "order" }),
    fetchCms("globals/services-page", { depth: 1 }),
  ]);
  return { services: docs.map(pageDoc), page: { ...page, hero: withPhoto(page.hero) } };
}

// What the yard pays for each material, as [{ slug, price, unit, updatedAt }]:
// slug is the material's, price the average in AUD or null when not set, unit
// is "kg", "tonne" or "each", and updatedAt an ISO date. See app/prices.
export async function getPrices() {
  "use cache";
  cacheTag("cms:price");
  const { docs } = await fetchCms("price", {
    depth: 1,
    limit: 100,
    "populate[materials][slug]": true,
  });
  return docs
    .filter((price) => typeof price.material === "object")
    .map(({ material, price, unit, updatedAt }) => ({
      slug: material.slug,
      price: price ?? null,
      unit,
      updatedAt,
    }));
}

// The materials, and the /what-we-buy page's header, what affects the price,
// groups of cards, selling steps and closing band. A material's related and a
// group's materials are slugs, and a material with no steps of its own takes
// the page's selling steps.
export async function getWhatWeBuyContent() {
  "use cache";
  cacheTag("cms:materials");
  const [{ docs }, page] = await Promise.all([
    fetchCms("materials", { depth: 1, limit: 100 }),
    fetchCms("globals/what-we-buy-page", { depth: 1 }),
  ]);
  // A relationship at depth 1 is the document, or its id if it's not readable.
  const slugById = new Map(docs.map((doc) => [doc.id, doc.slug]));
  const slugs = (refs) =>
    (refs ?? [])
      .map((ref) => (typeof ref === "object" ? ref.slug : slugById.get(ref)))
      .filter(Boolean);

  return {
    materials: docs.map((doc) => ({
      ...pageDoc(doc),
      steps: doc.steps.items.length > 0 ? doc.steps : page.sellingSteps,
      related: slugs(doc.related),
    })),
    page: {
      ...page,
      hero: withPhoto(page.hero),
      groups: page.groups.map(({ anchor, materials, ...group }) => ({
        ...group,
        id: anchor,
        slugs: slugs(materials),
      })),
    },
  };
}
