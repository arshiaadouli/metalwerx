// /robots.txt: every page may be crawled, and crawlers are pointed at the
// sitemap (see app/sitemap.js). /api/ only takes the CMS's revalidate calls.
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://metalwerx.com.au/sitemap.xml",
  };
}
