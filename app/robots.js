import { SITE_URL } from "@/lib/seo";

// /robots.txt: every crawler may read every page, and the sitemap lists them.
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
