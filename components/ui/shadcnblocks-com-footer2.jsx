import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

// Footer2 from shadcnblocks.com, ported to JSX. Props:
//   logo        { url, src, alt, width, height }
//   description string
//   sections    [{ title, links: [{ name, href }] }]
//   copyright   node
//   legalLinks  [{ name, href }]
//   className   string
// The grid has room for the logo column plus four sections; extras are dropped.
const MAX_SECTIONS = 4;

const Footer2 = ({
  logo,
  description,
  sections = [],
  copyright,
  legalLinks = [],
  className,
}) => {
  const visibleSections = sections.slice(0, MAX_SECTIONS);

  return (
    <footer className={cn("border-t py-16 font-montserrat", className)}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          <div className="col-span-2 mb-8 lg:mb-0">
            {logo && (
              <Link href={logo.url} title={logo.alt} className="inline-flex items-center">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="h-10 w-auto light:brightness-0"
                />
              </Link>
            )}
            {description && (
              <p className="mt-4 max-w-sm text-sm font-medium text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {visibleSections.map((section) => (
            <div key={section.title}>
              {/* h2, not h3: the footer follows pages whose only heading is the h1. */}
              <h2 className="mb-4 font-oswald text-sm font-semibold uppercase tracking-[0.15em]">
                {section.title}
              </h2>
              <ul className="space-y-4 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.name} className="font-medium">
                    <Link
                      href={link.href}
                      title={link.name}
                      className="transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t pt-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center">
          <p>{copyright}</p>
          {legalLinks.length > 0 && (
            <ul className="flex gap-4">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    title={link.name}
                    className="underline transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
};

export { Footer2 };
