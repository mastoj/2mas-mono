import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  assetPrefix: "/2mas-demo2-static",
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: `${process.env.AUTH_DOMAIN}/:path*`,
      },
    ];
  },
};

export default nextConfig;
