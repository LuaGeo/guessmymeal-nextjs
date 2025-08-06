/* import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  reactStrictMode: true,
};

export default nextConfig; */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
