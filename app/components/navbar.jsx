import { Anvil, Battery, Cable, Car, Container, Factory, Truck } from "lucide-react";
import { Navbar1 } from "@/components/ui/shadcnblocks-com-navbar1";

const iconClass = "size-5 shrink-0 text-cherry";

// Only / and /blogs exist so far; the other links are placeholders for pages
// still to be built.
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
    {
      title: "What We Buy",
      url: "/what-we-buy",
      items: [
        {
          title: "Ferrous Metals",
          description: "Steel, cast iron and mixed heavy scrap",
          icon: <Anvil className={iconClass} />,
          url: "/what-we-buy#ferrous",
        },
        {
          title: "Non-Ferrous Metals",
          description: "Copper, brass, aluminium and stainless steel",
          icon: <Cable className={iconClass} />,
          url: "/what-we-buy#non-ferrous",
        },
        {
          title: "Car Bodies",
          description: "Unwanted cars, utes and trucks",
          icon: <Car className={iconClass} />,
          url: "/what-we-buy#cars",
        },
        {
          title: "Batteries",
          description: "Lead-acid car and truck batteries",
          icon: <Battery className={iconClass} />,
          url: "/what-we-buy#batteries",
        },
      ],
    },
    {
      title: "Services",
      url: "/services",
      items: [
        {
          title: "Bin Hire",
          description: "Scrap bins dropped at your site and collected when full",
          icon: <Container className={iconClass} />,
          url: "/services#bin-hire",
        },
        {
          title: "Pickup & Collection",
          description: "Bulk scrap collected from homes, farms and businesses",
          icon: <Truck className={iconClass} />,
          url: "/services#collection",
        },
        {
          title: "Commercial Recycling",
          description: "Ongoing scrap removal for workshops and builders",
          icon: <Factory className={iconClass} />,
          url: "/services#commercial",
        },
      ],
    },
    { title: "Blog", url: "/blogs" },
    { title: "About", url: "/about" },
    { title: "Contact", url: "/contact-us" },
  ],
  mobileExtraLinks: [
    { name: "Opening Hours", url: "/contact#hours" },
    { name: "Find Us", url: "/contact#location" },
  ],
  // Navbar1 calls its two buttons login/signup; here they're the yard's calls to action.
  auth: {
    login: { text: "Scrap Prices", url: "/prices" },
    signup: { text: "Get a Quote", url: "/contact" },
  },
};

export default function Navbar() {
  return <Navbar1 {...navbar} />;
}
