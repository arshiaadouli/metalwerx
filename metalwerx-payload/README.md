# Metal Werx CMS

The [Payload](https://payloadcms.com) CMS for the Metal Werx website ([metalwerx](../metalwerx)). It holds:

- **Media**: every photo on the website, 47 files. The files are kept in object storage (below), each under the prefix of the website section it belongs to: `brand/`, `home/`, `blogs/`, `services/` and `what-we-buy/`. The admin's Media folders use the same names. A photo used on several pages is in the folder of the first one in that order.
- **Home page** (global): all the home page copy, section by section, with each photo linked to its media file.
- **Posts**: the blog posts, each with a title, date, description, cover photo and body. A post's URL on the website is `/blogs/<slug>`.
- **Privacy policy** (global): the privacy policy text, as sections of topics made of paragraphs, questions and answers, callouts, an address and a list.
- **Terms & Conditions** (global, `terms`): the text of the website's `/terms` page, built the same way as the privacy policy (both come from `src/globals/legalPage.ts`).
- **Services**: one document per service, with everything on its page at `/services/<slug>` (header, overview, steps, what goes in, FAQ and closing call to action) and photos linked to media. The order field sets their order on `/services`.
- **Services page** (global): the header and closing band of `/services`.
- **Materials**: one document per material the yard buys, with everything on its page at `/what-we-buy/<slug>` (header, overview and grades, steps, what we buy, FAQ, the three materials suggested next and closing call to action) and photos linked to media. A material with no steps of its own shows the selling steps from the What We Buy page.
- **What We Buy page** (global): the header of `/what-we-buy`, what affects the price (the factors under the header, at `#price-factors`), its groups of material cards (each with its anchor, such as `#ferrous`, and the materials in order), the selling steps and the closing band. The website's navbar lists the materials in the same order.

The website reads these over the REST API and caches them. After each change, the CMS calls the website's `/api/revalidate` (see `src/hooks/revalidateWebsite.ts`).

## Addresses

All on the LAN machine 192.168.15.240:

| What | Address |
| --- | --- |
| Admin | http://192.168.15.240:3001/admin |
| REST API | http://192.168.15.240:3001/api, e.g. `/api/posts`, `/api/globals/home-page` |
| MCP server | http://192.168.15.240:3001/api/mcp |
| Object storage (S3 API) | http://192.168.15.240:9000, bucket `metalwerx-media` |

A photo's URL points straight at the object storage, e.g. `http://192.168.15.240:9000/metalwerx-media/home/photo-1722695694560-f452b0919d3a.jpg`. Anyone on the LAN can read the files; listing and uploading need the S3 key.

## Object storage

[SeaweedFS](https://github.com/seaweedfs/seaweedfs) provides the S3 API. It's a single binary, `~/.local/bin/weed` (4.48), with its data in `~/seaweedfs/data` and its keys in `~/seaweedfs/s3.json`: the `payload` identity, whose key is also in `.env`, and anonymous read access to the bucket. Only the S3 port (9000) listens on the LAN; SeaweedFS's other servers stay on localhost.

## Running it

```bash
npm ci
cp .env.example .env    # then fill in the secrets
npm run build
npm start               # http://192.168.15.240:3001
```

`npm run dev` runs the development server on the same port.

To keep SeaweedFS and the CMS running across logouts and reboots, install the user services in `deploy/` (lingering is already enabled for this user):

```bash
mkdir -p ~/.config/systemd/user
cp deploy/seaweedfs.service deploy/metalwerx-cms.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now seaweedfs metalwerx-cms
```

## Environment

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | The SQLite database, `file:./metalwerx.db` |
| `PAYLOAD_SECRET` | Signs logins and API keys |
| `PAYLOAD_PUBLIC_SERVER_URL` | `http://192.168.15.240:3001` |
| `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | The object storage |
| `WEBSITE_URL` | The website, told to refresh after each change |
| `REVALIDATE_SECRET` | Shared with the website's `/api/revalidate` |
| `PAYLOAD_MCP_API_KEY` | The MCP key `npm run seed:content` uses |

## Seeding

The content was loaded from the website in two steps, both safe to run again:

1. `npm run seed:images` uploads the photos listed in `seed/images.json` from the website's `public/` folder, creates the bucket and the folders, and, on a fresh database, makes the first admin user (its password goes in `.admin-credentials`) and an MCP API key (added to `.env`).
2. `npm run seed:content`, with the CMS running, saves `seed/content/*.json` (the home page, the posts, the privacy policy, the terms, the services page, the services, the materials and the What We Buy page) through the MCP server. It only fills in what's missing, so content edited in the admin is left alone.

## MCP

`/api/mcp` is an MCP server (Streamable HTTP) from `@payloadcms/plugin-mcp`. Each client needs an API key, made in the admin under **MCP > API Keys**, which also sets what the client can do. There's a find, create, update and delete tool for posts, services, materials and prices (`findPosts`, `createPosts`, …), find and update for media, and find and update for each global (`findHomePage`, `updateHomePage`, …). Files can't be uploaded over MCP; upload them in the admin.

To use it from Claude Code:

```bash
claude mcp add --transport http payload http://192.168.15.240:3001/api/mcp \
  --header "Authorization: Bearer <API key>"
```

## Changing the schema

The collections are in `src/collections`, the globals in `src/globals`, the field groups they share (photos, SEO, steps, FAQ, the closing band) in `src/fields.ts` and the config in `src/payload.config.ts`. The development server, or `npm run seed:images`, updates the SQLite database to match the schema; the production server doesn't, so stop it and run one of those after a change, then rebuild. Then run `npm run generate:types` and `npm run generate:importmap`, and update the website's `lib/cms.js` if the shape changed.
