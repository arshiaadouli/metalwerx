"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { RotateCw } from "lucide-react";
import { Container } from "@/app/services/sections";
import { Button } from "@/components/ui/button";
import EmptyBay from "./empty-bay";

// Shown when the blog list or a post fails to load, e.g. Strapi is unreachable.
// The real error is logged in the server terminal. Nothing came through, so
// the whole slice of the rack is empty.
export default function BlogError({ retry }) {
  return (
    <main id="main" className="flex-1">
      <Container className="grid gap-12 py-16 sm:gap-14 sm:py-24 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-16 lg:py-32">
        <div>
          <h1 className="type-title text-ink">Couldn&apos;t load the blog</h1>
          <p className="mt-6 max-w-[40ch] type-lede text-ink-soft">
            Something went wrong while loading posts. Please try again.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button type="button" size="lg" variant="outline" onClick={() => retry()}>
              <RotateCw aria-hidden="true" />
              Try again
            </Button>
            <Button asChild size="lg" variant="quiet">
              <Link href="/blogs">
                All posts
              </Link>
            </Button>
            <Button asChild size="lg" variant="quiet">
              <Link href="/">
                Back to home
              </Link>
            </Button>
          </div>
        </div>
        <EmptyBay label="Couldn't load posts" stocked={false} />
      </Container>
    </main>
  );
}
