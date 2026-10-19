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

Environment files aren't committed to Git, so a fresh clone doesn't have one. Create a file named `.env` in the project root:

```env
DATABASE_URL="mongodb+srv://USER:PASSWORD@HOST/DATABASE"
```

Ask the project owner for the real connection string. The current development database runs on a local network, so a machine outside that network needs a hosted database instead, such as MongoDB Atlas.

Posts are read from the `blog` collection. Each document has a `title` (string), a `date` (date) and a `body` (string), as defined in [prisma/schema.prisma](prisma/schema.prisma).

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Pages reload as you edit files.

If `DATABASE_URL` is missing or the database can't be reached, the other pages still work, but `/blogs` shows an error and the terminal logs the cause, for example `Environment variable not found: DATABASE_URL`.

## Production build

```bash
npm run build
npm start
```

`npm start` serves the build at [http://localhost:3000](http://localhost:3000). The build prints a warning that it failed to find font override values for `Saira Stencil`. It's harmless.

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
