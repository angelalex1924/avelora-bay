import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /** Mobile testing on LAN — allows HMR from phone IP */
  allowedDevOrigins: ["192.168.1.95"],
  turbopack: {
    /** Monorepo parent lockfile was stealing the workspace root */
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
