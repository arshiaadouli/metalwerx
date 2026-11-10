import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Container, Factory, Menu, Truck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getMaterials, getWhatWeBuyPage } from "@/app/what-we-buy/materials";
import { openingHours } from "@/lib/business";
import { photoProps } from "@/lib/photo";

// The site header, from Navbar1 on shadcnblocks.com: the logo, the menu and two
// buttons, as a bar from lg up and a slide-out sheet below it. A menu entry
// with items opens a dropdown (an accordion in the sheet) of { title,
// description, url } items, each with an icon or a photo thumbnail, under a
// link to the entry's own page; from lg up the entry's label is that link too,
// with the dropdown opening on hover. The What We Buy items come from the CMS
// (see Navbar below); the Services items are written here, so a service added
// in the CMS needs an entry here too.

const logo = {
  src: "/logo.png",
  alt: "Metal Werx Scrap Metal Recycling",
  // Display size; logo.png is 4726×985, the same 4.8:1 ratio.
  width: 192,
  height: 40,
};

const iconClass = "size-5 shrink-0 text-cherry";

const services = [
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
];

// Under the menu in the sheet. /contact-us only has its #hours section once
// the hours are filled in lib/business.js, so the link to it waits for them too.
const extraLinks = [
  ...(openingHours.length > 0 ? [{ name: "Opening Hours", url: "/contact-us#hours" }] : []),
  { name: "Find Us", url: "/contact-us#location" },
];

const buttons = [
  { text: "Scrap Prices", url: "/prices", outline: true },
  { text: "Get a Quote", url: "/contact-us" },
];

const buttonClassName = "font-oswald uppercase tracking-[0.15em]";

// The What We Buy menu lists the materials in the CMS in their order on
// /what-we-buy, each with its header photo as a 48px thumbnail. Its summary is
// the item's description, without the full stop.
export default async function Navbar() {
  const [{ groups }, materials] = await Promise.all([getWhatWeBuyPage(), getMaterials()]);
  const order = groups.flatMap((group) => group.slugs);
  const rank = (slug) => (order.includes(slug) ? order.indexOf(slug) : order.length);
  const menu = [
    { title: "Home", url: "/" },
    {
      title: "What We Buy",
      url: "/what-we-buy",
      columns: 3,
      allLabel: "All materials",
      items: materials
        .toSorted((a, b) => rank(a.slug) - rank(b.slug))
        .map(({ slug, title, summary, image }) => ({
          title,
          description: summary.replace(/\.$/, ""),
          image,
          url: `/what-we-buy/${slug}`,
        })),
    },
    { title: "Services", url: "/services", allLabel: "All services", items: services },
    { title: "Blog", url: "/blogs" },
    { title: "About", url: "/about" },
  ];

  return (
    // z-40 keeps the dropdown above page content (e.g. the hero's z-10 copy) but under portaled overlays (z-50).
    <header className="relative z-40 border-b py-4 font-montserrat">
      <div className="mx-auto max-w-7xl px-6">
        {/* A div, not a nav: NavigationMenu renders its own <nav aria-label="Main">. */}
        <div className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Logo loading="eager" />
            <div className="flex items-center">
              <NavigationMenu viewport={false}>
                <NavigationMenuList>
                  {menu.map((item) => (
                    <MenuItem key={item.title} item={item} />
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {buttons.map(({ text, url, outline }) => (
              <Button
                key={url}
                asChild
                variant={outline ? "outline" : "default"}
                size="sm"
                className={buttonClassName}
              >
                <Link href={url} title={text}>
                  {text}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between lg:hidden">
          <Logo loading="eager" />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            {/* The sheet is portaled to <body>, so it restates the header's font.
                aria-describedby={undefined} tells Radix it has no description on purpose. */}
            <SheetContent className="overflow-y-auto font-montserrat" aria-describedby={undefined}>
              <SheetHeader>
                <SheetTitle>
                  <SheetClose asChild>
                    <Logo />
                  </SheetClose>
                </SheetTitle>
              </SheetHeader>
              {/* Below lg the desktop nav is hidden, so this is the main nav. */}
              <nav aria-label="Main" className="my-6 flex flex-col gap-6">
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col gap-4 font-oswald uppercase tracking-[0.15em]"
                >
                  {menu.map((item) => (
                    <MobileMenuItem key={item.title} item={item} />
                  ))}
                </Accordion>
                <div className="border-t py-4">
                  <div className="grid grid-cols-2 justify-start">
                    {extraLinks.map((link) => (
                      <SheetClose asChild key={link.url}>
                        <Link
                          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                          href={link.url}
                          title={link.name}
                        >
                          {link.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {buttons.map(({ text, url, outline }) => (
                    <SheetClose asChild key={url}>
                      <Button
                        asChild
                        variant={outline ? "outline" : "default"}
                        className={buttonClassName}
                      >
                        <Link href={url} title={text}>
                          {text}
                        </Link>
                      </Button>
                    </SheetClose>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// Extra props (e.g. onClick from SheetClose) go to the link.
function Logo({ loading, ...props }) {
  return (
    <Link href="/" title={logo.alt} className="flex items-center gap-2" {...props}>
      <Image
        src={logo.src}
        alt={logo.alt}
        title={logo.alt}
        width={logo.width}
        height={logo.height}
        loading={loading}
        className="h-8 w-auto lg:h-10 light:brightness-0"
      />
    </Link>
  );
}

// A 48px thumbnail, resized by Next's image optimizer (see lib/photo.js), or
// the item's icon.
function ItemMedia({ item }) {
  return item.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...photoProps(item.image.src, "48px")}
      alt={item.image.alt}
      title={item.image.alt}
      loading="lazy"
      className="size-12 shrink-0 self-center rounded-md object-cover"
    />
  ) : (
    item.icon
  );
}

// `columns: 2` lays a long dropdown out in two columns; `columns: 3` does too
// at lg, then three from xl, where the wider panel fits beside the logo.
const dropdownLayout = {
  1: "w-80",
  2: "grid w-[40rem] grid-cols-2",
  3: "grid w-[40rem] grid-cols-2 xl:w-[56rem] xl:grid-cols-3",
};

// The "All services" link at the top of a dropdown.
const allLinkClassName =
  "flex select-none items-center justify-between gap-4 rounded-md p-3 text-sm font-semibold leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground focus-visible:bg-muted";

const itemClassName =
  "flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground focus-visible:bg-muted";

function MenuItem({ item }) {
  if (!item.items) {
    return (
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 font-oswald text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
            href={item.url}
            title={item.title}
          >
            {item.title}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  }
  return (
    <NavigationMenuItem className="text-muted-foreground">
      <NavigationMenuTrigger
        href={item.url}
        title={item.title}
        className="font-oswald uppercase tracking-[0.15em]"
      >
        {item.title}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className={`${dropdownLayout[item.columns ?? 1]} p-3`}>
          <li className="col-span-full">
            <NavigationMenuLink asChild>
              <Link className={allLinkClassName} href={item.url} title={item.allLabel}>
                {item.allLabel}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </NavigationMenuLink>
          </li>
          {item.items.map((subItem) => (
            <li key={subItem.title}>
              <NavigationMenuLink asChild>
                <Link className={itemClassName} href={subItem.url} title={subItem.title}>
                  <ItemMedia item={subItem} />
                  <div>
                    <div className="text-sm font-semibold">{subItem.title}</div>
                    <p className="mt-1 text-sm leading-snug text-muted-foreground">
                      {subItem.description}
                    </p>
                  </div>
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function MobileMenuItem({ item }) {
  if (!item.items) {
    return (
      <SheetClose asChild>
        <Link href={item.url} title={item.title} className="font-semibold">
          {item.title}
        </Link>
      </SheetClose>
    );
  }
  return (
    <AccordionItem value={item.title} className="border-b-0">
      <AccordionTrigger className="py-0 font-semibold uppercase hover:no-underline">
        {item.title}
      </AccordionTrigger>
      <AccordionContent className="mt-2 font-montserrat normal-case tracking-normal">
        <SheetClose asChild>
          <Link className={allLinkClassName} href={item.url} title={item.allLabel}>
            {item.allLabel}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </SheetClose>
        {item.items.map((subItem) => (
          <SheetClose asChild key={subItem.title}>
            <Link className={itemClassName} href={subItem.url} title={subItem.title}>
              <ItemMedia item={subItem} />
              <div>
                <div className="text-sm font-semibold">{subItem.title}</div>
                <p className="mt-1 text-sm leading-snug text-muted-foreground">
                  {subItem.description}
                </p>
              </div>
            </Link>
          </SheetClose>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
