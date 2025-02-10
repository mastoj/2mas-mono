import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  assetPrefix: "/2mas-demo2-static",
  async rewrites() {
    return [
      {
        source: "/auth",
        destination: `${process.env.AUTH_DOMAIN}/auth`,
      },
      {
        source: "/login",
        destination: `${process.env.AUTH_DOMAIN}/login`,
      },
      {
        source: "/logout/:path*",
        destination: `${process.env.AUTH_DOMAIN}/logout/:path*`,
      },
    ];
  },
};

export default nextConfig;
