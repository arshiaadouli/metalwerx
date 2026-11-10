import { MEDIA_BUCKET_URL } from "@/lib/media";

// The CMS's photos at /media/<key>, read from its object storage on the LAN
// (see lib/media.js). Next's image optimizer fetches them from here too. Only
// GET is answered (Next answers HEAD from it), and only for files in the one
// bucket, which the storage lets anyone read but not list or write.

// The request headers passed on, so browsers can revalidate a cached photo,
// and the response headers passed back.
const REQUEST_HEADERS = ["if-none-match", "if-modified-since", "range"];
const RESPONSE_HEADERS = [
  "content-type",
  "content-length",
  "content-range",
  "accept-ranges",
  "etag",
  "last-modified",
];

export async function GET(request, { params }) {
  const { path } = await params;
  // Each segment is a folder or file name; "." and ".." would step out of the
  // bucket.
  if (path.some((segment) => segment === "." || segment === "..")) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  for (const name of REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  let upstream;
  try {
    upstream = await fetch(`${MEDIA_BUCKET_URL}/${path.map(encodeURIComponent).join("/")}`, {
      headers,
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    console.error("Couldn't reach the media storage:", error);
    return new Response("Media storage unavailable", { status: 502 });
  }
  if (![200, 206, 304].includes(upstream.status)) {
    return new Response("Not found", { status: 404 });
  }

  const responseHeaders = new Headers({ "cache-control": "public, max-age=86400" });
  for (const name of RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
}
