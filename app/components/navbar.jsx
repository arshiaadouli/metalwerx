import { Container, Factory, Truck } from "lucide-react";
import { Navbar1 } from "@/components/ui/shadcnblocks-com-navbar1";

const iconClass = "size-5 shrink-0 text-cherry";

// The What We Buy thumbnails are free stock photos (Unsplash and Pexels
// licenses, no credit required), cropped to 96px squares for 48px display.
// Each item notes its photo's source page.
const unsplash = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=96&h=96&q=70`;
const pexels = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=96&h=96&fit=crop`;

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
    {
      title: "What We Buy",
      url: "/what-we-buy",
      columns: 3,
      items: [
        {
          title: "Aluminium Wheels",
          description: "Alloy rims from cars, utes and trucks",
          // https://www.pexels.com/photo/wheel-mags-on-a-stand-5661682/
          image: { src: pexels(5661682), alt: "Alloy wheels stacked on shelves" },
          url: "/what-we-buy/aluminium-wheels",
        },
        {
          title: "Electric Motors",
          description: "Motors, alternators and starters",
          // https://unsplash.com/photos/gray-ac-motor-2MLhOfRL_hI
          image: {
            src: unsplash("photo-1563456020111-f02d832ae94c"),
            alt: "An old grey electric motor",
          },
          url: "/what-we-buy/electric-motors",
        },
        {
          title: "Brass",
          description: "Taps, fittings, valves and keys",
          // https://www.pexels.com/photo/pile-of-golden-screws-14593018/
          image: { src: pexels(14593018), alt: "A pile of brass screws and nuts" },
          url: "/what-we-buy/brass",
        },
        {
          title: "Scrap Car Parts",
          description: "Engines, gearboxes, radiators and more",
          // https://unsplash.com/photos/pile-of-old-car-engines-and-parts-G-Fno_v4alo
          image: {
            src: unsplash("photo-1767340078189-4258fbb7bd7c"),
            alt: "A pile of old car engines and parts",
          },
          url: "/what-we-buy/scrap-car-parts",
        },
        {
          title: "Scrap Machinery",
          description: "Old farm, factory and workshop equipment",
          // https://unsplash.com/photos/old-industrial-machinery-with-rust-and-debris-BpBT7i3JnoM
          image: {
            src: unsplash("photo-1776254575132-fbc8f3d50210"),
            alt: "Old rusty industrial machinery",
          },
          url: "/what-we-buy/scrap-machinery",
        },
        {
          title: "Stainless Steel",
          description: "Sinks, benches, tanks and offcuts",
          // https://www.pexels.com/photo/container-of-short-stainless-steel-pipes-with-milled-ends-12951634/
          image: { src: pexels(12951634), alt: "Stainless steel pipe offcuts" },
          url: "/what-we-buy/stainless-steel",
        },
        {
          title: "Unwanted Cars",
          description: "Cars, utes and trucks, running or not",
          // https://unsplash.com/photos/a-bunch-of-cars-that-are-sitting-in-the-dirt-GcBoM7B40Ck
          image: {
            src: unsplash("photo-1719242513425-f5eed99b282f"),
            alt: "Old cars in a junkyard",
          },
          url: "/what-we-buy/unwanted-cars",
        },
        {
          title: "Aluminium",
          description: "Cans, extrusions, sheet and castings",
          // https://unsplash.com/photos/crushed-assorted-beverage-cans-lot-k1tUxfs8JYY
          image: {
            src: unsplash("photo-1561503412-852800622772"),
            alt: "Crushed aluminium drink cans",
          },
          url: "/what-we-buy/aluminium",
        },
        {
          title: "Copper",
          description: "Pipe, wire and offcuts",
          // https://www.pexels.com/photo/close-up-photo-of-copper-wires-5279317/
          image: { src: pexels(5279317), alt: "Tangled scrap copper wire" },
          url: "/what-we-buy/copper",
        },
        {
          title: "PVC Wire",
          description: "Insulated copper and household cable",
          // https://unsplash.com/photos/a-colorful-bundle-of-electrical-wires-on-a-light-background-Sbxf5Dbyerk
          image: {
            src: unsplash("photo-1761507320645-b11a00bfcc34"),
            alt: "Colourful insulated electrical wires",
          },
          url: "/what-we-buy/pvc-wire",
        },
        {
          title: "Lead",
          description: "Batteries, flashing and wheel weights",
          // https://unsplash.com/photos/rows-of-batteries-with-red-and-blue-terminals-CH7kRmyBQ4I
          image: {
            src: unsplash("photo-1742899273038-67ff67477663"),
            alt: "Rows of lead-acid batteries",
          },
          url: "/what-we-buy/lead",
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

export default function Navbar() {
  return <Navbar1 {...navbar} />;
}
