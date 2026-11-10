import { Lock, ShieldCheck } from "lucide-react";
import { getPrivacyPolicy } from "@/lib/cms";
import { LegalPage } from "../components/legal-page";

// The text is in the CMS (see lib/cms.js), read at build time and refreshed
// when it changes there. The layout is shared with /terms.

export async function generateMetadata() {
  const { seo } = await getPrivacyPolicy();
  return { title: seo.title, description: seo.description };
}

export default async function PrivacyPolicyPage() {
  const { hero, sections, cta } = await getPrivacyPolicy();
  return (
    <LegalPage hero={hero} sections={sections} cta={cta} icon={ShieldCheck} badgeIcon={Lock} />
  );
}
