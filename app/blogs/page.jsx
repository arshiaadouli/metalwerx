import Link from "next/link";
import { CutTitle, Enter } from "@/components/ui/enter";
import { Reveal } from "@/components/ui/reveal";
import { blogSlug, getBlogs } from "@/lib/blogs";
import { getBlogPage } from "@/lib/pages";
import BlogViews from "./blog-views";
import { formatDate, isoDate, readingStats } from "./format";

// The whole page must be static HTML, so search engines get every post in the
// first response. The build fails if anything here would need a request.
export const ensureStatic = "navigation";

// The title, description and headings are the Blog Page in Strapi.
// getBlogPage is cached, so this and the page share one request.
export async function generateMetadata() {
  const { seo } = await getBlogPage();
  return { title: seo.title, description: seo.description };
}

export default async function BlogsPage() {
  const { eyebrow, heading, emptyMessage } = await getBlogPage();

  return (
    <div className="flex-1 bg-surface text-ink">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 font-montserrat sm:py-24">
        {/* Plays on load, one step after another (see components/ui/enter.jsx). */}
        <header>
          {eyebrow && (
            <Enter as="p" step={0} className="font-oswald text-sm uppercase tracking-[0.3em] text-cherry">
              {eyebrow}
            </Enter>
          )}
          <h1 className="mt-2 font-bebas-neue text-7xl tracking-wide">
            <CutTitle step={1}>{heading}</CutTitle>
          </h1>
          <Enter step={2} className="mt-4 h-1 w-16 bg-cherry" />
        </header>
        {/* getBlogs is cached, so the posts are prerendered with the header. No
            <Suspense> here: React can move a boundary's content into a hidden
            element after the skeleton, which crawlers that don't run JavaScript
            may skip. */}
        <BlogList emptyMessage={emptyMessage} />
      </main>
    </div>
  );
}

async function BlogList({ emptyMessage }) {
  const blogs = await getBlogs();

  if (blogs.length === 0) {
    return emptyMessage && <p className="mt-12 text-ink-soft">{emptyMessage}</p>;
  }

  // BlogViews switches between a grid (two columns from sm, three from lg) and
  // a list of wide cards, by setting data-view on the wrapper it puts around
  // the list. The group-data-[view=...]/blogs classes below follow it.
  return (
    <BlogViews summary={`${blogs.length} ${blogs.length === 1 ? "post" : "posts"}`}>
      <ul className="mt-6 grid gap-6 group-data-[view=grid]/blogs:sm:grid-cols-2 group-data-[view=grid]/blogs:lg:grid-cols-3">
        {/* Each row of the grid plays left to right. */}
        {blogs.map((blog, i) => (
          <Reveal as="li" key={blog.id} step={i % 3}>
            <article className="group relative flex h-full flex-col overflow-hidden border border-line bg-panel transition-colors hover:border-cherry focus-within:border-cherry group-data-[view=list]/blogs:sm:flex-row">
              {/* Above the text in the grid and on phones; in the list, a
                  column on the left that's as tall as the text. Only the first
                  row of the grid can be on the first screen, so the rest load
                  as they're scrolled to. sizes covers the larger of the two
                  views: a third of the page or 24rem in the list from lg, half
                  the page from sm. */}
              {blog.cover && (
                <div className="relative aspect-video shrink-0 overflow-hidden group-data-[view=list]/blogs:sm:aspect-auto group-data-[view=list]/blogs:sm:w-72 group-data-[view=list]/blogs:lg:w-96">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={blog.cover.src}
                    srcSet={blog.cover.srcSet}
                    sizes="(min-width: 64rem) 24rem, (min-width: 40rem) calc(50vw - 2.25rem), calc(100vw - 3rem)"
                    alt={blog.cover.alt}
                    title={blog.title}
                    loading={i < 3 ? "eager" : "lazy"}
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                </div>
              )}
              {/* A column, so "Read post" lines up along the bottom of a row
                  of grid cards whose titles wrap differently. */}
              <div className="flex flex-1 flex-col p-6 group-data-[view=list]/blogs:sm:p-8">
                <p className="font-oswald text-xs uppercase tracking-[0.2em] text-ink-muted">
                  <time dateTime={isoDate(blog.date)}>{formatDate(blog.date)}</time>
                  {" · "}
                  {readingStats(blog.text).minutes} min read
                </p>
                <h2 className="mt-3 font-bebas-neue text-4xl tracking-wide text-ink transition-colors group-hover:text-ink-cherry group-data-[view=grid]/blogs:sm:text-3xl">
                  {/* The ::after overlay makes the whole card clickable, photo included. */}
                  <Link
                    href={`/blogs/${blogSlug(blog.title)}`}
                    title={blog.title}
                    className="after:absolute after:inset-0 focus-visible:outline-none"
                  >
                    {blog.title}
                  </Link>
                </h2>
                <p className="mt-3 line-clamp-3 leading-7 text-ink-soft">{blog.text}</p>
                <p
                  aria-hidden="true"
                  className="mt-auto pt-5 font-oswald text-sm uppercase tracking-[0.2em] text-cherry"
                >
                  Read post →
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </BlogViews>
  );
}
