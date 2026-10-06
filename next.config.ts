import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    localPatterns: [
      {
        pathname: "/fotos-about/**",
        search: "",
      },
      {
        pathname: "/logos/**",
        search: "?v=20260827-1038",
      },
      {
        pathname: "/historia/**",
      },
      {
        pathname: "/imagenes/**",
      },
      {
        pathname: "/fotos-apps/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
