import {
  Geist,
  Geist_Mono,
  Montserrat,
  Saira_Stencil,
  Bebas_Neue,
  Oswald,
} from "next/font/google";
import { openGraph } from "@/lib/metadata";
import Analytics from "./components/analytics";
import BusinessJsonLd from "./components/business-json-ld";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import ThemeScript from "./components/theme-script";
import ThemeToggle from "./components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--montserrat",
  subsets: ["latin"],
});

// Next has no fallback metrics for Saira Stencil, so it can't build a
// size-matched fallback. Turbopack still looks them up (and warns) unless
// `fallback` is set, so name the fallback fonts ourselves.
const sairaStencil = Saira_Stencil({
  // variable: "--saira-stencil",
  subsets: ["latin"],
  adjustFontFallback: false,
  fallback: ["Arial", "sans-serif"],
});

const bebasNeue = Bebas_Neue({
  variable: "--bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--oswald",
  subsets: ["latin"],
});

// Page titles read "Contact Us | Metal Werx". The default and description are
// fallbacks for pages that don't set their own.
// The site answers on both metalwerx.com.au and www (which the proxy redirects
// here), so every page names the bare domain as its canonical URL. "./" is
// resolved against each page's own path.
// The Open Graph defaults are in lib/metadata.js, which pages that set their
// own preview image spread in.
export const metadata = {
  metadataBase: new URL("https://metalwerx.com.au"),
  alternates: { canonical: "./" },
  title: {
    template: "%s | Metal Werx",
    default: "Scrap Metal Recycling in Hallam VIC | Metal Werx",
  },
  description:
    "Scrap metal recycling in Hallam, in Melbourne's south-east, for homes, farms and businesses. Metal Werx buys ferrous and non-ferrous metals, car bodies and batteries.",
  openGraph,
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-AU"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${sairaStencil.variable} ${bebasNeue.variable} ${oswald.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
        <ThemeToggle />
        <BusinessJsonLd />
        <Analytics />
      </body>
    </html>
  );
}
