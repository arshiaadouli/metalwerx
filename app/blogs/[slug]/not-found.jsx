import Link from "next/link";
import { Container } from "@/app/services/sections";
import { Button } from "@/components/ui/button";
import EmptyBay from "../empty-bay";

// Shown for a /blogs/<slug> that matches no post: the bay that was picked is
// empty, with the way back to the posts and home beside it.
export default function BlogNotFound() {
  return (
    <main id="main" className="flex-1">
      <Container className="grid gap-12 py-16 sm:gap-14 sm:py-24 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-16 lg:py-32">
        <div>
          <h1 className="type-title text-ink">Post not found</h1>
          <p className="mt-6 max-w-[40ch] type-lede text-ink-soft">
            This post doesn&apos;t exist or has been deleted.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="outline">
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
        <EmptyBay code="404" label="No such post" />
      </Container>
    </main>
  );
}
