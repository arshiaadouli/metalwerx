import { Container, Factory, Truck } from "lucide-react";
import { Navbar1 } from "@/components/ui/shadcnblocks-com-navbar1";
import { getMaterials, getWhatWeBuyPage } from "@/app/what-we-buy/materials";

const iconClass = "size-5 shrink-0 text-cherry";

// /prices is a placeholder for a page still to be built, as are the #hours
// and #location sections of /contact-us.
const navbar = {
  logo: {
    url: "/",
    src: "/logo.png",
    alt: "Metal Werx Scrap Metal Recycling",
    // Display size; logo.png is 4726×985, the same 4.8:1 ratio.
    width: 192,
    height: 40,
  },
  menu: [
    { title: "Home", url: "/" },
    // Filled in by Navbar below, from the CMS.
    { title: "What We Buy", url: "/what-we-buy", columns: 3, items: [] },
    {
      title: "Services",
      url: "/services",
      items: [
        {
          title: "Bin Hire",
          description: "Scrap bins dropped at your site and collected when full",
          icon: <Container className={iconClass} />,
          url: "/services/bin-hire",
        },
        {
          title: "Pickup & Collection",
          description: "Bulk scrap collected from homes, farms and businesses",
          icon: <Truck className={iconClass} />,
          url: "/services/pickup-and-collection",
        },
        {
          title: "Commercial Recycling",
          description: "Ongoing scrap removal for workshops and builders",
          icon: <Factory className={iconClass} />,
          url: "/services/commercial-recycling",
        },
      ],
    },
    { title: "Blog", url: "/blogs" },
    { title: "About", url: "/about" },
    { title: "Contact", url: "/contact-us" },
  ],
  mobileExtraLinks: [
    { name: "Opening Hours", url: "/contact-us#hours" },
    { name: "Find Us", url: "/contact-us#location" },
  ],
  // Navbar1 calls its two buttons login/signup; here they're the yard's calls to action.
  auth: {
    login: { text: "Scrap Prices", url: "/prices" },
    signup: { text: "Get a Quote", url: "/contact-us" },
  },
};

// The What We Buy menu lists the materials in the CMS in their order on
// /what-we-buy, each with its header photo as a 48px thumbnail. Its summary is
// the item's description, without the full stop.
export default async function Navbar() {
  const [{ groups }, materials] = await Promise.all([getWhatWeBuyPage(), getMaterials()]);
  const order = groups.flatMap((group) => group.slugs);
  const rank = (slug) => (order.includes(slug) ? order.indexOf(slug) : order.length);
  const items = materials
    .toSorted((a, b) => rank(a.slug) - rank(b.slug))
    .map(({ slug, title, summary, image }) => ({
      title,
      description: summary.replace(/\.$/, ""),
      image: { src: image.url, alt: image.alt },
      url: `/what-we-buy/${slug}`,
    }));
  const menu = navbar.menu.map((entry) =>
    entry.url === "/what-we-buy" ? { ...entry, items } : entry,
  );
  return <Navbar1 {...navbar} menu={menu} />;
}
