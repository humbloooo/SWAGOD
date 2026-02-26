import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  experimental: {
    // optimizeCss: true, // Requires critters
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ['error'] } : false,
  }
};

export default bundleAnalyzer(nextConfig);
