import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "dreamworksdirect.com" },
    ],
    deviceSizes: [640, 750, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24 hours cache for optimized images
    dangerouslyAllowSVG: true,
    qualities: [100],
  },
  // Enable experimental features for speed
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Compression
  compress: true,

};

export default nextConfig;
