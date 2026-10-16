import "server-only";
import { connection } from "next/server";
import prisma from "@/lib/prisma";

// Each query waits for connection() so it only runs at request time. Without
// it, Cache Components may run queries while prerendering, which errors.

export async function getBlogs() {
  await connection();
  return prisma.blog.findMany({
    // Newest first; posts on the same date in the order they were added.
    orderBy: [{ date: "desc" }, { id: "desc" }],
  });
}

// Post URLs are /blogs/<slug>, where the slug is the hyphenated title:
// "Copper Prices: What's Changed?" → "copper-prices-whats-changed".
export function blogSlug(title) {
  return title
    .normalize("NFKD") // Split accented letters so the accents can be dropped: é → e.
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "") // "what's" → "whats", not "what-s".
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getBlogBySlug(slug) {
  await connection();
  // Slugs aren't stored, so match against every title. Oldest first, so if two
  // posts share a title the original keeps its URL.
  const posts = await prisma.blog.findMany({
    select: { id: true, title: true },
    orderBy: [{ date: "asc" }, { id: "asc" }],
  });
  const match = posts.find((post) => blogSlug(post.title) === slug);
  return match ? prisma.blog.findUnique({ where: { id: match.id } }) : null;
}
