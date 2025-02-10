import type { NextConfig } from "next";

console.log("==> Auth Domain:", process.env.AUTH_DOMAIN);

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
        source: "/logout",
        destination: `${process.env.AUTH_DOMAIN}/logout`,
      },
    ];
  },
};

export default nextConfig;
