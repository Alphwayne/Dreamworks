import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },
  // Enable experimental features for speed
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Compression
  compress: true,
};

export default nextConfig;
