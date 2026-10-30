import { revalidateTag } from "next/cache";

// The CMS POSTs here after a change, with { tags: ["cms:posts", …] } and the
// shared secret, so the pages using that content are rebuilt on their next
// visit (see lib/cms.js and the CMS's hooks/revalidateWebsite.ts).
export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tags } = await request.json().catch(() => ({}));
  const cmsTags = Array.isArray(tags) ? tags.filter((tag) => /^cms:[\w-]+$/.test(tag)) : [];
  // expire 0: the next visit waits for the new content rather than getting
  // the old page once more.
  for (const tag of cmsTags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: cmsTags });
}
