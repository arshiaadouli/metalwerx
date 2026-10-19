# Metal Werx

Website for Metal Werx, a scrap metal recycling and cash-for-cars business. It's built with Next.js 16 (App Router), React 19 and Tailwind CSS 4. Blog posts are stored in MongoDB and read through Prisma 6.

## Requirements

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 20.9 or newer, which includes npm. The project is developed on Node 24.
- A MongoDB connection string. Only the blog pages need it; the rest of the site runs without a database.

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

### 3. Create the `.env` file

Environment files aren't committed to Git, so a fresh clone doesn't have one. Create a file named `.env` in the project root.

The development database is a MongoDB server on the private LAN at `192.168.15.46`. On a machine connected to that network, use:

```env
DATABASE_URL="mongodb://USER:PASSWORD@192.168.15.46:27017/metalwerx?authSource=admin&replicaSet=rs0"
```

Ask the project owner for the username and password. To check the connection, see [Use the LAN database](#use-the-lan-database).

A machine outside that network can't reach the LAN database, so it needs a hosted database instead, such as MongoDB Atlas:

```env
DATABASE_URL="mongodb+srv://USER:PASSWORD@HOST/DATABASE"
```

Posts are read from the `blog` collection. Each document has a `title` (string), a `date` (date) and a `body` (string), as defined in [prisma/schema.prisma](prisma/schema.prisma).

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Pages reload as you edit files. To open the site from a phone or another computer on the network, see [Running on a private LAN](#running-on-a-private-lan).

If `DATABASE_URL` is missing or the database can't be reached, the other pages still work, but `/blogs` shows an error and the terminal logs the cause, for example `Environment variable not found: DATABASE_URL`.

## Production build

```bash
npm run build
npm start
```

`npm start` serves the build at [http://localhost:3000](http://localhost:3000). The build prints a warning that it failed to find font override values for `Saira Stencil`. It's harmless.

## Running on a private LAN

### Use the LAN database

The machine has to be on the same network as the database server (`192.168.15.x`). Check that it can reach the database port:

```powershell
# Windows (PowerShell): look for "TcpTestSucceeded : True"
Test-NetConnection 192.168.15.46 -Port 27017
```

```bash
# macOS / Linux: look for "succeeded"
nc -vz 192.168.15.46 27017
```

If that fails, you're on a different network, or the server or its firewall isn't accepting connections on port 27017.

The database is a single-member replica set (`rs0`) that advertises itself as `192.168.15.46:27017`, so the `replicaSet=rs0` URL from step 3 works from any machine on the LAN. If the database moves and Prisma times out even though the port test passes, the replica set is probably advertising an address that other machines can't reach, such as `localhost`. Add `&directConnection=true` to the end of `DATABASE_URL` so Prisma connects to the server directly.

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
lib/              Prisma client and blog queries
prisma/           Database schema
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

Vercel doesn't read your local `.env`. Set the database URL on Vercel with `npx vercel env add DATABASE_URL`. It has to be a database that Vercel can reach over the internet, because a local-network address won't work there.
