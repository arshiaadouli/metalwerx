# How content gets from Payload CMS to the Next.js site

For a developer who knows Next.js but has not used Payload. It explains what Payload is, what the content looks like when it leaves the CMS, and every step it takes to reach a page. File paths are relative to this repository (`metalwerx`) unless they start with `metalwerx-payload/`.

## 1. The two apps

| | Website | CMS |
| --- | --- | --- |
| Folder | `metalwerx` | `metalwerx-payload` |
| What it is | Next.js 16 App Router site, JavaScript | Next.js 16 app with Payload 3 mounted inside it, TypeScript |
| Port | 3000 | 3001 |
| Database | none | SQLite, `metalwerx.db` |
| Photos | served at `/media/...` | stored in an S3 bucket (SeaweedFS on port 9000) |

Payload is not a separate server you install. It is an npm package that mounts into a Next.js app and gives it three things:

- an **admin UI** at `/admin`, generated from your field definitions;
- a **REST API** at `/api/<collection>` and `/api/globals/<global>` (plus GraphQL at `/api/graphql`);
- a **database layer** that creates the tables from the same field definitions.

So `metalwerx-payload` is just another Next.js app. Its `src/app/(payload)/` folder is Payload's own routes and you never touch it. The files you care about are `src/payload.config.ts`, `src/collections/*.ts`, `src/globals/*.ts`, `src/fields.ts` and `src/hooks/*.ts`.

The website never imports Payload. It talks to the CMS over HTTP only, the same way it would talk to any REST API.

## 2. Payload in Next.js terms

**A collection** is a table with many rows. `Services`, `Posts`, `Materials`, `Price`, `Media`, `Messages`, `MessagePhotos`, `Users`. Each row is a "document" with an auto `id`, `createdAt` and `updatedAt`.

**A global** is a single document with no list: the home page copy, the privacy policy, the terms, the `/services` page header, the `/what-we-buy` page. One record, edited in place.

**A field** is one property on a document. You declare it once as an object and Payload uses that declaration for the admin form, validation, the database column and the JSON shape. A trimmed example from `metalwerx-payload/src/collections/Services.ts`:

```ts
export const Services: CollectionConfig = {
  slug: 'services',                    // the API path: /api/services
  access: { read: () => true },        // anyone may GET; writes need an admin login
  defaultSort: 'order',
  hooks: {
    afterChange: [revalidateWebsite(['cms:services'])],
    afterDelete: [revalidateWebsite(['cms:services'])],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'order', type: 'number', required: true },
    ...photo('The header photo, also on the cards.'),   // an upload + a tooltip, from fields.ts
    { name: 'overview', type: 'group', fields: [ ... ] },
    { name: 'features', type: 'array', fields: [ ... ] },
  ],
}
```

The field types you will meet and what they become in JSON:

| Type | In the admin | In the JSON |
| --- | --- | --- |
| `text`, `textarea`, `number`, `email`, `select` | one input | a string or number |
| `group` | a boxed set of inputs | a nested object with the group's name |
| `array` | repeatable rows with add/remove | an array of objects, each with an `id` |
| `upload` (relationTo `media`) | a file picker | an id, or the whole media document, depending on `depth` (see below) |
| `relationship` | a dropdown of another collection's documents | same as upload: id or document |

`metalwerx-payload/src/fields.ts` holds the field groups the collections share: `photo()`, `seo()`, `link()`, `icon()`, `steps()`, `faq()`, `cta()`, `details()`. They are functions, so every collection gets its own copy.

`payload.config.ts` is the root. It lists the collections and globals, picks the SQLite adapter, and adds two plugins: `s3Storage`, which sends every `media` upload to the bucket instead of the disk, and `mcpPlugin`, which exposes the content to AI clients. Payload regenerates `src/payload-types.ts` from this config, so the CMS side has TypeScript types for every document.

## 3. What the API returns

Everything the website reads is public (`access.read: () => true`), so there is no auth header on reads. Open these in a browser to see the raw shape:

```
http://192.168.15.240:3001/api/services?depth=1&limit=100&sort=order
http://192.168.15.240:3001/api/globals/home-page?depth=1
http://192.168.15.240:3001/api/posts?depth=1&limit=1000&sort=-date
```

A collection answers with a paginated envelope:

```json
{ "docs": [ ... ], "totalDocs": 3, "limit": 100, "page": 1, "hasNextPage": false }
```

A global answers with the document itself, no envelope.

**`depth` is the one query parameter you must understand.** An `upload` or `relationship` field stores only the other document's id. `depth=0` returns the id. `depth=1` replaces it with the other document (one level down). So with `depth=1` a service's `image` is not `12` but:

```json
"image": {
  "id": 12,
  "alt": "A hook-lift truck dropping a bin",
  "title": null,
  "url": "http://192.168.15.240:9000/metalwerx-media/services/pickup.jpg",
  "filename": "pickup.jpg", "mimeType": "image/jpeg", "width": 1600, "height": 1067
}
```

If the related document is not readable at that depth it stays an id, which is why `lib/cms.js` sometimes checks `typeof ref === "object"`.

Other query parameters used here: `limit`, `sort` (`-date` for descending), and `populate[materials][slug]=true` on `/api/price`, which asks for only the `slug` of each related material instead of the whole document.

## 4. The website's one door to the CMS: `lib/cms.js`

Every page gets its content through `lib/cms.js`. Nothing else in the site calls the CMS. The file does three jobs.

**Fetch.** `fetchCms(path, query)` builds `CMS_URL + /api/ + path`, adds the query string, does a plain `fetch`, and throws on a non-2xx status. `CMS_URL` comes from `.env.local`.

**Reshape.** Payload's JSON is passed on mostly as is, with three fixed translations so components never see Payload's internals:

- an upload plus its `imageTitle` becomes `{ src, alt, title }`, with `src` rewritten by `mediaPath()` to a `/media/...` path on this site;
- an array of `{ text }` rows becomes a plain array of strings (Payload has no "list of strings" field type, so repeatable text is stored as rows);
- a relationship becomes the related document's `slug`.

**Cache.** Each exported function is a Next.js cached function:

```js
export async function getHomePage() {
  "use cache";
  cacheTag("cms:home-page");
  const doc = await fetchCms("globals/home-page", { depth: 1 });
  return { ...reshaped doc };
}
```

The exports and the tag each one owns:

| Function | Reads | Tag |
| --- | --- | --- |
| `getHomePage()` | `globals/home-page` | `cms:home-page` |
| `getPosts()` | `posts` | `cms:posts` |
| `getPrivacyPolicy()` | `globals/privacy-policy` | `cms:privacy-policy` |
| `getTerms()` | `globals/terms` | `cms:terms` |
| `getServicesContent()` | `services` + `globals/services-page` | `cms:services` |
| `getWhatWeBuyContent()` | `materials` + `globals/what-we-buy-page` | `cms:materials` |
| `getPrices()` | `price` | `cms:price` |

Some routes add one more layer on top. `app/services/services.js` takes `getServicesContent()` and swaps icon names such as `"truck"` for lucide components, and adds the closing-band photo that lives in `public/images` rather than the CMS. `app/blogs/` formats dates. Those files are the place for presentation-only transforms; `lib/cms.js` stays about shape.

## 5. The page

A page is an ordinary async Server Component. `app/page.jsx`:

```jsx
export const ensureStatic = "navigation";

export default async function Home() {
  const { hero, ticker, whyUs, commercial, cashForCars, faq } = await getHomePage();
  return (
    <main>
      <IndexHero {...hero} />
      <IndexMarquee items={ticker} />
      ...
    </main>
  );
}
```

`next.config.mjs` turns on `cacheComponents`, so a page is static HTML unless it reads something request-bound. `ensureStatic = "navigation"` makes the build fail if that ever happens, so the CMS copy is always in the first response for search engines.

Dynamic routes such as `app/services/[slug]/page.jsx` and `app/blogs/[slug]/page.jsx` use `generateStaticParams()` to prerender every document at build time. A document added in the CMS after the build is rendered on its first visit and then kept.

## 6. Keeping pages fresh: the revalidation loop

Because reads are cached, a save in the admin would not show until the cache expires (the default `cacheLife` is 15 minutes). The CMS shortens that to seconds:

1. Every collection and global has `afterChange` (and `afterDelete`) hooks that call `revalidateWebsite([...tags])` from `metalwerx-payload/src/hooks/revalidateWebsite.ts`. A hook in Payload is just an async function Payload runs around a database operation.
2. The hook POSTs `{ tags: ["cms:services"] }` to `WEBSITE_URL + /api/revalidate` with an `x-revalidate-secret` header, 5 second timeout. A failure is logged and does not block the save.
3. `app/api/revalidate/route.js` checks the secret, keeps only tags matching `cms:<name>`, and calls `revalidateTag(tag, { expire: 0 })` for each. `expire: 0` makes the next visit wait for fresh content instead of serving the stale page once more.
4. The next request to any page that called a function tagged with that tag re-runs the fetch.

The `Media` collection revalidates `cms:home-page`, `cms:posts`, `cms:services` and `cms:materials` together, because a new alt text or file can affect all of them.

If you change content with a script instead of the admin, set `req.context.skipRevalidate` or expect to POST the tags to `/api/revalidate` yourself afterwards. Rebuilding the site alone does not clear the tagged cache.

## 7. Photos

Uploads go to the S3 bucket, so a media document's `url` points at `http://192.168.15.240:9000/metalwerx-media/<prefix>/<file>`. That address is on the LAN and is not what visitors should see, so:

- `lib/media.js` `mediaPath(url)` turns a bucket URL into `/media/<prefix>/<file>`. `lib/cms.js` applies it to every photo.
- `app/media/[...path]/route.js` is a Route Handler that fetches the file from the bucket and streams it back with a one-day cache header. Next's image optimizer reads from this route, so `next.config.mjs` needs no `remotePatterns`.

The prefix (`home/`, `services/`, `blogs/`, `what-we-buy/`, `brand/`) is the admin's Media folder and mirrors the site section.

## 8. The one write: the contact form

Reads are public; writes are not. The contact form is the only thing the website writes.

1. `app/contact-us/actions.js` is a Server Action. It validates the fields, applies an in-memory rate limit, then:
2. `uploadMessagePhoto(file)` in `lib/cms.js` POSTs multipart form data to `/api/message-photos` and gets back the new document's id;
3. `createMessage({ ...fields, photos: ids })` POSTs JSON to `/api/messages`.

Both requests carry `x-messages-secret`. On the CMS side `Messages` and `MessagePhotos` have `access.create` that checks that header against `MESSAGES_SECRET`, and `access.update: () => false`, so even an admin cannot edit a message. Message photos use `upload.staticDir`, so they stay on the CMS server's disk rather than in the public bucket.

## 9. Environment variables that tie it together

| Website `.env.local` | CMS `.env` | Must match |
| --- | --- | --- |
| `CMS_URL` | `PAYLOAD_PUBLIC_SERVER_URL` | the CMS address, e.g. `http://192.168.15.240:3001` |
| `REVALIDATE_SECRET` | `REVALIDATE_SECRET` | yes |
| `MESSAGES_SECRET` | `MESSAGES_SECRET` | yes |
| `MEDIA_BUCKET_URL` | `S3_ENDPOINT` + `S3_BUCKET` | the bucket address |
| | `WEBSITE_URL` | where the CMS POSTs revalidations, e.g. `http://192.168.15.240:3000` |

## 10. Adding a field end to end

Say a service needs a `tagline` under its heading.

1. **CMS:** add `{ name: 'tagline', type: 'text' }` to `fields` in `metalwerx-payload/src/collections/Services.ts`. Payload adds the column on next start and the input appears in the admin. Fill it in and save. The save fires `revalidateWebsite(['cms:services'])`.
2. **Check the JSON:** open `/api/services?depth=1` and confirm `tagline` is on each document. No hook change is needed, the tag already covers the collection.
3. **Website:** `getServicesContent()` spreads the document, so `tagline` already arrives in `services`. Render it in `app/services/sections.jsx` or the page.
4. If the new field is an upload, wrap it with `photo()` in `lib/cms.js` so it becomes `{ src, alt, title }`. If it is a repeatable text, wrap it with `texts()`.

A new collection needs more: a file in `src/collections/`, an entry in `payload.config.ts`'s `collections` array, `access.read: () => true`, hooks with a new `cms:<name>` tag, a new cached function in `lib/cms.js` with the same tag, and if it has pages, a route with `generateStaticParams()`.

## 11. Where to look when it misbehaves

- **Content is stale on the site.** Check the CMS log for `Couldn't revalidate ...`. Usually `WEBSITE_URL` or `REVALIDATE_SECRET` is wrong on one side. Posting the tag by hand works: `curl -X POST $WEBSITE_URL/api/revalidate -H "x-revalidate-secret: $SECRET" -H "content-type: application/json" -d '{"tags":["cms:services"]}'`.
- **A photo is a broken image.** Check the media document's `url` starts with `MEDIA_BUCKET_URL`, otherwise `mediaPath()` leaves it untouched and the browser tries the LAN address.
- **A relationship is a number, not an object.** You fetched with `depth=0`, or the related collection is not publicly readable.
- **The build fails with a "needs a request" error.** Something in a page with `ensureStatic` read headers, cookies or search params. Only `lib/cms.js` functions and props may feed those pages.
- **A contact form message returns 401/403 from the CMS.** `MESSAGES_SECRET` differs between the two `.env` files.
