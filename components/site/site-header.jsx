import Image from "next/image";
import Link from "next/link";
import { Menu, Phone } from "lucide-react";

import { MetalIcon } from "@/components/metal/metal";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { YARD } from "@/lib/yard";

// The site header. Props:
//   logo      { url, src, alt, width, height }
//   materials { groups: [{ id, title, items: [{ slug, title, summary, href }] }], href }
//   services  [{ slug, title, summary, href, icon }]
//   links     [{ title, href }]: the plain links after the two menus
//   quote     { text, href }
//   extra     [{ name, href }]: the mobile menu's extra links
// It stays at the top of the screen, so the yard's number is always one tap
// away. Below lg the menus fold into a sheet.
export function SiteHeader({ logo, materials, services, links, quote, extra = [] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-ground">
      <div className="mx-auto flex h-16 w-full max-w-[82.5rem] items-center gap-6 px-5 sm:px-8 lg:h-[4.5rem] lg:gap-8">
        <Logo logo={logo} loading="eager" />

        <NavigationMenu viewport={false} className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>What we buy</NavigationMenuTrigger>
              <NavigationMenuContent>
                <MaterialsPanel materials={materials} />
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ServicesPanel services={services} />
              </NavigationMenuContent>
            </NavigationMenuItem>
            {links.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link href={link.href} className={navLinkClass}>
                    {link.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href={YARD.phoneHref} className="tabular">
              <Phone aria-hidden="true" />
              {YARD.phone}
            </a>
          </Button>
          <Button asChild size="icon" className="sm:hidden">
            <a href={YARD.phoneHref} aria-label={`Call ${YARD.phone}`} title={`Call ${YARD.phone}`}>
              <Phone aria-hidden="true" />
            </a>
          </Button>
          <Button asChild size="sm" variant="outline" className="hidden lg:inline-flex">
            <Link href={quote.href}>
              {quote.text}
            </Link>
          </Button>
          <MobileMenu
            logo={logo}
            materials={materials}
            services={services}
            links={links}
            quote={quote}
            extra={extra}
          />
        </div>
      </div>
    </header>
  );
}

const navLinkClass =
  "inline-flex h-10 items-center rounded-[2px] px-3 text-[0.9375rem] font-semibold text-ink transition-colors duration-150 hover:bg-sunk";

function Logo({ logo, loading, ...props }) {
  return (
    <Link href={logo.url} title="Home" className="shrink-0" {...props}>
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        loading={loading}
        unoptimized
        className="h-8 w-auto lg:h-9 light:brightness-0"
      />
    </Link>
  );
}

function MaterialsPanel({ materials }) {
  return (
    <div className="w-[48rem] xl:w-[58rem]">
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-px bg-rule">
        {materials.groups.map((group, i) => (
          <div key={group.id} className="bg-raised p-5">
            <p className="type-meta text-ink-muted">{group.title}</p>
            <ul className={i === 0 ? "mt-3 grid grid-cols-2 gap-x-4" : "mt-3 grid"}>
              {group.items.map((item) => (
                <li key={item.slug}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className="group/item -mx-2 flex items-center gap-3 rounded-[2px] p-2 transition-colors duration-150 hover:bg-sunk"
                    >
                      <MetalIcon slug={item.slug} className="size-10" />
                      <span className="min-w-0">
                        <span className="block text-[0.9375rem] leading-tight font-bold text-ink">{item.title}</span>
                        <span className="mt-0.5 block text-sm leading-snug text-ink-muted">{item.summary}</span>
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-rule bg-sunk px-5 py-3">
        <p className="text-sm text-ink-soft">Weighed at the yard and paid by bank transfer. Bring photo ID.</p>
        <NavigationMenuLink asChild>
          <Link
            href={materials.href}
            className="text-sm font-bold text-ink underline underline-offset-[0.22em] hover:no-underline"
          >
            Everything we buy
          </Link>
        </NavigationMenuLink>
      </div>
    </div>
  );
}

function ServicesPanel({ services }) {
  return (
    <ul className="grid w-[24rem] gap-px bg-rule">
      {services.map(({ slug, title, summary, href, icon: Icon }) => (
        <li key={slug} className="bg-raised">
          <NavigationMenuLink asChild>
            <Link href={href} className="flex gap-4 p-4 transition-colors duration-150 hover:bg-sunk">
              <span className="grid size-10 shrink-0 place-items-center rounded-[2px] bg-rack text-rack-ink">
                <Icon aria-hidden="true" strokeWidth={1.75} className="size-5" />
              </span>
              <span>
                <span className="block text-[0.9375rem] leading-tight font-bold text-ink">{title}</span>
                <span className="mt-1 block text-sm leading-snug text-ink-muted">{summary}</span>
              </span>
            </Link>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  );
}

function MobileMenu({ logo, materials, services, links, quote, extra }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu aria-hidden="true" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      {/* aria-describedby={undefined} tells Radix it has no description on purpose. */}
      <SheetContent aria-describedby={undefined} className="flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <SheetClose asChild>
              <Logo logo={logo} />
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
        {/* Below lg the desktop nav is hidden, so this is the main nav. */}
        <nav aria-label="Main" className="mt-6 flex flex-1 flex-col">
          <Accordion type="single" collapsible className="border-t border-rule">
            <AccordionItem value="materials" className="border-rule">
              <AccordionTrigger className="py-4 text-lg font-bold">What we buy</AccordionTrigger>
              <AccordionContent>
                <ul className="grid gap-1 pb-2">
                  {materials.groups.flatMap((group) => group.items).map((item) => (
                    <li key={item.slug}>
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 rounded-[2px] p-2 hover:bg-sunk"
                        >
                          <MetalIcon slug={item.slug} className="size-9" />
                          <span className="text-base font-semibold text-ink">{item.title}</span>
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                  <li>
                    <SheetClose asChild>
                      <Link
                        href={materials.href}
                        className="block p-2 text-base font-bold text-ink underline underline-offset-[0.22em]"
                      >
                        Everything we buy
                      </Link>
                    </SheetClose>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="services" className="border-rule">
              <AccordionTrigger className="py-4 text-lg font-bold">Services</AccordionTrigger>
              <AccordionContent>
                <ul className="grid gap-1 pb-2">
                  {services.map(({ slug, title, href, icon: Icon }) => (
                    <li key={slug}>
                      <SheetClose asChild>
                        <Link href={href} className="flex items-center gap-3 rounded-[2px] p-2 hover:bg-sunk">
                          <span className="grid size-9 shrink-0 place-items-center rounded-[2px] bg-rack text-rack-ink">
                            <Icon aria-hidden="true" strokeWidth={1.75} className="size-[1.125rem]" />
                          </span>
                          <span className="text-base font-semibold text-ink">{title}</span>
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <ul>
            {links.map((link) => (
              <li key={link.href} className="border-b border-rule">
                <SheetClose asChild>
                  <Link href={link.href} className="flex py-4 text-lg font-bold text-ink">
                    {link.title}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
          {extra.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {extra.map((link) => (
                <li key={link.href}>
                  <SheetClose asChild>
                    <Link
                      href={link.href}
                      className="text-base text-ink-soft underline underline-offset-[0.22em]"
                    >
                      {link.name}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-auto grid gap-3 pt-8">
            <Button asChild size="lg">
              <a href={YARD.phoneHref} className="tabular">
                <Phone aria-hidden="true" />
                Call {YARD.phone}
              </a>
            </Button>
            <SheetClose asChild>
              <Button asChild size="lg" variant="outline">
                <Link href={quote.href}>
                  {quote.text}
                </Link>
              </Button>
            </SheetClose>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
