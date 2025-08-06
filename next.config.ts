import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Configurações para produção (env)
  env: {
    CUSTOM_KEY: "my-value",
  },

  // Configurações de imagem
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },

  // Configurações de build
  output: "standalone",

  // Otimizações
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // As configurações que você já tinha no seu arquivo
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
