import { Suspense, cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/lib/blogs";
import { excerpt, formatDate, isoDate, readingStats } from "../format";

// Shared by generateMetadata and the page, so each request queries MongoDB once.
const getBlogForRequest = cache(getBlogBySlug);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogForRequest(slug);
  if (!blog) return { title: "Post not found" };
  return { title: blog.title, description: excerpt(blog.body) };
}

export default function BlogPage({ params }) {
  return (
    <div className="flex-1 bg-surface text-ink">
      <main className="mx-auto w-full max-w-3xl px-6 py-16 font-montserrat sm:py-24">
        <BackLink />
        {/* The back link is prerendered; the post is read from MongoDB on each request. */}
        <Suspense fallback={<BlogSkeleton />}>
          <BlogArticle params={params} />
        </Suspense>
      </main>
    </div>
  );
}

async function BlogArticle({ params }) {
  const { slug } = await params;
  const blog = await getBlogForRequest(slug);
  if (!blog) notFound();

  const { words, minutes } = readingStats(blog.body);
  // Blank lines in the body separate paragraphs.
  const paragraphs = blog.body.split(/\n\s*\n/);

  return (
    <article className="mt-10">
      <header>
        <p className="font-oswald text-sm uppercase tracking-[0.3em] text-cherry">Metalwerx Blog</p>
        <h1 className="mt-3 font-bebas-neue text-6xl leading-none tracking-wide sm:text-7xl">
          {blog.title}
        </h1>
        <div className="mt-6 h-1 w-16 bg-cherry" />
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 font-oswald text-sm uppercase tracking-[0.2em]">
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
        </dl>
      </header>

      <div className="mt-10 space-y-6 border-t border-line pt-10 text-lg leading-8 text-ink-soft">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      <footer className="mt-16 border-t border-line pt-8">
        <BackLink />
      </footer>
    </article>
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

function BlogSkeleton() {
  return (
    <div className="mt-10 animate-pulse">
      <p className="sr-only">Loading post…</p>
      <div className="h-3 w-32 bg-well" />
      <div className="mt-4 h-14 w-3/4 bg-well" />
      <div className="mt-6 h-1 w-16 bg-well" />
      <div className="mt-6 h-4 w-2/3 bg-well" />
      <div className="mt-10 space-y-3 border-t border-line pt-10">
        <div className="h-5 w-full bg-well" />
        <div className="h-5 w-full bg-well" />
        <div className="h-5 w-2/3 bg-well" />
      </div>
    </div>
  );
}
