import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tough-bandicoot-496.convex.cloud',
        port: '',
        pathname: '/api/storage/**',
      },
    ],
  },};

export default nextConfig;
