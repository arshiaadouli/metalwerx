import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/app/components/json-ld";
import { getPosts } from "@/lib/cms";
import { business } from "@/lib/business";
import { openGraph } from "@/lib/metadata";
import { photoProps } from "@/lib/photo";
import { Button } from "@/components/ui/button";
import { CutTitle, Enter } from "@/components/ui/enter";
import { Reveal } from "@/components/ui/reveal";
import { excerpt, formatDate, isoDate, readingStats } from "../format";
import BlogBody from "./blog-body";

// The whole page must be static HTML, so search engines get the full post in
// the first response. The build fails if anything here would need a request,
// and the first visit to a post added after the build waits for its finished
// page rather than getting a loading skeleton.
export const ensureStatic = "navigation";

// Every post is prerendered at build time, and one added in the CMS later on
// its first visit. Any other slug is a 404.
export async function generateStaticParams() {
  return (await getPosts()).map((blog) => ({ slug: blog.id }));
}

// Shared as an article, with its dates. The cover photo is also the preview
// image, when there is one.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = (await getPosts()).find((post) => post.id === slug);
  if (!blog) return { title: "Post not found" };
  const { cover } = blog;
  return {
    title: blog.title,
    description: excerpt(blog.description),
    openGraph: {
      ...openGraph,
      type: "article",
      publishedTime: blog.date.toISOString(),
      modifiedTime: blog.updated.toISOString(),
      ...(cover && { images: [{ url: cover.src, alt: cover.alt }] }),
    },
  };
}

// How many of the newest posts the sidebar lists.
const LATEST_COUNT = 3;

export default async function BlogPage({ params }) {
  const { slug } = await params;
  const posts = await getPosts();
  const blog = posts.find((post) => post.id === slug);
  if (!blog) notFound();
  // Newest first. It can include this post, which is then marked as the one
  // being read.
  const latest = posts.slice(0, LATEST_COUNT);

  // Large screens widen the page for a sidebar to the right of the post.
  // Smaller ones keep the post's width and put the sidebar after it.
  return (
    <div className="flex-1 bg-surface text-ink">
      <main
        className={`mx-auto w-full max-w-3xl px-6 py-16 font-montserrat sm:py-24 ${
          latest.length > 0 ? "lg:max-w-6xl" : ""
        }`}
      >
        {/* The header plays on load, one step after another (see
            components/ui/enter.jsx). */}
        <Enter step={0}>
          <BackLink />
        </Enter>
        <div className="lg:flex lg:items-start lg:gap-16">
          <div className="min-w-0 lg:flex-1">
            <BlogArticle blog={blog} />
          </div>
          {latest.length > 0 && <LatestPosts posts={latest} currentId={blog.id} />}
        </div>
      </main>
    </div>
  );
}

// The post is also given to search engines as a BlogPosting. Posts don't name
// a writer yet, so the yard is the author, under the same name as in
// app/components/business-json-ld.jsx.
function BlogArticle({ blog }) {
  const { words, minutes } = readingStats(blog.text);
  const url = `${business.url}/blogs/${blog.id}`;
  const yard = { "@type": "Organization", name: business.name, url: business.url };
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.description,
    url,
    mainEntityOfPage: url,
    datePublished: isoDate(blog.date),
    dateModified: blog.updated.toISOString(),
    ...(blog.cover && { image: new URL(blog.cover.src, business.url).href }),
    wordCount: words,
    author: yard,
    publisher: yard,
  };

  return (
    <article className="mt-10">
      <JsonLd data={blogJsonLd} />
      <header>
        <Enter as="p" step={1} className="font-oswald text-sm uppercase tracking-[0.3em] text-cherry">
          Metal Werx Blog
        </Enter>
        <h1 className="mt-3 font-bebas-neue text-6xl leading-none tracking-wide sm:text-7xl">
          <CutTitle step={2}>{blog.title}</CutTitle>
        </h1>
        <Enter step={3} className="mt-6 h-1 w-16 bg-cherry" />
        <Enter
          as="dl"
          step={3}
          className="mt-6 flex flex-wrap gap-x-8 gap-y-3 font-oswald text-sm uppercase tracking-[0.2em]"
        >
          <div className="flex gap-2">
            <dt className="text-ink-muted">Published</dt>
            <dd>
              <time dateTime={isoDate(blog.date)}>{formatDate(blog.date, "full")}</time>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-muted">Reading time</dt>
            <dd>{minutes} min</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-muted">Words</dt>
            <dd>{words}</dd>
          </div>
        </Enter>
      </header>

      {/* Usually the largest thing on the first screen, so it loads first.
          It blurs into focus without moving, like the photo on the About
          page. */}
      {blog.cover && (
        <Enter
          as="img"
          fade
          step={3}
          {...photoProps(
            blog.cover.src,
            "(min-width: 64rem) 47rem, (min-width: 48rem) 45rem, calc(100vw - 3rem)",
          )}
          alt={blog.cover.alt}
          title={blog.title}
          fetchPriority="high"
          className="mt-10 h-auto w-full rounded-lg"
        />
      )}

      <BlogBody paragraphs={blog.paragraphs} />

      <NextSteps />

      <footer className="mt-16 border-t border-line pt-8">
        <BackLink />
      </footer>
    </article>
  );
}

// The newest posts, styled like the cards on /blogs, with the one being read
// outlined. Stays in view while the post scrolls on large screens.
function LatestPosts({ posts, currentId }) {
  return (
    <aside
      aria-labelledby="latest-posts"
      className="mt-16 border-t border-line pt-10 lg:sticky lg:top-8 lg:mt-10 lg:w-72 lg:shrink-0 lg:border-0 lg:pt-0"
    >
      <Reveal>
        <h2
          id="latest-posts"
          className="font-oswald text-sm uppercase tracking-[0.3em] text-cherry"
        >
          Latest posts
        </h2>
        <div className="mt-4 h-1 w-12 bg-cherry" />
      </Reveal>
      {/* Slides in post by post, like the Contact page's links. */}
      <ul className="mt-6 grid gap-4">
        {posts.map((post, i) => {
          const current = post.id === currentId;
          return (
            <Reveal as="li" key={post.id} variant="slide" step={i}>
              <article
                className={`group relative flex gap-4 border bg-panel p-3 transition-colors hover:border-cherry focus-within:border-cherry ${
                  current ? "border-cherry" : "border-line"
                }`}
              >
                {post.cover && (
                  <div className="relative size-20 shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      {...photoProps(post.cover.src, "5rem")}
                      alt={post.cover.alt}
                      title={post.title}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                    />
                  </div>
                )}
                <div className="min-w-0 self-center">
                  <p className="font-oswald text-xs uppercase tracking-[0.2em] text-ink-muted">
                    {current ? (
                      <span className="text-ink-cherry">Reading now</span>
                    ) : (
                      <time dateTime={isoDate(post.date)}>{formatDate(post.date, "medium")}</time>
                    )}
                  </p>
                  <h3 className="mt-1 line-clamp-2 font-bebas-neue text-2xl leading-none tracking-wide text-ink transition-colors group-hover:text-ink-cherry">
                    {/* The ::after overlay makes the whole card clickable, photo included. */}
                    <Link
                      href={`/blogs/${post.id}`}
                      title={post.title}
                      aria-current={current ? "page" : undefined}
                      className="after:absolute after:inset-0 focus-visible:outline-none"
                    >
                      {post.title}
                    </Link>
                  </h3>
                </div>
              </article>
            </Reveal>
          );
        })}
      </ul>
      <Reveal variant="slide" step={posts.length} className="mt-6">
        <Link
          href="/blogs"
          title="All posts"
          className="inline-block font-oswald text-sm uppercase tracking-[0.2em] text-ink-cherry transition-colors hover:text-ink"
        >
          View all posts →
        </Link>
      </Reveal>
    </aside>
  );
}

// Under every post, so each one links on to what the yard buys and the quote
// form.
function NextSteps() {
  return (
    <Reveal
      as="aside"
      aria-labelledby="next-steps"
      className="mt-16 rounded-2xl border border-line bg-panel p-6 sm:p-8"
    >
      <h2 id="next-steps" className="font-bebas-neue text-4xl tracking-wide text-ink">
        Got Scrap to Sell?
      </h2>
      <p className="mt-2 max-w-xl leading-7 text-ink-soft">
        See what we buy at our Hallam yard, or tell us what you have and we&apos;ll give you a
        quote.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Button asChild size="lg" className="font-oswald uppercase tracking-[0.15em]">
          <Link href="/contact-us" title="Get a Quote">
            Get a Quote
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="font-oswald uppercase tracking-[0.15em]"
        >
          <Link href="/what-we-buy" title="What We Buy">
            What We Buy
          </Link>
        </Button>
      </div>
    </Reveal>
  );
}

function BackLink() {
  return (
    <Link
      href="/blogs"
      title="All posts"
      className="font-oswald text-sm uppercase tracking-[0.2em] text-ink-muted transition-colors hover:text-ink-cherry"
    >
      ← All posts
    </Link>
  );
}
