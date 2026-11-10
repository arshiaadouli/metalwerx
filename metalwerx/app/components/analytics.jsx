import { Suspense } from "react";
import MatomoTracker from "./matomo-tracker";

// Visit and conversion counts from a self-hosted Matomo, once one is running:
// set MATOMO_URL (its address, e.g. https://metalwerx.com.au/matomo/) and
// MATOMO_SITE_ID in .env.local and rebuild. Until then nothing is added to
// the page. When it goes live, the privacy policy in the CMS needs to say so.
const url = process.env.MATOMO_URL;
const siteId = process.env.MATOMO_SITE_ID;

export default function Analytics() {
  if (!url || !siteId) return null;
  // The tracker reads the path, which a prerendered page only knows in the
  // browser, so it waits behind Suspense rather than holding up the page.
  return (
    <Suspense fallback={null}>
      <MatomoTracker url={url.endsWith("/") ? url : `${url}/`} siteId={siteId} />
    </Suspense>
  );
}
