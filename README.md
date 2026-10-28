# Metal Werx

Website for Metal Werx, a scrap metal recycling and cash-for-cars business. It's built with Next.js 16 (App Router), React 19 and Tailwind CSS 4. The home page, the blog posts, the privacy policy and the services come from the Payload CMS in [metalwerx-payload](../metalwerx-payload), at http://192.168.15.240:3001, and their photos from its object storage. The rest of the copy lives in JavaScript files next to the pages.

## Requirements

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 20.9 or newer, which includes npm. The project is developed on Node 24.

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

`npm ci` installs the exact versions pinned in `package-lock.json`.

### 3. Connect to the CMS

Add the CMS to `.env.local`:

```bash
CMS_URL=http://192.168.15.240:3001
REVALIDATE_SECRET=<the same value as REVALIDATE_SECRET in the CMS's .env>
```

The home page, blog posts, privacy policy and services are edited in the CMS admin at http://192.168.15.240:3001/admin. The site reads them at build time and keeps them in its cache: after a change, the CMS calls the site's `/api/revalidate`, so the change shows on the next visit, and the cache also refreshes by itself every 15 minutes. A post's URL is `/blogs/<slug>`, and a service's `/services/<slug>`. The CMS must be running for `npm run build`.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Pages reload as you edit files. To open the site from a phone or another computer on the network, see [Running on a private LAN](#running-on-a-private-lan).

## Production build

```bash
npm run build
npm start
```

`npm start` serves the build at [http://localhost:3000](http://localhost:3000).

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
app/api/revalidate/  Called by the CMS after a change
app/components/   Navbar, footer, theme toggle and home page sections
components/ui/    Shared UI components (buttons, accordion, animations, contact globe)
lib/              CMS reads (cms.js), blog post lookups (blogs.js) and the photo helper (photo.js)
public/           Static files: the logo and the site's photos (images/)
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

The build reads its content from the CMS at `CMS_URL`, which is only on the LAN (192.168.15.240), so a Vercel build can't reach it. To deploy to Vercel, the CMS and its object storage need public addresses, set as `CMS_URL` and `REVALIDATE_SECRET` on Vercel, and the image host in `next.config.mjs` changed to match.
