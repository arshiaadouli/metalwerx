import "server-only";
import { cacheLife } from "next/cache";
import { fetchStrapi, mediaUrl, uploadedImage } from "./strapi";

// Posts come from the Strapi CMS (see lib/strapi.js). Each query is cached
// ("use cache"), so the blog pages are prerendered with the posts already in
// the HTML, which is what search engines read. "hours" is the Cache Components
// version of `revalidate = 3600`: after an hour the next visit gets the cached
// page while it re-reads Strapi in the background, so a new or edited post
// shows up within the hour without a redeploy. This means `next build` must be
// able to reach Strapi.

// Every published post, 100 at a time (Strapi's page size limit), as
// { id, title, date, cover, body, text }: cover is the cover photo or null (see
// toCover), body is the post's blocks (see toBlocks) and text is the same
// words without formatting, for excerpts and reading time.
async function fetchPosts(sort) {
  const posts = [];
  for (let page = 1; ; page++) {
    const { data, meta } = await fetchStrapi("blogs", {
      populate: { cover: true },
      pagination: { page, pageSize: 100 },
      sort,
    });
    posts.push(...data);
    if (page >= meta.pagination.pageCount) break;
  }

  // Strapi sends dates as "YYYY-MM-DD", which parses to midnight UTC, the same
  // as the dates stored in MongoDB before.
  return posts.map(({ documentId, title, date, cover, body }) => {
    const blocks = toBlocks(body).map((block) =>
      block.type === "image"
        ? { ...block, image: { ...block.image, url: mediaUrl(block.image.url) } }
        : block,
    );
    return {
      id: documentId,
      title,
      date: new Date(date),
      cover: toCover(cover),
      body: blocks,
      text: blocksToText(blocks),
    };
  });
}

// The cover photo as <img> attributes, with Strapi's smaller copies in srcSet
// (see uploadedImage), and the alt text saved with it in the Media Library.
function toCover(cover) {
  const image = uploadedImage(cover);
  return image && { ...image, alt: cover.alternativeText ?? "" };
}

// The body is a Rich text (Blocks) field: an array of paragraphs, headings,
// lists, quotes, code and images, whose children go down to text nodes. A body
// saved while it was still a plain text field arrives as a string, so it's
// split into paragraphs at blank lines, as the CMS migration does.
function toBlocks(body) {
  if (Array.isArray(body)) return body;
  return String(body ?? "")
    .split(/\n\s*\n/)
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({ type: "paragraph", children: [{ type: "text", text }] }));
}

// Blocks are separated by blank lines and list items by line breaks.
function blocksToText(blocks) {
  return blocks.map(nodeText).join("\n\n");
}

function nodeText(node) {
  if (node.type === "text") return node.text;
  return (node.children ?? []).map(nodeText).join(node.type === "list" ? "\n" : "");
}

export async function getBlogs() {
  "use cache";
  cacheLife("hours");
  // Newest first; posts on the same date in the order they were added.
  return fetchPosts(["date:desc", "createdAt:desc"]);
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
  "use cache";
  cacheLife("hours");
  // Slugs aren't stored, so match against every title. Oldest first, so if two
  // posts share a title the original keeps its URL.
  const posts = await fetchPosts(["date:asc", "createdAt:asc"]);
  return posts.find((post) => blogSlug(post.title) === slug) ?? null;
}
