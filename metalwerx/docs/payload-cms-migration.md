# Metal Werx: moving the website from Strapi to Payload CMS

This document records how the Metal Werx website moved off Strapi and onto a self-hosted Payload CMS. It covers what was removed, what was built, how the website and the CMS talk to each other, and what is still left to do.

- **Website:** `~/metalwerx` (this repository), branch `alt-design`. The changes are **not committed yet**.
- **CMS:** `~/metalwerx-payload` on the LAN machine 192.168.15.240. It is **not a Git repository yet**.
- **State checked on:** 28 October 2026.

## Contents

1. [Summary](#1-summary)
2. [Timeline](#2-timeline)
3. [Where the site started](#3-where-the-site-started)
4. [Removing Strapi (and the old Prisma setup)](#4-removing-strapi-and-the-old-prisma-setup)
5. [Bringing the photos into the project](#5-bringing-the-photos-into-the-project)
6. [The Payload CMS project](#6-the-payload-cms-project)
7. [Collections: Media, Posts, Services, Materials](#7-collections-media-posts-services-materials)
8. [Globals: Home Page, Privacy Policy, Services Page, What We Buy Page](#8-globals-home-page-privacy-policy-services-page-what-we-buy-page)
9. [How the website reads the CMS](#9-how-the-website-reads-the-cms)
10. [Loading the content through MCP](#10-loading-the-content-through-mcp)
11. [Changing the schema later](#11-changing-the-schema-later)
12. [Current state](#12-current-state)
13. [Known issues and next steps](#13-known-issues-and-next-steps)

## 1. Summary

- **Strapi is gone from the website.**
  - Its client (`lib/strapi.js`) and page loader (`lib/pages.js`) were deleted, and the blog loader was rewritten.
  - All 55 lines in 17 files that mentioned Strapi were removed or rewritten, including the `STRAPI_URL` setting and the README instructions.
  - A search of the source for "strapi" now finds nothing.
- **The unused Prisma/MongoDB setup went with it.** That's `lib/prisma.js`, `prisma/schema.prisma`, `prisma.config.ts`, the `prisma` and `@prisma/client` packages, and the `prisma generate` install step.
- **A self-hosted Payload CMS replaces Strapi** at http://192.168.15.240:3001. It stores content in SQLite and photos in S3-compatible object storage (SeaweedFS).
- **Much more of the site can now be edited without code.**
  - Strapi held only the blog posts and the home and blog page copy.
  - Payload holds the home page, the blog posts, the privacy policy, the services and the Services page, the materials and the What We Buy page, plus all 47 photos.
- **The CMS has four collections and four globals.** The collections are Media, Posts, Services and Materials. The globals (single pages) are Home Page, Privacy Policy, Services Page and What We Buy Page. A Users collection holds the admin logins.
- **14 per-page route folders became 2 dynamic routes**, `/services/[slug]` and `/what-we-buy/[slug]`. A service or material added in the CMS gets its own page without a code change.
- **Edits show up without a redeploy.**
  - Every CMS read is cached under a tag, and each save in the CMS calls the website's new `/api/revalidate` route to clear it.
  - The cache also refreshes itself every 15 minutes.
- **The content was loaded through Payload's MCP server** (`/api/mcp`), using seed scripts that are safe to run again.
- **The hard-coded copy shrank:**

  | File | Lines before | Lines after |
  | --- | --- | --- |
  | `app/what-we-buy/materials.js` | 1,424 | 80 |
  | `app/services/services.js` | 502 | 80 |
  | `app/privacy-policy/page.jsx` (only the layout is left) | 568 | 284 |

## 2. Timeline

| Date (2026) | What happened |
| --- | --- |
| 21 Oct | Last commit (`539a314`). Blog posts and the home and blog page copy still come from Strapi 5 in `../metalwerx-cms`. |
| 23 Oct | Strapi and Prisma removed from the site. Home page copy and blog posts moved into code (`app/home-page.js`, `app/blogs/posts.js`). Stock photos downloaded into `public/images/`, with `lib/photo.js` for responsive sizes. |
| 26 Oct | Payload CMS set up in `~/metalwerx-payload` with SeaweedFS storage and the MCP plugin. Media, Posts, Services, Home Page, Privacy Policy and Services Page created and filled. Site switched to `lib/cms.js`, and `/api/revalidate` added. |
| 28 Oct | Materials and What We Buy Page added and filled. The What We Buy pages and the navbar's What We Buy menu switched to the CMS. |

## 3. Where the site started

| Content | Where it lived | How the site got it |
| --- | --- | --- |
| Blog posts | Strapi `blog` collection (MongoDB through Prisma before that) | `lib/strapi.js` → `lib/blogs.js` |
| Home page copy and photos | Strapi `home-page` single type | `lib/pages.js` → `getHomePage()` |
| Blog page headings and SEO | Strapi `blog-page` single type | `lib/pages.js` → `getBlogPage()` |
| Privacy policy | Hard-coded JSX in `app/privacy-policy/page.jsx` | In the page itself |
| Services (3) | Hard-coded in `app/services/services.js`, plus a route folder per service | In the code |
| Materials (11) | Hard-coded in `app/what-we-buy/materials.js`, plus a route folder per material | In the code |
| Navbar What We Buy menu | Hard-coded in `app/components/navbar.jsx` | In the code |
| Stock photos | Hot-linked from `images.unsplash.com` and `images.pexels.com` | Plain `<img>` tags |

That setup had three problems:

- Strapi ran only on the development machine (`localhost:1337`), and its project was never pushed to GitHub.
- `next build` needed Strapi to be running.
- Changing a service, a material or the privacy policy meant editing code and redeploying.

**The goal:** replace Strapi with a Payload CMS hosted on the LAN machine 192.168.15.240, and save the content through Payload's MCP plugin.

## 4. Removing Strapi (and the old Prisma setup)

### 4.1 Deleted files

| File | What it did |
| --- | --- |
| `lib/strapi.js` | `fetchStrapi(path, query)` sent GET requests to `STRAPI_URL/api/<path>`, using Strapi's nested `populate[...]` query syntax. `mediaUrl()` turned `/uploads/...` paths into full URLs. It threw an error if `STRAPI_URL` wasn't set. |
| `lib/pages.js` | `getHomePage()` and `getBlogPage()`, both cached for an hour. `getHomePage()` used a deep `populate` tree so every component and upload came back. The module also split one-per-line text boxes (the ticker and step points) into lists. |
| `lib/prisma.js` | A shared `PrismaClient`, left over from when posts were in MongoDB. |
| `prisma/schema.prisma`, `prisma.config.ts` | The MongoDB `Blog` model and Prisma's config. |

### 4.2 Every Strapi reference, and what replaced it

On the last commit, `git grep -i strapi` found 55 lines in 17 files. All of them are gone:

| File | Before | Now |
| --- | --- | --- |
| `lib/blogs.js` (114 → 15 lines) | Paged through Strapi's `/api/blogs` 100 posts at a time. Converted Rich text (Blocks) bodies, built `srcSet` from Strapi's image formats, and worked out each post's slug from its title on every request. | `getBlogs()` and `getBlogBySlug()`, built on `getPosts()` in `lib/cms.js`. Slugs are stored in the CMS. |
| `app/blogs/[slug]/blog-body.jsx` (141 → 15) | Rendered Strapi's Blocks JSON: headings, lists, quotes, code and images. | Renders the body as paragraphs. A single line break stays a `<br>`. |
| `app/blogs/page.jsx`, `app/blogs/[slug]/page.jsx` | The headings, empty-state text, the label above each post title and the SEO text came from Strapi's `blog-page`. | Those few strings are now in the page code. Posts come from `lib/blogs.js`. Each post's new `description` field is its card summary and meta description. |
| `app/blogs/error.jsx` | Comment: "e.g. Strapi is unreachable" | General wording |
| `app/page.jsx` | `getHomePage()` from `lib/pages.js` | `getHomePage()` from `lib/cms.js` |
| `app/components/index-hero.jsx`, `index-marquee.jsx`, `index-why-us.jsx`, `index-commercial.jsx`, `index-faq.jsx`, `index-cash-for-cars.jsx` | Comments pointing at "the Home Page in Strapi", and icon maps keyed by Strapi's stored values | Comments point at `lib/cms.js`, and the icon maps match the CMS's options. The cash-for-cars photo uses `photoProps()`. |
| `app/services/services.js`, `app/what-we-buy/materials.js` | Comment: "lives here rather than in Strapi" | Both load from the CMS (sections 7.5 and 7.6). |
| `README.md` | Strapi setup, `STRAPI_URL`, "Strapi has to be running while you build" | Setup for `CMS_URL` and `REVALIDATE_SECRET`, the CMS admin, revalidation, and a note that Vercel can't reach the LAN-only CMS |

### 4.3 Packages and settings

- `package.json` lost `@prisma/client`, `prisma` and `"postinstall": "prisma generate"`.
- No Strapi package was ever installed in the website, because the site reached Strapi with plain `fetch`.
- Nothing reads `STRAPI_URL` any more. The website now needs this in `.env.local`:

  ```bash
  CMS_URL=http://192.168.15.240:3001
  REVALIDATE_SECRET=<the same value as REVALIDATE_SECRET in the CMS's .env>
  ```

### 4.4 Checking it

```bash
grep -rni strapi --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git .
```

This returns no matches. The Strapi project itself still exists at `~/metalwerx-cms`, but it isn't running and the website no longer refers to it.

## 5. Bringing the photos into the project

Before 23 Oct, photos came from two places:

- Strapi served its uploaded photos itself.
- The other stock photos were hot-linked from the Unsplash and Pexels CDNs, with `&w=<width>` added for each `srcset` size.

Every component used a plain `<img>` so that Next.js didn't need a `remotePatterns` entry.

On 23 Oct:

- **Downloaded the stock photos.** The 46 photos (23 from Unsplash and 23 from Pexels, about 20 MB) were saved into `public/images/unsplash/` and `public/images/pexels/`. Each is at most 2400 px on the long side and named by its ID on the source site.
- **Added `lib/photo.js`.** `photoProps(src, sizes)` uses Next's `getImageProps()` to give a plain `<img>` a `src`, `srcSet` and `sizes` from Next's image optimizer. The browser then downloads the smallest copy that fills the space.
- **Switched these components to `photoProps()`:**
  - the hero background (`components/ui/animated-hero-section-1.jsx`)
  - `components/ui/gradient-card.jsx`
  - `components/ui/notched-project-card.jsx`, which gained a `sizes` prop
  - the 48 px menu thumbnails in `components/ui/shadcnblocks-com-navbar1.jsx`
  - `app/components/index-cash-for-cars.jsx`
  - `Photo` in `app/services/sections.jsx`, replacing the old `WIDTHS` list and `&w=` srcset
  - the blog list and post pages

These local files were later uploaded to the CMS's Media collection (section 10). Today, only the About page still uses `public/images/` directly. Every other photo comes from the CMS's object storage.

## 6. The Payload CMS project

`~/metalwerx-payload` is a separate Next.js app that runs only the Payload admin and API. Opening `/` redirects to `/admin`.

### 6.1 Stack

| Part | Version and details |
| --- | --- |
| Payload | 3.92.0 (`payload`, `@payloadcms/next`, `@payloadcms/ui`) |
| Next.js / React | 16.3.3 / 19.2.6 |
| Database | SQLite through `@payloadcms/db-sqlite`, in the file `metalwerx.db` |
| File storage | `@payloadcms/storage-s3` → SeaweedFS 4.48 (S3 API), bucket `metalwerx-media` |
| AI access | `@payloadcms/plugin-mcp`, an MCP server at `/api/mcp` |
| Image processing | `sharp` |
| Editor | Lexical is configured, but no field uses rich text. All text is in plain text and textarea fields. |

### 6.2 Addresses

Everything runs on the LAN machine 192.168.15.240:

| What | Address |
| --- | --- |
| Admin | http://192.168.15.240:3001/admin |
| REST API | http://192.168.15.240:3001/api, e.g. `/api/posts`, `/api/globals/home-page` |
| MCP server | http://192.168.15.240:3001/api/mcp |
| Object storage (S3 API) | http://192.168.15.240:9000, bucket `metalwerx-media` |
| Website, production (`next start`) | http://192.168.15.240:3123 |
| Website, development (`npm run dev`) | http://192.168.15.240:3000 |

### 6.3 Configuration (`src/payload.config.ts`)

- **No `serverURL`:**
  - The admin calls the API on whichever address it was opened at.
  - Logins are only accepted from the addresses in the `csrf` list: `PAYLOAD_PUBLIC_SERVER_URL`, `http://localhost:3001` and `http://127.0.0.1:3001`. The last two are for VS Code's port forwarding.
- **Contents:**
  - Collections: Users, Media, Posts, Services, Materials.
  - Globals: Home Page, Privacy Policy, Services Page, What We Buy Page.
- **S3 storage for `media`:**
  - `disablePayloadAccessControl: true` makes a photo's URL point straight at the bucket, for example `http://192.168.15.240:9000/metalwerx-media/home/<file>`. Photos aren't served through Payload.
  - `alwaysInsertFields: true` adds the `prefix` field, which puts each file in its folder in the bucket.
  - `forcePathStyle: true` and region `us-east-1` are set for SeaweedFS.
- **MCP plugin.** Each item has a description that tells an AI client what it is. Allowed actions:

  | Content | Allowed over MCP |
  | --- | --- |
  | Posts, Services, Materials | Find, create, update and delete |
  | Media | Find and update only. Files can't be uploaded over MCP. |
  | The four globals | Find and update |
- **`next.config.ts`:**
  - The `/` → `/admin` redirect.
  - `allowedDevOrigins: ['192.168.*.*']`, so live reload works from other devices on the LAN.
- **Scripts:**
  - `dev` and `start` listen on `0.0.0.0:3001`.
  - `seed:images` and `seed:content` load the content (section 10).
  - `generate:types` and `generate:importmap` are used after schema changes (section 11).

### 6.4 Object storage: SeaweedFS

- **Why SeaweedFS:** MinIO was the first choice, but its binary downloads returned HTTP 410 (Gone).
- **Install:** a single binary, `~/.local/bin/weed` (version 4.48).
- **Data:** `~/seaweedfs/data`.
- **Keys:** `~/seaweedfs/s3.json`. It defines a `payload` identity, whose key is also in the CMS's `.env`, and gives anonymous read access to the bucket.
- **Network:**
  - Only the S3 API (port 9000) listens on the LAN.
  - The master, volume and filer servers stay on `127.0.0.1`, because the filer accepts writes without a key.
- **Access:** the bucket is public-read, so anyone on the LAN can load a photo by its URL. Listing and uploading files need the key.

### 6.5 Environment variables (CMS `.env`)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | The SQLite file, `file:./metalwerx.db` |
| `PAYLOAD_SECRET` | Signs logins and API keys |
| `PAYLOAD_PUBLIC_SERVER_URL` | `http://192.168.15.240:3001` |
| `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | The object storage |
| `WEBSITE_URL` | The website the CMS tells to refresh after each change (`http://192.168.15.240:3123`) |
| `REVALIDATE_SECRET` | Shared with the website's `/api/revalidate` route |
| `PAYLOAD_MCP_API_KEY` | The MCP key that `seed:content` uses. `seed:images` writes it. |

`.env.example` lists the same names without the secret values.

### 6.6 Running it

```bash
cd ~/metalwerx-payload
npm ci
cp .env.example .env    # then fill in the secrets
npm run build
npm start               # http://192.168.15.240:3001
```

The `deploy/` folder holds systemd user units for SeaweedFS (`seaweedfs.service`) and the CMS (`metalwerx-cms.service`, which starts after SeaweedFS). They keep both running across logouts and reboots. The units are **not installed yet**; see [next steps](#13-known-issues-and-next-steps).

## 7. Collections: Media, Posts, Services, Materials

### 7.1 How each collection and global was built

Every collection and global went through the same steps:

1. **Model the page as it already was.** The fields match the props the existing React sections already took, so the page designs didn't change. Only the data source did.
2. **Write the config** in `src/collections/<Name>.ts` or `src/globals/<Name>.ts`. Register it in `payload.config.ts` and enable it in the MCP plugin.
3. **Push the schema** to SQLite by starting the dev server. Then regenerate `payload-types.ts` and the admin's import map.
4. **Add the revalidation hook**, with the cache tag of the pages that show the content.
5. **Export the existing copy** to `seed/content/<name>.json` and save it through MCP (section 10).
6. **Switch the website** to read the content through `lib/cms.js`, and delete the hard-coded copy.

### 7.2 Shared conventions

- **Public read.** Every content collection and global has `access.read: () => true`, so the website reads it over REST without a key. Changes need an admin login or an MCP API key.
- **Revalidation hook.** `src/hooks/revalidateWebsite.ts` runs on `afterChange`, and on `afterDelete` for collections. It is given the cache tags to clear (section 9.2).
- **Photos.** A photo is an `upload` field pointing at Media, plus an optional `imageTitle` (the tooltip where the photo is used). The alt text is written once, on the Media document.
- **Icons.** An icon is a `select` field of lucide icon names. The website turns each name into its lucide-react component, and falls back to the Recycle icon for an unknown name.
- **Lists.** Repeated text (paragraphs, list items, ticker items, step points) is an array of `{ text }` rows. In Strapi, some of these were a single text box split at line breaks.
- **SEO.** Every page-level document has an `seo` group (`title`, `description`). The website uses it in `generateMetadata()`.
- **Closing call to action.** The band at the foot of the service, material, Services and What We Buy pages is a `cta` group (`heading`, `text`, `buttonText`, `buttonHref`).

### 7.3 Media (`media`)

Every photo on the website: **47 files**.

| Field | Type | Notes |
| --- | --- | --- |
| *(the file)* | upload | Kept in the S3 bucket. Payload records its file name, size, dimensions and URL. |
| `alt` | text, required | The screen-reader description, used everywhere the photo appears |
| `title` | text | The default tooltip |
| `source` | text | The Unsplash or Pexels page the photo came from |
| `prefix` | text (added by the S3 plugin) | The photo's folder in the bucket |

- **Folders.** Admin folders are turned on (`folders: true`) and use the same names as the bucket prefixes:

  | Folder | Photos |
  | --- | --- |
  | `what-we-buy/` | 30 |
  | `services/` | 9 |
  | `home/` | 5 |
  | `blogs/` | 2 |
  | `brand/` | 1 (the logo) |

  A photo used in several sections is in the folder of the first of them, in the order brand → home → blogs → services → what-we-buy.
- **Hook.** Any change clears `cms:home-page`, `cms:posts`, `cms:services` and `cms:materials`, because a new alt text or file changes every page that shows the photo.
- **Uploads.** Upload new files in the admin. Over MCP, you can find media and edit their text fields, but not upload files.

### 7.4 Posts (`posts`)

The blog at `/blogs`. **3 posts.**

| Field | Type | Notes |
| --- | --- | --- |
| `title` | text, required | |
| `slug` | text, unique, indexed (in the sidebar) | The post's URL is `/blogs/<slug>`. Left empty, the slug is made from the title, using the same rules as the site's old `blogSlug()`: `"Copper Prices: What's Changed?"` → `copper-prices-whats-changed`. |
| `date` | date, required (day picker) | The blog lists posts newest first (`defaultSort: '-date'`). |
| `description` | textarea, required | The card summary on `/blogs`, and the meta description |
| `cover` | upload → Media | Shown at the top of the post and on its card. Also the image used when the post is shared. |
| `body` | array of `{ text }`, at least 1 | One textarea per paragraph |

- **Hook:** clears `cms:posts` after a save or a delete.
- **Changes from Strapi:**
  - Paragraphs replace the rich-text editor.
  - The slug is stored, instead of being worked out from the title on every request.
  - Every post needs a `description`.
- **Current posts:**
  - "Ferrous or Non-Ferrous? Why It Matters When You Sell Scrap"
  - "How to Prepare Your Scrap Metal for the Yard"
  - "Scrapping an Old Car: What to Do Before We Tow It Away!"

### 7.5 Services (`services`)

Each service is one document. It holds everything on the service's page at `/services/<slug>` and its row on `/services`. **3 services.**

| Field | Type | Notes |
| --- | --- | --- |
| `title` | text, required | The short name, for menus, cards and the breadcrumb |
| `heading` | text, required | The page's `<h1>` |
| `slug` | text, unique | The page is at `/services/<slug>`. |
| `anchor` | text, required | The service's row is at `/services#<anchor>`, so links made before the service pages existed still land in the right place. |
| `order` | number, required | Position on `/services`, lowest first (`defaultSort: 'order'`) |
| `icon` | select | container, truck, factory, scale, repeat, ruler, forklift, tractor, calendar-check, calendar-clock, receipt-text, layers, recycle |
| `summary` | text, required | One line, for cards |
| `lede` | textarea, required | The paragraph under the heading |
| `image`, `imageTitle` | upload → Media, text | The header photo. Also used on cards and when the page is shared. |
| `seo` | group | `title`, `description` |
| `overview` | group | `heading`, `paragraphs[]`, `features[]` (`icon`, `title`, `text`) |
| `steps` ("How it works") | group | `intro`, `items[]` (`title`, `text`) |
| `details` | group | `heading`, `intro`, `images[]`, `lists[]` (see below) |
| `faq` | group | `intro`, `questions[]` (`question`, `answer`) |
| `cta` | group | The closing band |

In `details`:

- `images[]` holds at most 2 photos: a large one and a smaller one over its corner.
- Each entry in `lists[]` has a `title`, a `kind` and `items[]`. `kind` shows ticks (what's taken) or crosses (what to leave out).

- **Hook:** clears `cms:services` after a save or a delete.
- **Current services:**

  | Order | Service | URL |
  | --- | --- | --- |
  | 1 | Bin Hire | `/services/bin-hire` |
  | 2 | Pickup & Collection | `/services/pickup-and-collection` |
  | 3 | Commercial Recycling | `/services/commercial-recycling` |

- **Website side:** `app/services/services.js` went from 502 lines of copy to an 80-line loader that turns icon names into lucide components.

### 7.6 Materials (`materials`)

Each material the yard buys is one document. It holds everything on the material's page at `/what-we-buy/<slug>`. **11 materials.**

The fields are the same as in Services, and the collection reuses the same `photo()` field helper. These fields differ:

| Field | How it differs from Services |
| --- | --- |
| `icon` | Its own list of 12: cylinder, wrench, layers, disc-3, cooking-pot, battery-full, cable, zap, cog, tractor, car-front, recycle. Shown in the pill above the `<h1>`. |
| `related` ("We also buy") | Links to up to 3 other materials, suggested at the foot of the page |
| `overview` | `grades[]` (`title`, `text`) replaces `features`, under an optional `gradesTitle` that defaults to "Grades We Buy" |
| `steps` | Optional. With no items, the page shows the selling steps from the What We Buy Page. Only Scrap Machinery and Unwanted Cars have steps of their own. |
| *(no `order` field)* | The order comes from the What We Buy Page's groups. The admin lists materials by title. |

- **Hook:** clears `cms:materials` after a save or a delete.
- **Current materials:**
  - Non-ferrous: Copper, Brass, Aluminium, Aluminium Wheels, Stainless Steel, Lead, PVC Wire, Electric Motors
  - Ferrous: Unwanted Cars, Scrap Car Parts, Scrap Machinery
- **Website side:** `app/what-we-buy/materials.js` went from 1,424 lines of copy to an 80-line loader.

### 7.7 Users (`users`)

Payload's standard login collection for the admin, with an email and a password. `npm run seed:images` created the first admin account (section 10).

## 8. Globals: Home Page, Privacy Policy, Services Page, What We Buy Page

In Payload, content that exists only once is a *global* rather than a collection. Here, each global is one page.

### 8.1 Home Page (`home-page`)

The fields follow the home page from top to bottom:

| Field | Contents |
| --- | --- |
| `seo` | `title`, `description` |
| `hero` | `eyebrow`, `title`, `description`, two buttons, and the background photos (see below) |
| `ticker` | `[{ text }]`: the scrolling band under the hero |
| `whyUs` | `heading`, `intro`, `reasons[]` (`title`, `description`, `href`, photo) |
| `commercial` | `heading`, `intro`, `services[]` (`title`, `href`, `icon`) |
| `cashForCars` | `heading`, `subheading`, `body`, photo, `steps[]` (`title`, `description`, `points[]`, `icon`), `cta` |
| `faq` | `heading`, `intro`, `questions[]` |

Details:

- **Hero:**
  - The buttons are `primaryCta` and `secondaryCta`, each with `text` and `href`.
  - `backgroundImages[]` holds at least one photo, each with a tooltip. The photos take turns behind the copy.
- **Icon options:**
  - Commercial services: handshake, truck, file-pen, recycle, car, factory, container, phone.
  - Cash for cars steps: phone, message, dollar, scale, truck, car, handshake, check.
- **Current content:**

  | Item | Count |
  | --- | --- |
  | Hero photos | 4 |
  | Ticker items | 11 |
  | "Why us" reasons | 3 |
  | Commercial links | 3 |
  | Cash for cars steps | 3 |
  | FAQs | 5 |

- **Changes from Strapi.** The sections are the same as in Strapi's Home Page, so the home page components kept their props. Two things changed:
  - The ticker and step points are lists, not one-per-line text boxes.
  - Photos are always Media uploads. Strapi also allowed pasting an outside URL.
- **Hook:** clears `cms:home-page`.

### 8.2 Privacy Policy (`privacy-policy`)

The whole policy used to be hard-coded JSX. Now the text is in the CMS, and the page file (568 → 284 lines) only lays it out.

| Field | Contents |
| --- | --- |
| `seo` | `title`, `description` |
| `hero` | `eyebrow`, `title`, `intro` |
| `sections[]` | `anchor`, `title`, `icon`, `topics[]` |
| `topics[]` | `title`, `content` (blocks, below) |
| `cta` | `heading`, `body`, `buttonText`, `buttonHref` |

Each section is linked as `/privacy-policy#<anchor>`. Its icon is one of shield-check, info, database, chart-column, mail, lock or scale.

A topic's `content` is built from these blocks:

| Block | Fields | Shown as |
| --- | --- | --- |
| `paragraph` | `text` | One or more paragraphs. A blank line starts a new paragraph. |
| `questions` | `items[]` (`question`, `answer`) | Question-and-answer cards in a two-column grid |
| `callout` | `kind` (Legal basis or Please note), `text` | A highlighted box with that label |
| `address` | `text` | The company address panel, keeping line breaks |
| `iconList` | `items[]` (`label`, `icon`) | A grid of labelled icons |

An `iconList` icon is one of globe, monitor, link, server, clock or network.

- **Current content:**
  - 5 sections: overview, general, data-collection, analytics and newsletter
  - 19 topics
  - 43 blocks: 34 paragraphs, 6 callouts, 1 set of questions and answers, 1 address and 1 icon list
- **Layout:** the "On this page" sidebar and the section numbers are generated from `sections`.
- **Hook:** clears `cms:privacy-policy`.

### 8.3 Services Page (`services-page`)

The header and the closing band of `/services`. The rows between them come from the Services collection, in `order`.

| Field | Contents |
| --- | --- |
| `seo` | `title`, `description` |
| `hero` | `eyebrow`, `title`, `lede`, a photo with its tooltip, and a button (`cta`: `text`, `href`) |
| `cta` | The closing band |

- **Hook:** clears `cms:services`. That's the same tag as the collection, because the website reads both together.

### 8.4 What We Buy Page (`what-we-buy-page`)

| Field | Contents |
| --- | --- |
| `seo` | `title`, `description` |
| `hero` | `eyebrow`, `title`, `lede`, a photo with its tooltip, and a button (`cta`) |
| `groups[]` | `title`, `anchor`, `intro`, `materials` (see below) |
| `sellingSteps` | `intro`, `items[]`: how selling at the yard works. Shown on this page and on every material page without its own steps. |
| `cta` | The closing band |

Each group is a section of material cards at `/what-we-buy#<anchor>`. Its `materials` field is an ordered list of links to Materials: the cards in that section.

- **Current content:** a `non-ferrous` group with 8 materials, a `ferrous` group with 3, and 4 selling steps.
- **The groups also:**
  - set the order of the navbar's What We Buy menu;
  - provide the anchors the footer's Ferrous and Non-Ferrous links point to.
- **Hook:** clears `cms:materials`.

## 9. How the website reads the CMS

### 9.1 `lib/cms.js`

All CMS reads go through this one server-only module:

- `fetchCms(path, query)` sends a GET request to `CMS_URL/api/<path>`. On an error status it throws, with the status and path in the message.
- Each exported function is a `"use cache"` function with a cache tag.
- Each reshapes Payload's JSON into the props the page components already took.

| Function | REST request(s) | Cache tag | Used by |
| --- | --- | --- | --- |
| `getHomePage()` | `globals/home-page?depth=1` | `cms:home-page` | `/` |
| `getPosts()` | `posts?depth=1&limit=1000&sort=-date` | `cms:posts` | `lib/blogs.js` → `/blogs`, `/blogs/[slug]` |
| `getPrivacyPolicy()` | `globals/privacy-policy?depth=0` | `cms:privacy-policy` | `/privacy-policy` |
| `getServicesContent()` | `services?depth=1&limit=100&sort=order` and `globals/services-page?depth=1` | `cms:services` | `app/services/services.js` → `/services`, `/services/[slug]` |
| `getWhatWeBuyContent()` | `materials?depth=1&limit=100` and `globals/what-we-buy-page?depth=1` | `cms:materials` | `app/what-we-buy/materials.js` → `/what-we-buy`, `/what-we-buy/[slug]`, the navbar |

- `depth=1` makes Payload include each linked Media document (its URL and alt text) instead of only its ID.
- `getWhatWeBuyContent()` also:
  - turns the material links (`related`, and each group's `materials`) into slugs;
  - gives the page's selling steps to materials that have none of their own.

### 9.2 Caching and revalidation

```text
Editor saves in the admin (or through MCP)
        │
        ▼
CMS afterChange / afterDelete hook          src/hooks/revalidateWebsite.ts
        │   POST {WEBSITE_URL}/api/revalidate
        │   x-revalidate-secret: <REVALIDATE_SECRET>
        │   { "tags": ["cms:posts"] }
        ▼
Website route                               app/api/revalidate/route.js
        │   401 unless the secret matches
        │   keeps only tags matching ^cms:[\w-]+$
        │   revalidateTag(tag, { expire: 0 })
        ▼
The next visit to a page using that tag gets fresh content from the CMS
```

- **Prerendered pages.** Pages are built ahead of time with their content in the HTML, so **`next build` needs the CMS running**.
- **No stale page after an edit.** `expire: 0` makes the next visit wait for the new content, instead of getting the old page one more time.
- **A failed call doesn't block the save.** If the call fails (website down, wrong secret), the CMS logs a warning and saves anyway. The website's cache also refreshes itself every 15 minutes (Next's default `cacheLife`).
- **Seeding:**
  - `seed:images` sets `context.skipRevalidate`, so uploading 47 photos doesn't send 47 calls.
  - `seed:content` goes through MCP, so its saves do notify the website.
- **Faster than before.** With Strapi, the cache lasted an hour (`cacheLife("hours")`) and nothing told the site about changes, so an edit could take up to an hour to appear.

Which saves refresh which pages:

| Saved in the CMS | Tag cleared | Pages refreshed |
| --- | --- | --- |
| Home Page | `cms:home-page` | `/` |
| A post | `cms:posts` | `/blogs`, `/blogs/<slug>` |
| Privacy Policy | `cms:privacy-policy` | `/privacy-policy` |
| A service, or the Services Page | `cms:services` | `/services`, `/services/<slug>` |
| A material, or the What We Buy Page | `cms:materials` | `/what-we-buy`, `/what-we-buy/<slug>`, and the navbar on every page |
| A media file | All of the above except `cms:privacy-policy` | Every page with photos |

### 9.3 Routes: 14 folders became 2

| Before | After |
| --- | --- |
| `app/services/service-page.jsx`, plus `bin-hire/`, `pickup-and-collection/` and `commercial-recycling/`, each a 7-line `page.jsx` | `app/services/[slug]/page.jsx` |
| `app/what-we-buy/material-page.jsx`, plus 11 material folders, each a 7-line `page.jsx` | `app/what-we-buy/[slug]/page.jsx` |

- **URLs:** unchanged (`/services/bin-hire`, `/what-we-buy/copper` and so on).
- **Prerendering:** `generateStaticParams()` reads the slugs from the CMS, so every service, material and post is built at build time.
  - A page added in the CMS later is built on its first visit.
  - Any other slug gives a 404.
- **Build check:** `export const ensureStatic = "navigation"` is set on these pages:
  - the home page
  - the blog list and the post pages
  - the service and material pages

  On those pages, the build fails if anything would need a request when someone visits. That way, search engines always get the full copy in the first response.
- **Metadata:** `generateMetadata()` takes the title and description from each document's `seo` group.
  - Service and material pages use their header photo as the image when the page is shared.
  - Posts use their cover photo.

### 9.4 Navbar

`app/components/navbar.jsx` (173 → 80 lines) is now an async server component. Its **What We Buy** dropdown comes from the CMS:

- It lists every material, in the order of the What We Buy Page's groups.
- Each entry shows the material's summary (without the full stop) and its header photo as a 48 px thumbnail.

The **Services** dropdown is still hard-coded (see next steps).

### 9.5 Photos from the CMS

`next.config.mjs` gained this setting:

```js
images: {
  remotePatterns: [new URL("http://192.168.15.240:9000/metalwerx-media/**")],
  dangerouslyAllowLocalIP: true,
},
```

- Next's image optimizer refuses private IP addresses unless `dangerouslyAllowLocalIP` is set.
- `remotePatterns` limits it to the one bucket.
- The components still render a plain `<img>` with `photoProps()` (section 5). It now produces addresses like `/_next/image?url=http://192.168.15.240:9000/metalwerx-media/…`, one for each width.

## 10. Loading the content through MCP

The content was saved through Payload's MCP plugin, as requested. The seeding scripts are in `~/metalwerx-payload/seed/`. They skip anything that's already there, so they're safe to run again.

### Step 1: Photo inventory (`seed/inventory.mjs` → `seed/images.json`)

This script searched the website's code for every photo. It read:

- the navbar and the footer
- `app/home-page.js` and `app/blogs/posts.js`
- `app/services/services.js` and `app/what-we-buy/materials.js`
- the About page

For each photo, it recorded the folder, alt text, tooltip and source page. It found 47 photos.

> `services.js` and `materials.js` now load their content from the CMS, so running the inventory again would miss their photos. Treat `seed/images.json` as the record.

### Step 2: Upload the photos (`npm run seed:images`, `seed/seed-images.ts`)

This script runs inside Payload (`payload run`):

1. Creates the bucket if it's missing and makes it public-read.
2. Creates the admin folders `brand`, `home`, `blogs`, `services` and `what-we-buy`.
3. Uploads each photo from the website's `public/` folder to Media, with its alt text, tooltip, source and prefix. It skips files that are already uploaded.
4. On a fresh database, creates the first admin user and an MCP API key labelled "Content seed and Claude Code":
   - The admin's random password goes in `.admin-credentials`, which only its owner can read.
   - The key is added to `.env` as `PAYLOAD_MCP_API_KEY`.
   - Later runs set the key's permissions again, so a newly added collection or global is covered.

### Step 3: Save the copy (`npm run seed:content`, `seed/seed-content.mjs`)

With the CMS running, this script sends JSON-RPC calls to `/api/mcp`, using the API key:

1. Calls `initialize` and `tools/list`.
2. Calls `findMedia` to match each file name to its media ID. Every `"image": "<file name>"` in the JSON files is replaced with that ID.
3. Saves each global (Home Page, Privacy Policy, Services Page, What We Buy Page) with `update<Global>`, but only if it's still empty (it has no SEO title).
4. Creates posts, services and materials with `create<Collection>`, but only if no document has their slug yet.
5. Once all the materials exist, saves their `related` links in a second pass, and turns the What We Buy groups' material slugs into IDs.

Content edited in the admin is never overwritten.

The content comes from these files in `seed/content/`, which were made from the copy that was in the website's code:

- `home-page.json`
- `posts.json`
- `privacy-policy.json`
- `services.json`
- `services-page.json`
- `materials.json`
- `what-we-buy-page.json`

### MCP tools and access

The MCP server has 22 tools:

| Content | Tools |
| --- | --- |
| Posts | `findPosts`, `createPosts`, `updatePosts`, `deletePosts` |
| Services | `findServices`, `createServices`, `updateServices`, `deleteServices` |
| Materials | `findMaterials`, `createMaterials`, `updateMaterials`, `deleteMaterials` |
| Media | `findMedia`, `updateMedia` |
| Home Page | `findHomePage`, `updateHomePage` |
| Privacy Policy | `findPrivacyPolicy`, `updatePrivacyPolicy` |
| Services Page | `findServicesPage`, `updateServicesPage` |
| What We Buy Page | `findWhatWeBuyPage`, `updateWhatWeBuyPage` |

Each client needs an API key, made in the admin under **MCP > API Keys**. The key also sets what that client is allowed to do. To connect Claude Code:

```bash
claude mcp add --transport http payload http://192.168.15.240:3001/api/mcp \
  --header "Authorization: Bearer <API key>"
```

## 11. Changing the schema later

**Where things are:**

- Collections: `src/collections/`
- Globals: `src/globals/`
- Config: `src/payload.config.ts`

**Applying a change.** The dev server (`npm run dev`) and `npm run seed:images` update the SQLite database to match the schema. The production server (`npm start`) doesn't. So:

1. Stop the CMS.
2. Run `npm run dev` or `npm run seed:images`.
3. Run `npm run build`, then start the CMS again.
4. Run `npm run generate:types` and `npm run generate:importmap`.
5. If the shape of the data changed, update the website's `lib/cms.js`.

**Adding a new collection or global** also needs:

- an entry in the MCP plugin config;
- its permissions in `seed-images.ts`, then a fresh run of `seed:images` so the key covers it;
- a revalidation hook with a cache tag;
- a function to read it in `lib/cms.js`.

**The SQLite error when adding a collection.** Payload rebuilds the `payload_locked_documents_rels` table to add the new collection's column. The rebuild fails with `no such column: <slug>_id` and leaves a `__new_payload_locked_documents_rels` table behind.

This happened when Materials was added. An earlier rebuild had also left `services_id` without its foreign key. To fix it:

1. Add the new slug to the list in `seed/fix-locked-documents-rels.mjs`.
2. Stop the CMS.
3. Run `node seed/fix-locked-documents-rels.mjs`. It does nothing if the table is already right, and it keeps the existing rows (the admin's edit locks).
4. Start the dev server, so it can push the rest of the schema.

## 12. Current state

Checked on 28 October 2026:

| Check | Result |
| --- | --- |
| "strapi" in the website source | No matches |
| CMS admin (`:3001/admin`) | Up (HTTP 200) |
| Content over the REST API | 3 posts, 3 services, 11 materials and 47 media files. All 4 globals filled in. |
| A photo from the bucket (`:9000/metalwerx-media/brand/logo.png`) | HTTP 200 |
| Development site (`:3000`), `/what-we-buy` | Photos come from the CMS's bucket |
| Development site, `POST /api/revalidate` without the secret | HTTP 401: the route exists and checks the secret |
| **Production site (`:3123`)** | **Still the 23 Oct build.** Photos come from `public/images`, and `POST /api/revalidate` gives 404. |
| systemd units for the CMS and SeaweedFS | Not installed |

## 13. Known issues and next steps

Roughly in order of importance:

1. **Rebuild and restart the production site on port 3123.**
   - The `next start` process there has been running since 23 Oct, before the CMS existed. It still serves that build, not the CMS content.
   - The CMS's revalidation calls to it fail with 404, and the CMS logs "Couldn't revalidate … the website answered 404".
   - To fix it, stop that process. Then, with the CMS running, run `npm run build && npm start -- -p 3123` in `~/metalwerx`.
2. **Install the systemd units** so SeaweedFS and the CMS start on boot. Right now both were started by hand. If SeaweedFS stops, the photos break. If the CMS stops, builds fail. First stop the hand-started SeaweedFS and CMS so their ports are free, then run:

   ```bash
   mkdir -p ~/.config/systemd/user
   cp ~/metalwerx-payload/deploy/*.service ~/.config/systemd/user/
   systemctl --user daemon-reload
   systemctl --user enable --now seaweedfs metalwerx-cms
   ```

3. **Put `~/metalwerx-payload` in Git, and back up the data.**
   - The schema, the seed scripts and the content JSON exist only on this machine.
   - All the content is in `metalwerx.db` and all the photos are in `~/seaweedfs/data`. Back up both.
4. **Commit the website changes.** Everything above is uncommitted on `alt-design`. These new files need adding:
   - `lib/cms.js`
   - `lib/photo.js`
   - `app/api/revalidate/route.js`
   - `public/images/` (the About page still uses it)
5. **Vercel deployments won't build** while the CMS is only on the LAN. Once the CMS and its object storage have public addresses:
   - set `CMS_URL` and `REVALIDATE_SECRET` on Vercel;
   - point `remotePatterns` in `next.config.mjs` at the public storage address;
   - remove `dangerouslyAllowLocalIP`.
6. **Secure the admin account.**
   - Sign in, change the seeded admin password and delete `~/metalwerx-payload/.admin-credentials`.
   - No email adapter is set up, so password-reset emails only go to the CMS log.
7. **The navbar's Services menu is still hard-coded.** A service added in the CMS gets its page and a row on `/services`, but no menu entry. The menu could be built from `getServices()`, like the What We Buy menu.
8. **The blog page copy is hard-coded.**
   - Strapi's `blog-page` single type wasn't moved to Payload. It held the blog heading, the empty-state text, the label above post titles and the blog's SEO text.
   - Those strings are now fixed in `app/blogs/page.jsx` and `app/blogs/[slug]/page.jsx`.
   - Add a Blog Page global if they should be editable.
9. **Have the yard check the service and material copy.** These details describe what scrap yards typically do, not necessarily what this yard does:
   - the grades
   - what's accepted and what to leave out
   - the bin, weigh-ticket and delivery-area details

   The old code singled out tyres, household batteries and cracked lead-acid batteries in particular.
10. **Tidy up:**
    - `app/home-page.js` and `app/blogs/posts.js` aren't used by the site any more; only the one-off `seed/inventory.mjs` reads them. Delete them, or leave them out of the commit, so there's one source of truth.
    - The website's `.env` still has the old MongoDB `DATABASE_URL`. Nothing reads it.
    - `.gitignore`, `.vercelignore` and `eslint.config.mjs` still mention `app/generated/prisma`.
    - The old Strapi project is still at `~/metalwerx-cms`. Archive or delete it once nothing more is needed from it.
    - The website README says the home page, posts, privacy policy and services come from the CMS, but doesn't mention What We Buy.
    - The CMS README says `inventory.mjs` rebuilds `images.json`, which is no longer true (section 10).
