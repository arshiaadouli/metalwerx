import { Suspense } from "react";
import Link from "next/link";
import { blogSlug, getBlogs } from "@/lib/blogs";
import { formatDate, isoDate, readingStats } from "./format";

export const metadata = {
  title: "Scrap Metal Recycling Blog",
  description:
    "News, recycling tips and scrap metal updates from the team at Metal Werx Scrap Metal Recycling.",
};

export default function BlogsPage() {
  return (
    <div className="flex-1 bg-carbon text-chrome">
      <main className="mx-auto w-full max-w-4xl px-6 py-16 font-montserrat sm:py-24">
        <header>
          <p className="font-oswald text-sm uppercase tracking-[0.3em] text-cherry">Metalwerx</p>
          <h1 className="mt-2 font-bebas-neue text-7xl tracking-wide">Blog</h1>
          <div className="mt-4 h-1 w-16 bg-cherry" />
        </header>
        {/* The header is prerendered; the posts are read from MongoDB on each request. */}
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  );
}

async function BlogList() {
  const blogs = await getBlogs();

  if (blogs.length === 0) {
    return <p className="mt-12 text-aluminium">No posts yet.</p>;
  }

  return (
    <>
      <p className="mt-10 font-oswald text-sm uppercase tracking-[0.2em] text-steel">
        {blogs.length} {blogs.length === 1 ? "post" : "posts"}
      </p>
      <ul className="mt-6 grid gap-6">
        {blogs.map((blog) => (
          <li key={blog.id}>
            <article className="group relative border border-gunmetal bg-mill-scale p-6 transition-colors hover:border-cherry focus-within:border-cherry sm:p-8">
              <p className="font-oswald text-xs uppercase tracking-[0.2em] text-steel">
                <time dateTime={isoDate(blog.date)}>{formatDate(blog.date)}</time>
                {" · "}
                {readingStats(blog.body).minutes} min read
              </p>
              <h2 className="mt-3 font-bebas-neue text-4xl tracking-wide text-chrome transition-colors group-hover:text-cherry-bright">
                {/* The ::after overlay makes the whole card clickable. */}
                <Link
                  href={`/blogs/${blogSlug(blog.title)}`}
                  className="after:absolute after:inset-0 focus-visible:outline-none"
                >
                  {blog.title}
                </Link>
              </h2>
              <p className="mt-3 line-clamp-3 leading-7 text-aluminium">{blog.body}</p>
              <p
                aria-hidden="true"
                className="mt-5 font-oswald text-sm uppercase tracking-[0.2em] text-cherry"
              >
                Read post →
              </p>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}

function BlogListSkeleton() {
  return (
    <div className="mt-10">
      <p className="sr-only">Loading posts…</p>
      <div className="h-4 w-20 animate-pulse bg-gunmetal" />
      <div className="mt-6 grid gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-pulse space-y-4 border border-gunmetal bg-mill-scale p-6 sm:p-8">
            <div className="h-3 w-40 bg-gunmetal" />
            <div className="h-8 w-2/3 bg-gunmetal" />
            <div className="h-4 w-full bg-gunmetal" />
            <div className="h-4 w-5/6 bg-gunmetal" />
          </div>
        ))}
      </div>
    </div>
  );
}
