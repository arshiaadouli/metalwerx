import { ViewTransition } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Breadcrumbs, Container, CtaBand } from "@/app/services/sections";
import { blogSlug, getBlogBySlug, getBlogs } from "@/lib/blogs";
import { getBlogPage } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { excerpt, formatDate, isoDate, readingStats } from "../format";
import BlogBody from "./blog-body";

// The whole page must be static HTML, so search engines get the full post in
// the first response. The build fails if anything here would need a request,
// and the first visit to a post added after the build waits for its finished
// page rather than getting a loading skeleton.
export const ensureStatic = "navigation";

// Every post is prerendered at build time. A post added later is rendered on
// its first visit and served from the cache after that.
export async function generateStaticParams() {
  const blogs = await getBlogs();
  // Cache Components fails the build if this returns no params, so with no
  // posts yet, prerender one slug that matches nothing and shows the 404.
  if (blogs.length === 0) return [{ slug: "no-posts-yet" }];
  return blogs.map((blog) => ({ slug: blogSlug(blog.title) }));
}

// getBlogBySlug is cached, so this and the page share one request to Strapi.
// The cover photo is also the preview image when the post is shared; a post
// without one shows the site's default.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Post not found" };
  const { cover } = blog;
  return pageMetadata({
    path: `/blogs/${slug}`,
    title: blog.title,
    description: excerpt(blog.text),
    image: cover && { url: cover.src, width: cover.width, height: cover.height, alt: cover.alt },
    openGraph: { type: "article", publishedTime: isoDate(blog.date) },
  });
}

// How many of the newest posts the sidebar lists.
const LATEST_COUNT = 3;

// No <Suspense> around the post: React can move a boundary's content into a
// hidden element after the skeleton, which crawlers that don't run JavaScript
// may skip.
export default async function BlogPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();
  // The links back to the list carry the Blog Page's postEyebrow from Strapi.
  const { postEyebrow } = await getBlogPage();
  const listLabel = postEyebrow || "Blog";
  // getBlogs is cached and newest first, so the sidebar is prerendered too. It
  // leaves out this post, whose title is already the page's h1: SEO audits
  // flag a heading that repeats.
  const latest = (await getBlogs()).filter((post) => post.id !== blog.id).slice(0, LATEST_COUNT);

  // Large screens put the newest posts in a column to the right of the post,
  // where they stay in view as it scrolls. Smaller ones list them after it.
  return (
    <main id="main" className="flex-1">
      <Container className="pt-8 pb-20 sm:pt-10 sm:pb-28">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: listLabel, href: "/blogs" },
          ]}
        />
        <div
          className={cn(
            "mt-10 sm:mt-14",
            latest.length > 0 &&
              "lg:grid lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start lg:gap-16 xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-24",
          )}
        >
          <BlogArticle blog={blog} listLabel={listLabel} />
          {latest.length > 0 && <LatestPosts posts={latest} />}
        </div>
      </Container>
      <CtaBand
        heading="Got scrap to sell?"
        text="Tell us what you've got and we'll give you a price."
        cta={{ text: "Get a quote", href: "/contact-us" }}
      />
    </main>
  );
}

function BlogArticle({ blog, listLabel }) {
  const { words, minutes } = readingStats(blog.text);

  return (
    <article aria-labelledby="post-title" className="min-w-0">
      <header>
        <h1 id="post-title" className="type-title text-ink">
          {blog.title}
        </h1>
        {/* Set like a weigh ticket: each figure in its own ruled cell. */}
        <dl className="mt-8 grid w-fit max-w-full grid-cols-[repeat(3,auto)] border-y border-rule sm:mt-10">
          <MetaItem term="Published">
            <time dateTime={isoDate(blog.date)}>{formatDate(blog.date)}</time>
          </MetaItem>
          <MetaItem term="Reading time">{minutes} min</MetaItem>
          <MetaItem term="Words">{new Intl.NumberFormat("en-AU").format(words)}</MetaItem>
        </dl>
      </header>

      {/* Usually the largest thing on the first screen, so it loads first. A
          plain <img>, like the body's photos, so no next.config remotePatterns
          entry is needed for the Strapi server. It carries across from the
          post's entry on /blogs, which crops it to the same 16:9. */}
      {blog.cover && (
        <ViewTransition name={`post-${blog.id}`} share="metal-morph" default="none">
          <div className="mt-10 aspect-video overflow-hidden rounded-[2px] bg-sunk sm:mt-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blog.cover.src}
              srcSet={blog.cover.srcSet}
              sizes="(min-width: 82.5rem) 53.5rem, (min-width: 64rem) calc(100vw - 25rem), (min-width: 40rem) calc(100vw - 4rem), calc(100vw - 2.5rem)"
              width={blog.cover.width}
              height={blog.cover.height}
              alt={blog.cover.alt}
              fetchPriority="high"
              className="size-full object-cover"
            />
          </div>
        </ViewTransition>
      )}

      <BlogBody blocks={blog.body} />

      {/* As wide as the body above it: the same measure at the same size.
          "Back to the …", so it doesn't repeat the breadcrumb's link text. */}
      <footer className="mt-16 max-w-[54ch] border-t border-rule pt-4 text-lg">
        <Link
          href="/blogs"
          className="-ml-0.5 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-ink underline-offset-[0.22em] hover:underline"
        >
          <ArrowLeft aria-hidden="true" strokeWidth={2.25} className="size-[1.125rem]" />
          Back to the {listLabel}
        </Link>
      </footer>
    </article>
  );
}

function MetaItem({ term, children }) {
  return (
    <div className="py-3 pr-5 not-first:border-l not-first:border-rule not-first:pl-5 sm:pr-8 sm:not-first:pl-8">
      <dt className="type-meta text-ink-muted">{term}</dt>
      <dd className="mt-0.5 type-meta text-ink">{children}</dd>
    </div>
  );
}

// The newest of the other posts on a rail. Stays in view while the post
// scrolls on large screens.
function LatestPosts({ posts }) {
  return (
    <aside aria-labelledby="latest-posts" className="mt-20 lg:sticky lg:top-24 lg:mt-0">
      <h2 id="latest-posts" className="type-subheading text-ink">
        Latest posts
      </h2>
      <ul className="mt-4 border-t-2 border-ink">
        {posts.map((post) => (
          <li key={post.id} className="border-b border-rule">
            <Link
              href={`/blogs/${blogSlug(post.title)}`}
              className="group flex min-h-11 gap-4 py-4 focus-visible:outline-offset-2"
            >
              {post.cover && (
                <div className="aspect-[4/3] w-24 shrink-0 self-start overflow-hidden rounded-[2px] bg-sunk">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.cover.src}
                    srcSet={post.cover.srcSet}
                    sizes="6rem"
                    alt={post.cover.alt}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="type-meta text-ink-muted">
                  <time dateTime={isoDate(post.date)}>{formatDate(post.date, "medium")}</time>
                </p>
                <h3 className="mt-1 line-clamp-3 text-base leading-snug font-bold text-ink underline decoration-transparent decoration-1 underline-offset-[0.2em] transition-colors duration-150 ease-out-expo [font-stretch:104%] group-hover:decoration-ink">
                  {post.title}
                </h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/blogs"
        className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-ink underline-offset-[0.22em] hover:underline"
      >
        All posts
        <ArrowRight aria-hidden="true" strokeWidth={2.25} className="size-[1.125rem]" />
      </Link>
    </aside>
  );
}
