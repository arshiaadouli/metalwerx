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

const sairaStencil = Saira_Stencil({
  variable: "--saira-stencil",
  subsets: ["latin"],
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

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${sairaStencil.variable} ${bebasNeue.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
