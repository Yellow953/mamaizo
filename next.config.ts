import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Hide the Next.js dev badge so client previews look clean
  devIndicators: false,
};

export default nextConfig;
