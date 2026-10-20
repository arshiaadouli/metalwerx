import {
  Geist,
  Geist_Mono,
  Montserrat,
  Saira_Stencil,
  Bebas_Neue,
  Oswald,
} from "next/font/google";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
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
export const metadata = {
  title: {
    template: "%s | Metal Werx",
    default: "Metal Werx Scrap Metal Recycling",
  },
  description:
    "Scrap metal recycling for homes, farms and businesses. Metal Werx buys ferrous and non-ferrous metals, car bodies and batteries.",
};

// Sets data-theme as the page is parsed, so it never paints in the wrong theme:
// the visitor's last pick in ThemeToggle, else their OS setting. With scripts
// off, the page stays on the dark default. suppressHydrationWarning on <html>
// lets React accept the attribute the script changed.
const themeScript = `(function(){var t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)})()`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${sairaStencil.variable} ${bebasNeue.variable} ${oswald.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
        <ThemeToggle />
      </body>
    </html>
  );
}
