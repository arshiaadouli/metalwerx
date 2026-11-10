/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // The dev server blocks its live-reload connection for any hostname other
  // than localhost. Allow private 192.168.x.x addresses so the site can be
  // opened from other devices on the LAN, e.g. http://192.168.15.190:3000.
  allowedDevOrigins: ["192.168.*.*", "metalwerx.com.au"],
  // The CMS's photos are in its object storage on the LAN, but the site serves
  // them itself at /media (see lib/media.js), so the image optimizer only ever
  // reads local paths and needs no remotePatterns.
  // No "X-Powered-By: Next.js" on responses.
  poweredByHeader: false,
  // Baseline security headers on every response. HSTS leaves out
  // includeSubDomains until every subdomain is known to serve HTTPS. The CSP
  // only stops other sites framing these pages; a full policy needs nonces for
  // Next's inline scripts, so roll one out in report-only mode first.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  // The privacy policy moved from /privacy-policy to /privacy. Keep old links
  // and search results working; browsers carry any #anchor across.
  // The materials taken off What We Buy on 29 October 2026 send their old links
  // to the closest page that's left. A material added back in the CMS under
  // one of these slugs needs its line removed, or the redirect hides its page.
  async redirects() {
    return [
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/what-we-buy/aluminium", destination: "/what-we-buy/alloy-mix", permanent: true },
      { source: "/what-we-buy/scrap-steel", destination: "/what-we-buy/hms-steel", permanent: true },
      { source: "/what-we-buy/unwanted-cars", destination: "/#cash-for-cars", permanent: true },
      { source: "/what-we-buy/lead", destination: "/what-we-buy", permanent: true },
      { source: "/what-we-buy/pvc-wire", destination: "/what-we-buy", permanent: true },
      { source: "/what-we-buy/scrap-car-parts", destination: "/what-we-buy", permanent: true },
      { source: "/what-we-buy/scrap-machinery", destination: "/what-we-buy", permanent: true },
    ];
  },
  experimental: {
    // Server Actions (the contact form) are refused when the browser's origin
    // isn't the host the server sees. The public site reaches this server
    // through a reverse proxy, so allow its domain in case the proxy forwards
    // its own host.
    // The form also sends up to 10 photos of up to 10 MB each (see
    // lib/message-photos.js), over the default 1 MB limit.
    serverActions: {
      allowedOrigins: ["metalwerx.com.au", "www.metalwerx.com.au"],
      bodySizeLimit: "105mb",
    },
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
