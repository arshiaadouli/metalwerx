import IndexCashForCars from "./components/index-cash-for-cars";
import IndexCommercial from "./components/index-commercial";
import Faq from "./components/faq";
import IndexHero from "./components/index-hero";
import IndexMarquee from "./components/index-marquee";
import IndexVisitUs from "./components/index-visit-us";
import IndexWhyUs from "./components/index-why-us";
import { getHomePage } from "@/lib/cms";

// The whole page must be static HTML, so search engines get the copy in the
// first response. The build fails if anything here would need a request. The
// copy and photos come from the CMS (see lib/cms.js), read at build time and
// refreshed when they change there.
export const ensureStatic = "navigation";

// "absolute" keeps the layout's "| Metal Werx" suffix off, since the home
// page title already starts with the name.
export async function generateMetadata() {
  const { seo } = await getHomePage();
  return {
    title: { absolute: seo.title },
    description: seo.description,
  };
}

export default async function Home() {
  const { hero, ticker, whyUs, commercial, cashForCars, faq } = await getHomePage();

  return (
    <main className="flex flex-1 flex-col">
      <IndexHero {...hero} />
      <IndexMarquee items={ticker} />
      <IndexWhyUs {...whyUs} />
      <IndexCommercial {...commercial} />
      <IndexCashForCars {...cashForCars} />
      <Faq {...faq} />
      <IndexVisitUs />
    </main>
  );
}
