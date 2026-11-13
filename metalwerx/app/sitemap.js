import {
  getHomePage,
  getPosts,
  getPrices,
  getPrivacyPolicy,
  getServicesContent,
  getTerms,
  getWhatWeBuyContent,
} from "@/lib/cms";
import { suburbs } from "@/app/areas/suburbs";

// /sitemap.xml, for search engines. It lists the fixed pages, the suburbs with
// a page of their own (see app/areas/local.js) and every blog post,
// service and material in the CMS. The CMS reads are cached and tagged
// (see lib/cms.js), so a post or material added there shows up here once the
// CMS revalidates its tag. URLs use the bare domain, as the canonical URLs do
// (see app/layout.jsx). Each page's lastModified is when its content was last
// saved in the CMS, prices included where the page shows them, so a change is
// recrawled sooner.
const SITE_URL = "https://metalwerx.com.au";

const page = (path, changeFrequency, priority, lastModified) => ({
  url: `${SITE_URL}${path}`,
  ...(lastModified && { lastModified }),
  changeFrequency,
  priority,
});

// The newest of some ISO dates, or undefined with none.
const latest = (...dates) => dates.filter(Boolean).sort().at(-1);

export default async function sitemap() {
  const [home, posts, prices, services, whatWeBuy, privacy, terms] = await Promise.all([
    getHomePage(),
    getPosts(),
    getPrices(),
    getServicesContent(),
    getWhatWeBuyContent(),
    getPrivacyPolicy(),
    getTerms(),
  ]);
  const priceUpdated = Object.fromEntries(prices.map(({ slug, updatedAt }) => [slug, updatedAt]));
  const pricesUpdated = latest(...Object.values(priceUpdated));
  // Posts are newest first.
  const latestPost = posts[0]?.date;

  return [
    page("/", "weekly", 1, home.updatedAt),
    page(
      "/services",
      "monthly",
      0.9,
      latest(services.page.updatedAt, ...services.services.map((service) => service.updatedAt)),
    ),
    ...services.services.map(({ slug, updatedAt }) => page(`/services/${slug}`, "monthly", 0.8, updatedAt)),
    // The cards on /what-we-buy and each material's header show its price.
    page(
      "/what-we-buy",
      "monthly",
      0.9,
      latest(whatWeBuy.page.updatedAt, pricesUpdated, ...whatWeBuy.materials.map((m) => m.updatedAt)),
    ),
    ...whatWeBuy.materials.map(({ slug, updatedAt }) =>
      page(`/what-we-buy/${slug}`, "monthly", 0.8, latest(updatedAt, priceUpdated[slug])),
    ),
    page("/prices", "weekly", 0.8, pricesUpdated),
    page("/areas", "monthly", 0.7),
    ...suburbs
      .filter((suburb) => suburb.local)
      .map(({ slug }) => page(`/areas/${slug}`, "yearly", 0.5)),
    page("/blogs", "weekly", 0.6, latestPost),
    ...posts.map(({ id, date }) => page(`/blogs/${id}`, "yearly", 0.5, date)),
    page("/about", "yearly", 0.5),
    page("/contact-us", "yearly", 0.7),
    page("/privacy", "yearly", 0.2, privacy.updatedAt),
    page("/terms", "yearly", 0.2, terms.updatedAt),
  ];
}
