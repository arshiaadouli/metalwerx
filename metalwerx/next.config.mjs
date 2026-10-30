/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // The dev server blocks its live-reload connection for any hostname other
  // than localhost. Allow private 192.168.x.x addresses so the site can be
  // opened from other devices on the LAN, e.g. http://192.168.15.190:3000.
  allowedDevOrigins: ["192.168.*.*"],
  images: {
    // The CMS's photos are in its object storage on the LAN (see lib/cms.js).
    // Next's image optimizer refuses private addresses unless allowed, so
    // dangerouslyAllowLocalIP lets it through, and remotePatterns keeps it to
    // that one bucket.
    remotePatterns: [new URL("http://192.168.15.240:9000/metalwerx-media/**")],
    dangerouslyAllowLocalIP: true,
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
