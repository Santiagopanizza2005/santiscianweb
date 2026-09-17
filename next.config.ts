import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/logos/**",
        search: "?v=20260827-1038",
      },
      {
        pathname: "/historia/**",
      },
    ],
  },
};

export default nextConfig;
