import { Archivo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import analyticsPackage from "@vercel/analytics/package.json";
import { MetalDefs } from "@/components/metal/metal";
import { OPEN_GRAPH, SITE_URL } from "@/lib/seo";
import { YARD } from "@/lib/yard";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import ThemeToggle from "./components/theme-toggle";
import "./globals.css";

// Archivo sets the whole site. Its width axis gives the wide display
// headlines and the narrow metal codes on the grade tags from one font.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Page titles read "Contact Us | Metal Werx". The default, description and
// share preview are fallbacks for pages that don't set their own (each page
// sets its canonical link and preview with pageMetadata, see lib/seo.js).
// metadataBase turns their paths into full URLs on the site's address.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: OPEN_GRAPH,
  title: {
    template: "%s | Metal Werx",
    default: "Metal Werx Scrap Metal Recycling",
  },
  description:
    "Scrap metal recycling for homes, farms and businesses. Metal Werx buys ferrous and non-ferrous metals, car bodies and batteries.",
  // Where the yard is, in the geo tags that local SEO checks look for. The
  // home and contact pages also carry it in their JSON-LD (LOCAL_BUSINESS).
  other: {
    "geo.region": `AU-${YARD.state}`,
    "geo.placename": YARD.suburb,
    "geo.position": `${YARD.geo.latitude};${YARD.geo.longitude}`,
    ICBM: `${YARD.geo.latitude}, ${YARD.geo.longitude}`,
  },
};

// Sets data-theme as the page is parsed, so it never paints in the wrong theme:
// the visitor's last pick in ThemeToggle, else their OS setting. With scripts
// off, the page stays on the dark default. suppressHydrationWarning on <html>
// lets React accept the attribute the script changed.
const themeScript = `(function(){var t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)})()`;

// Vercel Web Analytics' script, in the HTML itself. <Analytics /> only adds it
// after the page's JavaScript runs, so a crawler or SEO checker reading the
// HTML would find no analytics. It skips adding its own when this tag is
// already in <head>, then reports each page view as the visitor navigates, so
// the tag carries the same data attributes it would set, auto-tracking off
// included, and nothing is counted twice. In dev the component loads Vercel's
// debug script instead, so this is production only.
const analyticsBasePath = process.env.NEXT_PUBLIC_VERCEL_OBSERVABILITY_BASEPATH;
const analyticsScript = analyticsBasePath
  ? `/${analyticsBasePath.replace(/^\//, "")}/insights/script.js`
  : "/_vercel/insights/script.js";

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU" data-theme="dark" suppressHydrationWarning className={`${archivo.variable} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {process.env.NODE_ENV === "production" && (
          <script
            defer
            src={analyticsScript}
            data-sdkn="@vercel/analytics/next"
            data-sdkv={analyticsPackage.version}
            data-disable-auto-track="1"
          />
        )}
      </head>
      <body className="flex min-h-full flex-col">
        {/* Every page's <main> has id="main". */}
        <a
          href="#main"
          className="fixed top-3 left-3 z-50 -translate-y-24 rounded-[2px] bg-ink px-4 py-3 font-bold text-ground focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <MetalDefs />
        <Navbar />
        {children}
        <Footer />
        <ThemeToggle />
        {/* Vercel Web Analytics: page views and visitors, without cookies.
            Switched on in the Vercel project; it sends nothing in dev. */}
        <Analytics />
      </body>
    </html>
  );
}
