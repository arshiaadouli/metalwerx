import { getPosts } from "@/lib/cms";

// The posts are written in the CMS (see lib/cms.js). Each is returned as
// { id, title, date, description, cover, paragraphs, text }: id is the slug,
// so a post's URL is /blogs/<id>.

// Newest first.
export function getBlogs() {
  return getPosts();
}

export async function getBlogBySlug(slug) {
  const posts = await getPosts();
  return posts.find((post) => post.id === slug) ?? null;
}
