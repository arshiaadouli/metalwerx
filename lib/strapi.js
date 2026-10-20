import "server-only";

// The Strapi CMS (metalwerx-cms) at STRAPI_URL serves the blog posts
// (lib/blogs.js) and the home and blog page copy (lib/pages.js). Its public
// API only returns published content.

function strapiUrl() {
  const url = process.env.STRAPI_URL;
  if (!url) {
    throw new Error("STRAPI_URL is not set. Point it at the Strapi CMS, e.g. http://localhost:1337.");
  }
  return url;
}

// GETs /api/<path> and returns the parsed JSON. The query is nested the way
// Strapi's docs write it: { populate: { seo: true } } is sent as
// populate[seo]=true, and { sort: ["date:desc"] } as sort[0]=date:desc.
export async function fetchStrapi(path, query = {}) {
  const res = await fetch(`${strapiUrl()}/api/${path}?${toSearchParams(query)}`);
  if (!res.ok) {
    // A single type with nothing published answers 404 too.
    const hint = res.status === 404 ? " Is it published?" : "";
    throw new Error(`Strapi returned ${res.status} for /api/${path}.${hint}`);
  }
  return res.json();
}

// Uploaded files have paths like /uploads/photo.jpg on the Strapi server.
export function mediaUrl(url) {
  return new URL(url, strapiUrl()).href;
}

function toSearchParams(query, params = new URLSearchParams(), prefix = "") {
  for (const [key, value] of Object.entries(query)) {
    const name = prefix ? `${prefix}[${key}]` : key;
    if (value !== null && typeof value === "object") toSearchParams(value, params, name);
    else params.set(name, value);
  }
  return params;
}
