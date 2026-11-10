import { FileText, Scale } from "lucide-react";
import { getTerms } from "@/lib/cms";
import { LegalPage } from "../components/legal-page";

// The text is in the CMS (see lib/cms.js), read at build time and refreshed
// when it changes there. The layout is shared with /privacy.

export async function generateMetadata() {
  const { seo } = await getTerms();
  return { title: seo.title, description: seo.description };
}

export default async function TermsPage() {
  const { hero, sections, cta } = await getTerms();
  return <LegalPage hero={hero} sections={sections} cta={cta} icon={FileText} badgeIcon={Scale} />;
}
