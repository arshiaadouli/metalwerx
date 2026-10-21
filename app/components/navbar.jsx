import { SiteHeader } from "@/components/site/site-header";
import { services } from "@/app/services/services";
import { getMaterial, groups } from "@/app/what-we-buy/materials";

// The site header's menus and links. What We Buy and Services list the pages
// from app/what-we-buy/materials.js and app/services/services.js, so a new
// material or service shows up here on its own. Each material carries its own
// cross-section (components/metal/metal.jsx) in place of a photo.

const logo = {
  url: "/",
  src: "/logo.webp",
  alt: "Metal Werx Scrap Metal Recycling",
  // Display size; logo.webp is 576×120 (3× this), the same 4.8:1 ratio. It is
  // served as is (SiteHeader's `unoptimized`), so every visitor and crawler
  // gets WebP; the optimiser would turn it into a JPEG for one that doesn't
  // ask for WebP. public/logo.png is the full-size original.
  width: 192,
  height: 40,
};

const materials = {
  href: "/what-we-buy",
  groups: groups.map((group) => ({
    id: group.id,
    title: group.title,
    items: group.slugs.map((slug) => {
      const { title, summary } = getMaterial(slug);
      return { slug, title, summary, href: `/what-we-buy/${slug}` };
    }),
  })),
};

const serviceLinks = services.map(({ slug, title, summary, icon }) => ({
  slug,
  title,
  summary,
  icon,
  href: `/services/${slug}`,
}));

const links = [
  { title: "Blog", href: "/blogs" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact-us" },
];

// The #hours and #location sections are on /contact-us.
const extra = [
  { name: "Opening hours", href: "/contact-us#hours" },
  { name: "Find us", href: "/contact-us#location" },
];

export default function Navbar() {
  return (
    <SiteHeader
      logo={logo}
      materials={materials}
      services={serviceLinks}
      links={links}
      quote={{ text: "Free quote", href: "/contact-us" }}
      extra={extra}
    />
  );
}
