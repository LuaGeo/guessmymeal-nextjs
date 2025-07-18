/* import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  reactStrictMode: true,
};

export default nextConfig; */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Désactive ESLint pendant le build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Désactive la vérification TypeScript pendant le build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
