import { getPosts, getPrices, getServicesContent, getWhatWeBuyContent } from "@/lib/cms";

// /sitemap.xml, for search engines. It lists the fixed pages and every blog
// post, service and material in the CMS. The CMS reads are cached and tagged
// (see lib/cms.js), so a post or material added there shows up here once the
// CMS revalidates its tag. URLs use the bare domain, as the canonical URLs do
// (see app/layout.jsx).
const SITE_URL = "https://metalwerx.com.au";

const page = (path, changeFrequency, priority, lastModified) => ({
  url: `${SITE_URL}${path}`,
  ...(lastModified && { lastModified }),
  changeFrequency,
  priority,
});

export default async function sitemap() {
  const [posts, prices, { services }, { materials }] = await Promise.all([
    getPosts(),
    getPrices(),
    getServicesContent(),
    getWhatWeBuyContent(),
  ]);
  // The prices page changes when any price does. Posts are newest first.
  const pricesUpdated = prices
    .map((price) => price.updatedAt)
    .filter(Boolean)
    .sort()
    .at(-1);
  const latestPost = posts[0]?.date;

  return [
    page("/", "weekly", 1),
    page("/services", "monthly", 0.9),
    ...services.map(({ slug }) => page(`/services/${slug}`, "monthly", 0.8)),
    page("/what-we-buy", "monthly", 0.9),
    ...materials.map(({ slug }) => page(`/what-we-buy/${slug}`, "monthly", 0.8)),
    page("/prices", "weekly", 0.8, pricesUpdated),
    page("/blogs", "weekly", 0.6, latestPost),
    ...posts.map(({ id, date }) => page(`/blogs/${id}`, "yearly", 0.5, date)),
    page("/about", "yearly", 0.5),
    page("/contact-us", "yearly", 0.7),
    page("/privacy", "yearly", 0.2),
    page("/terms", "yearly", 0.2),
  ];
}
