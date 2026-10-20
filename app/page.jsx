import { getHomePage } from "@/lib/pages";
import IndexCashForCars from "./components/index-cash-for-cars";
import IndexCommercial from "./components/index-commercial";
import IndexFaq from "./components/index-faq";
import IndexHero from "./components/index-hero";
import IndexMarquee from "./components/index-marquee";
import IndexWhyUs from "./components/index-why-us";
import ScrapJourney from "./components/scrap-journey/scrap-journey";

// The whole page must be static HTML, so search engines get the copy from
// Strapi in the first response. The build fails if anything here would need a
// request.
export const ensureStatic = "navigation";

// getHomePage is cached, so this and the page share one request to Strapi.
// "absolute" keeps the layout's "| Metal Werx" suffix off, since the home
// page title already starts with the name.
export async function generateMetadata() {
  const { seo } = await getHomePage();
  return { title: { absolute: seo.title }, description: seo.description };
}

export default async function Home() {
  const { hero, ticker, whyUs, commercial, cashForCars, faq } = await getHomePage();

  return (
    <main className="flex flex-1 flex-col">
      {/* The scroll-driven 3D tour of selling scrap at the yard, ending on
          the hero's CTAs. */}
      <ScrapJourney primaryCta={hero.primaryCta} secondaryCta={hero.secondaryCta} />
      <IndexHero {...hero} />
      <IndexMarquee items={ticker} />
      <IndexWhyUs {...whyUs} />
      <IndexCommercial {...commercial} />
      <IndexCashForCars {...cashForCars} />
      <IndexFaq {...faq} />
    </main>
  );
}
