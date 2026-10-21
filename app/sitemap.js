import { blogSlug, getBlogs } from "@/lib/blogs";
import { SITE_URL } from "@/lib/seo";
import { services } from "./services/services";
import { materials } from "./what-we-buy/materials";

// /sitemap.xml, every page for search engines (robots.txt points to it). The
// material, service and blog pages come from their lists, so a new one is
// listed without an edit here. getBlogs is cached for an hour, so a new post
// shows up within the hour. Posts give their date as the last change; the other
// pages have no date to give, so they leave it out rather than claim a change
// at every build.
export default async function sitemap() {
  const blogs = await getBlogs();
  const paths = [
    "/",
    "/what-we-buy",
    ...materials.map(({ slug }) => `/what-we-buy/${slug}`),
    "/services",
    ...services.map(({ slug }) => `/services/${slug}`),
    "/about",
    "/contact-us",
    "/blogs",
    "/privacy-policy",
  ];
  return [
    ...paths.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...blogs.map((blog) => ({
      url: `${SITE_URL}/blogs/${blogSlug(blog.title)}`,
      lastModified: blog.date,
    })),
  ];
}
