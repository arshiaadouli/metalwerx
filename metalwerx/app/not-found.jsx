import { NotFoundGlitch } from "@/components/ui/not-found-glitch";

// No canonical URL: the layout's would name /_not-found, and a missing page
// shouldn't claim one.
export const metadata = {
  title: "Page not found",
  alternates: { canonical: null },
};

// Shown for any URL without a page, including the navbar and footer links to
// pages still to be built. Posts that don't exist get app/blogs/[slug]/not-found.jsx.
export default function NotFound() {
  return (
    <main className="flex flex-1 bg-surface font-montserrat text-ink">
      <NotFoundGlitch
        description="This page doesn't exist yet or has moved."
        homeLabel="Back to home"
        browseHref="/contact-us"
        browseLabel="Contact us"
      />
    </main>
  );
}
