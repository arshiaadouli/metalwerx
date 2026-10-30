// Saves the website's copy to the CMS through its MCP server (/api/mcp): the
// home page, the blog posts, the privacy policy, the terms and conditions, the
// services page, the services, the materials and the What We Buy page, from seed/content/*.json.
// Photos are named there by file name and saved as links to the media
// collection, so run `npm run seed:images` first, with the CMS running.
//
//   npm run seed:content
//
// Only what's missing is saved: the home page, privacy policy, terms, services
// page and What We Buy page if they're still empty, and a post, service or material
// if none has its slug yet. Content edited in the admin is left alone.
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split("\n")
    .filter((line) => /^\w+=/.test(line))
    .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]),
);
const endpoint = new URL("/api/mcp", process.env.CMS_URL ?? env.PAYLOAD_PUBLIC_SERVER_URL);
const apiKey = process.env.PAYLOAD_MCP_API_KEY ?? env.PAYLOAD_MCP_API_KEY;
const content = (name) => JSON.parse(readFileSync(new URL(`./content/${name}.json`, import.meta.url), "utf8"));

let nextId = 1;

// One JSON-RPC call. The server answers with JSON or a one-message event stream.
async function rpc(method, params) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: nextId++, method, params }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method}: HTTP ${res.status} ${text}`);
  const json = text.startsWith("{") ? text : text.match(/^data: (.*)$/m)?.[1];
  const message = JSON.parse(json);
  if (message.error) throw new Error(`${method}: ${message.error.message}`);
  return message.result;
}

// Calls a tool, with a document's fields as its arguments, and returns the
// JSON documents in its answer.
async function tool(name, args) {
  const result = await rpc("tools/call", { name, arguments: args });
  const text = result.content.map((part) => part.text).join("\n");
  if (result.isError || /^(Error|❌)/.test(text)) throw new Error(`${name}: ${text}`);
  return [...text.matchAll(/```json\n([\s\S]*?)\n```/g)].map((m) => JSON.parse(m[1]));
}

await rpc("initialize", {
  protocolVersion: "2025-06-18",
  capabilities: {},
  clientInfo: { name: "metalwerx-seed", version: "1.0.0" },
});
const { tools } = await rpc("tools/list", {});
console.log(`MCP tools: ${tools.map((t) => t.name).join(", ")}`);

// File name → media id, for every photo in the CMS.
const media = await tool("findMedia", { limit: 100 });
const mediaIds = new Map(media.map((doc) => [doc.filename, doc.id]));
const mediaId = (filename) => {
  const id = mediaIds.get(filename);
  if (id === undefined) throw new Error(`No media named ${filename}. Run npm run seed:images first.`);
  return id;
};

// Swaps every { image: "<file name>" } for the media id.
const linkImages = (value) =>
  Array.isArray(value)
    ? value.map(linkImages)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.entries(value).map(([key, v]) => [key, key === "image" ? mediaId(v) : linkImages(v)]),
        )
      : value;

// Saves a global unless it already has content (an SEO title).
async function seedGlobal(name, label, data) {
  const [doc] = await tool(`find${name}`, {});
  if (doc?.seo?.title) {
    console.log(`Skipped the ${label}, already there.`);
    return;
  }
  await tool(`update${name}`, data);
  console.log(`Saved the ${label}.`);
}

await seedGlobal("HomePage", "home page", linkImages(content("home-page")));
await seedGlobal("PrivacyPolicy", "privacy policy", content("privacy-policy"));
await seedGlobal("Terms", "terms and conditions", content("terms"));

for (const post of content("posts")) {
  const existing = await tool("findPosts", { where: JSON.stringify({ slug: { equals: post.slug } }) });
  if (existing.length) {
    console.log(`Skipped "${post.title}", already there.`);
    continue;
  }
  const [doc] = await tool("createPosts", { ...post, cover: post.cover ? mediaId(post.cover) : null });
  console.log(`Created "${doc.title}" at /blogs/${doc.slug}.`);
}

await seedGlobal("ServicesPage", "services page", linkImages(content("services-page")));

for (const service of content("services")) {
  const existing = await tool("findServices", { where: JSON.stringify({ slug: { equals: service.slug } }) });
  if (existing.length) {
    console.log(`Skipped "${service.title}", already there.`);
    continue;
  }
  const [doc] = await tool("createServices", linkImages(service));
  console.log(`Created "${doc.title}" at /services/${doc.slug}.`);
}

// The materials name each other, and the What We Buy page's groups name them,
// by slug. A material's suggestions are saved once all of them exist.
const materialIds = new Map();
const created = [];
for (const { related, ...material } of content("materials")) {
  const [existing] = await tool("findMaterials", { where: JSON.stringify({ slug: { equals: material.slug } }) });
  if (existing) {
    console.log(`Skipped "${material.title}", already there.`);
    materialIds.set(material.slug, existing.id);
    continue;
  }
  const [doc] = await tool("createMaterials", linkImages(material));
  console.log(`Created "${doc.title}" at /what-we-buy/${doc.slug}.`);
  materialIds.set(doc.slug, doc.id);
  created.push({ id: doc.id, related });
}
const materialId = (slug) => {
  const id = materialIds.get(slug);
  if (id === undefined) throw new Error(`No material with the slug ${slug}.`);
  return id;
};
for (const { id, related } of created) {
  await tool("updateMaterials", { id, related: related.map(materialId) });
}

const whatWeBuyPage = content("what-we-buy-page");
await seedGlobal("WhatWeBuyPage", "What We Buy page", {
  ...linkImages(whatWeBuyPage),
  groups: whatWeBuyPage.groups.map((group) => ({ ...group, materials: group.materials.map(materialId) })),
});
