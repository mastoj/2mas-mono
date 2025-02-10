import type { NextConfig } from "next";

console.log("==> Auth Domain:", process.env.AUTH_DOMAIN);

const nextConfig: NextConfig = {
  /* config options here */
  assetPrefix: "/2mas-demo-static",
  async rewrites() {
    return [
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
