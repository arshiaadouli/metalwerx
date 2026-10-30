"use client"; // Error boundaries must be Client Components

// Shown when the blog list or a post fails to render.
// The real error is logged in the server terminal.
export default function BlogError({ retry }) {
  return (
    <div className="flex-1 bg-surface text-ink">
      <main className="mx-auto w-full max-w-3xl px-6 py-16 font-montserrat sm:py-24">
        <h1 className="font-bebas-neue text-6xl tracking-wide">Couldn&apos;t load the blog</h1>
        <p className="mt-4 text-ink-soft">
          Something went wrong while loading posts. Please try again.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-8 bg-cherry px-6 py-3 font-oswald text-sm uppercase tracking-[0.2em] text-chrome transition-colors hover:bg-cherry-bright"
        >
          Try again
        </button>
      </main>
    </div>
  );
}
