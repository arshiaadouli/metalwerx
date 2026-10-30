import "server-only";
import { cacheTag } from "next/cache";

// The Payload CMS (metalwerx-payload) at CMS_URL holds the home page copy, the
// blog posts, the privacy policy, the services and the materials (What We
// Buy). Their photos are files in its object storage, linked by URL. Each
// read is cached and tagged: the CMS
// calls /api/revalidate with the tag after a change, and the cache also
// refreshes by itself every 15 minutes (the default cacheLife).

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

// A media document, as { src, alt, title }. title is the tooltip where the
// photo is used, falling back to the photo's own.
function photo(media, title) {
  if (!media || typeof media !== "object") return null;
  return { src: media.url, alt: media.alt ?? "", title: title || media.title || undefined };
}

// The home page, in the shape the home page sections take (see app/page.jsx).
export async function getHomePage() {
  "use cache";
  cacheTag("cms:home-page");
  const { seo, hero, ticker, whyUs, commercial, cashForCars, faq } = await fetchCms(
    "globals/home-page",
    { depth: 1 },
  );
  const link = ({ text, href }) => ({ text, href });

  return {
    seo,
    hero: {
      eyebrow: hero.eyebrow,
      title: hero.title,
      description: hero.description,
      primaryCta: link(hero.primaryCta),
      secondaryCta: link(hero.secondaryCta),
      backgroundImages: hero.backgroundImages.map((item) => photo(item.image, item.imageTitle)),
    },
    ticker: ticker.map((item) => item.text),
    whyUs: {
      heading: whyUs.heading,
      intro: whyUs.intro,
      reasons: whyUs.reasons.map(({ title, description, href, image, imageTitle }) => ({
        title,
        description,
        href,
        image: photo(image, imageTitle),
      })),
    },
    commercial: {
      heading: commercial.heading,
      intro: commercial.intro,
      services: commercial.services.map(({ title, href, icon }) => ({ title, href, icon })),
    },
    cashForCars: {
      heading: cashForCars.heading,
      subheading: cashForCars.subheading,
      body: cashForCars.body,
      image: photo(cashForCars.image, cashForCars.imageTitle),
      steps: cashForCars.steps.map(({ title, description, points, icon }) => ({
        title,
        description,
        points: points.map((point) => point.text),
        icon,
      })),
      cta: link(cashForCars.cta),
    },
    faq: {
      heading: faq.heading,
      intro: faq.intro,
      questions: faq.questions.map(({ question, answer }) => ({ question, answer })),
    },
  };
}

// Every blog post, newest first, as { id, title, date, description, cover,
// paragraphs, text }: id is the slug, date a Date at midnight UTC, cover the
// cover photo or null, paragraphs the body, and text the whole body, for
// reading time.
export async function getPosts() {
  "use cache";
  cacheTag("cms:posts");
  const { docs } = await fetchCms("posts", { depth: 1, limit: 1000, sort: "-date" });
  return docs.map((post) => {
    const paragraphs = post.body.map((paragraph) => paragraph.text);
    return {
      id: post.slug,
      title: post.title,
      date: new Date(post.date),
      description: post.description,
      cover: photo(post.cover),
      paragraphs,
      text: paragraphs.join("\n\n"),
    };
  });
}

// The privacy policy as stored: seo, hero, sections (each with topics made of
// content blocks) and cta. See app/privacy-policy/page.jsx.
export async function getPrivacyPolicy() {
  "use cache";
  cacheTag("cms:privacy-policy");
  return fetchCms("globals/privacy-policy", { depth: 0 });
}

// The services, in their order on /services, and the /services page's header
// and closing band. Photos are { url, alt, title } here, as the services
// sections take them (see app/services/sections.jsx), and icons are lucide
// names, such as "container" (see app/services/services.js).
export async function getServicesContent() {
  "use cache";
  cacheTag("cms:services");
  const [{ docs }, page] = await Promise.all([
    fetchCms("services", { depth: 1, limit: 100, sort: "order" }),
    fetchCms("globals/services-page", { depth: 1 }),
  ]);
  const servicePhoto = (media, title) => {
    const image = photo(media, title);
    return image && { url: image.src, alt: image.alt, title: image.title };
  };
  const band = ({ heading, text, buttonText, buttonHref }) => ({
    heading,
    text,
    cta: { text: buttonText, href: buttonHref },
  });

  const services = docs.map((service) => ({
    slug: service.slug,
    anchor: service.anchor,
    title: service.title,
    heading: service.heading,
    icon: service.icon,
    summary: service.summary,
    seo: service.seo,
    lede: service.lede,
    image: servicePhoto(service.image, service.imageTitle),
    overview: {
      heading: service.overview.heading,
      paragraphs: service.overview.paragraphs.map((paragraph) => paragraph.text),
      features: service.overview.features.map(({ icon, title, text }) => ({ icon, title, text })),
    },
    steps: {
      intro: service.steps.intro,
      items: service.steps.items.map(({ title, text }) => ({ title, text })),
    },
    details: {
      heading: service.details.heading,
      intro: service.details.intro,
      images: service.details.images.map((item) => servicePhoto(item.image, item.imageTitle)),
      lists: service.details.lists.map(({ title, kind, items }) => ({
        title,
        kind,
        items: items.map((item) => item.text),
      })),
    },
    faq: {
      intro: service.faq.intro,
      questions: service.faq.questions.map(({ question, answer }) => ({ question, answer })),
    },
    cta: band(service.cta),
  }));

  const { seo, hero, cta } = page;
  return {
    services,
    page: {
      seo,
      hero: {
        eyebrow: hero.eyebrow,
        title: hero.title,
        lede: hero.lede,
        image: servicePhoto(hero.image, hero.imageTitle),
        cta: { text: hero.cta.text, href: hero.cta.href },
      },
      cta: band(cta),
    },
  };
}

// The materials, and the /what-we-buy page's header, groups of cards, selling
// steps and closing band. Photos are { url, alt, title } and icons lucide
// names (see app/what-we-buy/materials.js). A material's
// related and a group's materials are slugs; a material whose steps have no
// items takes the page's selling steps.
export async function getWhatWeBuyContent() {
  "use cache";
  cacheTag("cms:materials");
  const [{ docs }, page] = await Promise.all([
    fetchCms("materials", { depth: 1, limit: 100 }),
    fetchCms("globals/what-we-buy-page", { depth: 1 }),
  ]);
  const materialPhoto = (media, title) => {
    const image = photo(media, title);
    return image && { url: image.src, alt: image.alt, title: image.title };
  };
  const band = ({ heading, text, buttonText, buttonHref }) => ({
    heading,
    text,
    cta: { text: buttonText, href: buttonHref },
  });
  const steps = ({ intro, items }) => ({
    intro,
    items: items.map(({ title, text }) => ({ title, text })),
  });
  // A relationship at depth 1 is the document, or its id if it's not readable.
  const slugs = (refs) => {
    const byId = new Map(docs.map((material) => [material.id, material.slug]));
    return (refs ?? [])
      .map((ref) => (typeof ref === "object" ? ref.slug : byId.get(ref)))
      .filter(Boolean);
  };

  const sellingSteps = steps(page.sellingSteps);
  const materials = docs.map((material) => ({
    slug: material.slug,
    anchor: material.anchor,
    title: material.title,
    heading: material.heading,
    icon: material.icon,
    summary: material.summary,
    seo: material.seo,
    lede: material.lede,
    image: materialPhoto(material.image, material.imageTitle),
    overview: {
      heading: material.overview.heading,
      paragraphs: material.overview.paragraphs.map((paragraph) => paragraph.text),
      gradesTitle: material.overview.gradesTitle || undefined,
      grades: material.overview.grades.map(({ title, text }) => ({ title, text })),
    },
    steps: material.steps?.items?.length ? steps(material.steps) : sellingSteps,
    details: {
      heading: material.details.heading,
      intro: material.details.intro,
      images: material.details.images.map((item) => materialPhoto(item.image, item.imageTitle)),
      lists: material.details.lists.map(({ title, kind, items }) => ({
        title,
        kind,
        items: items.map((item) => item.text),
      })),
    },
    faq: {
      intro: material.faq.intro,
      questions: material.faq.questions.map(({ question, answer }) => ({ question, answer })),
    },
    related: slugs(material.related),
    cta: band(material.cta),
  }));

  const { seo, hero, groups, cta } = page;
  return {
    materials,
    page: {
      seo,
      hero: {
        eyebrow: hero.eyebrow,
        title: hero.title,
        lede: hero.lede,
        image: materialPhoto(hero.image, hero.imageTitle),
        cta: { text: hero.cta.text, href: hero.cta.href },
      },
      groups: groups.map(({ anchor, title, intro, materials: refs }) => ({
        id: anchor,
        title,
        intro,
        slugs: slugs(refs),
      })),
      sellingSteps,
      cta: band(cta),
    },
  };
}
