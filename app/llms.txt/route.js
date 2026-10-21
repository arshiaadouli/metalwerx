import { blogSlug, getBlogs } from "@/lib/blogs";
import { SITE_URL } from "@/lib/seo";
import { YARD } from "@/lib/yard";
import { services } from "../services/services";
import { getMaterial, groups } from "../what-we-buy/materials";

// /llms.txt, the site summed up for AI assistants and LLM crawlers, in the
// Markdown layout llmstxt.org sets out: the name, a one-line summary, the key
// facts, then a section of links per part of the site. Like /sitemap.xml, the
// materials, services and posts come from their lists, so a new page shows up
// here without an edit. It says only what the site itself says (no prices, and
// no hours until YARD.hours is filled in). getBlogs is cached for an hour, so
// the file is prerendered and a new post shows up within the hour.
export async function GET() {
  const blogs = await getBlogs();
  const link = (title, path, note) => `- [${escape(title)}](${SITE_URL}${path})${note ? `: ${note}` : ""}`;

  const lines = [
    "# Metal Werx Scrap Metal Recycling",
    "",
    `> Metal Werx is a scrap metal recycling yard at ${YARD.address}, in Melbourne's south-east. It buys ferrous and non-ferrous metals, car bodies and batteries from homes, farms and businesses, hires out scrap bins and picks up loads.`,
    "",
    "Scrap is weighed at the Hallam yard and paid for by bank transfer. Sellers bring photo ID.",
    "",
    `- Phone: ${YARD.phone}`,
    `- Email: ${YARD.email}`,
    `- Address: ${YARD.address}`,
    YARD.hours
      ? `- Opening hours: ${YARD.hours.map(({ days, time }) => `${days} ${time}`).join("; ")}`
      : "- Opening hours: not published yet; call ahead before visiting",
    `- Directions: ${YARD.mapsHref}`,
    "",
    ...groups.flatMap((group) => [
      `## What we buy: ${group.title}`,
      "",
      group.intro,
      "",
      ...group.slugs.map((slug) => {
        const { title, summary, overview } = getMaterial(slug);
        const grades = overview.grades.map((grade) => grade.title).join(", ");
        return link(title, `/what-we-buy/${slug}`, `${summary} ${overview.gradesTitle ?? "Grades"}: ${grades}.`);
      }),
      "",
    ]),
    "## Services",
    "",
    ...services.map(({ slug, title, summary }) => link(title, `/services/${slug}`, summary)),
    "",
    "## About and contact",
    "",
    link("Home", "/", "Why sell to Metal Werx, commercial services, cash for cars and common questions"),
    link("What we buy", "/what-we-buy", "Every material, grouped as above"),
    link("About Metal Werx", "/about", "The yard and what it does"),
    link("Contact", "/contact-us", "Phone, email, a message form, the address and a map"),
    "",
    ...(blogs.length
      ? [
          "## Blog",
          "",
          ...blogs.map((blog) => link(blog.title, `/blogs/${blogSlug(blog.title)}`, `Posted ${isoDate(blog.date)}`)),
          "",
        ]
      : []),
    "## Optional",
    "",
    link("Privacy policy", "/privacy-policy"),
    link("Sitemap", "/sitemap.xml", "Every page, for crawlers"),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

// Square brackets would end a Markdown link's text early.
function escape(text) {
  return text.replace(/[[\]]/g, "\\$&");
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}
