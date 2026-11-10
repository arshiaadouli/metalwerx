"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";

// The self-hosted Matomo tracker (see analytics.jsx), without cookies, so the
// site needs no cookie banner. The setup script counts the first page; each
// page reached by a client-side navigation after that is counted here. Taps on
// phone and email links count as Contact events, as does a sent quote form
// (see app/contact-us/contact-with-globe.jsx).
export default function MatomoTracker({ url, siteId }) {
  const pathname = usePathname();
  const firstPage = useRef(true);

  useEffect(() => {
    if (firstPage.current) {
      firstPage.current = false;
      return;
    }
    // Next sets the new page's title just after the URL changes.
    const timer = setTimeout(() => {
      const paq = (window._paq ||= []);
      paq.push(["setCustomUrl", window.location.href]);
      paq.push(["setDocumentTitle", document.title]);
      paq.push(["trackPageView"]);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest?.('a[href^="tel:"], a[href^="mailto:"]');
      if (!link) return;
      const action = link.protocol === "tel:" ? "Call" : "Email";
      (window._paq ||= []).push(["trackEvent", "Contact", action, link.pathname || link.href]);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const setup = [
    `var _paq = (window._paq = window._paq || []);`,
    `_paq.push(["disableCookies"]);`,
    `_paq.push(["trackPageView"]);`,
    `_paq.push(["enableLinkTracking"]);`,
    `_paq.push(["setTrackerUrl", ${JSON.stringify(`${url}matomo.php`)}]);`,
    `_paq.push(["setSiteId", ${JSON.stringify(String(siteId))}]);`,
    `var g = document.createElement("script"); g.async = true; g.src = ${JSON.stringify(`${url}matomo.js`)};`,
    `document.head.appendChild(g);`,
  ].join("\n");

  return (
    <Script id="matomo" strategy="afterInteractive">
      {setup}
    </Script>
  );
}
