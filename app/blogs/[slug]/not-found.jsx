import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="flex-1 bg-carbon text-chrome">
      <main className="mx-auto w-full max-w-3xl px-6 py-16 font-montserrat sm:py-24">
        <p className="font-oswald text-sm uppercase tracking-[0.3em] text-cherry">404</p>
        <h1 className="mt-2 font-bebas-neue text-6xl tracking-wide">Post not found</h1>
        <p className="mt-4 text-aluminium">This post doesn&apos;t exist or has been deleted.</p>
        <Link
          href="/blogs"
          className="mt-8 inline-block font-oswald text-sm uppercase tracking-[0.2em] text-steel transition-colors hover:text-cherry-bright"
        >
          ← All posts
        </Link>
      </main>
    </div>
  );
}
