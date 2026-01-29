import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Agrega esto para Vercel
  reactStrictMode: true,
};

export default nextConfig;