# Metal Werx

Website for Metal Werx, a scrap metal recycling and cash-for-cars business. It's built with Next.js 16 (App Router), React 19 and Tailwind CSS 4. Blog posts and the copy on the home and blog pages are managed in a Strapi 5 CMS, a separate project in `../metalwerx-cms`, and read through its REST API.

**Website:** [metalwerx.com.au](https://metalwerx.com.au) (coming soon). Until the domain points at Vercel, the site is live at [metawerx.vercel.app](https://metawerx.vercel.app).

## Requirements

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 20.9 or newer, which includes npm. The project is developed on Node 24.
- The Strapi CMS in `../metalwerx-cms`, running. The home page and the blog pages need it; the rest of the site runs without it. The CMS is its own Git repository and isn't on GitHub yet, so for now it only exists on the development machine.

## Install on a new machine

### 1. Clone the repository

```bash
git clone https://github.com/arshiaadouli/metalwerx.git
cd metalwerx
```

### 2. Install dependencies

```bash
npm ci
```

`npm ci` installs the exact versions pinned in `package-lock.json`. Its `postinstall` step runs `prisma generate` to build the database client, so you don't need to install anything else.

Newer versions of npm may warn that some packages' install scripts are "not yet covered by allowScripts". You can ignore this warning: the install still finishes and the Prisma client is still generated.

### 3. Start the Strapi CMS

In a second terminal, start Strapi from its folder next to this one:

```bash
cd ../metalwerx-cms
npm run develop
```

It serves the admin panel at [http://localhost:1337/admin](http://localhost:1337/admin), where content is edited, and the API the site reads at `http://localhost:1337/api`. The content types are:

| Content type | Kind | What it holds |
| --- | --- | --- |
| **Blog** | Collection | The posts at `/blogs`, each with a `title`, a `date` and a rich text `body` |
| **Home Page** | Single | The home page's search title and description, hero (text, buttons and background photos), the scrolling ticker, the Commercial, Cash for Cars and FAQ sections |
| **Blog Page** | Single | The search title and description, heading and empty-list message at `/blogs`, and the label above each post's title |

Only published content appears on the site. In the Home Page, the ticker and each Cash for Cars step's points are typed one per line. A photo can be uploaded or, if nothing is uploaded, given as the address of a photo hosted elsewhere; the alt text is required either way. On a fresh database, Strapi fills the Home Page and Blog Page with the site's original copy the first time it starts (see `src/seed.ts` in the CMS).

### 4. Create the `.env` file

Environment files aren't committed to Git, so a fresh clone doesn't have one. Create a file named `.env` in the project root:

```env
STRAPI_URL=http://localhost:1337
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Pages reload as you edit files. To open the site from a phone or another computer on the network, see [Running on a private LAN](#running-on-a-private-lan).

If `STRAPI_URL` is missing or Strapi isn't running, the other pages still work, but the home page and `/blogs` show an error and the terminal logs the cause, for example `STRAPI_URL is not set` or `fetch failed`. Content published in Strapi shows up on the site within an hour, because the Strapi queries are cached for that long.

## Production build

```bash
npm run build
npm start
```

Strapi has to be running while you build, because the home and blog pages are prerendered with their content in them. `npm start` serves the build at [http://localhost:3000](http://localhost:3000).

## Running on a private LAN

### Open the site from other devices

`npm run dev` and `npm start` both listen on every network interface, so phones, tablets and other computers on the LAN can open the site.

1. Find the LAN IPv4 address of the machine running the server:
   - Windows: run `ipconfig` and look under the Ethernet or Wi-Fi adapter.
   - macOS: run `ipconfig getifaddr en0`.
   - Linux: run `hostname -I`.

   Don't rely on the `Network:` address that Next.js prints at startup. It can be a VPN address, such as Tailscale's `100.x.x.x`, instead of the LAN one.
2. On the other device, open `http://<that address>:3000`, for example `http://192.168.15.190:3000`.

By default, the dev server blocks its live-reload connection for any hostname other than `localhost`. When that happens, the page loads but doesn't update as you edit, and the terminal logs `Blocked cross-origin request to Next.js dev resource /_next/webpack-hmr`. [next.config.mjs](next.config.mjs) allows `192.168.*.*` through `allowedDevOrigins`, so live reload works on this LAN. If your network uses a different range, add it to that list, for example `"10.*.*.*"`. The dev server restarts by itself when the file changes. The production server (`npm start`) doesn't have this check.

### Allow it through the firewall

The first time Node.js listens on a port, Windows asks whether to allow it through the firewall. Allow it on **Private networks**, and make sure the LAN connection's profile is Private (Settings > Network & internet > Ethernet or Wi-Fi > Network profile type). If you dismissed the prompt, add a rule from PowerShell run as administrator:

```powershell
New-NetFirewallRule -DisplayName "Metal Werx dev server" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -Profile Private
```

On macOS, click **Allow** when asked whether `node` can accept incoming connections.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Create a production build in `.next/` |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
app/              Pages and layouts: home, about, blogs, contact-us, privacy-policy
app/components/   Navbar, footer, theme toggle and home page sections
components/ui/    Shared UI components (buttons, accordion, animations, contact globe)
lib/              Strapi queries: blog posts (blogs.js) and home/blog page copy (pages.js)
public/           Static files such as the logo
```

## Deploying

The site is deployed to the Vercel project `metawerx` with the Vercel CLI. The GitHub repository isn't connected to Vercel, so pushing to GitHub doesn't trigger a deployment.

On a new machine, log in and link the folder to the project first, because the `.vercel` link folder isn't committed:

```bash
npx vercel login
npx vercel link    # choose the existing metawerx project
```

Then deploy:

```bash
npx vercel          # preview deployment
npx vercel --prod   # production, https://metawerx.vercel.app
```

### Domain

The site's own address will be [metalwerx.com.au](https://metalwerx.com.au). Both `www.metalwerx.com.au` (the main address) and `metalwerx.com.au` (which redirects to it) are already added to the Vercel project. They go live once the domain's DNS, managed at burstxservers, has these two records:

| Name | Type | Value |
| --- | --- | --- |
| `metalwerx.com.au` | A | `216.198.79.1` and `64.29.17.1` |
| `www` | CNAME | `76e8eca01842befc.vercel-dns-017.com.` |

Leave the MX and TXT records alone: they carry the `info@metalwerx.com.au` email. Once the domain works, set `SITE_URL` on Vercel to `https://www.metalwerx.com.au` and redeploy, so canonical links, the sitemap and share previews use the new address. Until then `SITE_URL` stays `https://metawerx.vercel.app`.

### Environment variables

Vercel doesn't read your local `.env`. Set the Strapi URL on Vercel with `npx vercel env add STRAPI_URL`. It has to be a Strapi server that Vercel can reach over the internet, so `http://localhost:1337` won't work there: the CMS needs hosting first.
