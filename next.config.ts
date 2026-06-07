import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  images: {
    qualities: [75, 90, 100],
  },
};

export default nextConfig;
