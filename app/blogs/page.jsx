import { ViewTransition } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs, Container } from "@/app/services/sections";
import { blogSlug, getBlogs } from "@/lib/blogs";
import { getBlogPage } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";
import BlogViews from "./blog-views";
import { excerpt, formatDate, isoDate, readingStats } from "./format";

// The whole page must be static HTML, so search engines get every post in the
// first response. The build fails if anything here would need a request.
export const ensureStatic = "navigation";

// The title, description and headings are the Blog Page in Strapi.
// getBlogPage is cached, so this and the page share one request.
export async function generateMetadata() {
  const { seo } = await getBlogPage();
  return pageMetadata({ path: "/blogs", title: seo.title, description: seo.description });
}

// The blog is a catalogue of posts: a masthead, then every post on one rail,
// newest first. The Blog Page's eyebrow names the site in the breadcrumbs
// rather than sitting over the heading.
export default async function BlogsPage() {
  const { eyebrow, heading, emptyMessage } = await getBlogPage();

  return (
    <main id="main" className="flex-1 pb-20 sm:pb-28">
      <Container>
        <header className="pt-8 sm:pt-10">
          <Breadcrumbs items={[{ name: eyebrow || "Home", href: "/" }, { name: heading }]} />
          <h1 className="mt-10 type-title text-ink sm:mt-14">{heading}</h1>
        </header>
        {/* getBlogs is cached, so the posts are prerendered with the header. No
            <Suspense> here: React can move a boundary's content into a hidden
            element after the skeleton, which crawlers that don't run JavaScript
            may skip. */}
        <BlogList emptyMessage={emptyMessage} />
      </Container>
    </main>
  );
}

async function BlogList({ emptyMessage }) {
  const blogs = await getBlogs();

  if (blogs.length === 0) {
    return (
      emptyMessage && (
        <p className="mt-12 border-t-2 border-ink pt-6 type-lede text-ink-soft sm:mt-16">{emptyMessage}</p>
      )
    );
  }

  // BlogViews switches between a grid (two columns from sm, three from lg) and
  // a list of ruled rows, by setting data-view on the wrapper it puts around
  // the list. The group-data-[view=...]/blogs classes below follow it.
  return (
    <BlogViews
      summary={`${blogs.length} ${blogs.length === 1 ? "post" : "posts"}`}
      className="mt-12 sm:mt-16"
    >
      <ul className="grid gap-y-12 border-t-2 border-ink pt-8 group-data-[view=grid]/blogs:sm:grid-cols-2 group-data-[view=grid]/blogs:sm:gap-x-8 group-data-[view=grid]/blogs:sm:gap-y-14 group-data-[view=grid]/blogs:lg:grid-cols-3 group-data-[view=list]/blogs:sm:gap-y-0 group-data-[view=list]/blogs:sm:pt-0">
        {blogs.map((blog, i) => (
          <BlogEntry key={blog.id} blog={blog} index={i} />
        ))}
      </ul>
    </BlogViews>
  );
}

// One post in the catalogue, the whole entry a single link named by its
// title. In the grid the cover sits over the text; in the list it is a column
// on the left, on a row ruled off from the next.
function BlogEntry({ blog, index }) {
  const titleId = `post-${blog.id}-title`;
  const { minutes } = readingStats(blog.text);

  return (
    <li className="group-data-[view=list]/blogs:sm:border-b group-data-[view=list]/blogs:sm:border-rule">
      <Link
        href={`/blogs/${blogSlug(blog.title)}`}
        aria-labelledby={titleId}
        className="group flex h-full flex-col gap-5 rounded-[2px] focus-visible:outline-offset-[6px] group-data-[view=list]/blogs:sm:grid group-data-[view=list]/blogs:sm:grid-cols-[15rem_minmax(0,1fr)] group-data-[view=list]/blogs:sm:gap-8 group-data-[view=list]/blogs:sm:py-8 group-data-[view=list]/blogs:lg:grid-cols-[22rem_minmax(0,1fr)] group-data-[view=list]/blogs:lg:gap-12"
      >
        {/* The cover carries across to the post's own page (see the post's
            cover in [slug]/page.jsx). Only the first row of the grid can be on
            the first screen, so the rest load as they're scrolled to. sizes
            covers the larger of the two views: a third of the page or 22rem in
            the list from lg, half the page from sm. */}
        {blog.cover && (
          <ViewTransition name={`post-${blog.id}`} share="metal-morph" default="none">
            <div className="aspect-video overflow-hidden rounded-[2px] bg-sunk">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blog.cover.src}
                srcSet={blog.cover.srcSet}
                sizes="(min-width: 64rem) 25rem, (min-width: 40rem) calc(50vw - 3rem), calc(100vw - 2.5rem)"
                width={blog.cover.width}
                height={blog.cover.height}
                alt={blog.cover.alt}
                loading={index < 3 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
                className="size-full object-cover"
              />
            </div>
          </ViewTransition>
        )}
        {/* A column, so "Read post" lines up along the foot of a row of grid
            entries whose titles wrap differently. */}
        <div className="flex flex-1 flex-col group-data-[view=list]/blogs:sm:max-w-[62ch]">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 type-meta text-ink-muted">
            <time dateTime={isoDate(blog.date)}>{formatDate(blog.date)}</time>
            <span aria-hidden="true" className="h-3.5 w-px bg-rule" />
            <span>{minutes} min read</span>
          </p>
          <h2
            id={titleId}
            className="mt-2.5 type-subheading text-ink underline decoration-transparent decoration-[0.09em] underline-offset-[0.16em] transition-colors duration-150 ease-out-expo group-hover:decoration-ink"
          >
            {blog.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-base text-pretty text-ink-soft">{excerpt(blog.text, 220)}</p>
          <p
            aria-hidden="true"
            className="mt-auto inline-flex items-center gap-2 pt-5 text-[0.9375rem] font-semibold text-ink-soft transition-colors duration-150 ease-out-expo group-hover:text-ink"
          >
            Read post
            <ArrowRight strokeWidth={2.25} className="size-4" />
          </p>
        </div>
      </Link>
    </li>
  );
}
