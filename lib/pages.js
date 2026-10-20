import "server-only";
import { cacheLife } from "next/cache";
import { fetchStrapi, mediaUrl } from "./strapi";

// The copy on the home page and around the blog posts is edited in Strapi, as
// the Home Page and Blog Page single types. Cached for an hour like the posts
// (see lib/blogs.js), so the pages are prerendered with it and an edit shows
// up within the hour without a redeploy.

// Strapi leaves components out of a response unless asked for, down to each
// nested component and upload.
const HOME_PAGE_POPULATE = {
  seo: true,
  hero: {
    populate: {
      primaryCta: true,
      secondaryCta: true,
      backgroundImages: { populate: { upload: true } },
    },
  },
  whyUs: {
    populate: { reasons: { populate: { image: { populate: { upload: true } } } } },
  },
  commercial: { populate: { services: true } },
  cashForCars: {
    populate: { image: { populate: { upload: true } }, steps: true, cta: true },
  },
  faq: { populate: { questions: true } },
};

export async function getHomePage() {
  "use cache";
  cacheLife("hours");
  const { data } = await fetchStrapi("home-page", { populate: HOME_PAGE_POPULATE });
  const { seo, hero, ticker, whyUs, commercial, cashForCars, faq } = data;

  return {
    seo: toSeo(seo),
    hero: {
      eyebrow: hero.eyebrow,
      title: hero.title,
      description: hero.description,
      primaryCta: toLink(hero.primaryCta),
      secondaryCta: toLink(hero.secondaryCta),
      backgroundImages: hero.backgroundImages.map(toImage).filter(Boolean),
    },
    ticker: lines(ticker),
    whyUs: {
      heading: whyUs.heading,
      intro: whyUs.intro,
      reasons: whyUs.reasons.map(({ title, description, href, image }) => ({
        title,
        description,
        href,
        image: toImage(image),
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
      image: toImage(cashForCars.image),
      steps: cashForCars.steps.map(({ title, description, points, icon }) => ({
        title,
        description,
        points: lines(points),
        icon,
      })),
      cta: toLink(cashForCars.cta),
    },
    faq: {
      heading: faq.heading,
      intro: faq.intro,
      questions: faq.questions.map(({ question, answer }) => ({ question, answer })),
    },
  };
}

export async function getBlogPage() {
  "use cache";
  cacheLife("hours");
  const { data } = await fetchStrapi("blog-page", { populate: { seo: true } });
  const { seo, eyebrow, heading, emptyMessage, postEyebrow } = data;
  return { seo: toSeo(seo), eyebrow, heading, emptyMessage, postEyebrow };
}

function toSeo({ metaTitle, metaDescription }) {
  return { title: metaTitle, description: metaDescription };
}

function toLink(link) {
  return link ? { text: link.text, href: link.href } : null;
}

// An uploaded photo wins over a pasted address. With neither there's nothing
// to show, so this returns null.
function toImage(image) {
  const src = image?.upload ? mediaUrl(image.upload.url) : image?.url;
  return src ? { src, alt: image.alt, title: image.title } : null;
}

// Lists that are typed into a text box, one item per line.
function lines(text) {
  return (text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
