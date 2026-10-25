import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Hide the Next.js dev badge so client previews look clean
  devIndicators: false,
  // Product and recipe photos uploaded at /admin
  images: {
    remotePatterns: [{ protocol: "https", hostname: "firebasestorage.googleapis.com" }],
  },
  // The client reviewed this design at /design2 before it became the main site
  async redirects() {
    return [
      { source: "/design2", destination: "/", permanent: true },
      { source: "/design2/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
