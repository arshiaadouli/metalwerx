import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

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

// Navbar1 from shadcnblocks.com, ported to JSX. Props:
//   logo             { url, src, alt, width, height, title? }
//   menu             [{ title, url, description?, icon?, items?: [same shape] }]
//   mobileExtraLinks [{ name, url }]
//   auth             { login: { text, url }, signup: { text, url } }
// Items with `items` open a dropdown on desktop and an accordion on mobile.
const Navbar1 = ({ logo, menu = [], mobileExtraLinks = [], auth }) => {
  return (
    // z-40 keeps the dropdown above page content (e.g. the hero's z-10 copy) but under portaled overlays (z-50).
    <header className="relative z-40 border-b py-4 font-montserrat">
      <div className="mx-auto max-w-7xl px-6">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <NavbarLogo logo={logo} loading="eager" />
            <div className="flex items-center">
              <NavigationMenu viewport={false}>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          {auth && (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="font-oswald uppercase tracking-[0.15em]">
                <Link href={auth.login.url} title={auth.login.text}>
                  {auth.login.text}
                </Link>
              </Button>
              <Button asChild size="sm" className="font-oswald uppercase tracking-[0.15em]">
                <Link href={auth.signup.url} title={auth.signup.text}>
                  {auth.signup.text}
                </Link>
              </Button>
            </div>
          )}
        </nav>
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <NavbarLogo logo={logo} loading="eager" />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              {/* The sheet is portaled to <body>, so it restates the header's font.
                  aria-describedby={undefined} tells Radix it has no description on purpose. */}
              <SheetContent
                className="overflow-y-auto font-montserrat"
                aria-describedby={undefined}
              >
                <SheetHeader>
                  <SheetTitle>
                    <SheetClose asChild>
                      <NavbarLogo logo={logo} />
                    </SheetClose>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-6 flex flex-col gap-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4 font-oswald uppercase tracking-[0.15em]"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                  {mobileExtraLinks.length > 0 && (
                    <div className="border-t py-4">
                      <div className="grid grid-cols-2 justify-start">
                        {mobileExtraLinks.map((link) => (
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
                  )}
                  {auth && (
                    <div className="flex flex-col gap-3">
                      <SheetClose asChild>
                        <Button asChild variant="outline" className="font-oswald uppercase tracking-[0.15em]">
                          <Link href={auth.login.url} title={auth.login.text}>
                            {auth.login.text}
                          </Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild className="font-oswald uppercase tracking-[0.15em]">
                          <Link href={auth.signup.url} title={auth.signup.text}>
                            {auth.signup.text}
                          </Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

// Extra props (e.g. loading, or onClick from SheetClose) go to the link.
const NavbarLogo = ({ logo, loading, ...props }) => (
  <Link
    href={logo.url}
    title={logo.alt}
    className="flex items-center gap-2"
    {...props}
  >
    <Image
      src={logo.src}
      alt={logo.alt}
      title={logo.alt}
      width={logo.width}
      height={logo.height}
      loading={loading}
      className="h-8 w-auto lg:h-10 light:brightness-0"
    />
    {logo.title && <span className="text-lg font-semibold">{logo.title}</span>}
  </Link>
);

const renderMenuItem = (item) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground">
        <NavigationMenuTrigger className="font-oswald uppercase tracking-[0.15em]">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3">
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                <NavigationMenuLink asChild>
                  <Link
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground focus-visible:bg-muted"
                    href={subItem.url}
                    title={subItem.title}
                  >
                    {subItem.icon}
                    <div>
                      <div className="text-sm font-semibold">
                        {subItem.title}
                      </div>
                      {subItem.description && (
                        <p className="mt-1 text-sm leading-snug text-muted-foreground">
                          {subItem.description}
                        </p>
                      )}
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

  return (
    <NavigationMenuItem key={item.title}>
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
};

const renderMobileMenuItem = (item) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold uppercase hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2 font-montserrat normal-case tracking-normal">
          {item.items.map((subItem) => (
            <SheetClose asChild key={subItem.title}>
              <Link
                className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground focus-visible:bg-muted"
                href={subItem.url}
                title={subItem.title}
              >
                {subItem.icon}
                <div>
                  <div className="text-sm font-semibold">{subItem.title}</div>
                  {subItem.description && (
                    <p className="mt-1 text-sm leading-snug text-muted-foreground">
                      {subItem.description}
                    </p>
                  )}
                </div>
              </Link>
            </SheetClose>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <SheetClose asChild key={item.title}>
      <Link href={item.url} title={item.title} className="font-semibold">
        {item.title}
      </Link>
    </SheetClose>
  );
};

export { Navbar1 };
