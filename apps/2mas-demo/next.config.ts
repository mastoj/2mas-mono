import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  assetPrefix: "/2mas-demo-static",
  async rewrites() {
    return [
      {
        source: "/login/:path*",
        destination: `${process.env.AUTH_DOMAIN}/login/:path*`,
      },
      {
        source: "/logout/:path*",
        destination: `${process.env.AUTH_DOMAIN}/logout/:path*`,
      },
      {
        source: "/refresh/:path*",
        destination: `${process.env.AUTH_DOMAIN}/refresh/:path*`,
      },
      {
        source: "/demo2/:path*",
        destination: `${process.env.DEMO2_DOMAIN}/:path*`,
      },
      {
        source: "/2mas-demo2-static/:path*",
        destination: `${process.env.DEMO2_DOMAIN}/2mas-demo2-static/:path*`,
      },
    ];
  },
};

export default nextConfig;
