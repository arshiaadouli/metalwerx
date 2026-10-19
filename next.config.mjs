/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // The dev server blocks its live-reload connection for any hostname other
  // than localhost. Allow private 192.168.x.x addresses so the site can be
  // opened from other devices on the LAN, e.g. http://192.168.15.190:3000.
  allowedDevOrigins: ["192.168.*.*"],
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
