import { NotFoundGlitch } from "@/components/ui/be-ui-404-not-found";

export default function BlogNotFound() {
  return (
    <main className="flex flex-1 bg-surface font-montserrat text-ink">
      <NotFoundGlitch
        title="Post not found"
        description="This post doesn't exist or has been deleted."
        homeHref="/blogs"
        homeLabel="All posts"
        browseLabel="Back to home"
      />
    </main>
  );
}
